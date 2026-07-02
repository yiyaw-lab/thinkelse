import { NextResponse } from "next/server";

import { generateQuest } from "@/lib/agents/generateQuest";
import { buildQuestContext } from "@/lib/agents/build-family-context";
import { getCompleteFamilies } from "@/lib/db/families";
import { getFirstChildForFamily } from "@/lib/db/children";
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
  type PreferredTimeParts,
  parsePreferredTime,
} from "@/lib/timezone";

function isPreferredDeliveryWindow(
  preferredTime: PreferredTimeParts,
  localTime: PreferredTimeParts,
): boolean {
  if (preferredTime.hour !== localTime.hour) {
    return false;
  }

  const minuteDelta = localTime.minute - preferredTime.minute;
  return minuteDelta >= 0 && minuteDelta < 30;
}

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
  const families = await getCompleteFamilies();

  const results: { phone: string; status: string }[] = [];

  for (const family of families) {
    if (!family.preferred_time || !family.phone) continue;

    const timezone =
      typeof family.timezone === "string" && family.timezone
        ? family.timezone
        : DEFAULT_TIMEZONE;
    const preferredTime = parsePreferredTime(family.preferred_time);
    const localTime = getLocalTimeParts(timezone, now);

    if (!preferredTime) {
      results.push({ phone: family.phone, status: "skipped_invalid_time" });
      continue;
    }

    if (!isPreferredDeliveryWindow(preferredTime, localTime)) {
      continue;
    }

    const child = await getFirstChildForFamily(family.id);
    if (!child) continue;

    const localDateKey = formatLocalDateKey(timezone, now);
    const alreadySentToday = await hasQuestOnLocalDay(
      child.id,
      localDateKey,
      timezone,
    );

    if (alreadySentToday) {
      results.push({ phone: family.phone, status: "skipped_already_sent" });
      continue;
    }

    const outboundLimit = await checkOutboundRateLimit({
      phone: family.phone,
      familyId: family.id,
      bodyLength: 0,
    });

    if (!outboundLimit.allowed) {
      results.push({ phone: family.phone, status: `skipped_${outboundLimit.reason}` });
      continue;
    }

    const questContext = await buildQuestContext(family, child);
    const generatedQuest = await generateQuest(questContext);
    const reviewStatus = await reviewStatusForFamily(family.id);
    const message = formatQuestMessage(generatedQuest);

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

    results.push({ phone: family.phone, status: "sent" });
  }

  return NextResponse.json({
    ok: true,
    sent: results.filter((result) => result.status === "sent").length,
    results,
  });
}
