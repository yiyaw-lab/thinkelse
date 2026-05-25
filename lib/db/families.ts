import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function findFamilyByPhone(phone: string) {
  const { data, error } = await supabaseAdmin
    .from("families")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (error) {
    console.error("findFamilyByPhone error:", error);
    return null;
  }

  return data;
}

export async function createFamily(phone: string) {
  const { data, error } = await supabaseAdmin
    .from("families")
    .insert({
      phone,
      onboarding_step: "parent_name",
    })
    .select()
    .single();

  if (error) {
    console.error("createFamily error:", error);
    return null;
  }

  return data;
}

export async function updateFamily(id: string, updates: Record<string, unknown>) {
  const { error } = await supabaseAdmin
    .from("families")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("updateFamily error:", error);
  }
}