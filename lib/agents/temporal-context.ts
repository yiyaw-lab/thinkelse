export type TemporalContext = {
  season: "winter" | "spring" | "summer" | "fall";
  timeOfDay: "early morning" | "morning" | "afternoon" | "evening";
  settingHints: string[];
};

function seasonFromMonth(month: number): TemporalContext["season"] {
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

function parsePreferredHour(preferredTime: string): number | null {
  const match = preferredTime
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (!match) return null;

  let hour = Number.parseInt(match[1], 10);
  const period = match[3];
  if (period === "am") {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }
  return hour;
}

function timeOfDayFromHour(hour: number): TemporalContext["timeOfDay"] {
  if (hour < 9) return "early morning";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function settingHintsFor(
  season: TemporalContext["season"],
  timeOfDay: TemporalContext["timeOfDay"],
): string[] {
  const hints: string[] = [];

  if (timeOfDay === "early morning" || timeOfDay === "morning") {
    hints.push("breakfast table", "backpack", "shared object", "walk to school");
  } else if (timeOfDay === "afternoon") {
    hints.push("after school", "backyard", "sidewalk", "kitchen counter");
  } else {
    hints.push("dinner table", "twilight sky", "bedtime wind-down", "porch");
  }

  if (season === "winter") hints.push("cold air", "indoor warmth", "short daylight");
  if (season === "spring") hints.push("buds", "rain", "mud", "birds returning");
  if (season === "summer") hints.push("heat", "long daylight", "outdoor sounds");
  if (season === "fall") hints.push("leaves", "earlier dusk", "crisp air");

  return hints;
}

export function getTemporalContext(
  now = new Date(),
  preferredTime?: string | null,
): TemporalContext {
  const season = seasonFromMonth(now.getUTCMonth());
  const preferredHour = preferredTime ? parsePreferredHour(preferredTime) : null;
  const hour = preferredHour ?? now.getUTCHours();
  const timeOfDay = timeOfDayFromHour(hour);

  return {
    season,
    timeOfDay,
    settingHints: settingHintsFor(season, timeOfDay),
  };
}

export function formatTemporalContext(context: TemporalContext): string {
  return `Season: ${context.season}. Delivery time: ${context.timeOfDay}. Time-compatible texture: ${context.settingHints.slice(0, 5).join(", ")}.`;
}
