import { NextResponse } from "next/server";

import { generateQuest } from "@/lib/agents/generateQuest";
import type { FamilyQuestContext } from "@/lib/agents/types";

const SAMPLE_CONTEXT: FamilyQuestContext = {
  parentName: "Sarah",
  childName: "Mira",
  age: 8,
  interests: ["animals", "drawing", "space"],
  questNumber: 4,
  recentQuests: [
    {
      title: "Shadow Play Patterns",
      prompt:
        "Mira, what shapes do shadows make on our front step right now, and how do they change as the sun moves?",
      mission:
        "At the front step this morning, watch and name the shapes shadows make on the ground.",
      skill: "observation",
      response: "Her shadow was longest before dinner.",
      elsyReply: "Sharp noticing - what do you think made the shadow stretch that long?",
      missionStatus: "completed",
      completedAt: "2026-06-12T18:15:00Z",
      createdAt: "2026-06-12T08:00:00Z",
    },
    {
      title: "Front Step Patterns",
      prompt:
        "Mira, what kinds of shapes or colors do you notice right at our front step, and what makes you think they're there?",
      mission:
        "At the front step, look closely at the different marks, cracks, or objects you see.",
      skill: "pattern-finding",
      response: "She noticed cracks and changing shadows.",
      elsyReply: null,
      missionStatus: "completed",
      completedAt: "2026-06-11T08:20:00Z",
      createdAt: "2026-06-11T08:00:00Z",
    },
  ],
  learningEvents: [
    {
      kind: "avoidance",
      summary:
        "Parent dislikes repeated front-step shadow, shape, color, and pattern-noticing quests.",
      evidence: "feedback on two weak morning quests",
      confidence: 0.95,
    },
    {
      kind: "family_preference",
      summary:
        "Family wants richer quests with evidence, fairness, design, tradeoffs, perspective, or a tiny test.",
      evidence: "parent asked for less formulaic morning quests",
      confidence: 0.9,
    },
  ],
  temporal: {
    season: "summer",
    timeOfDay: "morning",
    settingHints: ["breakfast table", "walk to school", "window light"],
  },
};

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  try {
    const quest = await generateQuest(SAMPLE_CONTEXT);

    return NextResponse.json({
      ok: true,
      context: SAMPLE_CONTEXT,
      quest,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Quest generation failed.";
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
