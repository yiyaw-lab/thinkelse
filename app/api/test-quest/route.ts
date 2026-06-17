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
      title: "Shadow Detective",
      prompt: "Why do shadows change shape throughout the day?",
      mission: "Trace your shadow with chalk at three different times.",
      skill: "observation",
      response: "Her shadow was longest before dinner.",
      createdAt: "2026-06-12T08:00:00Z",
    },
    {
      title: "Sound Collector",
      prompt: "What sounds do you usually ignore on the way to school?",
      mission: "Close your eyes for ten seconds and count every sound.",
      skill: "listening",
      response: "She heard a bird and a truck backup beep.",
      createdAt: "2026-06-11T08:00:00Z",
    },
  ],
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
