import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync("lib/ops/lighthouse-pilot.ts", "utf8");
const packageJson = readFileSync("package.json", "utf8");
const ci = readFileSync(".github/workflows/ci.yml", "utf8");

const requiredSource = [
  "classifyPilotSignal",
  "buildLighthousePilotBrief",
  "formatLighthousePilotBrief",
  "delight",
  "friction",
  "feature_request",
  "personalization",
  "delivery",
  "quality",
  "do not overgeneralize",
];

let failed = false;

for (const needle of requiredSource) {
  if (!source.includes(needle)) {
    console.error(`lighthouse-pilot.ts missing: ${needle}`);
    failed = true;
  }
}

const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});

const {
  buildLighthousePilotBrief,
  classifyPilotSignal,
  formatLighthousePilotBrief,
} = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

const events = [
  {
    kind: "successful_pattern",
    summary: "Building quests worked and the child looked forward to the next one.",
    evidence: "He loved making the paper bridge.",
    confidence: 0.9,
  },
  {
    kind: "avoidance",
    summary: "Parent says never send noisy missions.",
    evidence: "Please don't send noisy activities.",
    confidence: 0.95,
  },
  {
    kind: "family_preference",
    summary: "Please make future quests shorter and more hands-on.",
    evidence: "Can you make these shorter?",
    confidence: 0.85,
  },
  {
    kind: "parent_note",
    summary: "Parent never received scheduled dinner even after onboarding.",
    evidence: "I went through onboarding and never received scheduled missions.",
    confidence: 0.9,
  },
  {
    kind: "quest_feedback",
    summary: "Dinner questions felt boring, generic, and unanswerable.",
    evidence: "Dinner questions are unanswerable.",
    confidence: 0.9,
  },
  {
    kind: "child_interest",
    summary: "Child likes soccer and fairness questions tied to games.",
    evidence: "Soccer prompts got longer answers.",
    confidence: 0.7,
  },
];

const expected = [
  ["successful_pattern", "delight"],
  ["avoidance", "friction"],
  ["family_preference", "feature_request"],
  ["parent_note", "delivery"],
  ["quest_feedback", "quality"],
  ["child_interest", "personalization"],
];

for (const [kind, category] of expected) {
  const event = events.find((candidate) => candidate.kind === kind);
  const actual = classifyPilotSignal(event);
  if (actual !== category) {
    console.error(`Expected ${kind} to classify as ${category}, got ${actual}`);
    failed = true;
  }
}

const brief = buildLighthousePilotBrief(
  [
    {
      familyId: "family-a",
      parentName: "Yiya",
      learningEvents: events,
    },
  ],
  "2026-07-06T12:00:00.000Z",
);

if (brief.summary.delight !== 1) failed = true;
if (brief.summary.delivery !== 1) failed = true;
if (brief.summary.friction !== 1) failed = true;
if (brief.summary.quality !== 1) failed = true;
if (brief.summary.feature_request !== 1) failed = true;
if (brief.summary.personalization !== 1) failed = true;
if (brief.followUps.length < 2 || brief.followUps[0].priority !== "high") {
  console.error("Expected high-priority follow-ups for delivery/quality/friction signals.");
  failed = true;
}
if (!brief.risks.some((signal) => signal.category === "delivery")) {
  console.error("Delivery issue should appear in risks.");
  failed = true;
}
if (!brief.experiments.some((signal) => signal.category === "feature_request")) {
  console.error("Feature request should appear in experiments.");
  failed = true;
}

const formatted = formatLighthousePilotBrief(brief);
for (const needle of [
  "Lighthouse pilot brief",
  "Summary:",
  "Wins:",
  "Risks:",
  "Experiments:",
  "Follow-ups:",
  "Check scheduler",
  "Turn this into a regression fixture",
]) {
  if (!formatted.includes(needle)) {
    console.error(`Formatted pilot brief missing: ${needle}`);
    failed = true;
  }
}

if (/\b(?:rank child|score child|diagnos|therapy|iq)\b/i.test(formatted)) {
  console.error("Pilot brief must not rank, diagnose, or score children.");
  failed = true;
}

if (!packageJson.includes('"check:lighthouse-pilot": "node scripts/check-lighthouse-pilot.mjs"')) {
  console.error("package.json must expose check:lighthouse-pilot.");
  failed = true;
}

if (!ci.includes("npm run check:lighthouse-pilot")) {
  console.error("CI must run check:lighthouse-pilot.");
  failed = true;
}

if (failed) {
  console.error(formatted);
  process.exit(1);
}

console.log("Lighthouse pilot check passed.");
