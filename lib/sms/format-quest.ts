import type { GeneratedQuest } from "@/lib/agents/generateQuest";
import type { InterpretedResponse } from "@/lib/agents/interpretResponse";

export function formatQuestMessage(quest: GeneratedQuest): string {
  return `🌱 ${quest.title}

${quest.prompt}

Mission:
${quest.mission}

Think about:
${quest.followUp}`;
}

export function formatInterpretationMessage(result: InterpretedResponse): string {
  return `${result.encouragement}

${result.followUp}`;
}
