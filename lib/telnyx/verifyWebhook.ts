import { createPublicKey, verify } from "node:crypto";

const DEFAULT_TOLERANCE_SECONDS = 300;
const ED25519_SPKI_PREFIX = Buffer.from("302a300506032b6570032100", "hex");

function ed25519PublicKeyFromRaw(rawKey: Buffer) {
  return createPublicKey({
    key: Buffer.concat([ED25519_SPKI_PREFIX, rawKey]),
    format: "der",
    type: "spki",
  });
}

function parseEd25519PublicKey(publicKeyBase64: string) {
  const keyBytes = Buffer.from(publicKeyBase64.trim(), "base64");

  if (keyBytes.length === 32) {
    return ed25519PublicKeyFromRaw(keyBytes);
  }

  return createPublicKey({
    key: keyBytes,
    format: "der",
    type: "spki",
  });
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

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestampSec) > toleranceSeconds) {
    return false;
  }

  let signatureBytes: Buffer;

  try {
    signatureBytes = Buffer.from(signature, "base64");
  } catch {
    return false;
  }

  if (!publicKeyBase64.trim()) {
    return false;
  }

  const signedPayload = Buffer.from(`${timestamp}|${rawBody}`);

  return verify(
    null,
    signedPayload,
    parseEd25519PublicKey(publicKeyBase64),
    signatureBytes,
  );
}

export function shouldVerifyTelnyxWebhook(): boolean {
  if (process.env.NODE_ENV === "production") {
    return true;
  }

  return Boolean(process.env.TELNYX_PUBLIC_KEY);
}
