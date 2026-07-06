import { formatRubricGuidance } from "./quality-rubric";

export type ParentResourceAgeBand = "5-7" | "8-10" | "11-12" | "all";

export type ParentResourceCard = {
  id: string;
  title: string;
  sourceName: string;
  url: string;
  ageBands: readonly ParentResourceAgeBand[];
  skills: readonly string[];
  triggerTerms: readonly string[];
  why: string;
  tryThis: string;
  safetyNote: string;
  reviewedAt: string;
};

export type ParentPromptContext = {
  kind: "quest" | "dinner";
  title?: string | null;
  prompt: string;
  mission?: string | null;
  followUp?: string | null;
  skill?: string | null;
  childAge?: number | null;
};

export const PARENT_RESOURCE_CARDS: readonly ParentResourceCard[] = [
  {
    id: "serve-and-return",
    title: "Serve and Return",
    sourceName: "Harvard Center on the Developing Child",
    url: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
    ageBands: ["5-7", "8-10", "all"],
    skills: ["observation", "listening", "conversation", "attention"],
    triggerTerms: ["notice", "listen", "conversation", "wait", "respond", "attention"],
    why:
      "This prompt is built for a short back-and-forth: your child notices, you respond, then they get another turn.",
    tryThis:
      "Pause after their first answer and ask, 'What makes you say that?'",
    safetyNote:
      "Keep it playful. This is conversation support, not a developmental claim.",
    reviewedAt: "2026-07-03",
  },
  {
    id: "civic-online-reasoning",
    title: "Civic Online Reasoning",
    sourceName: "Digital Inquiry Group",
    url: "https://cor.inquirygroup.org/",
    ageBands: ["8-10", "11-12", "all"],
    skills: [
      "source-evaluation",
      "evidence-seeking",
      "epistemic-honesty",
      "critical-thinking",
    ],
    triggerTerms: ["evidence", "true", "trust", "source", "rumor", "claim", "proof"],
    why:
      "This prompt practices slowing down before believing a claim: What do we know, and what would count as evidence?",
    tryThis:
      "Separate 'I know,' 'I think,' and 'I wonder' before deciding.",
    safetyNote:
      "Do not turn dinner into a fact-checking assignment; keep it family-scale.",
    reviewedAt: "2026-07-03",
  },
  {
    id: "how-people-learn",
    title: "How People Learn II",
    sourceName: "National Academies",
    url: "https://www.nationalacademies.org/read/24783",
    ageBands: ["all"],
    skills: [
      "reasoning",
      "comparison",
      "metacognition",
      "transfer",
      "pattern-finding",
    ],
    triggerTerms: ["compare", "pattern", "reason", "explain", "same", "different", "changed"],
    why:
      "This prompt helps make thinking visible: children compare ideas, explain reasons, and revise with new evidence.",
    tryThis:
      "Ask, 'What part of your idea feels strongest, and what part are you less sure about?'",
    safetyNote:
      "Avoid quizzing. The point is visible thinking, not one right answer.",
    reviewedAt: "2026-07-03",
  },
  {
    id: "learning-compass",
    title: "Learning Compass 2030",
    sourceName: "OECD",
    url: "https://www.oecd.org/en/data/tools/oecd-learning-compass-2030.html",
    ageBands: ["8-10", "11-12", "all"],
    skills: [
      "future-thinking",
      "decision-making",
      "values-reasoning",
      "systems-thinking",
    ],
    triggerTerms: [
      "future",
      "tradeoff",
      "choice",
      "responsible",
      "community",
      "world",
      "fair",
    ],
    why:
      "This prompt gives children practice navigating tradeoffs: more than one value can matter at the same time.",
    tryThis:
      "Ask who is helped, who might be affected later, and what tradeoff feels acceptable.",
    safetyNote:
      "Keep the stakes age-appropriate. Children should reason, not carry adult burdens.",
    reviewedAt: "2026-07-03",
  },
  {
    id: "lateral-reading",
    title: "Teaching Lateral Reading",
    sourceName: "Digital Inquiry Group",
    url: "https://cor.inquirygroup.org/curriculum/collections/teaching-lateral-reading/",
    ageBands: ["11-12"],
    skills: ["source-evaluation", "uncertainty-calibration", "critical-thinking"],
    triggerTerms: ["expert", "website", "internet", "news", "source", "trust", "claim"],
    why:
      "This prompt supports a parent-friendly version of source sense: check who is making a claim before trusting it.",
    tryThis:
      "Ask, 'Who would know this well, and what would they need to show us?'",
    safetyNote:
      "Use this as parent context only; do not ask the child to search the web by SMS.",
    reviewedAt: "2026-07-03",
  },
];

export const PARENT_RESOURCE_RUBRIC_GUIDANCE = formatRubricGuidance("resource");

const RESOURCE_CARD_BANNED_COPY = [
  /\bguarantee(?:d|s)?\b/i,
  /\bdiagnos(?:e|is|tic)\b/i,
  /\btherap(?:y|ist|eutic)\b/i,
  /\bmedical\b/i,
  /\bmental health\b/i,
  /\bboost iq\b/i,
  /\bbrain training\b/i,
];

export function validateParentResourceCard(card: ParentResourceCard): string[] {
  const issues: string[] = [];
  const copy = `${card.why} ${card.tryThis} ${card.safetyNote}`;

  if (!card.why.trim()) issues.push(`${card.id}: why is empty`);
  if (!card.tryThis.trim()) issues.push(`${card.id}: tryThis is empty`);
  if (!card.safetyNote.trim()) issues.push(`${card.id}: safetyNote is empty`);
  if (!card.sourceName.trim()) issues.push(`${card.id}: sourceName is empty`);
  if (!card.url.startsWith("https://")) {
    issues.push(`${card.id}: resource URL must be https`);
  }
  if (!/\b(?:ask|pause|separate|use|keep|avoid|do not)\b/i.test(card.tryThis)) {
    issues.push(`${card.id}: tryThis needs a concrete parent move`);
  }
  if (!/\b(?:claim|support|not|avoid|keep|age-appropriate|parent context|conversation)\b/i.test(card.safetyNote)) {
    issues.push(`${card.id}: safetyNote needs a clear boundary`);
  }

  for (const pattern of RESOURCE_CARD_BANNED_COPY) {
    if (pattern.test(copy)) {
      issues.push(`${card.id}: contains banned resource-card claim`);
    }
  }

  return issues;
}

function ageBandFor(age: number | null | undefined): ParentResourceAgeBand | null {
  if (age === null || age === undefined) return null;
  if (age <= 7) return "5-7";
  if (age <= 10) return "8-10";
  return "11-12";
}

function contextText(context: ParentPromptContext): string {
  return [
    context.title,
    context.prompt,
    context.mission,
    context.followUp,
    context.skill,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function scoreResourceCard(card: ParentResourceCard, context: ParentPromptContext) {
  const ageBand = ageBandFor(context.childAge);
  if (
    ageBand &&
    !card.ageBands.includes("all") &&
    !card.ageBands.includes(ageBand)
  ) {
    return Number.NEGATIVE_INFINITY;
  }

  const text = contextText(context);
  const skill = context.skill?.toLowerCase() ?? "";
  let score = card.ageBands.includes("all") ? 1 : 0;

  if (skill && card.skills.some((cardSkill) => cardSkill === skill)) {
    score += 6;
  }

  for (const cardSkill of card.skills) {
    if (text.includes(cardSkill)) score += 2;
  }

  for (const term of card.triggerTerms) {
    if (text.includes(term)) score += 3;
  }

  if (context.kind === "dinner" && card.id === "serve-and-return") {
    score += 1;
  }

  return score;
}

export function selectParentResourceCard(
  context: ParentPromptContext,
): ParentResourceCard {
  return [...PARENT_RESOURCE_CARDS]
    .map((card) => ({ card, score: scoreResourceCard(card, context) }))
    .filter(
      (entry) =>
        Number.isFinite(entry.score) &&
        validateParentResourceCard(entry.card).length === 0,
    )
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.card.id.localeCompare(b.card.id);
    })[0]?.card ?? PARENT_RESOURCE_CARDS[0];
}

export function formatParentResourceMessage(
  context: ParentPromptContext,
  card = selectParentResourceCard(context),
): string {
  const label = context.kind === "quest" ? "mission" : "dinner question";
  const title = context.title ? ` (${context.title})` : "";

  return `Parent context for this ${label}${title}:
${card.why}

Try: ${card.tryThis}

Resource: ${card.sourceName} - ${card.title}
${card.url}

Note: ${card.safetyNote}`;
}
