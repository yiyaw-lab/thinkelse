import { openai } from "@/lib/openai";

import {
  ELSY_SYSTEM_PROMPT,
  formatQuestHistory,
  getAgeGuidance,
  suggestNextSkills,
} from "./elsy-system";
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

${getAgeGuidance(context.age)}

Recent quests — do NOT repeat themes, settings, or skills; build forward if a prior response invites it:
${formatQuestHistory(context.recentQuests)}

Prefer a fresh cognitive skill from: ${suggestNextSkills(context.recentQuests)}

Quality bar:
- audience: parent reads the SMS and shares with ${context.childName} — never write as if the child is texting Elsy
- prompt: one vivid curiosity question ${context.childName} can hold all day (you may use their name)
- mission: 2–10 min real-world action parent + child can do without prep
- followUp: one Socratic question for later — opens thinking, no single right answer
- title: 2–4 words, poetic but clear (e.g. "Shadow Detective", "Sound Collector")
- skill: one primary cognitive skill trained today
- weave in an interest when it fits naturally — never forced
- if a recent child response is listed, optionally nod to their curiosity arc
- concrete > abstract; kitchen, sidewalk, window, backyard > generic "nature"
${revisionBlock}
Return valid JSON only:
{
  "title": "short title",
  "prompt": "one curiosity question",
  "mission": "small real-world activity",
  "followUp": "one follow-up question ending with ?",
  "skill": "observation | comparison | questioning | pattern-finding | perspective-taking | listening | hypothesis-testing | kindness-in-action"
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
