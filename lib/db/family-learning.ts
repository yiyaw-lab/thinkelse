import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type FamilyLearningKind =
  | "child_interest"
  | "quest_feedback"
  | "family_preference"
  | "successful_pattern"
  | "avoidance"
  | "parent_note";

export type FamilyLearningEvent = {
  kind: FamilyLearningKind;
  summary: string;
  evidence?: string | null;
  confidence?: number | null;
  created_at?: string;
};

export type FamilyLearningInput = {
  familyId: string;
  childId?: string | null;
  questId?: string | null;
  events: FamilyLearningEvent[];
};

function cleanText(value: string | null | undefined, maxLength: number) {
  const cleaned = value?.trim().replace(/\s+/g, " ") ?? "";
  if (!cleaned) return null;
  return cleaned.slice(0, maxLength);
}

function cleanConfidence(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0.7;
  }

  return Math.min(1, Math.max(0, value));
}

export async function saveFamilyLearningEvents({
  familyId,
  childId = null,
  questId = null,
  events,
}: FamilyLearningInput) {
  const rows = events
    .map((event) => {
      const summary = cleanText(event.summary, 280);
      if (!summary) return null;

      return {
        family_id: familyId,
        child_id: childId,
        quest_id: questId,
        kind: event.kind,
        summary,
        evidence: cleanText(event.evidence, 500),
        confidence: cleanConfidence(event.confidence),
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (rows.length === 0) {
    return false;
  }

  const { error } = await supabaseAdmin.from("family_learning_events").insert(rows);

  if (error) {
    console.error("saveFamilyLearningEvents error:", error);
    return false;
  }

  return true;
}

export async function getRecentFamilyLearningEvents(familyId: string, limit = 12) {
  const { data, error } = await supabaseAdmin
    .from("family_learning_events")
    .select("kind, summary, evidence, confidence, created_at")
    .eq("family_id", familyId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentFamilyLearningEvents error:", error);
    return [];
  }

  return (data ?? []) as FamilyLearningEvent[];
}
