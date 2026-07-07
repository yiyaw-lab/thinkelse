import { readFileSync } from "node:fs";
import ts from "typescript";

const timezoneSource = readFileSync("lib/timezone.ts", "utf8");
const dailyRoute = readFileSync("app/api/cron/daily-quest/route.ts", "utf8");
const dinnerRoute = readFileSync("app/api/cron/dinner-conversation/route.ts", "utf8");
const packageJson = readFileSync("package.json", "utf8");
const ci = readFileSync(".github/workflows/ci.yml", "utf8");

let failed = false;

const transpiled = ts.transpileModule(timezoneSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});

const {
  DEFAULT_TIMEZONE,
  formatLocalDateKey,
  getLocalTimeParts,
  isPreferredDeliveryWindow,
  normalizePreferredTimeInput,
  parsePreferredTime,
} = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

function expectWindow(preferred, local, expected, label) {
  const actual = isPreferredDeliveryWindow(preferred, local);
  if (actual !== expected) {
    console.error(`${label}: expected ${expected}, got ${actual}`);
    failed = true;
  }
}

const sixPm = parsePreferredTime("6pm");
const sixThirty = parsePreferredTime("6:30pm");
if (!sixPm || sixPm.hour !== 18 || sixPm.minute !== 0) {
  console.error("6pm should parse to 18:00.");
  failed = true;
}
if (!sixThirty || sixThirty.hour !== 18 || sixThirty.minute !== 30) {
  console.error("6:30pm should parse to 18:30.");
  failed = true;
}
if (parsePreferredTime("6:15pm") !== null) {
  console.error("6:15pm should be rejected because onboarding supports hour/half-hour times.");
  failed = true;
}
if (normalizePreferredTimeInput(" 6:30 PM ") !== "6:30pm") {
  console.error("normalizePreferredTimeInput should normalize spaced half-hour values.");
  failed = true;
}

if (sixPm) {
  expectWindow(sixPm, { hour: 17, minute: 59 }, false, "before window");
  expectWindow(sixPm, { hour: 18, minute: 0 }, true, "window start");
  expectWindow(sixPm, { hour: 18, minute: 29 }, true, "window final included minute");
  expectWindow(sixPm, { hour: 18, minute: 30 }, false, "window closes at next half hour");
  expectWindow(sixPm, { hour: 19, minute: 0 }, false, "wrong hour");
}

if (sixThirty) {
  expectWindow(sixThirty, { hour: 18, minute: 29 }, false, "half-hour before window");
  expectWindow(sixThirty, { hour: 18, minute: 30 }, true, "half-hour start");
  expectWindow(sixThirty, { hour: 18, minute: 59 }, true, "half-hour final included minute");
  expectWindow(sixThirty, { hour: 19, minute: 0 }, false, "half-hour closes next hour");
}

const utcDate = new Date("2026-07-06T01:15:00Z");
const localParts = getLocalTimeParts(DEFAULT_TIMEZONE, utcDate);
if (localParts.hour !== 18 || localParts.minute !== 15) {
  console.error(`Expected Los Angeles local time 18:15, got ${localParts.hour}:${localParts.minute}`);
  failed = true;
}
if (formatLocalDateKey(DEFAULT_TIMEZONE, utcDate) !== "2026-07-05") {
  console.error("formatLocalDateKey should use the family's timezone-local date.");
  failed = true;
}

if (!dailyRoute.includes("isPreferredDeliveryWindow(preferredTime, localTime)")) {
  console.error("Daily quest cron must use shared isPreferredDeliveryWindow.");
  failed = true;
}

if (!dinnerRoute.includes("isPreferredDeliveryWindow(dinnerTime, localTime)")) {
  console.error("Dinner cron must use shared isPreferredDeliveryWindow.");
  failed = true;
}

if (/function isDeliveryWindow/.test(dinnerRoute)) {
  console.error("Dinner cron must not keep a duplicate delivery-window helper.");
  failed = true;
}

if (!dailyRoute.includes('status: "would_send"') || !dinnerRoute.includes('status: "would_send"')) {
  console.error("Both cron routes must keep dry-run would_send observability.");
  failed = true;
}

if (!packageJson.includes('"check:scheduler-windows": "node scripts/check-scheduler-windows.mjs"')) {
  console.error("package.json must expose check:scheduler-windows.");
  failed = true;
}

if (!ci.includes("npm run check:scheduler-windows")) {
  console.error("CI must run check:scheduler-windows.");
  failed = true;
}

if (failed) {
  process.exit(1);
}

console.log("Scheduler window check passed.");
