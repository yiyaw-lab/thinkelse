export const DEFAULT_TIMEZONE = "America/Los_Angeles";

export const TIMEZONE_CHOICES = [
  { key: "1", label: "Pacific (PT)", iana: "America/Los_Angeles" },
  { key: "2", label: "Mountain (MT)", iana: "America/Denver" },
  { key: "3", label: "Central (CT)", iana: "America/Chicago" },
  { key: "4", label: "Eastern (ET)", iana: "America/New_York" },
  { key: "5", label: "Alaska (AKT)", iana: "America/Anchorage" },
  { key: "6", label: "Hawaii (HT)", iana: "Pacific/Honolulu" },
] as const;

const KEY_TO_IANA = Object.fromEntries(
  TIMEZONE_CHOICES.map((choice) => [choice.key, choice.iana]),
) as Record<string, string>;

const ALIAS_TO_IANA: Record<string, string> = {
  pt: "America/Los_Angeles",
  pst: "America/Los_Angeles",
  pdt: "America/Los_Angeles",
  pacific: "America/Los_Angeles",
  mt: "America/Denver",
  mst: "America/Denver",
  mdt: "America/Denver",
  mountain: "America/Denver",
  ct: "America/Chicago",
  cst: "America/Chicago",
  cdt: "America/Chicago",
  central: "America/Chicago",
  et: "America/New_York",
  est: "America/New_York",
  edt: "America/New_York",
  eastern: "America/New_York",
  akt: "America/Anchorage",
  alaska: "America/Anchorage",
  ht: "Pacific/Honolulu",
  hst: "Pacific/Honolulu",
  hawaii: "Pacific/Honolulu",
  "america/los_angeles": "America/Los_Angeles",
  "america/denver": "America/Denver",
  "america/chicago": "America/Chicago",
  "america/new_york": "America/New_York",
  "america/anchorage": "America/Anchorage",
  "pacific/honolulu": "Pacific/Honolulu",
};

export type PreferredTimeParts = {
  hour: number;
  minute: number;
};

export function timezonePrompt(): string {
  const lines = TIMEZONE_CHOICES.map(
    (choice) => `${choice.key} = ${choice.label}`,
  ).join("\n");

  return `Last step — what timezone are you in?\n\n${lines}\n\nReply with the number (e.g. 1) or your zone (e.g. Pacific).`;
}

export function parsePreferredTime(preferredTime: string): PreferredTimeParts | null {
  const normalized = preferredTime.trim().toLowerCase().replace(/\s+/g, "");
  const match = normalized.match(/^([1-9]|1[0-2])(?::([0-5]\d))?(am|pm)$/);

  if (!match) return null;

  const minute = match[2] ? Number.parseInt(match[2], 10) : 0;
  if (minute !== 0 && minute !== 30) return null;

  let hour = Number.parseInt(match[1], 10);
  const period = match[3];

  if (period === "am") {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }

  return { hour, minute };
}

export function normalizePreferredTimeInput(preferredTime: string): string | null {
  const normalized = preferredTime.trim().toLowerCase().replace(/\s+/g, "");
  const match = normalized.match(/^([1-9]|1[0-2])(?::([0-5]\d))?(am|pm)$/);

  if (!match || !parsePreferredTime(normalized)) return null;

  return `${match[1]}${match[2] ? `:${match[2]}` : ""}${match[3]}`;
}

export function parseTimezoneInput(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (KEY_TO_IANA[trimmed]) {
    return KEY_TO_IANA[trimmed];
  }

  const normalized = trimmed.toLowerCase().replace(/\s+/g, "_");
  if (ALIAS_TO_IANA[normalized]) {
    return ALIAS_TO_IANA[normalized];
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: trimmed });
    return trimmed;
  } catch {
    return null;
  }
}

export function getLocalTimeParts(
  timezone: string,
  date = new Date(),
): PreferredTimeParts {
  const safeTimezone = timezone || DEFAULT_TIMEZONE;

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: safeTimezone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);

    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    const minute = Number(parts.find((part) => part.type === "minute")?.value);

    if (Number.isFinite(hour) && Number.isFinite(minute)) {
      return { hour, minute };
    }
  } catch {
    // Fall back to UTC below.
  }

  return { hour: date.getUTCHours(), minute: date.getUTCMinutes() };
}

export function getLocalHour(timezone: string, date = new Date()): number {
  return getLocalTimeParts(timezone, date).hour;
}

export function formatLocalDateKey(timezone: string, date = new Date()): string {
  const safeTimezone = timezone || DEFAULT_TIMEZONE;

  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: safeTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}
