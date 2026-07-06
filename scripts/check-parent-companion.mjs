import { readFileSync } from "node:fs";
import ts from "typescript";

let source = readFileSync("lib/agents/parent-resource-cards.ts", "utf8");
const inbound = readFileSync("app/api/sms/inbound/route.ts", "utf8");
const packageJson = readFileSync("package.json", "utf8");
const ci = readFileSync(".github/workflows/ci.yml", "utf8");

const requiredSource = [
  "companionMove",
  "watchFor",
  "ifStuck",
  "formatParentCompanionMessage",
  "Parent move:",
  "Watch for:",
  "If it stalls:",
  "Resource:",
  "Note:",
];

let failed = false;

for (const needle of requiredSource) {
  if (!source.includes(needle)) {
    console.error(`parent-resource-cards.ts missing: ${needle}`);
    failed = true;
  }
}

if (!inbound.includes("formatParentResourceMessage")) {
  console.error("WHY handler must still call formatParentResourceMessage.");
  failed = true;
}

source = source.replace(
  'import { formatRubricGuidance } from "./quality-rubric";',
  'function formatRubricGuidance() { return ""; }',
);

const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});

const {
  PARENT_RESOURCE_CARDS,
  formatParentResourceMessage,
  selectParentResourceCard,
  validateParentResourceCard,
} = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

for (const card of PARENT_RESOURCE_CARDS) {
  const issues = validateParentResourceCard(card);
  if (issues.length > 0) {
    console.error(`${card.id} validation failed: ${issues.join("; ")}`);
    failed = true;
  }
}

const sourceContext = {
  kind: "quest",
  title: "Trust the Claim",
  prompt: "If a website and an expert make different claims, who would know whether this is trustworthy?",
  mission: "Check who made the internet claim before trusting it.",
  followUp: "What evidence would make you change your mind?",
  skill: "source-evaluation",
  childAge: 12,
};

const sourceCard = selectParentResourceCard(sourceContext);
if (sourceCard.id !== "lateral-reading") {
  console.error(`Expected lateral-reading for older source-evaluation context, got ${sourceCard.id}`);
  failed = true;
}

const youngSourceCard = selectParentResourceCard({
  ...sourceContext,
  childAge: 6,
});

if (youngSourceCard.id === "lateral-reading") {
  console.error("Age 6 context must not select the 11-12 lateral-reading card.");
  failed = true;
}

const message = formatParentResourceMessage(sourceContext, sourceCard);
for (const needle of [
  "Parent context for this mission",
  "Parent move:",
  "Watch for:",
  "If it stalls:",
  "Resource:",
  "Note:",
  "https://",
]) {
  if (!message.includes(needle)) {
    console.error(`Formatted companion message missing: ${needle}`);
    failed = true;
  }
}

if (/\b(?:guarantee|diagnose|therapy|therapeutic|boost iq|brain training)\b/i.test(message)) {
  console.error("Parent companion message contains banned claim language.");
  failed = true;
}

const dinnerMessage = formatParentResourceMessage({
  kind: "dinner",
  prompt: "If two people remember the same moment differently, how could we check kindly?",
  mission: "Start with a harmless example and ask what clue would help.",
  followUp: "What would make you change your mind?",
  skill: "epistemic-honesty",
  childAge: null,
});

if (!dinnerMessage.includes("Parent context for this dinner question")) {
  console.error("Dinner WHY response must label itself as dinner context.");
  failed = true;
}

if (!packageJson.includes('"check:parent-companion": "node scripts/check-parent-companion.mjs"')) {
  console.error("package.json must expose check:parent-companion.");
  failed = true;
}

if (!ci.includes("npm run check:parent-companion")) {
  console.error("CI must run check:parent-companion.");
  failed = true;
}

if (failed) {
  console.error(message);
  process.exit(1);
}

console.log("Parent companion check passed.");
