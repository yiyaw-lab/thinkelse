import type { GeneratedQuest } from "@/lib/agents/generateQuest";
import type { InterpretedResponse } from "@/lib/agents/interpretResponse";

export function formatQuestMessage(quest: GeneratedQuest): string {
  return `🌱 ${quest.title}

Ask:
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
