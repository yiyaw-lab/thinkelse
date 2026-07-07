import { readFileSync } from "node:fs";

const dimensionIds = [
  "worth-anticipating",
  "concrete",
  "answerable",
  "parent-mediated",
  "personalized",
  "epistemically-honest",
  "age-fit",
  "family-binding",
  "non-generic",
  "safe-and-humble",
];

const docTerms = [
  "delight",
  "Concrete",
  "Answerable",
  "Personalized",
  "Epistemically honest",
  "Parent-mediated",
  "Age-fit",
  "Family-binding",
  "Non-generic",
  "Safe and humble",
  "Daily Quest",
  "Dinner Conversation",
  "Interpretation Reply",
  "Parent Resource Reply",
];

const surfaceWiring = [
  {
    file: "lib/agents/generateQuest.ts",
    importFrom: './quality-rubric"',
    call: 'formatRubricGuidance("quest")',
  },
  {
    file: "lib/agents/generateDinnerConversation.ts",
    importFrom: './quality-rubric"',
    call: 'formatRubricGuidance("dinner")',
  },
  {
    file: "lib/agents/interpretResponse.ts",
    importFrom: './quality-rubric"',
    call: 'formatRubricGuidance("interpretation")',
  },
  {
    file: "lib/agents/parent-resource-cards.ts",
    importFrom: './quality-rubric"',
    call: 'formatRubricGuidance("resource")',
  },
];

let failed = false;

function read(file) {
  return readFileSync(file, "utf8");
}

function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function requireText(file, needle, text = read(file)) {
  if (!text.includes(needle)) {
    console.error(`${file} is missing required text: ${needle}`);
    failed = true;
  }
}

const doc = read("docs/ELSY_QUALITY_RUBRIC.md");
for (const term of docTerms) {
  requireText("docs/ELSY_QUALITY_RUBRIC.md", term, doc);
}

requireText("README.md", "docs/ELSY_QUALITY_RUBRIC.md");
requireText("docs/ELSY_SMS_GUIDANCE.md", "ELSY_QUALITY_RUBRIC.md");
requireText("package.json", '"check:quality-rubric": "node scripts/check-quality-rubric.mjs"');
requireText(".github/workflows/ci.yml", "npm run check:quality-rubric");

const runtime = stripComments(read("lib/agents/quality-rubric.ts"));
requireText("lib/agents/quality-rubric.ts", "ELSY_QUALITY_DIMENSIONS", runtime);
requireText("lib/agents/quality-rubric.ts", "formatRubricGuidance", runtime);
requireText("lib/agents/quality-rubric.ts", '"quest" | "dinner" | "interpretation" | "resource"', runtime);

const runtimeDimensionCount = [...runtime.matchAll(/\bid:\s*"/g)].length;
if (runtimeDimensionCount !== dimensionIds.length) {
  console.error(
    `lib/agents/quality-rubric.ts has ${runtimeDimensionCount} dimensions; expected ${dimensionIds.length}`,
  );
  failed = true;
}

for (const id of dimensionIds) {
  requireText("lib/agents/quality-rubric.ts", `id: "${id}"`, runtime);
}

for (const surface of surfaceWiring) {
  const source = stripComments(read(surface.file));
  requireText(surface.file, surface.importFrom, source);
  requireText(surface.file, surface.call, source);
}

const parentResources = stripComments(read("lib/agents/parent-resource-cards.ts"));
requireText("lib/agents/parent-resource-cards.ts", "validateParentResourceCard", parentResources);
requireText("lib/agents/parent-resource-cards.ts", "PARENT_RESOURCE_RUBRIC_GUIDANCE", parentResources);

if (failed) {
  process.exit(1);
}

console.log("Elsy quality rubric check passed.");
