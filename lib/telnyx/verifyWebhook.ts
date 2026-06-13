import Telnyx from "telnyx";

const DEFAULT_TOLERANCE_SECONDS = 300;

function parsePublicKey(publicKeyBase64: string): Uint8Array | null {
  const cleaned = publicKeyBase64.trim().replace(/^["']|["']$/g, "").replace(/\s/g, "");

  let bytes: Buffer;
  try {
    bytes = Buffer.from(cleaned, "base64");
  } catch {
    return null;
  }

  if (bytes.length === 32) {
    return new Uint8Array(bytes);
  }

  if (bytes.length === 44) {
    return new Uint8Array(bytes.subarray(-32));
  }

  return null;
}

function parseSignature(signature: string): Uint8Array | null {
  try {
    return new Uint8Array(Buffer.from(signature, "base64"));
  } catch {
    return null;
  }
}

export function getPublicKeyByteLength(publicKeyBase64: string): number | null {
  const cleaned = publicKeyBase64.trim().replace(/^["']|["']$/g, "").replace(/\s/g, "");

  try {
    return Buffer.from(cleaned, "base64").length;
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

  const publicKey = parsePublicKey(publicKeyBase64);
  const signatureBytes = parseSignature(signature);

  if (!publicKey || !signatureBytes) {
    return false;
  }

  try {
    Telnyx.webhooks.constructEvent(
      rawBody,
      signatureBytes,
      timestamp,
      publicKey,
      toleranceSeconds,
    );
    return true;
  } catch {
    return false;
  }
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
