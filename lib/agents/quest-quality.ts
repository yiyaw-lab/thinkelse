import type { GeneratedQuest } from "./generateQuest";
import type { InterpretedResponse } from "./interpretResponse";
import type { FamilyQuestContext, QuestHistoryEntry } from "./types";

const BANNED_PHRASES = [
  "worksheet",
  "homework",
  "correct answer",
  "good job",
  "great job",
  "amazing job",
  "as an ai",
  "chatbot",
  "quiz",
  "lesson",
  "screen time",
  "watch a video",
  "go online",
  "look it up",
  "search the internet",
  "download an app",
  "therapy",
  "therapeutic",
  "therapist",
  "medical",
  "mental health",
  "diagnose",
  "diagnosis",
  "treatment",
  "treat anxiety",
  "cure",
  "guaranteed",
];

const GENERIC_PRAISE = [
  "that's wonderful",
  "how wonderful",
  "so proud",
  "great job",
  "good job",
  "amazing",
];

const DULL_MISSION_PATTERNS = [
  { pattern: /\bexplore (the )?(world|nature|outside|environment)\b/i, note: "mission is too vague" },
  { pattern: /\b(learn|read|research) about\b/i, note: "mission should be real-world, not research" },
  { pattern: /\b(discuss|talk about)\b/i, note: "mission needs action beyond discussion" },
  { pattern: /\bthings around (you|the house|your home)\b/i, note: "mission needs a more concrete object or setting" },
  {
    pattern:
      /\b(first,?|then|finally)\b|\bnext,?\s+(try|ask|look|listen|compare|draw|build|test|watch|find)\b/i,
    note: "mission should feel like one tiny action, not a multi-step lesson",
  },
];

const RIGHT_ANSWER_PATTERNS = [
  { pattern: /\b(correct|right) answer\b/i, note: "quest should not imply a right answer" },
  { pattern: /\b(do you know|can you name|what is the name of)\b/i, note: "prompt feels like recall or trivia" },
  { pattern: /\bquiz\b/i, note: "quest should not feel like a quiz" },
];

const WEAK_FOLLOW_UP_PATTERNS = [
  { pattern: /\bwhat did you learn\b/i, note: "followUp is too school-like" },
  { pattern: /\bdid you like\b/i, note: "followUp should invite thinking beyond preference" },
  { pattern: /\bhow did it make you feel\b/i, note: "followUp should avoid therapy-like reflection" },
];

const WEAK_QUEST_PATTERNS = [
  {
    pattern: /\bwhat do you notice\b/i,
    note: "prompt uses a generic noticing frame",
  },
  {
    pattern: /\bwhat (?:kinds of )?(?:shapes?|colors?|patterns?) do you notice\b/i,
    note: "prompt uses a generic shape/color/pattern noticing frame",
  },
  {
    pattern: /\b(?:look|walk|go) around\b|\baround (?:you|your home|the house)\b/i,
    note: "quest uses a generic setting instead of a vivid anchor",
  },
  {
    pattern: /\b(?:something|anything) (?:interesting|new|different|nearby)\b/i,
    note: "quest asks for a vague object instead of a specific hook",
  },
  {
    pattern: /\b(?:fun little|silly|super fun|cool activity)\b/i,
    note: "quest tone feels childish or ignorable",
  },
  {
    pattern: /\bfront step\b/i,
    note: "quest uses the overused front-step setting",
  },
  {
    pattern: /\bshadow(?:s)?\b.*\b(?:shape|pattern|move|change)\b/i,
    note: "quest repeats the stale shadow-pattern frame",
  },
  {
    pattern: /\bname (?:one|a) detail\b.*\b(?:see|hear|feel|notice)\b/i,
    note: "quest uses a bland sensory-noticing parent move",
  },
];

const SURFACE_GROUPS: Array<{ label: string; pattern: RegExp }> = [
  { label: "front step", pattern: /\bfront step\b/i },
  { label: "shadows", pattern: /\bshadow(?:s)?\b/i },
  { label: "shapes/colors/patterns", pattern: /\b(?:shape|shapes|color|colors|pattern|patterns)\b/i },
  { label: "window light", pattern: /\bwindow light\b|\blight\b/i },
  { label: "sounds", pattern: /\b(?:sound|sounds|listen|listening|heard|hear)\b/i },
  { label: "weather/air", pattern: /\b(?:air|breeze|wind|weather|cloud|clouds|sky)\b/i },
];

const RICH_THINKING_TERMS = [
  "fair",
  "rule",
  "trust",
  "evidence",
  "clue",
  "claim",
  "reason",
  "choice",
  "decide",
  "tradeoff",
  "perspective",
  "someone",
  "person",
  "people",
  "test",
  "prediction",
  "predict",
  "redesign",
  "design",
  "invent",
  "build",
  "change your mind",
  "what else could be true",
];

const ANTICIPATION_HOOK_TERMS = [
  ...RICH_THINKING_TERMS,
  "surprise",
  "surprising",
  "mystery",
  "detective",
  "clue",
  "wonder",
  "why",
  "what if",
  "better",
  "harder",
  "easier",
  "helps",
  "trade",
  "choose",
  "try first",
  "stronger",
  "weaker",
];

const GENERIC_QUEST_ENERGY =
  /\b(?:look around|things around|something nearby|something interesting|anything interesting|explore|fun little|cool activity|what do you notice)\b/i;

function containsBannedPhrase(text: string): string | null {
  const lower = text.toLowerCase();
  return BANNED_PHRASES.find((phrase) => lower.includes(phrase)) ?? null;
}

function wordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function questBlob(quest: GeneratedQuest): string {
  return `${quest.title ?? ""} ${quest.whyThis ?? ""} ${quest.prompt ?? ""} ${quest.mission ?? ""} ${quest.followUp ?? ""}`.toLowerCase();
}

function surfaceTerms(text: string): Set<string> {
  const terms = new Set<string>();
  for (const group of SURFACE_GROUPS) {
    if (group.pattern.test(text)) terms.add(group.label);
  }
  return terms;
}

function validateQuestAgainstRecent(
  quest: GeneratedQuest,
  recentQuests: QuestHistoryEntry[],
): string[] {
  const issues: string[] = [];
  const current = questBlob(quest);
  const recentText = recentQuests
    .slice(0, 4)
    .map((recent) => `${recent.title ?? ""} ${recent.prompt} ${recent.mission} ${recent.skill ?? ""}`)
    .join(" ")
    .toLowerCase();

  if (!recentText.trim()) return issues;

  const recentTerms = surfaceTerms(recentText);
  const currentTerms = surfaceTerms(current);
  for (const term of currentTerms) {
    if (recentTerms.has(term)) {
      issues.push(`quest repeats recent surface: ${term}`);
    }
  }

  const recentTitles = new Set(
    recentQuests
      .slice(0, 4)
      .map((recent) => recent.title?.trim().toLowerCase())
      .filter((title): title is string => Boolean(title)),
  );
  if (recentTitles.has((quest.title ?? "").trim().toLowerCase())) {
    issues.push("quest repeats a recent title");
  }

  return issues;
}

export function validateQuest(
  quest: GeneratedQuest,
  context?: Pick<FamilyQuestContext, "questNumber" | "recentQuests">,
): string[] {
  const issues: string[] = [];
  const title = quest.title ?? "";
  const whyThis = quest.whyThis ?? "";
  const prompt = quest.prompt ?? "";
  const mission = quest.mission ?? "";
  const followUp = quest.followUp ?? "";
  const skill = quest.skill ?? "";
  const blob = questBlob(quest);

  if (!title.trim()) issues.push("title is empty");
  if (!whyThis.trim()) issues.push("whyThis is empty");
  if (!prompt.trim()) issues.push("prompt is empty");
  if (!mission.trim()) issues.push("mission is empty");
  if (!followUp.trim()) issues.push("followUp is empty");
  if (!skill.trim()) issues.push("skill is empty");

  if (prompt.length > 200) issues.push("prompt too long for SMS");
  if (whyThis.length > 180) issues.push("whyThis too long for SMS");
  if (mission.length > 220) issues.push("mission too long for SMS");
  if (followUp.length > 160) issues.push("followUp too long for SMS");
  if (!prompt.trim().endsWith("?")) {
    issues.push("prompt must be one curiosity question ending with ?");
  }
  if (whyThis && wordCount(whyThis) > 28) {
    issues.push("whyThis should be one short parent-facing sentence");
  }
  if (/\b(?:study|studies|research proves|neuroscience|brain development|guaranteed)\b/i.test(whyThis)) {
    issues.push("whyThis should avoid research jargon or overclaims");
  }
  if (
    whyThis &&
    !/\b(?:together|family|you and|with you|parent)\b/i.test(whyThis)
  ) {
    issues.push("whyThis should show how this brings the family into the thinking");
  }
  if (!followUp.trim().endsWith("?")) {
    issues.push("followUp must be a question ending with ?");
  }

  const titleWords = wordCount(title);
  if (titleWords > 0 && (titleWords < 2 || titleWords > 4)) {
    issues.push("title should be 2–4 words");
  }

  const banned = containsBannedPhrase(blob);
  if (banned) issues.push(`contains banned phrase: ${banned}`);

  for (const { pattern, note } of DULL_MISSION_PATTERNS) {
    if (pattern.test(mission)) issues.push(note);
  }

  for (const { pattern, note } of RIGHT_ANSWER_PATTERNS) {
    if (pattern.test(blob)) issues.push(note);
  }

  for (const { pattern, note } of WEAK_FOLLOW_UP_PATTERNS) {
    if (pattern.test(followUp)) issues.push(note);
  }

  for (const { pattern, note } of WEAK_QUEST_PATTERNS) {
    if (pattern.test(`${title} ${prompt} ${mission} ${followUp}`)) {
      issues.push(note);
    }
  }

  if (
    context &&
    context.questNumber > 1 &&
    /\b(?:shadow|front step|shape|color|pattern|window light|breeze|sky|cloud)\b/i.test(blob) &&
    !RICH_THINKING_TERMS.some((term) => blob.includes(term))
  ) {
    issues.push("quest relies on passive sensory noticing without a richer thinking move");
  }

  if (
    context &&
    context.questNumber > 1 &&
    GENERIC_QUEST_ENERGY.test(blob) &&
    !ANTICIPATION_HOOK_TERMS.some((term) => blob.includes(term))
  ) {
    issues.push("quest feels ignorable: add a concrete hook, tension, or payoff");
  }

  if (context) {
    issues.push(...validateQuestAgainstRecent(quest, context.recentQuests));
  }

  if (!/\b(notice|look|listen|find|watch|try|trace|count|ask|wonder|compare|sketch|walk|sit|close|open|feel|smell|draw|build|share|tell|spot|collect|measure|observe|predict|make|check|test|sort|invent|design|change|stack|fold|tap|turn)\b/i.test(
    mission,
  )) {
    issues.push("mission needs a clear real-world action verb");
  }

  return issues;
}

export function validateInterpretation(
  result: InterpretedResponse,
  childResponse: string,
): string[] {
  const issues: string[] = [];

  if (!result.encouragement?.trim()) issues.push("encouragement is empty");
  if (!result.followUp?.trim()) issues.push("followUp is empty");
  if (!result.followUp.trim().endsWith("?")) {
    issues.push("followUp must end with ?");
  }

  if (result.encouragement.length > 320) {
    issues.push("encouragement too long for SMS");
  }
  if (result.followUp.length > 200) {
    issues.push("followUp too long for SMS");
  }

  for (const { pattern, note } of WEAK_FOLLOW_UP_PATTERNS) {
    if (pattern.test(result.followUp)) issues.push(note);
  }

  const banned = containsBannedPhrase(
    `${result.encouragement} ${result.followUp}`.toLowerCase(),
  );
  if (banned) issues.push(`contains banned phrase: ${banned}`);

  const encouragementLower = result.encouragement.toLowerCase();
  if (GENERIC_PRAISE.some((phrase) => encouragementLower.includes(phrase))) {
    issues.push("encouragement sounds generic — react to what the child actually said");
  }

  const responseTokens = childResponse
    .toLowerCase()
    .split(/\W+/)
    .filter((token) => token.length > 4);

  const mentionsChild =
    responseTokens.length === 0 ||
    responseTokens.some((token) => encouragementLower.includes(token));

  if (!mentionsChild && childResponse.trim().length > 12) {
    issues.push("encouragement should echo a specific detail from the child's response");
  }

  return issues;
}
