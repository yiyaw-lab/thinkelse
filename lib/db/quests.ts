import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getLatestQuestForChild(childId: string) {
  const { data, error } = await supabaseAdmin
    .from("quests")
    .select()
    .eq("child_id", childId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("getLatestQuestForChild error:", error);
    return null;
  }

  return data;
}

export async function getRecentQuestsForChild(childId: string, limit = 8) {
  const { data, error } = await supabaseAdmin
    .from("quests")
    .select("title, prompt, mission, follow_up, skill, response, created_at")
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

export async function createQuest({
  childId,
  title,
  prompt,
  mission,
  followUp,
  skill,
  difficulty = "medium",
}: {
  childId: string;
  title?: string;
  prompt: string;
  mission: string;
  followUp?: string;
  skill?: string;
  difficulty?: string;
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
    })
    .select()
    .single();

  if (error) {
    console.error("createQuest error:", error);
    return null;
  }

  return data;
}
