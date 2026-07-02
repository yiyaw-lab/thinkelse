import { openai } from "@/lib/openai";

import { ELSY_SYSTEM_PROMPT, formatQuestHistory, getAgeGuidance } from "./elsy-system";
import { validateInterpretation } from "./quest-quality";
import type { InterpretContext } from "./types";

export type InterpretedResponse = {
  encouragement: string;
  followUp: string;
};

function buildInterpretPrompt(context: InterpretContext, revisionNotes?: string[]) {
  const interests =
    context.interests.length > 0 ? context.interests.join(", ") : "not specified";
  const parentLine = context.parentName
    ? `Parent relaying: ${context.parentName}`
    : "Parent name: unknown";

  const revisionBlock =
    revisionNotes && revisionNotes.length > 0
      ? `\nFix these issues:\n${revisionNotes.map((note) => `- ${note}`).join("\n")}\n`
      : "";

  return `
A parent just shared their child's thinking about today's quest. Write Elsy's SMS reply.

${parentLine}
Child: ${context.childName} (age ${context.age ?? "unknown"})
Interests: ${interests}
${getAgeGuidance(context.age)}

Today's quest${context.questTitle ? ` "${context.questTitle}"` : ""}:
Question: "${context.questPrompt}"
Mission: "${context.questMission}"
Think-about: "${context.questFollowUp}"
Skill: ${context.questSkill ?? "unknown"}

What the child noticed/said (via parent):
"${context.childResponse}"

Recent family arc (optional context — don't recap at length):
${formatQuestHistory(context.recentQuests)}

Write for SMS to the parent. They may read your follow-up question aloud to ${context.childName}.

Quality bar:
- encouragement: 1–2 sentences. React to a SPECIFIC detail from what the child said — quote or paraphrase it; make the parent feel equipped to keep the conversation going
- followUp: one question that goes one level deeper (Socratic retrieval). Must end with ?
- use a family-friendly thinking move: ask for evidence, a comparison, another perspective, a tiny test, or whether their idea changed
- warm, curious, never academic or generic praise
- do not repeat the original quest question verbatim
- if the response is thin, invite one concrete sensory detail or one small next try rather than lecturing
- no medical, therapeutic, diagnostic, or guaranteed-development language
${revisionBlock}
Return valid JSON only:
{
  "encouragement": "1-2 sentences",
  "followUp": "one question ending with ?"
}
`;
}

async function requestInterpretation(
  context: InterpretContext,
  revisionNotes?: string[],
): Promise<InterpretedResponse> {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.8,
    messages: [
      { role: "system", content: ELSY_SYSTEM_PROMPT },
      { role: "user", content: buildInterpretPrompt(context, revisionNotes) },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No interpretation generated.");
  }

  return JSON.parse(content) as InterpretedResponse;
}

export async function interpretResponse(
  context: InterpretContext,
): Promise<InterpretedResponse> {
  let result = await requestInterpretation(context);
  let issues = validateInterpretation(result, context.childResponse);

  if (issues.length > 0) {
    result = await requestInterpretation(context, issues);
    issues = validateInterpretation(result, context.childResponse);
    if (issues.length > 0) {
      console.warn("Interpretation quality issues after retry:", issues);
    }
  }

  return result;
}
