import { countQuestsForChild, getRecentQuestsForChild } from "@/lib/db/quests";
import { getTemporalContext } from "./temporal-context";

import type { FamilyQuestContext, InterpretContext, QuestHistoryEntry } from "./types";

type FamilyRow = {
  parent_name?: string | null;
  preferred_time?: string | null;
};

type ChildRow = {
  id: string;
  name: string;
  age: number | null;
  interests: string[] | null;
};

type QuestRow = {
  title: string | null;
  prompt: string;
  mission: string;
  follow_up: string | null;
  skill: string | null;
  response: string | null;
  elsy_reply?: string | null;
  mission_status?: string | null;
  completed_at?: string | null;
  created_at: string;
};

function mapQuestHistory(quests: QuestRow[]): QuestHistoryEntry[] {
  return quests.map((quest) => ({
    title: quest.title,
    prompt: quest.prompt,
    mission: quest.mission,
    skill: quest.skill,
    response: quest.response,
    elsyReply: quest.elsy_reply ?? null,
    missionStatus: quest.mission_status ?? null,
    completedAt: quest.completed_at ?? null,
    createdAt: quest.created_at,
  }));
}

export async function buildQuestContext(
  family: FamilyRow,
  child: ChildRow,
): Promise<FamilyQuestContext> {
  const [recentQuests, questCount] = await Promise.all([
    getRecentQuestsForChild(child.id, 8),
    countQuestsForChild(child.id),
  ]);

  const temporal = getTemporalContext(new Date(), family.preferred_time);

  return {
    parentName: family.parent_name ?? null,
    childName: child.name,
    age: child.age,
    interests: child.interests ?? [],
    questNumber: questCount + 1,
    recentQuests: mapQuestHistory(recentQuests),
    temporal,
  };
}

export async function buildInterpretContext(
  family: FamilyRow,
  child: ChildRow,
  quest: QuestRow,
  childResponse: string,
): Promise<InterpretContext> {
  const recentQuests = await getRecentQuestsForChild(child.id, 5);

  return {
    parentName: family.parent_name ?? null,
    childName: child.name,
    age: child.age,
    interests: child.interests ?? [],
    questTitle: quest.title,
    questPrompt: quest.prompt,
    questMission: quest.mission,
    questFollowUp: quest.follow_up ?? "",
    questSkill: quest.skill,
    childResponse,
    recentQuests: mapQuestHistory(recentQuests),
  };
}
