import { NextResponse } from "next/server";

import { generateQuest } from "@/lib/agents/generateQuest";
import { buildQuestContext } from "@/lib/agents/build-family-context";
import { formatLocalClock, isCronDryRun } from "@/lib/cron/request";
import { getCompleteFamilies } from "@/lib/db/families";
import { getChildrenForFamily } from "@/lib/db/children";
import { createQuest, hasQuestOnLocalDay } from "@/lib/db/quests";
import { reviewStatusForFamily } from "@/lib/quests/review-policy";
import { formatQuestMessage } from "@/lib/sms/format-quest";
import {
  checkOutboundRateLimit,
  recordOutboundSent,
} from "@/lib/sms/guardrails";
import { sendSms } from "@/lib/telnyx/sendSms";
import {
  DEFAULT_TIMEZONE,
  formatLocalDateKey,
  getLocalTimeParts,
  isPreferredDeliveryWindow,
  parsePreferredTime,
} from "@/lib/timezone";

type DailyQuestCronResult = {
  phone: string | null;
  child?: string;
  status: string;
  timezone?: string;
  preferredTime?: string | null;
  localDate?: string;
  localTime?: string;
};

export async function GET(request: Request) {
  // Production cron is configured in vercel.json. Require the shared bearer
  // token configured as CRON_SECRET so manual requests cannot trigger delivery.
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (process.env.NODE_ENV === "production") {
    if (!cronSecret) {
      console.error("CRON_SECRET is not configured for daily quest cron");
      return NextResponse.json(
        { ok: false, error: "Cron is not configured" },
        { status: 500 },
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const now = new Date();
  const dryRun = isCronDryRun(request);
  const families = await getCompleteFamilies();

  const results: DailyQuestCronResult[] = [];

  for (const family of families) {
    if (!family.phone) {
      if (dryRun) {
        results.push({ phone: null, status: "skipped_missing_phone" });
      }
      continue;
    }

    if (!family.preferred_time) {
      if (dryRun) {
        results.push({
          phone: family.phone,
          status: "skipped_missing_preferred_time",
        });
      }
      continue;
    }

    const timezone =
      typeof family.timezone === "string" && family.timezone
        ? family.timezone
        : DEFAULT_TIMEZONE;
    const preferredTime = parsePreferredTime(family.preferred_time);
    const localTime = getLocalTimeParts(timezone, now);
    const schedule = {
      timezone,
      preferredTime: family.preferred_time,
      localTime: formatLocalClock(localTime),
    };

    if (!preferredTime) {
      results.push({
        phone: family.phone,
        status: "skipped_invalid_time",
        ...schedule,
      });
      continue;
    }

    if (!isPreferredDeliveryWindow(preferredTime, localTime)) {
      if (dryRun) {
        results.push({
          phone: family.phone,
          status: "skipped_outside_delivery_window",
          ...schedule,
        });
      }
      continue;
    }

    const children = await getChildrenForFamily(family.id);
    if (children.length === 0) {
      results.push({
        phone: family.phone,
        status: "skipped_missing_child",
        ...schedule,
      });
      continue;
    }

    const localDateKey = formatLocalDateKey(timezone, now);
    const dueSchedule = { ...schedule, localDate: localDateKey };

    for (const child of children) {
      const alreadySentToday = await hasQuestOnLocalDay(
        child.id,
        localDateKey,
        timezone,
      );

      if (alreadySentToday) {
        results.push({
          phone: family.phone,
          child: child.name,
          status: "skipped_already_sent",
          ...dueSchedule,
        });
        continue;
      }

      if (dryRun) {
        results.push({
          phone: family.phone,
          child: child.name,
          status: "would_send",
          ...dueSchedule,
        });
        continue;
      }

      const outboundLimit = await checkOutboundRateLimit({
        phone: family.phone,
        familyId: family.id,
        bodyLength: 0,
      });

      if (!outboundLimit.allowed) {
        results.push({
          phone: family.phone,
          child: child.name,
          status: `skipped_${outboundLimit.reason}`,
          ...dueSchedule,
        });
        continue;
      }

      const questContext = await buildQuestContext(family, child);
      const generatedQuest = await generateQuest(questContext);
      const reviewStatus = await reviewStatusForFamily(family.id);
      const message = formatQuestMessage(generatedQuest, child.name);

      await createQuest({
        childId: child.id,
        title: generatedQuest.title,
        prompt: generatedQuest.prompt,
        mission: generatedQuest.mission,
        followUp: generatedQuest.followUp,
        skill: generatedQuest.skill,
        reviewStatus,
      });

      await sendSms(family.phone, message);
      await recordOutboundSent({
        phone: family.phone,
        familyId: family.id,
        bodyLength: message.length,
      });

      results.push({
        phone: family.phone,
        child: child.name,
        status: "sent",
        ...dueSchedule,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    sent: results.filter((result) => result.status === "sent").length,
    wouldSend: results.filter((result) => result.status === "would_send").length,
    results,
  });
}
