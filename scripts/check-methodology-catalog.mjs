import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync("lib/agents/research-techniques.ts", "utf8");
const docs = readFileSync("docs/EVIDENCE_INFORMED_TECHNIQUES.md", "utf8");
const packageJson = readFileSync("package.json", "utf8");
const ci = readFileSync(".github/workflows/ci.yml", "utf8");

const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});

const {
  RESEARCH_TECHNIQUES,
  TECHNIQUE_SOURCE_REGISTRY,
} = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString("base64")}`
);

const requiredDomains = [
  "epistemic-honesty",
  "critical-thinking",
  "learning-science",
  "executive-function",
  "creative-futures",
  "social-perspective",
  "future-readiness",
  "wellbeing-foundation",
];

const requiredAgeBands = ["5-7", "8-10", "11-12", "all"];
const bannedClaimPatterns = [
  /\bdiagnos(?:e|is|tic)\b/i,
  /\btherap(?:y|ist|eutic)\b/i,
  /\bmedical\b/i,
  /\bmental health\b/i,
  /\bboost iq\b/i,
  /\bbrain training\b/i,
  /\bguarantee(?:d|s)?\b/i,
  /\bneuro-enhancement\b/i,
];

const strongEvidenceTypes =
  /\b(consensus report|meta-analysis|systematic review|review|randomized controlled trial)\b/i;
const futureFrameworkEvidence = /\b(future|framework)\b/i;

let failed = false;
const errors = [];

function issue(message) {
  errors.push(message);
  failed = true;
}

const sourceKeys = new Set(Object.keys(TECHNIQUE_SOURCE_REGISTRY));
for (const [key, sourceEntry] of Object.entries(TECHNIQUE_SOURCE_REGISTRY)) {
  if (!sourceEntry.title?.trim()) issue(`${key}: source title is empty`);
  if (!sourceEntry.citation?.trim()) issue(`${key}: source citation is empty`);
  if (!sourceEntry.evidenceType?.trim()) issue(`${key}: source evidenceType is empty`);
  if (!sourceEntry.url?.startsWith("https://")) issue(`${key}: source url must be https`);
}

const ids = new Set();
const domainsCovered = new Set();
const agesCovered = new Set();

for (const technique of RESEARCH_TECHNIQUES) {
  if (ids.has(technique.id)) issue(`${technique.id}: duplicate technique id`);
  ids.add(technique.id);

  for (const field of ["id", "name", "mechanism", "questMove", "followUpMove", "avoid"]) {
    if (!String(technique[field] ?? "").trim()) issue(`${technique.id}: ${field} is empty`);
  }

  if (!Array.isArray(technique.domains) || technique.domains.length === 0) {
    issue(`${technique.id}: domains empty`);
  }
  if (!Array.isArray(technique.ageBands) || technique.ageBands.length === 0) {
    issue(`${technique.id}: ageBands empty`);
  }
  if (!Array.isArray(technique.sourceKeys) || technique.sourceKeys.length === 0) {
    issue(`${technique.id}: sourceKeys empty`);
  }
  if (!Array.isArray(technique.questSkills) || technique.questSkills.length === 0) {
    issue(`${technique.id}: questSkills empty`);
  }

  for (const domain of technique.domains) domainsCovered.add(domain);
  for (const band of technique.ageBands) agesCovered.add(band);

  const referencedSources = technique.sourceKeys.map((key) => TECHNIQUE_SOURCE_REGISTRY[key]);
  for (const key of technique.sourceKeys) {
    if (!sourceKeys.has(key)) issue(`${technique.id}: unknown source key ${key}`);
  }

  const copy = [
    technique.name,
    technique.mechanism,
    technique.questMove,
    technique.followUpMove,
  ].join(" ");
  const fullCopy = [
    technique.name,
    technique.mechanism,
    technique.questMove,
    technique.followUpMove,
    technique.avoid,
  ].join(" ");

  for (const pattern of bannedClaimPatterns) {
    if (pattern.test(copy)) issue(`${technique.id}: contains banned methodology claim`);
  }

  if (!/\b(?:do not|avoid|keep|use|do)\b/i.test(technique.avoid)) {
    issue(`${technique.id}: avoid field needs a clear boundary`);
  }

  if (technique.evidenceStrength === "strong") {
    const hasStrongSource = referencedSources.some((entry) =>
      strongEvidenceTypes.test(entry?.evidenceType ?? ""),
    );
    if (!hasStrongSource) {
      issue(`${technique.id}: strong technique lacks strong source type`);
    }
  }

  if (technique.evidenceStrength === "moderate") {
    const onlyFutureFrameworks = referencedSources.every((entry) =>
      futureFrameworkEvidence.test(entry?.evidenceType ?? ""),
    );
    if (onlyFutureFrameworks) {
      issue(`${technique.id}: moderate technique cannot rely only on future frameworks`);
    }
  }

  if (technique.evidenceStrength === "foresight") {
    const hasFutureSource = referencedSources.some((entry) =>
      futureFrameworkEvidence.test(`${entry?.evidenceType ?? ""} ${entry?.title ?? ""}`),
    );
    if (!hasFutureSource) {
      issue(`${technique.id}: foresight technique needs a future-oriented source`);
    }
    if (!/\b(?:future|tradeoff|systems|responsibility|plausible|forecast|deterministic)\b/i.test(fullCopy)) {
      issue(`${technique.id}: foresight technique needs explicit future/tradeoff framing`);
    }
  }

  if (technique.evidenceStrength === "emerging") {
    if (!/\b(?:not|avoid|vary|oversold|claims?)\b/i.test(technique.avoid)) {
      issue(`${technique.id}: emerging technique needs extra caution in avoid field`);
    }
  }

  if (!docs.includes(technique.name)) {
    issue(`${technique.id}: docs missing technique name ${technique.name}`);
  }
}

for (const domain of requiredDomains) {
  if (!domainsCovered.has(domain)) issue(`missing domain coverage: ${domain}`);
}

for (const ageBand of requiredAgeBands) {
  if (!agesCovered.has(ageBand)) issue(`missing age-band coverage: ${ageBand}`);
}

for (const phrase of [
  "Evidence Standard",
  "Foresight",
  "Do not make supplement, treatment, therapy, or brain-training claims.",
  "When a family gives feedback, honor it before generic methodology",
]) {
  if (!docs.includes(phrase)) issue(`docs missing methodology contract phrase: ${phrase}`);
}

if (!packageJson.includes('"check:methodology": "node scripts/check-methodology-catalog.mjs"')) {
  issue("package.json must expose check:methodology");
}

if (!ci.includes("npm run check:methodology")) {
  issue("CI must run check:methodology");
}

if (failed) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Methodology catalog check passed (${RESEARCH_TECHNIQUES.length} techniques, ${sourceKeys.size} sources).`,
);
