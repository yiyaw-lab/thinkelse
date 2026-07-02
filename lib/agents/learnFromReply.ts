import { openai } from "@/lib/openai";
import type {
  FamilyLearningEvent,
  FamilyLearningKind,
} from "@/lib/db/family-learning";

import { ELSY_SYSTEM_PROMPT, formatFamilyLearning, formatQuestHistory } from "./elsy-system";
import type { QuestReplyLearningContext } from "./types";

export type ReplyLearningKind =
  | "child_response"
  | "parent_feedback"
  | "mixed"
  | "question_or_support"
  | "unclear";

export type ReplyLearningAnalysis = {
  replyKind: ReplyLearningKind;
  childResponse: string | null;
  completeQuest: boolean;
  acknowledgement: string;
  memories: FamilyLearningEvent[];
};

const REPLY_KINDS = new Set<ReplyLearningKind>([
  "child_response",
  "parent_feedback",
  "mixed",
  "question_or_support",
  "unclear",
]);

const MEMORY_KINDS = new Set<FamilyLearningKind>([
  "child_interest",
  "quest_feedback",
  "family_preference",
  "successful_pattern",
  "avoidance",
  "parent_note",
]);

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function cleanConfidence(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0.7;
  }

  return Math.min(1, Math.max(0, value));
}

function normalizeLearningAnalysis(value: unknown): ReplyLearningAnalysis {
  const raw = value && typeof value === "object" ? value : {};
  const record = raw as Record<string, unknown>;
  const replyKind = REPLY_KINDS.has(record.replyKind as ReplyLearningKind)
    ? (record.replyKind as ReplyLearningKind)
    : "unclear";
  const childResponse = cleanText(record.childResponse, 800);
  const memories: FamilyLearningEvent[] = [];

  if (Array.isArray(record.memories)) {
    for (const memory of record.memories) {
      if (memories.length >= 3) break;
      if (!memory || typeof memory !== "object") continue;

      const memoryRecord = memory as Record<string, unknown>;
      const kind = memoryRecord.kind as FamilyLearningKind;
      const summary = cleanText(memoryRecord.summary, 280);
      if (!MEMORY_KINDS.has(kind) || !summary) continue;

      memories.push({
        kind,
        summary,
        evidence: cleanText(memoryRecord.evidence, 500),
        confidence: cleanConfidence(memoryRecord.confidence),
      });
    }
  }

  const acknowledgement = cleanText(record.acknowledgement, 160) ?? "";
  const completeQuest = Boolean(record.completeQuest) && Boolean(childResponse);

  return {
    replyKind,
    childResponse,
    completeQuest,
    acknowledgement,
    memories,
  };
}

function buildReplyLearningPrompt(context: QuestReplyLearningContext) {
  const interests =
    context.interests.length > 0 ? context.interests.join(", ") : "not specified";
  const parentLine = context.parentName
    ? `Parent relaying: ${context.parentName}`
    : "Parent name: unknown";

  return `
Analyze this parent's SMS reply to an active Elsy quest.

${parentLine}
Child: ${context.childName} (age ${context.age ?? "unknown"})
Known interests: ${interests}

Active quest${context.questTitle ? ` "${context.questTitle}"` : ""}:
Question: "${context.questPrompt}"
Mission: "${context.questMission}"
Think-about: "${context.questFollowUp}"
Skill: ${context.questSkill ?? "unknown"}

Parent SMS:
"${context.replyText}"

Recent quest arc:
${formatQuestHistory(context.recentQuests)}

Durable family memory already known:
${formatFamilyLearning(context.learningEvents)}

Classify the SMS before deciding what to save:
- child_response: the parent is reporting what the child noticed, said, tried, made, compared, or wondered during the quest.
- parent_feedback: the parent is giving Elsy suggestions, preferences, corrections, or product feedback, without reporting the child's quest response.
- mixed: the SMS includes both the child's quest response and parent feedback or future preference.
- question_or_support: the parent is asking how to use Elsy or what to do next, without giving durable preference.
- unclear: too ambiguous to safely mark the quest completed.

Rules:
- Do not mark the quest complete unless the SMS actually contains the child's response to the quest.
- If the parent says things like "make these shorter", "more outside missions", "he loves building", "she hated the noise one", "new idea: try shadows", or "can future quests be more mathy?", treat that as feedback or preference, not a child response.
- If the SMS is mixed, extract only the child's response into childResponse and also create memory events for the parent feedback.
- Memories should tune future quests. Prefer stable facts, preferences, successful patterns, avoidances, or useful parent notes.
- Do not store generic praise like "thanks" unless it contains a usable preference or successful pattern.
- Keep each memory summary specific and future-facing.
- acknowledgement is only for parent feedback/preference. Keep it SMS-short and concrete, such as "Got it - I'll make future quests shorter and more hands-on." Leave it empty for a pure child response.

Return valid JSON only:
{
  "replyKind": "child_response | parent_feedback | mixed | question_or_support | unclear",
  "childResponse": "the child's quest response only, or null",
  "completeQuest": true,
  "acknowledgement": "short parent-facing acknowledgement, or empty string",
  "memories": [
    {
      "kind": "child_interest | quest_feedback | family_preference | successful_pattern | avoidance | parent_note",
      "summary": "specific durable learning for future quests",
      "evidence": "short quote or paraphrase from the SMS",
      "confidence": 0.0
    }
  ]
}
`;
}

export async function learnFromQuestReply(
  context: QuestReplyLearningContext,
): Promise<ReplyLearningAnalysis> {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: ELSY_SYSTEM_PROMPT },
      { role: "user", content: buildReplyLearningPrompt(context) },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No reply learning analysis generated.");
  }

  return normalizeLearningAnalysis(JSON.parse(content));
}
