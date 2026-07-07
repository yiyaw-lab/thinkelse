import type { FamilyLearningEvent } from "@/lib/db/family-learning";

export type PilotSignalCategory =
  | "delight"
  | "friction"
  | "feature_request"
  | "personalization"
  | "delivery"
  | "quality";

export type PilotSignalPriority = "high" | "medium" | "low";

export type PilotFamilyInput = {
  familyId: string;
  parentName?: string | null;
  phone?: string | null;
  learningEvents: FamilyLearningEvent[];
};

export type PilotSignal = {
  familyId: string;
  parentName: string | null;
  category: PilotSignalCategory;
  priority: PilotSignalPriority;
  summary: string;
  evidence: string | null;
  recommendedAction: string;
};

export type LighthousePilotBrief = {
  generatedAt: string;
  familyCount: number;
  summary: Record<PilotSignalCategory, number>;
  wins: PilotSignal[];
  risks: PilotSignal[];
  experiments: PilotSignal[];
  followUps: PilotSignal[];
};

const CATEGORIES: readonly PilotSignalCategory[] = [
  "delight",
  "friction",
  "feature_request",
  "personalization",
  "delivery",
  "quality",
] as const;

function emptySummary(): Record<PilotSignalCategory, number> {
  return {
    delight: 0,
    friction: 0,
    feature_request: 0,
    personalization: 0,
    delivery: 0,
    quality: 0,
  };
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").trim().replace(/\s+/g, " ");
}

function textFor(event: FamilyLearningEvent): string {
  return `${event.kind} ${event.summary} ${event.evidence ?? ""}`.toLowerCase();
}

function priorityFor(event: FamilyLearningEvent, category: PilotSignalCategory): PilotSignalPriority {
  const confidence = event.confidence ?? 0.7;
  const text = textFor(event);

  if (
    category === "friction" &&
    (confidence >= 0.8 || /\b(hate|stuck|broken|not receiving|never received|boring|unanswerable)\b/.test(text))
  ) {
    return "high";
  }

  if (category === "delivery" || category === "quality") {
    return confidence >= 0.7 ? "high" : "medium";
  }

  if (category === "feature_request") {
    return confidence >= 0.8 ? "medium" : "low";
  }

  if (category === "delight" && confidence >= 0.75) {
    return "medium";
  }

  return "low";
}

export function classifyPilotSignal(event: FamilyLearningEvent): PilotSignalCategory {
  const text = textFor(event);

  if (/\b(not receiving|never received|stuck|schedule|scheduled|cron|time|dinner on|delivery)\b/.test(text)) {
    return "delivery";
  }

  if (/\b(boring|generic|formulaic|repetitive|unanswerable|too easy|too hard|childish|ignore)\b/.test(text)) {
    return "quality";
  }

  if (event.kind === "avoidance" || /\b(?:do not|don't|dont|never)\b.*\b(send|use|want|like)\b/.test(text)) {
    return "friction";
  }

  if (event.kind === "child_interest") {
    return "personalization";
  }

  if (/\b(can you|could you|please|feature|add|support|make future|next time|more|less|shorter|longer)\b/.test(text)) {
    return "feature_request";
  }

  if (event.kind === "successful_pattern" || /\b(loved|worked|great|favorite|look forward|can't wait|engaged)\b/.test(text)) {
    return "delight";
  }

  if (event.kind === "family_preference" || event.kind === "quest_feedback") {
    return "personalization";
  }

  return "personalization";
}

function actionFor(category: PilotSignalCategory): string {
  switch (category) {
    case "delight":
      return "Repeat the underlying pattern for this family and consider adding it to quality examples.";
    case "friction":
      return "Follow up or adjust generation constraints before sending similar prompts again.";
    case "feature_request":
      return "Cluster with similar requests and consider a small experiment or manual workaround.";
    case "delivery":
      return "Check scheduler, onboarding settings, and latest send logs before assuming content failure.";
    case "quality":
      return "Turn this into a regression fixture, rubric example, or prompt constraint.";
    case "personalization":
      return "Use this as family memory; do not overgeneralize it to all families yet.";
  }
}

export function buildPilotSignals(families: readonly PilotFamilyInput[]): PilotSignal[] {
  return families.flatMap((family) =>
    family.learningEvents.map((event) => {
      const category = classifyPilotSignal(event);
      return {
        familyId: family.familyId,
        parentName: family.parentName ?? null,
        category,
        priority: priorityFor(event, category),
        summary: normalizeText(event.summary).slice(0, 220),
        evidence: normalizeText(event.evidence).slice(0, 300) || null,
        recommendedAction: actionFor(category),
      };
    }),
  );
}

function priorityRank(priority: PilotSignalPriority): number {
  if (priority === "high") return 0;
  if (priority === "medium") return 1;
  return 2;
}

function sortSignals(signals: PilotSignal[]): PilotSignal[] {
  return [...signals].sort((a, b) => {
    const priority = priorityRank(a.priority) - priorityRank(b.priority);
    if (priority !== 0) return priority;
    return a.familyId.localeCompare(b.familyId);
  });
}

function countSummary(signals: readonly PilotSignal[]): Record<PilotSignalCategory, number> {
  const summary = emptySummary();
  for (const signal of signals) {
    summary[signal.category] += 1;
  }
  return summary;
}

export function buildLighthousePilotBrief(
  families: readonly PilotFamilyInput[],
  generatedAt = new Date().toISOString(),
): LighthousePilotBrief {
  const signals = buildPilotSignals(families);
  const wins = sortSignals(signals.filter((signal) => signal.category === "delight"));
  const risks = sortSignals(
    signals.filter((signal) =>
      signal.category === "friction" ||
      signal.category === "delivery" ||
      signal.category === "quality",
    ),
  );
  const experiments = sortSignals(
    signals.filter((signal) =>
      signal.category === "feature_request" || signal.category === "personalization",
    ),
  );
  const followUps = sortSignals(signals.filter((signal) => signal.priority === "high"));

  return {
    generatedAt,
    familyCount: families.length,
    summary: countSummary(signals),
    wins: wins.slice(0, 8),
    risks: risks.slice(0, 12),
    experiments: experiments.slice(0, 12),
    followUps: followUps.slice(0, 12),
  };
}

export function formatLighthousePilotBrief(brief: LighthousePilotBrief): string {
  const summary = CATEGORIES.map((category) => `${category}: ${brief.summary[category]}`).join(", ");
  const formatGroup = (title: string, signals: readonly PilotSignal[]) => {
    if (signals.length === 0) return `${title}: none`;
    return `${title}:\n${signals
      .map((signal) => {
        const parent = signal.parentName ? `${signal.parentName} ` : "";
        return `- [${signal.priority}] ${parent}${signal.summary} -> ${signal.recommendedAction}`;
      })
      .join("\n")}`;
  };

  return `Lighthouse pilot brief (${brief.generatedAt})
Families: ${brief.familyCount}
Summary: ${summary}

${formatGroup("Wins", brief.wins)}

${formatGroup("Risks", brief.risks)}

${formatGroup("Experiments", brief.experiments)}

${formatGroup("Follow-ups", brief.followUps)}`;
}
