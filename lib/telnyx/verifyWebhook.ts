import nacl from "tweetnacl";

const DEFAULT_TOLERANCE_SECONDS = 300;

function decodeBase64(value: string): Uint8Array | null {
  try {
    return new Uint8Array(Buffer.from(value, "base64"));
  } catch {
    return null;
  }
}

export function verifyTelnyxWebhookSignature({
  rawBody,
  signature,
  timestamp,
  publicKeyBase64,
  toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
}: {
  rawBody: string;
  signature: string | null;
  timestamp: string | null;
  publicKeyBase64: string;
  toleranceSeconds?: number;
}): boolean {
  if (!signature || !timestamp) {
    return false;
  }

  const timestampSec = Number.parseInt(timestamp, 10);
  if (Number.isNaN(timestampSec)) {
    return false;
  }

  const timestampAge = Math.floor(Date.now() / 1000) - timestampSec;
  if (toleranceSeconds > 0 && timestampAge > toleranceSeconds) {
    return false;
  }

  const publicKey = decodeBase64(
    publicKeyBase64.trim().replace(/^["']|["']$/g, "").replace(/\s/g, ""),
  );
  const signatureBytes = decodeBase64(signature);

  if (!publicKey || !signatureBytes || publicKey.length !== 32) {
    return false;
  }

  const payloadBuffer = Buffer.from(`${timestamp}|${rawBody}`, "utf8");

  return nacl.sign.detached.verify(payloadBuffer, signatureBytes, publicKey);
}

export function shouldVerifyTelnyxWebhook(): boolean {
  if (process.env.NODE_ENV === "production") {
    return true;
  }

  return Boolean(process.env.TELNYX_PUBLIC_KEY);
}
