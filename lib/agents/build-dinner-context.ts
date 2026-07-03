import {
  getRecentDinnerConversations,
  type DinnerConversationRow,
} from "@/lib/db/dinner-conversations";
import { getRecentFamilyLearningEvents } from "@/lib/db/family-learning";
import { getRecentQuestsForChild } from "@/lib/db/quests";

import { getTemporalContext, type TemporalContext } from "./temporal-context";
import type { FamilyLearningContextEntry, QuestHistoryEntry } from "./types";

type FamilyRow = {
  id: string;
  parent_name?: string | null;
  preferred_time?: string | null;
  dinner_conversation_time?: string | null;
};

type ChildRow = {
  id: string;
  name: string;
  age: number | null;
  interests: string[] | null;
};

export type DinnerChildContext = {
  id: string;
  name: string;
  age: number | null;
  interests: string[];
  recentQuests: QuestHistoryEntry[];
  learningEvents: FamilyLearningContextEntry[];
};

export type FamilyDinnerContext = {
  parentName: string | null;
  children: DinnerChildContext[];
  recentDinnerConversations: DinnerConversationRow[];
  familyLearningEvents: FamilyLearningContextEntry[];
  temporal: TemporalContext;
};

function mapQuestHistory(quests: Awaited<ReturnType<typeof getRecentQuestsForChild>>) {
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

export async function buildDinnerContext(
  family: FamilyRow,
  children: ChildRow[],
): Promise<FamilyDinnerContext> {
  const [familyLearningEvents, recentDinnerConversations, childContexts] = await Promise.all([
    getRecentFamilyLearningEvents(family.id, 12),
    getRecentDinnerConversations(family.id, 6),
    Promise.all(
      children.map(async (child) => {
        const [recentQuests, learningEvents] = await Promise.all([
          getRecentQuestsForChild(child.id, 5),
          getRecentFamilyLearningEvents(family.id, 8, child.id),
        ]);

        return {
          id: child.id,
          name: child.name,
          age: child.age ?? null,
          interests: Array.isArray(child.interests) ? child.interests : [],
          recentQuests: mapQuestHistory(recentQuests),
          learningEvents,
        };
      }),
    ),
  ]);

  return {
    parentName: family.parent_name ?? null,
    children: childContexts,
    recentDinnerConversations,
    familyLearningEvents,
    temporal: getTemporalContext(
      new Date(),
      family.dinner_conversation_time ?? family.preferred_time ?? null,
    ),
  };
}
