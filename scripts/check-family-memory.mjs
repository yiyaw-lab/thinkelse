import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync("lib/agents/family-memory.ts", "utf8");
const system = readFileSync("lib/agents/elsy-system.ts", "utf8");
const packageJson = readFileSync("package.json", "utf8");
const ci = readFileSync(".github/workflows/ci.yml", "utf8");

const required = [
  "formatFamilyMemoryProfile",
  "Avoid",
  "newer dated events",
  "Quest feedback",
  "Do not treat neutral or positive feedback as an avoidance",
  "Family preferences",
  "What worked",
  "Repeat the underlying pattern",
  "Child interests and sparks",
  "Parent notes",
  "Other context",
  "confidenceLabel",
  "Evidence:",
  "scopeLabel",
  "dateLabel",
];

let failed = false;

for (const needle of required) {
  if (!source.includes(needle)) {
    console.error(`family-memory.ts missing: ${needle}`);
    failed = true;
  }
}

const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});

const { formatFamilyMemoryProfile } = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

const profile = formatFamilyMemoryProfile([
  {
    kind: "avoidance",
    summary: "Parent disliked shadow/front-step missions.",
    evidence: "I do not like the current mission",
    confidence: 0.9,
    child_id: "child-yivin",
    created_at: "2026-07-01T12:00:00Z",
  },
  {
    kind: "quest_feedback",
    summary: "Shadows are acceptable when framed as a concrete evidence test.",
    evidence: "Actually shadows are fine if it is more of a test",
    confidence: 0.8,
    child_id: "child-yivin",
    created_at: "2026-07-06T12:00:00Z",
  },
  {
    kind: "family_preference",
    summary: "Family wants shorter, more hands-on missions.",
    evidence: "Can future quests be shorter and more hands-on?",
    confidence: 0.8,
    created_at: "2026-07-02T12:00:00Z",
  },
  {
    kind: "successful_pattern",
    summary: "Building and tiny redesign prompts got strong engagement.",
    evidence: "He loved making the paper bridge",
    confidence: 0.75,
    child_id: "child-yivin",
    created_at: "2026-07-03T12:00:00Z",
  },
  {
    kind: "child_interest",
    summary: "Child likes soccer and inventing rules.",
    evidence: "She talks about soccer rules all week",
    confidence: 0.7,
    child_id: "child-yivin",
    created_at: "2026-07-04T12:00:00Z",
  },
  {
    kind: "parent_note",
    summary: "Parent may prefer dinner prompts with fairness questions.",
    evidence: "Dinner fairness questions worked better",
    confidence: 0.45,
    created_at: "2026-07-05T12:00:00Z",
  },
  {
    kind: "unexpected_kind",
    summary: "Unrecognized context should still appear as other context.",
    evidence: "misc",
    confidence: 0.4,
    created_at: "2026-07-05T13:00:00Z",
  },
]);

const profileRequired = [
  "Avoid:",
  "newer dated events",
  "Parent disliked shadow/front-step missions.",
  'Evidence: "I do not like the current mission"',
  "high confidence",
  "child-scoped",
  "2026-07-01",
  "Quest feedback:",
  "Do not treat neutral or positive feedback as an avoidance",
  "Shadows are acceptable when framed as a concrete evidence test.",
  "2026-07-06",
  "Family preferences:",
  "Family wants shorter, more hands-on missions.",
  "What worked:",
  "Repeat the underlying pattern",
  "Child interests and sparks:",
  "Parent notes:",
  "low confidence",
  "family-wide",
  "Other context:",
];

for (const needle of profileRequired) {
  if (!profile.includes(needle)) {
    console.error(`formatted profile missing: ${needle}`);
    failed = true;
  }
}

const avoidanceIndex = profile.indexOf("Avoid:");
const feedbackIndex = profile.indexOf("Quest feedback:");
const preferenceIndex = profile.indexOf("Family preferences:");
if (
  avoidanceIndex === -1 ||
  feedbackIndex === -1 ||
  preferenceIndex === -1 ||
  avoidanceIndex > feedbackIndex ||
  feedbackIndex > preferenceIndex
) {
  console.error("Avoidances, quest feedback, and preferences are not in expected runtime order.");
  failed = true;
}

if (
  profile.includes("Quest feedback:\nTreat these as constraints") ||
  profile.includes("Shadows are acceptable") &&
    profile.indexOf("Shadows are acceptable") < profile.indexOf("Quest feedback:")
) {
  console.error("Quest feedback must not be rendered as hard avoidance.");
  failed = true;
}

if (formatFamilyMemoryProfile([]) !== "No durable family learning yet.") {
  console.error("Empty memory profile should use the stable empty-state sentence.");
  failed = true;
}

if (!system.includes('import { formatFamilyMemoryProfile } from "./family-memory";')) {
  console.error("elsy-system.ts must import formatFamilyMemoryProfile.");
  failed = true;
}

if (!system.includes("return formatFamilyMemoryProfile(learningEvents);")) {
  console.error("formatFamilyLearning must delegate to formatFamilyMemoryProfile.");
  failed = true;
}

if (!packageJson.includes('"check:family-memory": "node scripts/check-family-memory.mjs"')) {
  console.error("package.json must expose check:family-memory.");
  failed = true;
}

if (!ci.includes("npm run check:family-memory")) {
  console.error("CI must run check:family-memory.");
  failed = true;
}

if (failed) {
  console.error(profile);
  process.exit(1);
}

console.log("Family memory profile check passed.");
