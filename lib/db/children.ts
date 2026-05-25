import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getFirstChildForFamily(familyId: string) {
  const { data, error } = await supabaseAdmin
    .from("children")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getFirstChildForFamily error:", error);
    return null;
  }

  return data;
}

export async function createChild(familyId: string, name: string) {
  const { data, error } = await supabaseAdmin
    .from("children")
    .insert({ family_id: familyId, name })
    .select()
    .single();

  if (error) {
    console.error("createChild error:", error);
    return null;
  }

  return data;
}

export async function updateChildrenForFamily(
  familyId: string,
  updates: Record<string, unknown>
) {
  const { error } = await supabaseAdmin
    .from("children")
    .update(updates)
    .eq("family_id", familyId);

  if (error) {
    console.error("updateChildrenForFamily error:", error);
  }
}