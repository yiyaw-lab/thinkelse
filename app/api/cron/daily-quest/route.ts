import { NextResponse } from "next/server";

import { generateQuest } from "@/lib/agents/generateQuest";
import { buildQuestContext } from "@/lib/agents/build-family-context";
import { getCompleteFamilies } from "@/lib/db/families";
import { getFirstChildForFamily } from "@/lib/db/children";
import { createQuest } from "@/lib/db/quests";
import { reviewStatusForFamily } from "@/lib/quests/review-policy";
import { formatQuestMessage } from "@/lib/sms/format-quest";
import { sendSms } from "@/lib/telnyx/sendSms";

// Parse a preferred_time string like "8am", "8:30am", "6pm", "6:30pm" into a 24-hour integer (0–23).
// Returns null if unparseable.
function parsePreferredHour(preferredTime: string): number | null {
  const match = preferredTime
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);

  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const period = match[3];

  if (period === "am") {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }

  return hour;
}

export async function GET(request: Request) {
  // Verify the request comes from Vercel's cron system in production
  const authHeader = request.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const currentHour = new Date().getUTCHours();
  const families = await getCompleteFamilies();

  const results: { phone: string; status: string }[] = [];

  for (const family of families) {
    if (!family.preferred_time || !family.phone) continue;

    const preferredHour = parsePreferredHour(family.preferred_time);

    if (preferredHour === null || preferredHour !== currentHour) continue;

    const child = await getFirstChildForFamily(family.id);
    if (!child) continue;

    const questContext = await buildQuestContext(family, child);
    const generatedQuest = await generateQuest(questContext);
    const reviewStatus = await reviewStatusForFamily(family.id);

    await createQuest({
      childId: child.id,
      title: generatedQuest.title,
      prompt: generatedQuest.prompt,
      mission: generatedQuest.mission,
      followUp: generatedQuest.followUp,
      skill: generatedQuest.skill,
      reviewStatus,
    });

    await sendSms(family.phone, formatQuestMessage(generatedQuest));

    results.push({ phone: family.phone, status: "sent" });
  }

  return NextResponse.json({ ok: true, sent: results.length, results });
}
