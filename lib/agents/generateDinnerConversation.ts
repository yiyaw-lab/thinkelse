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
import type { FamilyDinnerContext } from "./build-dinner-context";
import type { FamilyQuestContext } from "./types";

export type GeneratedDinnerConversation = {
  question: string;
  parentMove: string;
  followUp: string;
  skill: string;
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

Quality bar:
- This is a dinner conversation, not a quest. No mission, task list, reporting ask, homework, worksheet, trivia, screen use, or "look it up."
- question: one table-ready question with no single right answer; it should invite evidence, uncertainty, perspective, tradeoffs, imagination, or a changed mind.
- parentMove: one short facilitation move the parent can use at the table, such as wait, ask what makes you say that, invite another child to add on, or name one detail.
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
];

function validateDinnerConversation(result: GeneratedDinnerConversation): string[] {
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

  return issues;
}

async function requestDinnerConversation(
  context: FamilyDinnerContext,
  revisionNotes?: string[],
): Promise<GeneratedDinnerConversation> {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.8,
    messages: [
      { role: "system", content: ELSY_SYSTEM_PROMPT },
      { role: "user", content: buildDinnerPrompt(context, revisionNotes) },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No dinner conversation generated.");
  }

  return JSON.parse(content) as GeneratedDinnerConversation;
}

export async function generateDinnerConversation(
  context: FamilyDinnerContext,
): Promise<GeneratedDinnerConversation> {
  let dinner = await requestDinnerConversation(context);
  let issues = validateDinnerConversation(dinner);

  if (issues.length > 0) {
    dinner = await requestDinnerConversation(context, issues);
    issues = validateDinnerConversation(dinner);
    if (issues.length > 0) {
      console.warn("Dinner conversation quality issues after retry:", issues);
    }
  }

  return dinner;
}
