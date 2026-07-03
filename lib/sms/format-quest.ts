import type { GeneratedQuest } from "@/lib/agents/generateQuest";
import type { GeneratedDinnerConversation } from "@/lib/agents/generateDinnerConversation";
import type { InterpretedResponse } from "@/lib/agents/interpretResponse";

export function formatQuestMessage(quest: GeneratedQuest, childName?: string | null): string {
  const childLine = childName ? `For ${childName}\n` : "";

  return `🌱 ${quest.title}

${childLine}Ask:
${quest.prompt}

Try:
${quest.mission}

Later:
${quest.followUp}

Reply with what they noticed.`;
}

export function formatInterpretationMessage(result: InterpretedResponse): string {
  return `${result.encouragement}

${result.followUp}`;
}

export function formatDinnerConversationMessage(
  dinner: GeneratedDinnerConversation,
): string {
  return `Dinner question:
${dinner.question}

Parent move:
${dinner.parentMove}

If it opens up:
${dinner.followUp}

No need to reply. Reply DINNER OFF to pause.`;
}

export function formatDinnerConversationNudgeMessage(): string {
  return "Elsy can now send one optional dinner-table question around your family meal time - built for richer conversations. Reply DINNER to set it up, or ignore this to skip. Reply STOP to opt out.";
}
