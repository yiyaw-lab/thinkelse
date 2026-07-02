import { supabaseAdmin } from "@/lib/supabaseAdmin";

const EARLY_COHORT_LIMIT = 50;

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
      sms_opted_in: true,
    })
    .select()
    .single();

  if (error) {
    console.error("createFamily error:", error);
    return null;
  }

  return data;
}

export async function getCompleteFamilies() {
  const { data, error } = await supabaseAdmin
    .from("families")
    .select("*")
    .eq("onboarding_step", "complete")
    .eq("sms_opted_in", true);

  if (error) {
    console.error("getCompleteFamilies error:", error);
    return [];
  }

  return data ?? [];
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

export async function restartFamilySettingsOnboarding(id: string) {
  await updateFamily(id, {
    onboarding_step: "preferred_time",
    preferred_time: null,
    timezone: null,
    dinner_conversation_opt_in: false,
  });
}

/** 1-based rank by signup date. Returns null if family not found. */
export async function getFamilyCohortRank(familyId: string): Promise<number | null> {
  const { data: family, error: familyError } = await supabaseAdmin
    .from("families")
    .select("created_at")
    .eq("id", familyId)
    .maybeSingle();

  if (familyError || !family) {
    console.error("getFamilyCohortRank error:", familyError);
    return null;
  }

  const { count, error: countError } = await supabaseAdmin
    .from("families")
    .select("id", { count: "exact", head: true })
    .lte("created_at", family.created_at);

  if (countError) {
    console.error("getFamilyCohortRank count error:", countError);
    return null;
  }

  return count ?? null;
}

export async function isEarlyCohortFamily(
  familyId: string,
  limit = EARLY_COHORT_LIMIT,
): Promise<boolean> {
  const rank = await getFamilyCohortRank(familyId);
  return rank !== null && rank <= limit;
}

export { EARLY_COHORT_LIMIT };
