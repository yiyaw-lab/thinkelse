import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  DEFAULT_TIMEZONE,
  formatLocalDateKey,
  getLocalTimeParts,
  isPreferredDeliveryWindow,
  parsePreferredTime,
} from "@/lib/timezone";

export type DeliveryStatusCode =
  | "due_now"
  | "sent_today"
  | "waiting_for_window"
  | "onboarding_incomplete"
  | "opted_out"
  | "missing_phone"
  | "missing_child"
  | "missing_preferred_time"
  | "invalid_preferred_time";

export type DeliveryStatusFamily = {
  familyId: string;
  parentName: string | null;
  phone: string | null;
  childName: string | null;
  onboardingStep: string | null;
  smsOptedIn: boolean | null;
  preferredTime: string | null;
  timezone: string | null;
  localDate: string;
  localTime: string;
  status: DeliveryStatusCode;
  reason: string;
  latestQuest: {
    id: string;
    title: string | null;
    createdAt: string;
    missionStatus: string | null;
    completedAt: string | null;
    hasResponse: boolean;
    isToday: boolean;
  } | null;
};

export type DeliveryStatusSnapshot = {
  generatedAt: string;
  total: number;
  summary: Record<DeliveryStatusCode, number>;
  families: DeliveryStatusFamily[];
};

type FamilyRow = {
  id: string;
  phone: string | null;
  parent_name: string | null;
  preferred_time: string | null;
  timezone: string | null;
  onboarding_step: string | null;
  sms_opted_in: boolean | null;
  created_at: string;
};

type ChildRow = {
  id: string;
  family_id: string;
  name: string | null;
  created_at: string;
};

type QuestRow = {
  id: string;
  child_id: string;
  title: string | null;
  response: string | null;
  mission_status: string | null;
  completed_at: string | null;
  created_at: string;
};

const STATUS_PRIORITY: Record<DeliveryStatusCode, number> = {
  due_now: 0,
  missing_phone: 1,
  missing_child: 2,
  missing_preferred_time: 3,
  invalid_preferred_time: 4,
  onboarding_incomplete: 5,
  opted_out: 6,
  waiting_for_window: 7,
  sent_today: 8,
};

function emptySummary(): Record<DeliveryStatusCode, number> {
  return {
    due_now: 0,
    sent_today: 0,
    waiting_for_window: 0,
    onboarding_incomplete: 0,
    opted_out: 0,
    missing_phone: 0,
    missing_child: 0,
    missing_preferred_time: 0,
    invalid_preferred_time: 0,
  };
}

function formatLocalClock(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

export async function getDeliveryStatusSnapshot(
  limit = 100,
  now = new Date(),
): Promise<DeliveryStatusSnapshot> {
  const { data: familyData, error: familyError } = await supabaseAdmin
    .from("families")
    .select(
      "id, phone, parent_name, preferred_time, timezone, onboarding_step, sms_opted_in, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (familyError) {
    console.error("getDeliveryStatusSnapshot families error:", familyError);
    return {
      generatedAt: now.toISOString(),
      total: 0,
      summary: emptySummary(),
      families: [],
    };
  }

  const families = (familyData ?? []) as FamilyRow[];
  const familyIds = families.map((family) => family.id);

  const { data: childData, error: childError } = familyIds.length
    ? await supabaseAdmin
        .from("children")
        .select("id, family_id, name, created_at")
        .in("family_id", familyIds)
        .order("created_at", { ascending: true })
    : { data: [], error: null };

  if (childError) {
    console.error("getDeliveryStatusSnapshot children error:", childError);
  }

  const childrenByFamily = new Map<string, ChildRow>();
  for (const child of ((childData ?? []) as ChildRow[])) {
    if (!childrenByFamily.has(child.family_id)) {
      childrenByFamily.set(child.family_id, child);
    }
  }

  const childIds = [...childrenByFamily.values()].map((child) => child.id);
  const { data: questData, error: questError } = childIds.length
    ? await supabaseAdmin
        .from("quests")
        .select("id, child_id, title, response, mission_status, completed_at, created_at")
        .in("child_id", childIds)
        .order("created_at", { ascending: false })
        .limit(Math.max(100, childIds.length * 5))
    : { data: [], error: null };

  if (questError) {
    console.error("getDeliveryStatusSnapshot quests error:", questError);
  }

  const latestQuestByChild = new Map<string, QuestRow>();
  for (const quest of ((questData ?? []) as QuestRow[])) {
    if (!latestQuestByChild.has(quest.child_id)) {
      latestQuestByChild.set(quest.child_id, quest);
    }
  }

  const summary = emptySummary();
  const rows = families.map((family): DeliveryStatusFamily => {
    const timezone = family.timezone || DEFAULT_TIMEZONE;
    const timezoneNote = family.timezone
      ? ""
      : ` Timezone is missing, so cron uses ${DEFAULT_TIMEZONE}.`;
    const localDate = formatLocalDateKey(timezone, now);
    const localTimeParts = getLocalTimeParts(timezone, now);
    const localTime = formatLocalClock(localTimeParts.hour, localTimeParts.minute);
    const child = childrenByFamily.get(family.id) ?? null;
    const latestQuest = child ? latestQuestByChild.get(child.id) ?? null : null;
    const latestQuestDate = latestQuest
      ? formatLocalDateKey(timezone, new Date(latestQuest.created_at))
      : null;
    const latestQuestIsToday = latestQuestDate === localDate;
    const preferredTime = family.preferred_time
      ? parsePreferredTime(family.preferred_time)
      : null;

    let status: DeliveryStatusCode = "waiting_for_window";
    let reason = `Waiting for the family's preferred local delivery time.${timezoneNote}`;

    if (family.sms_opted_in === false) {
      status = "opted_out";
      reason = "Family is opted out of SMS.";
    } else if (family.onboarding_step !== "complete") {
      status = "onboarding_incomplete";
      reason = `Onboarding is at ${family.onboarding_step ?? "unknown"}.`;
    } else if (!family.phone) {
      status = "missing_phone";
      reason = "Family has no phone number.";
    } else if (!child) {
      status = "missing_child";
      reason = "Family has no child profile.";
    } else if (!family.preferred_time) {
      status = "missing_preferred_time";
      reason = "Family has no preferred delivery time.";
    } else if (!preferredTime) {
      status = "invalid_preferred_time";
      reason = `Preferred time '${family.preferred_time}' cannot be scheduled.`;
    } else if (latestQuestIsToday) {
      status = "sent_today";
      reason = `A quest already exists for this family today.${timezoneNote}`;
    } else if (isPreferredDeliveryWindow(preferredTime, localTimeParts)) {
      status = "due_now";
      reason = `Family is in the current delivery window and has no quest today.${timezoneNote}`;
    }

    summary[status] += 1;

    return {
      familyId: family.id,
      parentName: family.parent_name,
      phone: family.phone,
      childName: child?.name ?? null,
      onboardingStep: family.onboarding_step,
      smsOptedIn: family.sms_opted_in,
      preferredTime: family.preferred_time,
      timezone: family.timezone,
      localDate,
      localTime,
      status,
      reason,
      latestQuest: latestQuest
        ? {
            id: latestQuest.id,
            title: latestQuest.title,
            createdAt: latestQuest.created_at,
            missionStatus: latestQuest.mission_status,
            completedAt: latestQuest.completed_at,
            hasResponse: Boolean(latestQuest.response?.trim()),
            isToday: latestQuestIsToday,
          }
        : null,
    };
  });

  rows.sort((a, b) => {
    const priority = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
    if (priority !== 0) return priority;
    return (a.parentName ?? a.phone ?? "").localeCompare(b.parentName ?? b.phone ?? "");
  });

  return {
    generatedAt: now.toISOString(),
    total: families.length,
    summary,
    families: rows,
  };
}
