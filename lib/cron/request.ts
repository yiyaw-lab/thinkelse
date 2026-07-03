import type { PreferredTimeParts } from "@/lib/timezone";

export function isCronDryRun(request: Request): boolean {
  const value = new URL(request.url).searchParams.get("dryRun");
  return value === "1" || value === "true";
}

export function formatLocalClock(time: PreferredTimeParts): string {
  return `${time.hour.toString().padStart(2, "0")}:${time.minute
    .toString()
    .padStart(2, "0")}`;
}
