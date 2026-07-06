import type { TemporalContext } from "./temporal-context";

export type FamilyLearningContextEntry = {
  kind: string;
  summary: string;
  evidence?: string | null;
  confidence?: number | null;
  child_id?: string | null;
  created_at?: string;
};

export type QuestHistoryEntry = {
  title: string | null;
  prompt: string;
  mission: string;
  skill: string | null;
  response: string | null;
  elsyReply: string | null;
  missionStatus: string | null;
  completedAt: string | null;
  createdAt: string;
};

export type FamilyQuestContext = {
  parentName: string | null;
  childName: string;
  age: number | null;
  interests: string[];
  questNumber: number;
  recentQuests: QuestHistoryEntry[];
  learningEvents: FamilyLearningContextEntry[];
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
  learningEvents: FamilyLearningContextEntry[];
};

export type QuestReplyLearningContext = {
  parentName: string | null;
  childName: string;
  age: number | null;
  interests: string[];
  questTitle: string | null;
  questPrompt: string;
  questMission: string;
  questFollowUp: string;
  questSkill: string | null;
  replyText: string;
  recentQuests: QuestHistoryEntry[];
  learningEvents: FamilyLearningContextEntry[];
};
