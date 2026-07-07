import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync("lib/agents/learning-arcs.ts", "utf8");
const generator = readFileSync("lib/agents/generateQuest.ts", "utf8");
const packageJson = readFileSync("package.json", "utf8");
const ci = readFileSync(".github/workflows/ci.yml", "utf8");

const requiredSource = [
  "LEARNING_ARCS",
  "evidence-habits",
  "fair-tradeoffs",
  "source-sense",
  "creative-prototyping",
  "perspective-listening",
  "future-responsibility",
  "selectLearningArc",
  "formatLearningArcGuidance",
  "recentSkillHits",
  "recentThemeHits",
  "Multi-week arc",
  "Week-level progression",
  "Do not repeat immediately",
  "Do not name the arc",
];

let failed = false;

for (const needle of requiredSource) {
  if (!source.includes(needle)) {
    console.error(`learning-arcs.ts missing: ${needle}`);
    failed = true;
  }
}

if (!generator.includes('import { formatLearningArcGuidance } from "./learning-arcs";')) {
  console.error("generateQuest.ts must import formatLearningArcGuidance.");
  failed = true;
}

if (!generator.includes("${learningArcGuidance}")) {
  console.error("generateQuest.ts must inject learningArcGuidance into the prompt.");
  failed = true;
}

const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});

const { formatLearningArcGuidance, selectLearningArc } = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

function baseContext(overrides = {}) {
  return {
    parentName: "Yiya",
    childName: "Yivin",
    age: 9,
    interests: [],
    questNumber: 8,
    recentQuests: [],
    learningEvents: [],
    temporal: { now: new Date("2026-07-06T15:00:00Z"), timezone: "America/Los_Angeles" },
    ...overrides,
  };
}

const evidenceArc = selectLearningArc(
  baseContext({
    interests: ["puzzles", "science", "testing ideas"],
    learningEvents: [
      {
        kind: "family_preference",
        summary: "Family likes clues, evidence, testing guesses, and asking what would change their mind.",
        confidence: 0.9,
      },
    ],
  }),
);

if (evidenceArc.id !== "evidence-habits") {
  console.error(`Expected evidence-habits, got ${evidenceArc.id}`);
  failed = true;
}

const saturatedArc = selectLearningArc(
  baseContext({
    interests: ["puzzles", "science"],
    recentQuests: [
      {
        title: "Trust the Clue",
        prompt: "What clue would make your guess stronger?",
        mission: "Make a prediction and check one piece of evidence.",
        skill: "evidence-seeking",
        response: null,
        elsyReply: null,
        missionStatus: null,
        completedAt: null,
        createdAt: "2026-07-01T12:00:00Z",
      },
      {
        title: "Tiny Test",
        prompt: "What do you predict will happen?",
        mission: "Change one variable and compare.",
        skill: "hypothesis-testing",
        response: null,
        elsyReply: null,
        missionStatus: null,
        completedAt: null,
        createdAt: "2026-07-02T12:00:00Z",
      },
      {
        title: "More or Less Sure",
        prompt: "What would make you less sure?",
        mission: "Name one reason your idea might be wrong.",
        skill: "uncertainty-calibration",
        response: null,
        elsyReply: null,
        missionStatus: null,
        completedAt: null,
        createdAt: "2026-07-03T12:00:00Z",
      },
    ],
  }),
);

if (saturatedArc.id === "evidence-habits") {
  console.error("Saturated evidence quests should force a fresh arc instead of repeating evidence-habits.");
  failed = true;
}

const creativeArc = selectLearningArc(
  baseContext({
    interests: ["Lego", "drawing robots", "inventing new game pieces"],
    learningEvents: [
      {
        kind: "successful_pattern",
        summary: "Building and tiny redesign prompts produced the strongest engagement.",
      },
    ],
  }),
);

if (creativeArc.id !== "creative-prototyping") {
  console.error(`Expected creative-prototyping, got ${creativeArc.id}`);
  failed = true;
}

const sourceArc = selectLearningArc(
  baseContext({
    age: 12,
    interests: ["news", "technology", "how to know whether a claim is trustworthy"],
    learningEvents: [
      {
        kind: "parent_note",
        summary: "Parent wants more practice asking who made a claim and why that source would know.",
      },
    ],
  }),
);

if (sourceArc.id !== "source-sense") {
  console.error(`Expected source-sense, got ${sourceArc.id}`);
  failed = true;
}

const youngSourceArc = selectLearningArc(
  baseContext({
    age: 6,
    interests: ["news", "claims", "sources"],
    learningEvents: [
      {
        kind: "parent_note",
        summary: "Parent asked for source evaluation practice.",
      },
    ],
  }),
);

if (youngSourceArc.id === "source-sense") {
  console.error("Age 6 context should not select the source-sense arc.");
  failed = true;
}

const formatted = formatLearningArcGuidance(
  baseContext({
    interests: ["Lego", "design"],
    learningEvents: [
      {
        kind: "successful_pattern",
        summary: "Tiny prototypes worked.",
      },
    ],
  }),
);

for (const needle of [
  "Multi-week arc",
  "Selected arc: Creative Prototyping",
  "Week-level progression",
  "Do not repeat immediately",
  "Do not name the arc",
]) {
  if (!formatted.includes(needle)) {
    console.error(`Formatted guidance missing: ${needle}`);
    failed = true;
  }
}

if (!packageJson.includes('"check:learning-arcs": "node scripts/check-learning-arcs.mjs"')) {
  console.error("package.json must expose check:learning-arcs.");
  failed = true;
}

if (!ci.includes("npm run check:learning-arcs")) {
  console.error("CI must run check:learning-arcs.");
  failed = true;
}

if (failed) {
  console.error(formatted);
  process.exit(1);
}

console.log("Learning arcs check passed.");
