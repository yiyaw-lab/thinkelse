import type { GeneratedQuest } from "./generateQuest";
import type { InterpretedResponse } from "./interpretResponse";

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

export function validateQuest(quest: GeneratedQuest): string[] {
  const issues: string[] = [];
  const title = quest.title ?? "";
  const prompt = quest.prompt ?? "";
  const mission = quest.mission ?? "";
  const followUp = quest.followUp ?? "";
  const skill = quest.skill ?? "";
  const blob = `${title} ${prompt} ${mission} ${followUp}`.toLowerCase();

  if (!title.trim()) issues.push("title is empty");
  if (!prompt.trim()) issues.push("prompt is empty");
  if (!mission.trim()) issues.push("mission is empty");
  if (!followUp.trim()) issues.push("followUp is empty");
  if (!skill.trim()) issues.push("skill is empty");

  if (prompt.length > 200) issues.push("prompt too long for SMS");
  if (mission.length > 220) issues.push("mission too long for SMS");
  if (followUp.length > 160) issues.push("followUp too long for SMS");
  if (!prompt.trim().endsWith("?")) {
    issues.push("prompt must be one curiosity question ending with ?");
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

  if (!/\b(notice|look|listen|find|watch|try|trace|count|ask|wonder|compare|sketch|walk|sit|close|open|feel|smell|draw|build|share|tell|spot|collect|measure|observe|predict|test|sort|invent|design|change|stack|fold|tap|turn)\b/i.test(
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
