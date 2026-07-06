import type { FamilyQuestContext } from "./types";

export type LearningArcId =
  | "evidence-habits"
  | "fair-tradeoffs"
  | "source-sense"
  | "creative-prototyping"
  | "perspective-listening"
  | "future-responsibility";

export type LearningArc = {
  id: LearningArcId;
  title: string;
  skills: readonly string[];
  bestSignals: readonly RegExp[];
  ageHint: "all" | "8+" | "11+";
  promise: string;
  weekMoves: readonly string[];
  avoid: string;
};

export const LEARNING_ARCS: readonly LearningArc[] = [
  {
    id: "evidence-habits",
    title: "Evidence Habits",
    skills: [
      "evidence-seeking",
      "hypothesis-testing",
      "uncertainty-calibration",
      "metacognition",
    ],
    bestSignals: [
      /\b(evidence|clue|test|experiment|prediction|predict|guess|prove|why|how|puzzle)\b/,
      /\b(what makes|change my mind|check|true|mistaken|stronger|weaker)\b/,
    ],
    ageHint: "all",
    promise:
      "Help the child connect claims to visible clues, revise gracefully, and enjoy being less certain.",
    weekMoves: [
      "Week 1: ask for one concrete clue before accepting a guess.",
      "Week 2: make a tiny prediction, change one variable, and compare.",
      "Week 3: name what would make the child more sure or less sure.",
      "Week 4: revisit a prior idea and notice how the evidence changed.",
    ],
    avoid: "Do not turn evidence into a quiz, a right-answer hunt, or a lecture about facts.",
  },
  {
    id: "fair-tradeoffs",
    title: "Fair Tradeoffs",
    skills: ["values-reasoning", "decision-making", "perspective-taking", "systems-thinking"],
    bestSignals: [
      /\b(fair|rule|share|sharing|turn|team|game|sibling|friend|choice|choose)\b/,
      /\b(tradeoff|protect|helps|hurts|equal|everyone|together|decision)\b/,
    ],
    ageHint: "all",
    promise:
      "Turn ordinary choices into practice seeing who benefits, who pays a cost, and what fairness requires.",
    weekMoves: [
      "Week 1: compare two plausible rules for a small shared resource.",
      "Week 2: ask who each rule helps and who it makes harder for.",
      "Week 3: change one constraint and see whether the fair rule changes.",
      "Week 4: invite the child to design a better rule with one tradeoff named.",
    ],
    avoid: "Do not moralize, adjudicate a current family conflict, or imply the adult's rule is the lesson.",
  },
  {
    id: "source-sense",
    title: "Source Sense",
    skills: ["source-evaluation", "epistemic-honesty", "critical-thinking", "assumption-spotting"],
    bestSignals: [
      /\b(source|claim|trust|trustworthy|news|article|headline|online|internet|video|ad|package|sign)\b/,
      /\b(who made|who knows|why believe|reliable|fact|rumor|heard|saw)\b/,
    ],
    ageHint: "8+",
    promise:
      "Build the habit of asking who would know, why they might know, and what would make a claim stronger.",
    weekMoves: [
      "Week 1: use a non-screen claim and ask who would know.",
      "Week 2: compare two possible sources without sending the child online.",
      "Week 3: notice what a source might be missing or trying to do.",
      "Week 4: ask what would make the claim more trustworthy.",
    ],
    avoid: "Do not send children into adult misinformation, politics, or unsupervised internet research.",
  },
  {
    id: "creative-prototyping",
    title: "Creative Prototyping",
    skills: ["creative-thinking", "problem-solving", "comparison", "hypothesis-testing"],
    bestSignals: [
      /\b(build|make|maker|lego|blocks|draw|art|craft|design|invent|robot|minecraft|create)\b/,
      /\b(fix|prototype|try|improve|redesign|change|better|model)\b/,
    ],
    ageHint: "all",
    promise:
      "Give creativity a testable shape: imagine several possibilities, try one tiny version, and learn from it.",
    weekMoves: [
      "Week 1: invent three possible fixes or uses before choosing one.",
      "Week 2: make or sketch the smallest possible version.",
      "Week 3: test what changed and name one tradeoff.",
      "Week 4: improve the design using one thing the family noticed.",
    ],
    avoid: "Do not require craft supplies, perfection, a finished product, or a long project.",
  },
  {
    id: "perspective-listening",
    title: "Perspective Listening",
    skills: ["perspective-taking", "listening", "communication", "intellectual-humility"],
    bestSignals: [
      /\b(listen|talk|conversation|quiet|shy|story|feeling|friend|sibling|disagree)\b/,
      /\b(another view|other person|different idea|heard|missed|understand)\b/,
    ],
    ageHint: "all",
    promise:
      "Practice seeing the same moment from more than one mind while keeping the conversation warm.",
    weekMoves: [
      "Week 1: ask what another person might notice in the same moment.",
      "Week 2: listen for one detail before adding a new idea.",
      "Week 3: name what each view sees well and what it might miss.",
      "Week 4: invite the child to change one idea after hearing someone else.",
    ],
    avoid: "Do not force apologies, debate performance, or emotional disclosure.",
  },
  {
    id: "future-responsibility",
    title: "Future Responsibility",
    skills: ["future-thinking", "systems-thinking", "cause-and-effect", "values-reasoning"],
    bestSignals: [
      /\b(future|ai|robot|technology|climate|world|community|service|help)\b/,
      /\b(ripple|consequence|responsible|tomorrow|later|impact|care|steward)\b/,
    ],
    ageHint: "8+",
    promise:
      "Help the child imagine futures as shaped by choices, constraints, responsibility, and care for others.",
    weekMoves: [
      "Week 1: imagine two possible futures for one ordinary object or routine.",
      "Week 2: trace one small ripple from a family-scale choice.",
      "Week 3: ask who is helped, who is burdened, and what could be adjusted.",
      "Week 4: choose one tiny action that makes the better future more likely.",
    ],
    avoid: "Do not forecast jobs, catastrophize, or make abstract global problems the child's burden.",
  },
] as const;

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function normalize(parts: readonly string[]): string {
  return parts.join(" ").toLowerCase();
}

function familySignalText(context: FamilyQuestContext): string {
  return normalize([
    context.childName,
    context.interests.join(" "),
    context.learningEvents
      .map((event) => `${event.kind} ${event.summary} ${event.evidence ?? ""}`)
      .join(" "),
  ]);
}

function recentQuestText(context: FamilyQuestContext): string {
  return normalize(
    context.recentQuests.map((quest) =>
      [
        quest.title ?? "",
        quest.prompt,
        quest.mission,
        quest.skill ?? "",
        quest.response ?? "",
        quest.elsyReply ?? "",
      ].join(" "),
    ),
  );
}

function supportsAge(arc: LearningArc, age: number | null): boolean {
  if (arc.ageHint === "all" || age === null) return true;
  if (arc.ageHint === "8+") return age >= 8;
  return age >= 11;
}

function ageBoost(arc: LearningArc, age: number | null): number {
  if (arc.ageHint === "all") return 1;
  if (age === null) return -1;
  if (arc.ageHint === "8+" && age >= 8) return 2;
  if (arc.ageHint === "11+" && age >= 11) return 2;
  return -5;
}

function signalBoost(arc: LearningArc, text: string): number {
  return arc.bestSignals.reduce((score, pattern) => score + (pattern.test(text) ? 4 : 0), 0);
}

function recentSkillHits(arc: LearningArc, context: FamilyQuestContext): number {
  const arcSkills = new Set(arc.skills.map((skill) => skill.toLowerCase()));
  return context.recentQuests.reduce((count, quest) => {
    const skill = quest.skill?.toLowerCase();
    return skill && arcSkills.has(skill) ? count + 1 : count;
  }, 0);
}

function recentThemeHits(arc: LearningArc, text: string): number {
  return arc.bestSignals.reduce((score, pattern) => score + (pattern.test(text) ? 1 : 0), 0);
}

export function selectLearningArc(context: FamilyQuestContext): LearningArc {
  const familyText = familySignalText(context);
  const recentText = recentQuestText(context);
  const seed = `${context.childName}|${context.questNumber}|${context.interests.join("|")}`;

  const scored = LEARNING_ARCS.filter((arc) => supportsAge(arc, context.age))
    .map((arc) => {
      const repetitionPenalty = recentSkillHits(arc, context) * -5;
      const themePenalty = recentThemeHits(arc, recentText) * -3;
      const tieBreak = stableHash(`${seed}|${arc.id}`) / 0xffffffff;

      return {
        arc,
        score:
          5 +
          ageBoost(arc, context.age) +
          signalBoost(arc, familyText) +
          repetitionPenalty +
          themePenalty +
          tieBreak,
      };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.arc ?? LEARNING_ARCS[0];
}

export function formatLearningArcGuidance(context: FamilyQuestContext): string {
  const arc = selectLearningArc(context);

  return `Multi-week arc - invisible continuity layer.
Selected arc: ${arc.title}
Purpose: ${arc.promise}
Core skills: ${arc.skills.join(", ")}
Week-level progression:
${arc.weekMoves.map((move) => `- ${move}`).join("\n")}
Today: make the quest one small, concrete step in this arc while still feeling fresh and doable.
Do not repeat immediately: if recent quests already trained this exact surface or skill, use the arc's next move with a new setting, action, or tradeoff.
Avoid: ${arc.avoid}
Do not name the arc, weeks, research, future skills, or methodology in the parent-facing SMS.`;
}
