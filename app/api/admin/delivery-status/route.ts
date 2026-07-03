import { NextResponse } from "next/server";

import { isAdminRequestAuthorized } from "@/lib/admin/auth";
import { getDeliveryStatusSnapshot } from "@/lib/db/delivery-status";

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = Number.parseInt(searchParams.get("limit") ?? "100", 10);
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), 250)
    : 100;

  const snapshot = await getDeliveryStatusSnapshot(limit);

  return NextResponse.json({
    ok: true,
    ...snapshot,
  });
}
