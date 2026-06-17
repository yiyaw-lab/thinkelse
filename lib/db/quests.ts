import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { formatLocalDateKey } from "@/lib/timezone";

export type QuestReviewStatus = "pending" | "approved" | "flagged" | "skipped";

export async function getLatestQuestForChild(childId: string) {
  const { data, error } = await supabaseAdmin
    .from("quests")
    .select()
    .eq("child_id", childId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getLatestQuestForChild error:", error);
    return null;
  }

  return data;
}

export async function hasQuestOnLocalDay(
  childId: string,
  localDateKey: string,
  timezone: string,
) {
  const { data, error } = await supabaseAdmin
    .from("quests")
    .select("created_at")
    .eq("child_id", childId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data?.created_at) {
    return false;
  }

  const questDateKey = formatLocalDateKey(
    timezone,
    new Date(data.created_at as string),
  );

  return questDateKey === localDateKey;
}

export async function getRecentQuestsForChild(childId: string, limit = 8) {
  const { data, error } = await supabaseAdmin
    .from("quests")
    .select(
      "title, prompt, mission, follow_up, skill, response, elsy_reply, created_at",
    )
    .eq("child_id", childId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentQuestsForChild error:", error);
    return [];
  }

  return data ?? [];
}

export async function countQuestsForChild(childId: string) {
  const { count, error } = await supabaseAdmin
    .from("quests")
    .select("id", { count: "exact", head: true })
    .eq("child_id", childId);

  if (error) {
    console.error("countQuestsForChild error:", error);
    return 0;
  }

  return count ?? 0;
}

export async function updateQuestResponse(questId: string, response: string) {
  const { error } = await supabaseAdmin
    .from("quests")
    .update({ response })
    .eq("id", questId);

  if (error) {
    console.error("updateQuestResponse error:", error);
  }
}

export async function saveElsyReply(questId: string, elsyReply: string) {
  const { error } = await supabaseAdmin
    .from("quests")
    .update({ elsy_reply: elsyReply })
    .eq("id", questId);

  if (error) {
    console.error("saveElsyReply error:", error);
  }
}

export async function updateQuestReview(
  questId: string,
  reviewStatus: QuestReviewStatus,
  reviewNotes?: string,
) {
  const { error } = await supabaseAdmin
    .from("quests")
    .update({
      review_status: reviewStatus,
      review_notes: reviewNotes ?? null,
    })
    .eq("id", questId);

  if (error) {
    console.error("updateQuestReview error:", error);
    return false;
  }

  return true;
}

export type PendingReviewQuest = {
  id: string;
  title: string | null;
  prompt: string;
  mission: string;
  follow_up: string | null;
  skill: string | null;
  response: string | null;
  elsy_reply: string | null;
  review_status: string | null;
  review_notes: string | null;
  created_at: string;
  child: {
    name: string;
    age: number | null;
    interests: string[] | null;
    family: {
      parent_name: string | null;
      phone: string;
    } | null;
  } | null;
};

export async function getPendingReviewQuests(limit = 25) {
  const { data, error } = await supabaseAdmin
    .from("quests")
    .select(
      `
      id, title, prompt, mission, follow_up, skill, response, elsy_reply,
      review_status, review_notes, created_at,
      children (
        name, age, interests,
        families ( parent_name, phone )
      )
    `,
    )
    .eq("review_status", "pending")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getPendingReviewQuests error:", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const child = Array.isArray(row.children) ? row.children[0] : row.children;
    const family = child?.families
      ? Array.isArray(child.families)
        ? child.families[0]
        : child.families
      : null;

    return {
      id: row.id,
      title: row.title,
      prompt: row.prompt,
      mission: row.mission,
      follow_up: row.follow_up,
      skill: row.skill,
      response: row.response,
      elsy_reply: row.elsy_reply,
      review_status: row.review_status,
      review_notes: row.review_notes,
      created_at: row.created_at,
      child: child
        ? {
            name: child.name,
            age: child.age,
            interests: child.interests,
            family,
          }
        : null,
    };
  }) satisfies PendingReviewQuest[];
}

export async function createQuest({
  childId,
  title,
  prompt,
  mission,
  followUp,
  skill,
  difficulty = "medium",
  reviewStatus = null,
}: {
  childId: string;
  title?: string;
  prompt: string;
  mission: string;
  followUp?: string;
  skill?: string;
  difficulty?: string;
  reviewStatus?: QuestReviewStatus | null;
}) {
  const { data, error } = await supabaseAdmin
    .from("quests")
    .insert({
      child_id: childId,
      title,
      prompt,
      mission,
      follow_up: followUp,
      skill,
      difficulty,
      review_status: reviewStatus,
    })
    .select()
    .single();

  if (error) {
    console.error("createQuest error:", error);
    return null;
  }

  return data;
}
