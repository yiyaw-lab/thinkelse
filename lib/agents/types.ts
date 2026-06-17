import type { TemporalContext } from "./temporal-context";

export type QuestHistoryEntry = {
  title: string | null;
  prompt: string;
  mission: string;
  skill: string | null;
  response: string | null;
  elsyReply: string | null;
  createdAt: string;
};

export type FamilyQuestContext = {
  parentName: string | null;
  childName: string;
  age: number | null;
  interests: string[];
  questNumber: number;
  recentQuests: QuestHistoryEntry[];
  temporal: TemporalContext;
};

export type InterpretContext = {
  parentName: string | null;
  childName: string;
  age: number | null;
  interests: string[];
  questTitle: string | null;
  questPrompt: string;
  questMission: string;
  questFollowUp: string;
  questSkill: string | null;
  childResponse: string;
  recentQuests: QuestHistoryEntry[];
};
