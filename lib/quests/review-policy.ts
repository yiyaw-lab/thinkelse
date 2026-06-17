import type { QuestReviewStatus } from "@/lib/db/quests";
import { isEarlyCohortFamily } from "@/lib/db/families";

export async function reviewStatusForFamily(
  familyId: string,
): Promise<QuestReviewStatus | null> {
  const inCohort = await isEarlyCohortFamily(familyId);
  return inCohort ? "pending" : null;
}
