const apiKey = process.env.TELNYX_API_KEY;
const from = process.env.TELNYX_PHONE_NUMBER;
const messagingProfileId = process.env.TELNYX_MESSAGING_PROFILE_ID;

export type SendSmsResult = {
  id: string;
};

export async function sendSms(to: string, body: string): Promise<SendSmsResult> {
  if (!apiKey || !from) {
    throw new Error("Missing Telnyx env vars (TELNYX_API_KEY, TELNYX_PHONE_NUMBER)");
  }

  const payload: Record<string, string> = { from, to, text: body };
  if (messagingProfileId) {
    payload.messaging_profile_id = messagingProfileId;
  }

  const response = await fetch("https://api.telnyx.com/v2/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const raw = await response.text();
  let parsed: { data?: { id?: string }; errors?: Array<{ code?: string; title?: string; detail?: string }> };
  try {
    parsed = JSON.parse(raw) as typeof parsed;
  } catch {
    parsed = {};
  }

  if (!response.ok) {
    const detail =
      parsed.errors?.map((e) => `${e.code ?? "?"} ${e.title}: ${e.detail}`).join(" | ") ||
      raw;
    throw new Error(`Telnyx SMS failed (${response.status}): ${detail}`);
  }

  const id = parsed.data?.id;
  if (!id) {
    throw new Error("Telnyx SMS accepted but no message id returned");
  }

  return { id };
}
