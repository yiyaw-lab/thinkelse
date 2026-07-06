import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync("lib/agents/world-context-cards.ts", "utf8");
const packageJson = readFileSync("package.json", "utf8");
const ci = readFileSync(".github/workflows/ci.yml", "utf8");

const requiredSource = [
  "WorldContextIssueFamily",
  "issueFamily",
  "tableScaleTranslations",
  "Reviewed:",
  "Table-scale translations to adapt",
  "automation-and-judgment",
  "truth-and-trust",
  "fairness-and-rules",
  "future-stewardship",
  "privacy-and-sharing",
  "helping-and-responsibility",
];

let failed = false;

for (const needle of requiredSource) {
  if (!source.includes(needle)) {
    console.error(`world-context-cards.ts missing: ${needle}`);
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
  formatWorldContextGuidance,
  selectWorldContextCard,
  WORLD_CONTEXT_CARDS,
} = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

const childFacingBanned = [
  "breaking news",
  "headline",
  "headlines",
  "politician",
  "politicians",
  "democrat",
  "republican",
  "president",
  "senator",
  "congress",
  "supreme court",
  "election",
  "campaign",
  "war",
  "shooting",
  "murder",
  "killed",
  "policy debate",
  "culture war",
];

for (const card of WORLD_CONTEXT_CARDS) {
  if (!card.issueFamily) {
    console.error(`${card.id} missing issueFamily.`);
    failed = true;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(card.reviewedAt)) {
    console.error(`${card.id} reviewedAt must be YYYY-MM-DD.`);
    failed = true;
  }
  if (!Array.isArray(card.tableScaleTranslations) || card.tableScaleTranslations.length < 2) {
    console.error(`${card.id} needs at least two tableScaleTranslations.`);
    failed = true;
  }

  const childFacing = [
    card.childFriendlyFrame,
    ...card.tableScaleTranslations,
    ...card.dinnerQuestionSeeds,
    ...card.parentMoveSeeds,
  ]
    .join(" ")
    .toLowerCase();

  const banned = childFacingBanned.find((phrase) => childFacing.includes(phrase));
  if (banned) {
    console.error(`${card.id} child-facing text contains banned phrase: ${banned}`);
    failed = true;
  }

  if (
    !/\b(table|family|school|friend|game|turn|seat|bite|rule|story|mistake|shared|person|people|child)\b/i.test(
      card.tableScaleTranslations.join(" "),
    )
  ) {
    console.error(`${card.id} translations need concrete family-scale anchors.`);
    failed = true;
  }
}

function baseContext(overrides = {}) {
  return {
    parentName: "Yiya",
    children: [
      {
        id: "child-1",
        name: "Yivin",
        age: 9,
        interests: [],
        recentQuests: [],
        learningEvents: [],
      },
    ],
    recentDinnerConversations: [],
    familyLearningEvents: [],
    temporal: {
      season: "summer",
      timeOfDay: "evening",
      settingHints: ["dinner table"],
    },
    ...overrides,
  };
}

const deeperClimate = selectWorldContextCard(
  baseContext({
    familyLearningEvents: [
      {
        kind: "family_preference",
        summary: "Family likes climate, future, planet, nature, convenience, care, and tradeoffs.",
      },
    ],
  }),
  "deeper",
);

if (deeperClimate?.id !== "climate-tradeoffs") {
  console.error(`Expected deeper climate card, got ${deeperClimate?.id ?? "none"}`);
  failed = true;
}

const lightClimate = selectWorldContextCard(
  baseContext({
    familyLearningEvents: [
      {
        kind: "family_preference",
        summary: "Family likes climate, future, planet, nature, convenience, care, and tradeoffs.",
      },
    ],
  }),
  "light",
);

if (lightClimate?.sensitivity === "medium") {
  console.error("Light world-context mode must not select medium-sensitivity cards.");
  failed = true;
}

const noNews = selectWorldContextCard(
  baseContext({
    familyLearningEvents: [
      {
        kind: "family_preference",
        summary: "Please avoid news, no politics, and scary news at dinner.",
      },
    ],
  }),
  "deeper",
);

if (noNews !== null) {
  console.error("No-news preference should disable world-context card selection.");
  failed = true;
}

const youngTech = selectWorldContextCard(
  baseContext({
    children: [
      {
        id: "child-1",
        name: "Yivin",
        age: 6,
        interests: ["robots", "tools"],
        recentQuests: [],
        learningEvents: [],
      },
    ],
    familyLearningEvents: [
      {
        kind: "family_preference",
        summary: "Family likes ai, robot, technology, machine, tools, and judgment.",
      },
    ],
  }),
  "light",
);

if (youngTech?.id === "ai-human-judgment" || youngTech?.id === "experts-disagree") {
  console.error("Age 6 context should not select older-child world-context cards.");
  failed = true;
}

const guidance = formatWorldContextGuidance(deeperClimate);
for (const needle of [
  "Issue family: future-stewardship",
  "Reviewed: 2026-07-03",
  "Table-scale translations to adapt",
  "Do not ask the child to design a whole game",
]) {
  if (!guidance.includes(needle)) {
    console.error(`Formatted world-context guidance missing: ${needle}`);
    failed = true;
  }
}

if (!packageJson.includes('"check:world-context": "node scripts/check-world-context-cards.mjs"')) {
  console.error("package.json must expose check:world-context.");
  failed = true;
}

if (!ci.includes("npm run check:world-context")) {
  console.error("CI must run check:world-context.");
  failed = true;
}

if (failed) {
  console.error(guidance);
  process.exit(1);
}

console.log("World-context card check passed.");
