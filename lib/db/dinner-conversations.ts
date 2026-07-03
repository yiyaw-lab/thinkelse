import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type DinnerConversationRow = {
  question: string;
  parent_move: string;
  follow_up: string;
  skill: string | null;
  local_date_key: string;
  sent_at: string;
};

export async function getRecentDinnerConversations(familyId: string, limit = 6) {
  const { data, error } = await supabaseAdmin
    .from("dinner_conversations")
    .select("question, parent_move, follow_up, skill, local_date_key, sent_at")
    .eq("family_id", familyId)
    .order("sent_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentDinnerConversations error:", error);
    return [];
  }

  return (data ?? []) as DinnerConversationRow[];
}

export async function getLatestDinnerConversation(
  familyId: string,
): Promise<DinnerConversationRow | null> {
  const { data, error } = await supabaseAdmin
    .from("dinner_conversations")
    .select("question, parent_move, follow_up, skill, local_date_key, sent_at")
    .eq("family_id", familyId)
    .order("sent_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getLatestDinnerConversation error:", error);
    return null;
  }

  return data as DinnerConversationRow | null;
}

export async function createDinnerConversationLog({
  familyId,
  question,
  parentMove,
  followUp,
  skill,
  localDateKey,
}: {
  familyId: string;
  question: string;
  parentMove: string;
  followUp: string;
  skill?: string | null;
  localDateKey: string;
}) {
  const { error } = await supabaseAdmin.from("dinner_conversations").insert({
    family_id: familyId,
    question,
    parent_move: parentMove,
    follow_up: followUp,
    skill,
    local_date_key: localDateKey,
  });

  if (error) {
    console.error("createDinnerConversationLog error:", error);
    return false;
  }

  return true;
}
