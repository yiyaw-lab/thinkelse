import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type SmsGuardrailEventType =
  | "inbound_message"
  | "outbound_message"
  | "quest_request"
  | "interpretation_request"
  | "rate_limit_notice";

export type SmsGuardrailStatus = "accepted" | "blocked" | "sent";

export type SmsGuardrailEventInput = {
  phone: string;
  familyId?: string | null;
  eventType: SmsGuardrailEventType;
  status: SmsGuardrailStatus;
  reason?: string | null;
  bodyLength?: number | null;
};

export async function logSmsGuardrailEvent({
  phone,
  familyId = null,
  eventType,
  status,
  reason = null,
  bodyLength = null,
}: SmsGuardrailEventInput): Promise<void> {
  const { error } = await supabaseAdmin.from("sms_guardrail_events").insert({
    phone,
    family_id: familyId,
    event_type: eventType,
    status,
    reason,
    body_length: bodyLength,
  });

  if (error) {
    console.error("logSmsGuardrailEvent error:", error);
  }
}

export async function countSmsGuardrailEvents({
  phone,
  eventType,
  status,
  since,
}: {
  phone: string;
  eventType: SmsGuardrailEventType;
  status: SmsGuardrailStatus;
  since: Date;
}): Promise<number | null> {
  const query = supabaseAdmin
    .from("sms_guardrail_events")
    .select("id", { count: "exact", head: true })
    .eq("phone", phone)
    .eq("event_type", eventType)
    .eq("status", status)
    .gte("created_at", since.toISOString());

  const { count, error } = await query;

  if (error) {
    console.error("countSmsGuardrailEvents error:", error);
    return null;
  }

  return count ?? 0;
}
