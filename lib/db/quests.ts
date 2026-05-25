import { supabaseAdmin } from "@/lib/supabaseAdmin";

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