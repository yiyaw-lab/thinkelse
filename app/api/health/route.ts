import { NextResponse } from "next/server";

import { getPublicKeyByteLength } from "@/lib/telnyx/verifyWebhook";

export async function GET() {
  const publicKey = process.env.TELNYX_PUBLIC_KEY;

  return NextResponse.json({
    ok: true,
    app: "Else",
    message: "Think Else is alive.",
    deploy: {
      sha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
      env: process.env.VERCEL_ENV ?? "development",
    },
    config: {
      telnyxApiKey: Boolean(process.env.TELNYX_API_KEY),
      telnyxPhoneNumber: Boolean(process.env.TELNYX_PHONE_NUMBER),
      telnyxPublicKey: Boolean(publicKey),
      telnyxPublicKeyBytes: publicKey ? getPublicKeyByteLength(publicKey) : null,
      supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabaseServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      openaiApiKey: Boolean(process.env.OPENAI_API_KEY),
      webhookVerifySkipped: process.env.TELNYX_SKIP_WEBHOOK_VERIFY === "true",
    },
  });
}
