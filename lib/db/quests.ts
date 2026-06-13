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
  prompt,
  mission,
  followUp,
  skill,
  difficulty = "medium",
}: {
  childId: string;
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