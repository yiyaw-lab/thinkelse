import { NextResponse } from "next/server";

import { interpretResponse } from "@/lib/agents/interpretResponse";
import type { InterpretContext } from "@/lib/agents/types";

const SAMPLE_INTERPRET: InterpretContext = {
  parentName: "Sarah",
  childName: "Mira",
  age: 8,
  interests: ["animals", "drawing", "space"],
  questTitle: "Shadow Detective",
  questPrompt: "Why do shadows change shape throughout the day?",
  questMission: "Trace your shadow with chalk at three different times today.",
  questFollowUp: "What was different about the light each time?",
  questSkill: "observation",
  childResponse: "Her shadow was longest before dinner and pointed toward the kitchen.",
  recentQuests: [],
  learningEvents: [
    {
      kind: "family_preference",
      summary: "Parent likes short follow-up questions that can be read aloud.",
      evidence: "short follow-up questions",
      confidence: 0.75,
    },
  ],
};

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  try {
    const reply = await interpretResponse(SAMPLE_INTERPRET);
    return NextResponse.json({ ok: true, context: SAMPLE_INTERPRET, reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Interpretation failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
