import { NextResponse } from "next/server";

import { buildDinnerContext } from "@/lib/agents/build-dinner-context";
import { generateDinnerConversation } from "@/lib/agents/generateDinnerConversation";
import { formatLocalClock, isCronDryRun } from "@/lib/cron/request";
import { getChildrenForFamily } from "@/lib/db/children";
import { createDinnerConversationLog } from "@/lib/db/dinner-conversations";
import {
  getDinnerConversationFamilies,
  markDinnerConversationSent,
} from "@/lib/db/families";
import { formatDinnerConversationMessage } from "@/lib/sms/format-quest";
import {
  checkOutboundRateLimit,
  recordOutboundSent,
} from "@/lib/sms/guardrails";
import { sendSms } from "@/lib/telnyx/sendSms";
import {
  DEFAULT_TIMEZONE,
  formatLocalDateKey,
  getLocalTimeParts,
  parsePreferredTime,
  type PreferredTimeParts,
} from "@/lib/timezone";

type DinnerCronResult = {
  phone: string | null;
  status: string;
  timezone?: string;
  dinnerTime?: string | null;
  localDate?: string;
  localTime?: string;
};

function isDeliveryWindow(
  preferredTime: PreferredTimeParts,
  localTime: PreferredTimeParts,
): boolean {
  if (preferredTime.hour !== localTime.hour) {
    return false;
  }

  const minuteDelta = localTime.minute - preferredTime.minute;
  return minuteDelta >= 0 && minuteDelta < 30;
}

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  return Boolean(cronSecret) && authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const dryRun = isCronDryRun(request);
  const families = await getDinnerConversationFamilies();
  const results: DinnerCronResult[] = [];

  for (const family of families) {
    if (!family.phone) {
      if (dryRun) {
        results.push({ phone: null, status: "skipped_missing_phone" });
      }
      continue;
    }

    if (!family.dinner_conversation_time) {
      if (dryRun) {
        results.push({
          phone: family.phone,
          status: "skipped_missing_dinner_time",
        });
      }
      continue;
    }

    const timezone =
      typeof family.timezone === "string" && family.timezone
        ? family.timezone
        : DEFAULT_TIMEZONE;
    const dinnerTime = parsePreferredTime(family.dinner_conversation_time);
    const localTime = getLocalTimeParts(timezone, now);
    const localDateKey = formatLocalDateKey(timezone, now);
    const schedule = {
      timezone,
      dinnerTime: family.dinner_conversation_time,
      localDate: localDateKey,
      localTime: formatLocalClock(localTime),
    };

    if (!dinnerTime) {
      results.push({
        phone: family.phone,
        status: "skipped_invalid_dinner_time",
        ...schedule,
      });
      continue;
    }

    if (!isDeliveryWindow(dinnerTime, localTime)) {
      if (dryRun) {
        results.push({
          phone: family.phone,
          status: "skipped_outside_delivery_window",
          ...schedule,
        });
      }
      continue;
    }

    if (family.dinner_conversation_last_sent_on === localDateKey) {
      results.push({
        phone: family.phone,
        status: "skipped_already_sent",
        ...schedule,
      });
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

    if (dryRun) {
      results.push({
        phone: family.phone,
        status: "would_send",
        ...schedule,
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
        status: `skipped_${outboundLimit.reason}`,
        ...schedule,
      });
      continue;
    }

    const dinnerContext = await buildDinnerContext(family, children);
    const generatedDinner = await generateDinnerConversation(dinnerContext);
    const message = formatDinnerConversationMessage(generatedDinner);

    await sendSms(family.phone, message);
    await recordOutboundSent({
      phone: family.phone,
      familyId: family.id,
      bodyLength: message.length,
    });
    await createDinnerConversationLog({
      familyId: family.id,
      question: generatedDinner.question,
      parentMove: generatedDinner.parentMove,
      followUp: generatedDinner.followUp,
      skill: generatedDinner.skill,
      localDateKey,
    });
    await markDinnerConversationSent(family.id, localDateKey);

    results.push({ phone: family.phone, status: "sent", ...schedule });
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    sent: results.filter((result) => result.status === "sent").length,
    wouldSend: results.filter((result) => result.status === "would_send").length,
    results,
  });
}
