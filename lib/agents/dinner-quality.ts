import type { FamilyDinnerContext } from "./build-dinner-context";
import type { SelectedWorldContextCard } from "./world-context-cards";

type DinnerQualityResult = {
  question?: string | null;
  parentMove?: string | null;
  followUp?: string | null;
  skill?: string | null;
};

const BANNED_DINNER_PHRASES = [
  "homework",
  "worksheet",
  "quiz",
  "correct answer",
  "right answer",
  "screen time",
  "watch a video",
  "look it up",
  "search the internet",
  "therapy",
  "therapeutic",
  "diagnose",
  "treatment",
  "brain training",
  "boost iq",
  "guaranteed",
  "breaking news",
  "headline",
  "headlines",
  "watch the news",
  "read the news",
  "politician",
  "politicians",
  "democrat",
  "democrats",
  "republican",
  "republicans",
  "left wing",
  "right wing",
  "liberal",
  "conservative",
  "president",
  "senator",
  "congress",
  "supreme court",
  "election",
  "candidate",
  "campaign",
  "war",
  "shooting",
  "killed",
  "murder",
];

const WEAK_DINNER_PATTERNS: Array<{ pattern: RegExp; issue: string }> = [
  {
    pattern: /\bwhat patterns? do you notice\b/i,
    issue: "question uses a generic pattern-noticing frame",
  },
  {
    pattern: /\bevening air\b|\bsummer night\b|\bsun\s*sets?\b|\bsunset\b|\bbreeze\b/i,
    issue: "question centers generic nature atmosphere instead of dinner conversation",
  },
  {
    pattern: /\bname one detail\b.*\b(?:hear|see|feel)\b/i,
    issue: "parentMove is a bland sensory-noticing move",
  },
  {
    pattern: /\bif you could change one thing\b.*\b(?:breeze|light|air|sky|weather)\b/i,
    issue: "followUp asks an abstract nature tweak without human stakes",
  },
  {
    pattern: /\bif you (?:designed|could design|were designing|made|could make) (?:a )?(?:game|system|society|world|school)\b/i,
    issue: "question asks the child to design an abstract scenario instead of answer from lived experience",
  },
  {
    pattern: /\bgame (?:where|about)\b|\bplayers?\b/i,
    issue: "question uses an abstract game/player frame instead of a game the child already knows",
  },
  {
    pattern: /\b(?:sharing a resource|keeping it all to themselves|resource|resources)\b/i,
    issue: "question uses abstract resource language instead of concrete shareable examples",
  },
  {
    pattern: /\bfamilies make decisions together\b|\btricky choices would you include\b/i,
    issue: "question is too meta for dinner; ask about one concrete decision instead",
  },
  {
    pattern: /\bwhat rules would make\b.*\bfair to everyone\b/i,
    issue: "question asks for abstract rule design instead of a concrete fair choice",
  },
];

const HUMAN_STAKES_TERMS = [
  "family",
  "friend",
  "friends",
  "person",
  "people",
  "someone",
  "kid",
  "kids",
  "grown-up",
  "grown-ups",
  "teacher",
  "neighbor",
  "team",
  "rule",
  "fair",
  "kind",
  "honest",
  "truth",
  "trust",
  "promise",
  "mistake",
  "help",
  "listen",
  "agree",
  "disagree",
  "decide",
  "choice",
  "choose",
  "change your mind",
  "evidence",
  "believe",
  "sure",
  "responsible",
  "responsibility",
  "world",
  "community",
  "future",
];

const ATMOSPHERE_TERMS = [
  "air",
  "breeze",
  "light",
  "sky",
  "sunset",
  "sun sets",
  "weather",
  "cloud",
  "clouds",
  "wind",
];

const ABSTRACT_DINNER_TERMS = [
  "design",
  "designed",
  "players",
  "resource",
  "resources",
  "system",
  "society",
  "model",
  "families make decisions",
  "tricky choices",
];

const CONCRETE_DINNER_ANCHORS = [
  "today",
  "tonight",
  "this week",
  "at the table",
  "last bite",
  "turn",
  "seat",
  "game you already know",
  "friend",
  "school",
  "home",
  "family rule",
  "someone at home",
  "something that happened",
];

const REPEATED_DINNER_THEME_GROUPS: Array<{ label: string; pattern: RegExp }> = [
  { label: "game design", pattern: /\b(?:design|designed|game|players?)\b/i },
  { label: "resource sharing", pattern: /\b(?:resource|resources|share|sharing|keeping it all)\b/i },
  { label: "family decisions", pattern: /\b(?:family|families).*\bdecisions?\b|\bdecisions? together\b/i },
];

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function repeatedDinnerThemes(
  result: DinnerQualityResult,
  context: FamilyDinnerContext,
): string[] {
  const current = `${result.question ?? ""} ${result.followUp ?? ""}`.toLowerCase();
  const recent = context.recentDinnerConversations
    .slice(0, 4)
    .flatMap((dinner) => [dinner.question, dinner.follow_up, dinner.skill ?? ""])
    .join(" ")
    .toLowerCase();

  if (!recent.trim()) return [];

  return REPEATED_DINNER_THEME_GROUPS.filter(
    (theme) => theme.pattern.test(current) && theme.pattern.test(recent),
  ).map((theme) => `dinner repeats recent abstract theme: ${theme.label}`);
}

export function validateDinnerConversation(
  result: DinnerQualityResult,
  worldContextCard: SelectedWorldContextCard | null,
  context?: FamilyDinnerContext,
): string[] {
  const issues: string[] = [];
  const question = result.question ?? "";
  const parentMove = result.parentMove ?? "";
  const followUp = result.followUp ?? "";
  const skill = result.skill ?? "";
  const blob = `${question} ${parentMove} ${followUp} ${skill}`.toLowerCase();

  if (!question.trim()) issues.push("question is empty");
  if (!parentMove.trim()) issues.push("parentMove is empty");
  if (!followUp.trim()) issues.push("followUp is empty");
  if (!skill.trim()) issues.push("skill is empty");

  if (question.length > 220) issues.push("question too long for SMS");
  if (parentMove.length > 180) issues.push("parentMove too long for SMS");
  if (followUp.length > 180) issues.push("followUp too long for SMS");
  if (!question.trim().endsWith("?")) issues.push("question must end with ?");
  if (!followUp.trim().endsWith("?")) issues.push("followUp must end with ?");

  const banned = BANNED_DINNER_PHRASES.find((phrase) => blob.includes(phrase));
  if (banned) issues.push(`contains banned phrase: ${banned}`);

  for (const weakPattern of WEAK_DINNER_PATTERNS) {
    if (weakPattern.pattern.test(`${question} ${parentMove} ${followUp}`)) {
      issues.push(weakPattern.issue);
    }
  }

  const questionBlob = question.toLowerCase();
  const conversationBlob = `${question} ${followUp}`.toLowerCase();
  if (
    includesAny(questionBlob, ATMOSPHERE_TERMS) &&
    !includesAny(conversationBlob, HUMAN_STAKES_TERMS)
  ) {
    issues.push("question uses atmosphere or weather without human stakes");
  }

  if (
    includesAny(conversationBlob, ABSTRACT_DINNER_TERMS) &&
    !includesAny(conversationBlob, CONCRETE_DINNER_ANCHORS)
  ) {
    issues.push("question uses abstract scenario language without a concrete answer anchor");
  }

  if (context) {
    issues.push(...repeatedDinnerThemes(result, context));
  }

  if (
    worldContextCard &&
    !includesAny(conversationBlob, [...worldContextCard.focusTerms])
  ) {
    issues.push("question does not reflect the selected world-context card");
  }

  return issues;
}
