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
];

const GENERIC_PRAISE = [
  "that's wonderful",
  "how wonderful",
  "so proud",
  "great job",
  "good job",
  "amazing",
];

function containsBannedPhrase(text: string): string | null {
  const lower = text.toLowerCase();
  return BANNED_PHRASES.find((phrase) => lower.includes(phrase)) ?? null;
}

export function validateQuest(quest: GeneratedQuest): string[] {
  const issues: string[] = [];
  const blob = `${quest.title} ${quest.prompt} ${quest.mission} ${quest.followUp}`.toLowerCase();

  if (!quest.title?.trim()) issues.push("title is empty");
  if (!quest.prompt?.trim()) issues.push("prompt is empty");
  if (!quest.mission?.trim()) issues.push("mission is empty");
  if (!quest.followUp?.trim()) issues.push("followUp is empty");
  if (!quest.skill?.trim()) issues.push("skill is empty");

  if (quest.prompt.length > 200) issues.push("prompt too long for SMS");
  if (quest.mission.length > 220) issues.push("mission too long for SMS");
  if (quest.followUp.length > 160) issues.push("followUp too long for SMS");
  if (!quest.followUp.trim().endsWith("?")) {
    issues.push("followUp must be a question ending with ?");
  }

  const banned = containsBannedPhrase(blob);
  if (banned) issues.push(`contains banned phrase: ${banned}`);

  if (!/\b(notice|look|listen|find|watch|try|trace|count|ask|wonder|compare|sketch|walk|sit|close|open|feel|smell|draw|build|share|tell|spot|collect|measure|observe)\b/i.test(
    quest.mission,
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
