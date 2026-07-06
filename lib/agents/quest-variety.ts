import type { FamilyQuestContext } from "./types";

type QuestVarietyLens = {
  id: string;
  title: string;
  skills: readonly string[];
  bestWhen: string;
  questMove: string;
  followUpMove: string;
  avoid: string;
};

const QUEST_VARIETY_LENSES: readonly QuestVarietyLens[] = [
  {
    id: "fair-rule",
    title: "Fair-rule test",
    skills: ["values-reasoning", "perspective-taking", "decision-making"],
    bestWhen: "recent quests have been mostly observation or pattern-finding",
    questMove:
      "Turn an ordinary shared object, game, or family moment into a tiny fairness question with two plausible rules.",
    followUpMove: "Ask who each rule helps, who it might make harder for, and what would make it fairer.",
    avoid: "Do not turn it into discipline, obedience, or a current family conflict.",
  },
  {
    id: "trust-the-clue",
    title: "Trust-the-clue check",
    skills: ["evidence-seeking", "source-evaluation", "epistemic-honesty"],
    bestWhen: "the child is ready to move beyond noticing into claims and evidence",
    questMove:
      "Have the child make or hear one small claim, then find one clue that would make the claim stronger or weaker.",
    followUpMove: "Ask what else could be true and what evidence would change their mind.",
    avoid: "Do not send the child online or ask them to investigate real people.",
  },
  {
    id: "tiny-redesign",
    title: "Tiny redesign",
    skills: ["creative-thinking", "systems-thinking", "problem-solving"],
    bestWhen: "the family likes building, drawing, invention, or visible changes",
    questMove:
      "Pick one everyday object or routine and imagine one tiny change that helps one person while creating a tradeoff.",
    followUpMove: "Ask what they would test before changing it for real.",
    avoid: "Do not require supplies, a polished craft, or a big project.",
  },
  {
    id: "perspective-swap",
    title: "Perspective swap",
    skills: ["perspective-taking", "communication", "intellectual-humility"],
    bestWhen: "recent replies suggest opinions, disagreements, stories, games, siblings, or friends",
    questMove:
      "Ask how the same moment might look different to a child, parent, friend, sibling, or stranger.",
    followUpMove: "Ask what detail each person might notice that the other misses.",
    avoid: "Do not make the child relive a real conflict or perform an apology.",
  },
  {
    id: "prediction-test",
    title: "Prediction test",
    skills: ["hypothesis-testing", "uncertainty-calibration", "metacognition"],
    bestWhen: "a concrete object or routine can be tested in under ten minutes",
    questMove:
      "Make one quick prediction, change one small variable, and compare the result with what they expected.",
    followUpMove: "Ask whether their idea stayed the same, got weaker, or got stronger.",
    avoid: "Do not make it a formal science experiment or a multi-step activity.",
  },
];

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function profileText(context: FamilyQuestContext): string {
  return [
    context.interests.join(" "),
    context.learningEvents.map((event) => `${event.kind} ${event.summary} ${event.evidence ?? ""}`).join(" "),
    context.recentQuests.map((quest) => `${quest.title ?? ""} ${quest.prompt} ${quest.mission} ${quest.skill ?? ""}`).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function selectQuestVarietyLens(context: FamilyQuestContext): QuestVarietyLens {
  const usedSkills = new Set(
    context.recentQuests
      .map((quest) => quest.skill?.toLowerCase())
      .filter((skill): skill is string => Boolean(skill)),
  );
  const profile = profileText(context);
  const seed = `${context.childName}|${context.questNumber}|${profile.slice(0, 180)}`;

  const scored = QUEST_VARIETY_LENSES.map((lens) => {
    const repeatedSkillPenalty = lens.skills.some((skill) => usedSkills.has(skill))
      ? -4
      : 0;
    const preferenceBoost =
      /draw|build|invent|design|robot|lego|minecraft|make|create/.test(profile) &&
      lens.id === "tiny-redesign"
        ? 4
        : 0;
    const evidenceBoost =
      /why|evidence|clue|true|trust|feedback|what makes/.test(profile) &&
      lens.id === "trust-the-clue"
        ? 3
        : 0;
    const fairnessBoost =
      /fair|rule|game|soccer|team|share|sibling/.test(profile) && lens.id === "fair-rule"
        ? 3
        : 0;
    const observationPenalty =
      /shadow|front step|shape|color|pattern|window light/.test(profile) &&
      (lens.id === "fair-rule" || lens.id === "trust-the-clue" || lens.id === "tiny-redesign")
        ? 3
        : 0;

    return {
      lens,
      score:
        repeatedSkillPenalty +
        preferenceBoost +
        evidenceBoost +
        fairnessBoost +
        observationPenalty +
        stableHash(`${seed}|${lens.id}`) / 0xffffffff,
    };
  }).sort((a, b) => b.score - a.score);

  return scored[0].lens;
}

export function formatQuestVarietyGuidance(context: FamilyQuestContext): string {
  const lens = selectQuestVarietyLens(context);
  return `Quest variety lens - use this to avoid repetitive passive noticing.
Lens: ${lens.title}
Best when: ${lens.bestWhen}
Quest move: ${lens.questMove}
Follow-up move: ${lens.followUpMove}
Skills it can train: ${lens.skills.join(", ")}
Avoid: ${lens.avoid}`;
}
