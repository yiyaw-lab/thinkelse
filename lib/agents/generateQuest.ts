import { openai } from "@/lib/openai";

import {
  COGNITIVE_SKILLS,
  ELSY_SYSTEM_PROMPT,
  formatFamilyLearning,
  formatQuestHistory,
  getAgeGuidance,
  suggestNextSkills,
} from "./elsy-system";
import { formatTechniqueGuidance, selectQuestTechniques } from "./research-techniques";
import { formatTemporalContext } from "./temporal-context";
import { validateQuest } from "./quest-quality";
import type { FamilyQuestContext } from "./types";

export type GeneratedQuest = {
  title: string;
  prompt: string;
  mission: string;
  followUp: string;
  skill: string;
};

function buildQuestPrompt(context: FamilyQuestContext, revisionNotes?: string[]) {
  const interests =
    context.interests.length > 0 ? context.interests.join(", ") : "not specified yet";
  const parentLine = context.parentName
    ? `Parent name: ${context.parentName} (warmly acknowledge when natural — SMS is to the parent)`
    : "Parent name: unknown";
  const isFirstQuest = context.questNumber <= 1 || context.recentQuests.length === 0;
  const techniqueGuidance = formatTechniqueGuidance(selectQuestTechniques(context));
  const launchGuidance = isFirstQuest
    ? `
First quest launch moment:
- This is the family's first real taste of Elsy. Make it feel like a tiny invitation into wonder, not a sample lesson.
- Aim for a "we can do this right now" win: one household or nearby-world object, one sensory action, one memorable noticing.
- Give the parent an easy line they can read aloud; no setup, supplies, app, research, or perfect timing.
- Delight comes from specificity (spoon reflection, sock shadow, window sound, cereal pattern), not extra words.
- Avoid big nature scavenger hunts, chores, lectures, or anything that feels like school.
`
    : "";

  const revisionBlock =
    revisionNotes && revisionNotes.length > 0
      ? `\nFix these issues in your next draft:\n${revisionNotes.map((note) => `- ${note}`).join("\n")}\n`
      : "";

  return `
Create ONE daily curiosity quest for this specific child.

${parentLine}
Child name: ${context.childName}
Age: ${context.age ?? "unknown"}
Interests: ${interests}
This is quest #${context.questNumber} for this child.

${formatTemporalContext(context.temporal)}

${getAgeGuidance(context.age)}

Recent quests — do NOT repeat themes, settings, or skills; build forward if a prior response invites it:
${formatQuestHistory(context.recentQuests)}

Durable family learning — use this to personalize future quests, honor preferences, repeat what worked, and avoid what did not:
${formatFamilyLearning(context.learningEvents)}

Evidence-informed method lens — invisible design layer. Choose ONE best-fit lens below and make the quest feel natural. Do not mention research, citations, technique names, "brain training", or future-skills jargon to the parent:
${techniqueGuidance}

Prefer a fresh cognitive skill from: ${suggestNextSkills(context.recentQuests)}

${launchGuidance}

Quality bar:
- audience: parent reads the SMS and shares with ${context.childName} — never write as if the child is texting Elsy
- prompt: one vivid ask-aloud curiosity question ${context.childName} can hold all day (you may use their name); concrete enough to picture; no single right answer
- mission: 2–10 min real-world action parent + child can do without prep; one clear action beats a list; include a tiny parent facilitation move when natural (notice together, name a detail, wait, compare, or try one change)
- followUp: one Socratic question for later — invite evidence, perspective, creative alternatives, or "did your idea change?"
- title: 2–4 words, poetic but clear (e.g. "Shadow Detective", "Sound Collector")
- skill: one primary cognitive skill trained today from this vocabulary: ${COGNITIVE_SKILLS.join(" | ")}
- weave in an interest when it fits naturally — never forced
- if a recent child response is listed, optionally nod to their curiosity arc
- if durable family learning lists preferences or avoidances, follow them unless they conflict with safety or the core real-world quest format
- favor family conversation starters like "What makes you say that?", "What else could be true?", "How could we test it?", or "What would you change?"
- concrete > abstract; kitchen, sidewalk, window, backyard > generic "nature"
- dullness check: reject anything that could appear in a worksheet, generic activity book, or chatbot demo
- safety/copy: no medical, therapeutic, diagnostic, or guaranteed-development language
${revisionBlock}
Return valid JSON only:
{
  "title": "short title",
  "prompt": "one curiosity question",
  "mission": "small real-world activity",
  "followUp": "one follow-up question ending with ?",
  "skill": "${COGNITIVE_SKILLS.join(" | ")}"
}
`;
}

async function requestQuest(
  context: FamilyQuestContext,
  revisionNotes?: string[],
): Promise<GeneratedQuest> {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.9,
    messages: [
      { role: "system", content: ELSY_SYSTEM_PROMPT },
      { role: "user", content: buildQuestPrompt(context, revisionNotes) },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No quest generated.");
  }

  return JSON.parse(content) as GeneratedQuest;
}

export async function generateQuest(context: FamilyQuestContext): Promise<GeneratedQuest> {
  let quest = await requestQuest(context);
  let issues = validateQuest(quest);

  if (issues.length > 0) {
    quest = await requestQuest(context, issues);
    issues = validateQuest(quest);
    if (issues.length > 0) {
      console.warn("Quest quality issues after retry:", issues);
    }
  }

  return quest;
}
