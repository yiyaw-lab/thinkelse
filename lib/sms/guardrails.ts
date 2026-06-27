import {
  countSmsGuardrailEvents,
  logSmsGuardrailEvent,
  type SmsGuardrailEventType,
} from "@/lib/db/sms-guardrails";

export const MAX_TELNYX_WEBHOOK_BYTES = 64 * 1024;
export const MAX_INBOUND_SMS_CHARS = 1000;

type RateLimit = {
  windowMs: number;
  max: number;
  reason: string;
};

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const LIMITS: Record<
  Exclude<SmsGuardrailEventType, "outbound_message">,
  RateLimit[]
> = {
  inbound_message: [
    { windowMs: HOUR, max: 20, reason: "inbound_hourly_limit" },
    { windowMs: DAY, max: 80, reason: "inbound_daily_limit" },
  ],
  quest_request: [
    { windowMs: HOUR, max: 1, reason: "quest_hourly_limit" },
    { windowMs: DAY, max: 3, reason: "quest_daily_limit" },
  ],
  interpretation_request: [
    { windowMs: HOUR, max: 6, reason: "interpretation_hourly_limit" },
    { windowMs: DAY, max: 20, reason: "interpretation_daily_limit" },
  ],
  rate_limit_notice: [
    { windowMs: HOUR, max: 2, reason: "rate_limit_notice_hourly_limit" },
  ],
};

const OUTBOUND_LIMITS: RateLimit[] = [
  { windowMs: HOUR, max: 15, reason: "outbound_hourly_limit" },
  { windowMs: DAY, max: 50, reason: "outbound_daily_limit" },
];

export function isLikelyE164Phone(phone: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(phone);
}

async function checkLimits({
  phone,
  eventType,
  status,
  limits,
}: {
  phone: string;
  eventType: SmsGuardrailEventType;
  status: "accepted" | "sent";
  limits: RateLimit[];
}): Promise<{ allowed: true } | { allowed: false; reason: string }> {
  for (const limit of limits) {
    const count = await countSmsGuardrailEvents({
      phone,
      eventType,
      status,
      since: new Date(Date.now() - limit.windowMs),
    });

    // If the guardrail table is temporarily unavailable, keep SMS compliance and
    // delivery working while surfacing the database error in logs.
    if (count === null) {
      continue;
    }

    if (count >= limit.max) {
      return { allowed: false, reason: limit.reason };
    }
  }

  return { allowed: true };
}

export async function checkInboundRateLimit({
  phone,
  familyId,
  bodyLength,
}: {
  phone: string;
  familyId?: string | null;
  bodyLength: number;
}) {
  const result = await checkLimits({
    phone,
    eventType: "inbound_message",
    status: "accepted",
    limits: LIMITS.inbound_message,
  });

  if (!result.allowed) {
    await logSmsGuardrailEvent({
      phone,
      familyId,
      eventType: "inbound_message",
      status: "blocked",
      reason: result.reason,
      bodyLength,
    });
  }

  return result;
}

export async function recordInboundAccepted({
  phone,
  familyId,
  bodyLength,
}: {
  phone: string;
  familyId?: string | null;
  bodyLength: number;
}) {
  await logSmsGuardrailEvent({
    phone,
    familyId,
    eventType: "inbound_message",
    status: "accepted",
    bodyLength,
  });
}

export async function checkAndRecordAction({
  phone,
  familyId,
  eventType,
  bodyLength,
}: {
  phone: string;
  familyId?: string | null;
  eventType: "quest_request" | "interpretation_request" | "rate_limit_notice";
  bodyLength?: number | null;
}) {
  const result = await checkLimits({
    phone,
    eventType,
    status: "accepted",
    limits: LIMITS[eventType],
  });

  await logSmsGuardrailEvent({
    phone,
    familyId,
    eventType,
    status: result.allowed ? "accepted" : "blocked",
    reason: result.allowed ? null : result.reason,
    bodyLength,
  });

  return result;
}

export async function checkOutboundRateLimit({
  phone,
  familyId,
  bodyLength,
}: {
  phone: string;
  familyId?: string | null;
  bodyLength: number;
}) {
  const result = await checkLimits({
    phone,
    eventType: "outbound_message",
    status: "sent",
    limits: OUTBOUND_LIMITS,
  });

  if (!result.allowed) {
    await logSmsGuardrailEvent({
      phone,
      familyId,
      eventType: "outbound_message",
      status: "blocked",
      reason: result.reason,
      bodyLength,
    });
  }

  return result;
}

export async function recordOutboundSent({
  phone,
  familyId,
  bodyLength,
}: {
  phone: string;
  familyId?: string | null;
  bodyLength: number;
}) {
  await logSmsGuardrailEvent({
    phone,
    familyId,
    eventType: "outbound_message",
    status: "sent",
    bodyLength,
  });
}
