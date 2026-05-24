import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function findFamilyByPhone(phone: string) {
  const { data, error } = await supabaseAdmin
    .from("families")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}