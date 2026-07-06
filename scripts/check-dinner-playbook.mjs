import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync("lib/agents/dinner-playbook.ts", "utf8");
const generator = readFileSync("lib/agents/generateDinnerConversation.ts", "utf8");
const packageJson = readFileSync("package.json", "utf8");
const ci = readFileSync(".github/workflows/ci.yml", "utf8");

const requiredSource = [
  "DINNER_PLAYBOOK_FRAMES",
  "table-fairness",
  "memory-truth",
  "trust-the-claim",
  "listening-disagreement",
  "kind-courage",
  "future-ripple",
  "selectDinnerPlaybookFrame",
  "formatDinnerPlaybookGuidance",
  "youngestAge",
  "Dinner playbook",
  "Table anchors",
  "Youngest-child test",
];

let failed = false;

for (const needle of requiredSource) {
  if (!source.includes(needle)) {
    console.error(`dinner-playbook.ts missing: ${needle}`);
    failed = true;
  }
}

if (!generator.includes('from "./dinner-playbook"')) {
  console.error("generateDinnerConversation.ts must import dinner playbook helpers.");
  failed = true;
}

if (!generator.includes("${dinnerPlaybookGuidance}")) {
  console.error("generateDinnerConversation.ts must inject dinnerPlaybookGuidance.");
  failed = true;
}

if (!generator.includes("selectDinnerPlaybookFrame(context, worldContextCard)")) {
  console.error("fallback must use the selected dinner playbook frame.");
  failed = true;
}

const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});

const { formatDinnerPlaybookGuidance, selectDinnerPlaybookFrame } = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

function baseContext(overrides = {}) {
  return {
    parentName: "Sarah",
    children: [
      {
        id: "child-1",
        name: "Mira",
        age: 8,
        interests: ["drawing"],
        recentQuests: [],
        learningEvents: [],
      },
      {
        id: "child-2",
        name: "Leo",
        age: 11,
        interests: ["soccer", "robots"],
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

const fairnessFrame = selectDinnerPlaybookFrame(
  baseContext({
    familyLearningEvents: [
      {
        kind: "family_preference",
        summary: "Family likes fairness, rules, turns, soccer, and hearing who a rule helps.",
        confidence: 0.9,
      },
    ],
  }),
);

if (fairnessFrame.id !== "table-fairness") {
  console.error(`Expected table-fairness, got ${fairnessFrame.id}`);
  failed = true;
}

const repeatedFairnessFrame = selectDinnerPlaybookFrame(
  baseContext({
    familyLearningEvents: [
      {
        kind: "family_preference",
        summary: "Family likes fairness, rules, turns, soccer, and hearing who a rule helps.",
      },
    ],
    recentDinnerConversations: [
      {
        question:
          "If two people wanted the same last bite tonight, what fair rule would you try first?",
        parent_move: "Ask each person for one reason.",
        follow_up:
          "What would make the rule feel fair even if someone did not get their first choice?",
        skill: "values-reasoning",
        local_date_key: "2026-07-05",
        sent_at: "2026-07-05T18:30:00Z",
      },
    ],
  }),
);

if (repeatedFairnessFrame.id === "table-fairness") {
  console.error("Recent table-fairness dinner should force a different playbook frame.");
  failed = true;
}

const abstractRecoveryFrame = selectDinnerPlaybookFrame(
  baseContext({
    familyLearningEvents: [
      {
        kind: "family_preference",
        summary:
          "Parent dislikes abstract dinner questions about designing games, players, resources, and decision systems; keep fairness concrete.",
      },
    ],
    recentDinnerConversations: [
      {
        question:
          "If you designed a game where players had to choose between sharing a resource, what rules would make it fair?",
        parent_move: "Ask what makes you say that and invite another family member to add their ideas.",
        follow_up: "How would players react if the resource rule changed?",
        skill: "values-reasoning",
        local_date_key: "2026-07-04",
        sent_at: "2026-07-04T18:30:00Z",
      },
    ],
  }),
);

if (
  /players?|resources?|design a game/i.test(
    `${abstractRecoveryFrame.fallbackQuestion} ${abstractRecoveryFrame.fallbackFollowUp}`,
  )
) {
  console.error("Playbook fallback must not repeat abstract game/player/resource language.");
  failed = true;
}

const worldFrame = selectDinnerPlaybookFrame(
  baseContext({ familyLearningEvents: [] }),
  {
    id: "rumors-and-evidence",
  },
);

if (worldFrame.id !== "trust-the-claim" && worldFrame.id !== "memory-truth") {
  console.error(`Expected evidence/trust frame for rumors world card, got ${worldFrame.id}`);
  failed = true;
}

const guidance = formatDinnerPlaybookGuidance(
  baseContext({
    familyLearningEvents: [
      {
        kind: "family_preference",
        summary: "Family wants concrete dinner questions young kids can answer in ten seconds.",
      },
    ],
  }),
);

for (const needle of [
  "Dinner playbook",
  "Table anchors",
  "Youngest-child test",
  "age 8",
  "Do not expose this playbook label",
]) {
  if (!guidance.includes(needle)) {
    console.error(`Formatted dinner playbook guidance missing: ${needle}`);
    failed = true;
  }
}

if (!packageJson.includes('"check:dinner-playbook": "node scripts/check-dinner-playbook.mjs"')) {
  console.error("package.json must expose check:dinner-playbook.");
  failed = true;
}

if (!ci.includes("npm run check:dinner-playbook")) {
  console.error("CI must run check:dinner-playbook.");
  failed = true;
}

if (failed) {
  console.error(guidance);
  process.exit(1);
}

console.log("Dinner playbook check passed.");
