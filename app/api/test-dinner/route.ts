import { NextResponse } from "next/server";

import { generateDinnerConversation } from "@/lib/agents/generateDinnerConversation";
import type { FamilyDinnerContext } from "@/lib/agents/build-dinner-context";
import type { WorldContextLevel } from "@/lib/agents/world-context-cards";
import { formatDinnerConversationMessage } from "@/lib/sms/format-quest";

const SAMPLE_CONTEXT: FamilyDinnerContext = {
  parentName: "Sarah",
  children: [
    {
      id: "sample-child-1",
      name: "Mira",
      age: 8,
      interests: ["animals", "drawing", "space"],
      recentQuests: [
        {
          title: "Shadow Detective",
          prompt: "Why do shadows change shape throughout the day?",
          mission: "Trace your shadow with chalk at three different times.",
          skill: "observation",
          response: "Her shadow was longest before dinner.",
          elsyReply: "Sharp noticing - what do you think made the shadow stretch that long?",
          missionStatus: "completed",
          completedAt: "2026-06-12T18:15:00Z",
          createdAt: "2026-06-12T08:00:00Z",
        },
      ],
      learningEvents: [
        {
          kind: "successful_pattern",
          summary: "Mira engages when questions let her draw or compare possible explanations.",
          evidence: "drawing and shadow quests got detailed replies",
          confidence: 0.8,
        },
      ],
    },
    {
      id: "sample-child-2",
      name: "Leo",
      age: 11,
      interests: ["soccer", "robots", "history"],
      recentQuests: [
        {
          title: "Fair Referee",
          prompt: "What makes a close call in a game feel fair?",
          mission: "Watch for one close decision in a game or story and name the evidence.",
          skill: "evidence-seeking",
          response: "He said the ref should explain what they saw.",
          elsyReply: null,
          missionStatus: "completed",
          completedAt: "2026-06-11T19:20:00Z",
          createdAt: "2026-06-11T08:00:00Z",
        },
      ],
      learningEvents: [
        {
          kind: "child_interest",
          summary: "Leo likes fairness questions tied to games and inventions.",
          evidence: "soccer and robot prompts got longer answers",
          confidence: 0.75,
        },
      ],
    },
  ],
  recentDinnerConversations: [
    {
      question:
        "If you designed a game where players had to choose between sharing a resource or keeping it all to themselves, what rules would make sharing feel fair to everyone?",
      parent_move:
        "Ask what makes you say that and invite another family member to add their ideas.",
      follow_up:
        "What could happen in the game if someone changed the sharing rules halfway through-how would players react?",
      skill: "values-reasoning",
      local_date_key: "2026-07-05",
      sent_at: "2026-07-05T18:30:00Z",
    },
    {
      question:
        "If you could design a game about how families make decisions together, what tricky choices would you include and why?",
      parent_move:
        "Ask what makes you say that and invite another family member to share a different idea.",
      follow_up:
        "How might your game show that sometimes people change their minds or see things differently?",
      skill: "decision-making",
      local_date_key: "2026-07-04",
      sent_at: "2026-07-04T18:30:00Z",
    },
  ],
  familyLearningEvents: [
    {
      kind: "family_preference",
      summary:
        "Parent dislikes unanswerable abstract dinner questions about designing games, players, resources, and family decision systems.",
      evidence: "feedback on two weak dinner starters",
      confidence: 0.95,
    },
    {
      kind: "family_preference",
      summary:
        "Dinner questions should be concrete enough for the youngest child to answer immediately from lived experience.",
      evidence: "parent said current dinner questions are unanswerable",
      confidence: 0.9,
    },
  ],
  temporal: {
    season: "summer",
    timeOfDay: "evening",
    settingHints: ["dinner table", "twilight sky", "outdoor sounds"],
  },
};

function worldContextLevelFromRequest(request: Request): WorldContextLevel | undefined {
  const value = new URL(request.url).searchParams.get("world")?.toLowerCase();
  if (value === "1" || value === "true" || value === "light") return "light";
  if (value === "deeper" || value === "medium") return "deeper";
  if (value === "0" || value === "false" || value === "none") return "none";
  return undefined;
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  try {
    const dinner = await generateDinnerConversation(SAMPLE_CONTEXT, {
      worldContextLevel: worldContextLevelFromRequest(request),
    });

    return NextResponse.json({
      ok: true,
      context: SAMPLE_CONTEXT,
      dinner,
      worldContextCard: dinner.worldContextCard ?? null,
      sms: formatDinnerConversationMessage(dinner),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Dinner conversation generation failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
