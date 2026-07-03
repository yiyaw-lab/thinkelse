import { NextResponse } from "next/server";

import { isAdminRequestAuthorized } from "@/lib/admin/auth";
import {
  getPendingReviewQuests,
  updateQuestReview,
  type QuestReviewStatus,
} from "@/lib/db/quests";
import { EARLY_COHORT_LIMIT } from "@/lib/db/families";

export async function GET(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const quests = await getPendingReviewQuests();

  return NextResponse.json({
    ok: true,
    cohortLimit: EARLY_COHORT_LIMIT,
    pending: quests.length,
    quests,
  });
}

export async function PATCH(request: Request) {
  if (!isAdminRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { questId?: string; status?: QuestReviewStatus; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { questId, status, notes } = body;
  if (!questId || !status) {
    return NextResponse.json(
      { ok: false, error: "questId and status required" },
      { status: 400 },
    );
  }

  if (!["approved", "flagged", "skipped"].includes(status)) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }

  const updated = await updateQuestReview(questId, status, notes);
  if (!updated) {
    return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, questId, status });
}
