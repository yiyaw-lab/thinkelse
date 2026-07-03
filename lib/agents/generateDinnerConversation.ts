import { openai } from "@/lib/openai";

import {
  COGNITIVE_SKILLS,
  ELSY_SYSTEM_PROMPT,
  formatFamilyLearning,
  formatQuestHistory,
  getAgeGuidance,
} from "./elsy-system";
import { formatTechniqueGuidance, selectQuestTechniques } from "./research-techniques";
import { formatTemporalContext } from "./temporal-context";
import {
  formatWorldContextGuidance,
  selectWorldContextCard,
  type SelectedWorldContextCard,
  type WorldContextLevel,
} from "./world-context-cards";
import type { FamilyDinnerContext } from "./build-dinner-context";
import type { FamilyQuestContext } from "./types";

export type GeneratedDinnerConversation = {
  question: string;
  parentMove: string;
  followUp: string;
  skill: string;
  worldContextCard?: {
    id: string;
    title: string;
    sensitivity: SelectedWorldContextCard["sensitivity"];
  };
};

export type DinnerGenerationOptions = {
  worldContextLevel?: WorldContextLevel;
};

function childLine(child: FamilyDinnerContext["children"][number]) {
  const interests = child.interests.length > 0 ? child.interests.join(", ") : "not specified";
  return `${child.name}, age ${child.age ?? "unknown"}, interests: ${interests}`;
}

function formatChildren(context: FamilyDinnerContext): string {
  if (context.children.length === 0) {
    return "No child profiles available.";
  }

  return context.children.map((child, index) => `${index + 1}. ${childLine(child)}`).join("\n");
}

function formatRecentArcs(context: FamilyDinnerContext): string {
  if (context.children.length === 0) {
    return "No child quest history available.";
  }

  return context.children
    .map((child) => {
      return `${child.name}:\n${formatQuestHistory(child.recentQuests)}`;
    })
    .join("\n\n");
}

function formatDinnerHistory(context: FamilyDinnerContext): string {
  if (context.recentDinnerConversations.length === 0) {
    return "No prior dinner questions yet.";
  }

  return context.recentDinnerConversations
    .map((dinner, index) => {
      const skill = dinner.skill ? ` [${dinner.skill}]` : "";
      return `${index + 1}.${skill} ${dinner.question}`;
    })
    .join("\n");
}

function selectDinnerTechniqueGuidance(context: FamilyDinnerContext): string {
  const selected = new Map<string, ReturnType<typeof selectQuestTechniques>[number]>();

  for (const child of context.children) {
    const pseudoQuestContext: FamilyQuestContext = {
      parentName: context.parentName,
      childName: child.name,
      age: child.age,
      interests: child.interests,
      questNumber: child.recentQuests.length + 1,
      recentQuests: child.recentQuests,
      learningEvents: child.learningEvents,
      temporal: context.temporal,
    };

    for (const technique of selectQuestTechniques(pseudoQuestContext, 2)) {
      selected.set(technique.id, technique);
    }
  }

  const dinnerFirst = [...selected.values()].sort((a, b) => {
    const aDinnerScore =
      Number(a.domains.includes("social-perspective")) +
      Number(a.domains.includes("epistemic-honesty")) +
      Number(a.domains.includes("future-readiness"));
    const bDinnerScore =
      Number(b.domains.includes("social-perspective")) +
      Number(b.domains.includes("epistemic-honesty")) +
      Number(b.domains.includes("future-readiness"));

    return bDinnerScore - aDinnerScore;
  });

  return formatTechniqueGuidance(dinnerFirst.slice(0, 3));
}

function buildDinnerPrompt(
  context: FamilyDinnerContext,
  worldContextCard: SelectedWorldContextCard | null,
  revisionNotes?: string[],
): string {
  const revisionBlock =
    revisionNotes && revisionNotes.length > 0
      ? `\nFix these issues in your next draft:\n${revisionNotes.map((note) => `- ${note}`).join("\n")}\n`
      : "";

  const ageGuidance = context.children
    .map((child) => `${child.name}: ${getAgeGuidance(child.age)}`)
    .join("\n");

  return `
Create ONE optional dinner-table conversation prompt for this family.

Parent name: ${context.parentName ?? "unknown"}
Children:
${formatChildren(context)}

${formatTemporalContext(context.temporal)}

Age guidance:
${ageGuidance || "Age unknown - keep it concrete, sensory, and parent-mediated."}

Recent quest arcs - use these to build continuity without repeating a quest:
${formatRecentArcs(context)}

Recent dinner questions - do NOT repeat themes, wording, or skills:
${formatDinnerHistory(context)}

Durable family learning - use this to personalize the question and avoid what did not work:
${formatFamilyLearning(context.familyLearningEvents)}

Evidence-informed method lens - invisible design layer. Choose ONE best-fit lens below. Do not mention research, citations, technique names, "brain training", or future-skills jargon to the parent:
${selectDinnerTechniqueGuidance(context)}

${formatWorldContextGuidance(worldContextCard)}

Dinner conversation bar:
- Make this feel worth asking at dinner. Prefer a small dilemma, choice, tradeoff, perspective clash, family value, changed mind, or "how do we know?" question over passive noticing.
- The first question should have human stakes: fairness, honesty, trust, courage, kindness, disagreement, responsibility, promises, belonging, evidence, uncertainty, or how people should decide.
- Use the season/time/place only as texture. Do not make the core question about air, light, breeze, clouds, sunset, or generic sensory observation.
- If you use a child's interest, connect it to a real-life judgment or perspective, not trivia about the interest.
- Parent move should help the parent run a better conversation: pause, invite a reason, ask for evidence, ask for the opposite view, ask another child to build on it, or ask what would change their mind.
- Avoid bland frames like "What patterns do you notice..." or "Name one thing you hear, see, or feel..." unless paired with a meaningful human decision.
- If a world-context lens is present, translate it into a durable family-scale question. Do not mention the news, headlines, parties, politicians, named public figures, violent events, or adult-coded policy debates.
- Strong examples to learn from, not copy:
  - If two people remember the same moment differently, how could we figure out what probably happened without making either person feel small?
  - When is it better to tell the truth even if it makes the next few minutes harder?
  - If our family could test one new rule this week to help everyone feel heard, what rule would you try?
  - What is something kids might notice about the world that grown-ups often miss?

Quality bar:
- This is a dinner conversation, not a quest. No mission, task list, reporting ask, homework, worksheet, trivia, screen use, or "look it up."
- question: one table-ready question with no single right answer; it should invite evidence, uncertainty, perspective, tradeoffs, imagination, values, or a changed mind.
- parentMove: one short facilitation move the parent can use at the table, such as wait, ask what makes you say that, invite another child to add on, ask for the opposite view, or ask what evidence would change their mind.
- followUp: one deeper question for later in the same conversation.
- Works for all listed children; if ages differ, let older children go deeper while younger children can answer concretely.
- Use family learning and interests naturally, never force them.
- Keep it warm, brief, and SMS-ready.
- No medical, therapeutic, diagnostic, mental-health, productivity, IQ, or guaranteed-development claims.
- skill: one primary cognitive skill from this vocabulary: ${COGNITIVE_SKILLS.join(" | ")}
${revisionBlock}
Return valid JSON only:
{
  "question": "one dinner-table question ending with ?",
  "parentMove": "one short parent facilitation move",
  "followUp": "one deeper question ending with ?",
  "skill": "${COGNITIVE_SKILLS.join(" | ")}"
}
`;
}

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

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function buildFallbackDinnerConversation(
  context: FamilyDinnerContext,
  worldContextCard: SelectedWorldContextCard | null,
): GeneratedDinnerConversation {
  const firstChild = context.children[0] ?? null;
  const firstInterest = firstChild?.interests[0] ?? null;
  const focus =
    firstInterest && firstChild
      ? `${firstChild.name}'s interest in ${firstInterest}`
      : "something your family disagrees about";
  const question = worldContextCard
    ? `If two people saw this differently - ${worldContextCard.childFriendlyFrame.toLowerCase()} - what would be a fair way to decide what to try first?`
    : `If two people at the table had different good reasons about ${focus}, how should we decide whose idea to try first?`;

  return {
    question,
    parentMove:
      "Ask each person for one reason, then ask what evidence or experience could change their mind.",
    followUp:
      "What would make the decision feel fair even if someone did not get their first choice?",
    skill: "perspective-taking",
    worldContextCard: worldContextCard
      ? {
          id: worldContextCard.id,
          title: worldContextCard.title,
          sensitivity: worldContextCard.sensitivity,
        }
      : undefined,
  };
}

function validateDinnerConversation(
  result: GeneratedDinnerConversation,
  worldContextCard: SelectedWorldContextCard | null,
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
    worldContextCard &&
    !includesAny(conversationBlob, [...worldContextCard.focusTerms])
  ) {
    issues.push("question does not reflect the selected world-context card");
  }

  return issues;
}

async function requestDinnerConversation(
  context: FamilyDinnerContext,
  worldContextCard: SelectedWorldContextCard | null,
  revisionNotes?: string[],
): Promise<GeneratedDinnerConversation> {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: ELSY_SYSTEM_PROMPT },
      { role: "user", content: buildDinnerPrompt(context, worldContextCard, revisionNotes) },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No dinner conversation generated.");
  }

  return JSON.parse(content) as GeneratedDinnerConversation;
}

function attachWorldContextCard(
  dinner: GeneratedDinnerConversation,
  worldContextCard: SelectedWorldContextCard | null,
): GeneratedDinnerConversation {
  if (!worldContextCard) return dinner;
  return {
    ...dinner,
    worldContextCard: {
      id: worldContextCard.id,
      title: worldContextCard.title,
      sensitivity: worldContextCard.sensitivity,
    },
  };
}

export async function generateDinnerConversation(
  context: FamilyDinnerContext,
  options: DinnerGenerationOptions = {},
): Promise<GeneratedDinnerConversation> {
  const worldContextCard = selectWorldContextCard(
    context,
    options.worldContextLevel,
  );
  let dinner = await requestDinnerConversation(context, worldContextCard);
  let issues = validateDinnerConversation(dinner, worldContextCard);

  if (issues.length > 0) {
    dinner = await requestDinnerConversation(context, worldContextCard, issues);
    issues = validateDinnerConversation(dinner, worldContextCard);
    if (issues.length > 0) {
      console.warn("Dinner conversation quality issues after retry:", issues);
      return buildFallbackDinnerConversation(context, worldContextCard);
    }
  }

  return attachWorldContextCard(dinner, worldContextCard);
}
