const apiKey = process.env.TELNYX_API_KEY;
const from = process.env.TELNYX_PHONE_NUMBER;

export async function sendSms(to: string, body: string) {
  if (!apiKey || !from) {
    throw new Error("Missing Telnyx env vars (TELNYX_API_KEY, TELNYX_PHONE_NUMBER)");
  }

  const response = await fetch("https://api.telnyx.com/v2/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, text: body }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telnyx SMS failed (${response.status}): ${error}`);
  }
}
