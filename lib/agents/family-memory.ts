import type { FamilyLearningContextEntry } from "./types";

type FamilyMemoryGroup = {
  title: string;
  instruction: string;
  events: FamilyLearningContextEntry[];
};

const GROUPS: Array<{
  kinds: readonly string[];
  title: string;
  instruction: string;
}> = [
  {
    kinds: ["avoidance"],
    title: "Avoid",
    instruction:
      "Treat these as constraints before generic methodology. Use newer dated events if they clearly reverse an older avoidance.",
  },
  {
    kinds: ["quest_feedback"],
    title: "Quest feedback",
    instruction:
      "Use these to tune future quests. Do not treat neutral or positive feedback as an avoidance unless it explicitly says to avoid something.",
  },
  {
    kinds: ["family_preference"],
    title: "Family preferences",
    instruction:
      "Use these to tune length, setting, topic, tone, difficulty, and send style when safe.",
  },
  {
    kinds: ["successful_pattern"],
    title: "What worked",
    instruction:
      "Repeat the underlying pattern, not the exact same surface or wording.",
  },
  {
    kinds: ["child_interest"],
    title: "Child interests and sparks",
    instruction:
      "Weave these in only when they make the prompt more natural and specific.",
  },
  {
    kinds: ["parent_note"],
    title: "Parent notes",
    instruction:
      "Use these as low-confidence context; do not overfit one ambiguous message.",
  },
];

function confidenceLabel(confidence?: number | null): string {
  if (typeof confidence !== "number" || !Number.isFinite(confidence)) {
    return "medium confidence";
  }
  if (confidence >= 0.8) return "high confidence";
  if (confidence >= 0.5) return "medium confidence";
  return "low confidence";
}

function scopeLabel(event: FamilyLearningContextEntry): string {
  return event.child_id ? "child-scoped" : "family-wide";
}

function dateLabel(event: FamilyLearningContextEntry): string {
  if (!event.created_at) return "date unknown";

  const parsed = new Date(event.created_at);
  if (Number.isNaN(parsed.getTime())) return "date unknown";

  return parsed.toISOString().slice(0, 10);
}

function formatEvent(event: FamilyLearningContextEntry, index: number): string {
  const evidence = event.evidence?.trim()
    ? ` Evidence: "${event.evidence.trim().slice(0, 120)}"`
    : "";
  const meta = `${scopeLabel(event)}, ${dateLabel(event)}, ${confidenceLabel(
    event.confidence,
  )}`;
  return `${index + 1}. ${event.summary} (${meta}).${evidence}`;
}

function groupEvents(
  learningEvents: FamilyLearningContextEntry[],
): FamilyMemoryGroup[] {
  return GROUPS.map((group) => ({
    title: group.title,
    instruction: group.instruction,
    events: learningEvents.filter((event) => group.kinds.includes(event.kind)),
  })).filter((group) => group.events.length > 0);
}

export function formatFamilyMemoryProfile(
  learningEvents: FamilyLearningContextEntry[],
): string {
  if (learningEvents.length === 0) {
    return "No durable family learning yet.";
  }

  const grouped = groupEvents(learningEvents);
  const covered = new Set(grouped.flatMap((group) => group.events));
  const uncategorized = learningEvents.filter((event) => !covered.has(event));
  const groups =
    uncategorized.length > 0
      ? [
          ...grouped,
          {
            title: "Other context",
            instruction:
              "Use only when it clearly improves the next message; otherwise ignore.",
            events: uncategorized,
          },
        ]
      : grouped;

  return groups
    .map((group) => {
      const events = group.events.map(formatEvent).join("\n");
      return `${group.title}:\n${group.instruction}\n${events}`;
    })
    .join("\n\n");
}
