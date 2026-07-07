import { dinnerFixtures, questFixtures } from "./quality-fixtures.mjs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const bannedPhrases = [
  "worksheet",
  "homework",
  "quiz",
  "correct answer",
  "right answer",
  "screen time",
  "watch a video",
  "look it up",
  "search the internet",
  "therapy",
  "therapeutic",
  "diagnose",
  "treatment",
  "brain training",
  "boost iq",
  "guaranteed",
];

const richThinkingTerms = [
  "fair",
  "rule",
  "trust",
  "evidence",
  "clue",
  "reason",
  "choice",
  "tradeoff",
  "perspective",
  "test",
  "change your mind",
  "what else could be true",
  "opposite view",
];

const questHookTerms = [
  ...richThinkingTerms,
  "mystery",
  "surprise",
  "stuck",
  "deciding",
  "stronger",
  "weaker",
  "first idea",
];

const dinnerHumanStakeTerms = [
  "family",
  "person",
  "people",
  "someone",
  "friend",
  "school",
  "home",
  "rule",
  "fair",
  "kind",
  "truth",
  "trust",
  "mistake",
  "listen",
  "disagree",
  "choice",
  "evidence",
  "sure",
  "responsible",
  "last bite",
  "turn",
  "seat",
];

const dinnerSparkTerms = [
  "tonight",
  "today",
  "last bite",
  "turn",
  "friend",
  "school",
  "truth",
  "fair",
  "kind",
  "trust",
  "change your mind",
  "what would make",
  "opposite view",
];

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function issueIf(condition, issues, message) {
  if (condition) issues.push(message);
}

function baseIssues(fields, requiredFields) {
  const issues = [];
  const blob = requiredFields.map((field) => fields[field] ?? "").join(" ").toLowerCase();

  for (const name of requiredFields) {
    const value = fields[name];
    issueIf(!String(value ?? "").trim(), issues, `${name} is empty`);
  }

  const banned = bannedPhrases.find((phrase) => blob.includes(phrase));
  issueIf(Boolean(banned), issues, `contains banned phrase: ${banned}`);

  return issues;
}

export function evaluateQuest(output) {
  const issues = baseIssues(output, [
    "title",
    "whyThis",
    "prompt",
    "mission",
    "followUp",
    "skill",
  ]);
  const blob = [
    output.title,
    output.whyThis,
    output.prompt,
    output.mission,
    output.followUp,
    output.skill,
  ].join(" ").toLowerCase();
  const coreBlob = [output.prompt, output.mission, output.followUp]
    .join(" ")
    .toLowerCase();
  const prompt = String(output.prompt ?? "");
  const mission = String(output.mission ?? "");
  const followUp = String(output.followUp ?? "");
  const whyThis = String(output.whyThis ?? "");

  issueIf(!prompt.trim().endsWith("?"), issues, "prompt must end with ?");
  issueIf(!followUp.trim().endsWith("?"), issues, "followUp must end with ?");
  issueIf(whyThis && wordCount(whyThis) > 28, issues, "whyThis too long");
  issueIf(
    whyThis && !/\b(?:together|family|you can|with you|parent)\b/i.test(whyThis),
    issues,
    "whyThis should bring parent/family into the moment",
  );
  issueIf(
    /\bwhat do you notice\b/i.test(prompt) ||
      /\b(?:look|walk|go) around\b/i.test(blob) ||
      /\b(?:something|anything) interesting\b/i.test(blob),
    issues,
    "quest uses generic noticing or vague object language",
  );
  issueIf(
    /\bfront step\b|\bshadow(?:s)?\b.*\b(?:shape|pattern|move|change)\b/i.test(coreBlob) &&
      !includesAny(coreBlob, richThinkingTerms),
    issues,
    "quest repeats passive shadow/front-step noticing without richer thinking",
  );
  issueIf(
    /\b(?:learn|read|research) about\b|\b(?:discuss|talk about)\b/i.test(mission),
    issues,
    "mission is research/discussion instead of a real-world action",
  );
  issueIf(
    !/\b(?:try|ask|pause|compare|check|test|choose|pick|make|build|draw|invent|change|sort|watch|listen|find|turn)\b/i.test(
      mission,
    ),
    issues,
    "mission lacks a clear action verb",
  );
  issueIf(
    /\bwhat did you learn\b|\bdid you like\b|\bhow did it make you feel\b/i.test(followUp),
    issues,
    "followUp is school-like or therapy-like",
  );
  issueIf(
    !includesAny(coreBlob, questHookTerms),
    issues,
    "quest lacks an anticipation hook or thinking payoff",
  );

  return {
    score: issues.length === 0 ? 3 : issues.length <= 2 ? 1 : 0,
    issues,
  };
}

export function evaluateDinner(output) {
  const issues = baseIssues(output, [
    "question",
    "whyThis",
    "parentMove",
    "followUp",
    "skill",
  ]);
  const question = String(output.question ?? "");
  const parentMove = String(output.parentMove ?? "");
  const followUp = String(output.followUp ?? "");
  const whyThis = String(output.whyThis ?? "");
  const blob = Object.values(output).join(" ").toLowerCase();
  const conversation = `${question} ${followUp}`.toLowerCase();

  issueIf(!question.trim().endsWith("?"), issues, "question must end with ?");
  issueIf(!followUp.trim().endsWith("?"), issues, "followUp must end with ?");
  issueIf(whyThis && wordCount(whyThis) > 28, issues, "whyThis too long");
  issueIf(
    whyThis && !/\b(?:together|family|table|everyone|you)\b/i.test(whyThis),
    issues,
    "whyThis should bring family into the conversation",
  );
  issueIf(
    /\bwhat patterns? do you notice\b|\bevening air\b|\bsummer night\b|\bsunset\b|\bbreeze\b/i.test(
      blob,
    ) && !includesAny(conversation, dinnerHumanStakeTerms),
    issues,
    "dinner centers atmosphere without human stakes",
  );
  issueIf(
    /\bif you (?:designed|could design|were designing|made|could make)\b|\bplayers?\b|\bresources?\b|\bgame where\b/i.test(
      question,
    ) && !/\bgame you already know\b/i.test(question),
    issues,
    "dinner uses abstract scenario language without a concrete answer anchor",
  );
  issueIf(
    /\bask what makes you say that and invite another family member\b|\bshare (?:your|their) ideas\b|\badd (?:your|their) ideas\b/i.test(
      parentMove,
    ),
    issues,
    "parentMove is formulaic",
  );
  issueIf(
    !includesAny(conversation, dinnerSparkTerms),
    issues,
    "dinner lacks a table hook or personal stake",
  );

  return {
    score: issues.length === 0 ? 3 : issues.length <= 2 ? 1 : 0,
    issues,
  };
}

export function runFixtureGroup(kind, fixtures, evaluator) {
  let failed = false;

  for (const fixture of fixtures) {
    const result = evaluator(fixture.output);
    const accepted = result.score >= 2;
    const expectedAccepted = fixture.expected === "pass";

    if (accepted !== expectedAccepted) {
      failed = true;
      console.error(
        `${kind} fixture ${fixture.id} expected ${fixture.expected} but scored ${result.score}.`,
      );
      for (const issue of result.issues) {
        console.error(`  - ${issue}`);
      }
    } else {
      console.log(
        `${kind} fixture ${fixture.id}: ${fixture.expected} as expected (score ${result.score})`,
      );
    }
  }

  return failed;
}

export function runQualityFixtureEvaluation() {
  const questFailed = runFixtureGroup("quest", questFixtures, evaluateQuest);
  const dinnerFailed = runFixtureGroup("dinner", dinnerFixtures, evaluateDinner);
  return questFailed || dinnerFailed;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const failed = runQualityFixtureEvaluation();
  if (failed) {
    process.exit(1);
  }

  console.log("Elsy quality fixture evaluation passed.");
}
