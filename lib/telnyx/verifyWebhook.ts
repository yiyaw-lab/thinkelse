import nacl from "tweetnacl";

const DEFAULT_TOLERANCE_SECONDS = 300;

function decodeBase64(value: string): Uint8Array | null {
  try {
    return new Uint8Array(Buffer.from(value, "base64"));
  } catch {
    return null;
  }
}

function normalizePublicKey(bytes: Uint8Array): Uint8Array | null {
  if (bytes.length === 32) {
    return bytes;
  }

  // SPKI DER encoding for Ed25519: 12-byte prefix + 32-byte key
  if (bytes.length === 44) {
    return bytes.slice(-32);
  }

  return null;
}

export function getPublicKeyByteLength(publicKeyBase64: string): number | null {
  const bytes = decodeBase64(
    publicKeyBase64.trim().replace(/^["']|["']$/g, "").replace(/\s/g, ""),
  );
  return bytes?.length ?? null;
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

  const publicKey = normalizePublicKey(
    decodeBase64(
      publicKeyBase64.trim().replace(/^["']|["']$/g, "").replace(/\s/g, ""),
    ) ?? new Uint8Array(),
  );
  const signatureBytes = decodeBase64(signature);

  if (!publicKey || !signatureBytes) {
    return false;
  }

  const payloadBuffer = Buffer.from(`${timestamp}|${rawBody}`, "utf8");

  return nacl.sign.detached.verify(payloadBuffer, signatureBytes, publicKey);
}

export function shouldVerifyTelnyxWebhook(): boolean {
  if (process.env.TELNYX_SKIP_WEBHOOK_VERIFY === "true") {
    return false;
  }

  if (process.env.NODE_ENV === "production") {
    return true;
  }

  return Boolean(process.env.TELNYX_PUBLIC_KEY);
}
