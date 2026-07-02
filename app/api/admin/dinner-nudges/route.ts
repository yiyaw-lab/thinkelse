import { NextResponse } from "next/server";

import {
  getDinnerConversationNudgeCandidates,
  markDinnerConversationNudged,
} from "@/lib/db/families";
import { formatDinnerConversationNudgeMessage } from "@/lib/sms/format-quest";
import {
  checkOutboundRateLimit,
  recordOutboundSent,
} from "@/lib/sms/guardrails";
import { sendSms } from "@/lib/telnyx/sendSms";

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.ADMIN_SECRET ?? process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return authHeader === `Bearer ${secret}`;
}

function normalizeLimit(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 100;
  }

  return Math.min(250, Math.max(1, Math.floor(value)));
}

async function handleDinnerNudges(request: Request, send: boolean, limit: number) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const candidates = await getDinnerConversationNudgeCandidates(limit);
  const message = formatDinnerConversationNudgeMessage();
  const results: { phone: string; status: string }[] = [];

  for (const family of candidates) {
    if (!family.phone) continue;

    if (!send) {
      results.push({ phone: family.phone, status: "dry_run" });
      continue;
    }

    const outboundLimit = await checkOutboundRateLimit({
      phone: family.phone,
      familyId: family.id,
      bodyLength: message.length,
    });

    if (!outboundLimit.allowed) {
      results.push({
        phone: family.phone,
        status: `skipped_${outboundLimit.reason}`,
      });
      continue;
    }

    try {
      await sendSms(family.phone, message);
      await recordOutboundSent({
        phone: family.phone,
        familyId: family.id,
        bodyLength: message.length,
      });
      await markDinnerConversationNudged(family.id);
      results.push({ phone: family.phone, status: "sent" });
    } catch (error) {
      console.error("send dinner nudge error:", error);
      results.push({ phone: family.phone, status: "send_failed" });
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun: !send,
    candidates: candidates.length,
    sent: results.filter((result) => result.status === "sent").length,
    results,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawLimit = searchParams.get("limit");
  const limit = rawLimit ? normalizeLimit(Number(rawLimit)) : 100;
  return handleDinnerNudges(request, false, limit);
}

export async function POST(request: Request) {
  let body: { send?: boolean; limit?: number };
  try {
    body = (await request.json()) as { send?: boolean; limit?: number };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  return handleDinnerNudges(request, body.send === true, normalizeLimit(body.limit));
}
