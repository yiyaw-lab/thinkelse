# Elsy Evaluation Harness

The evaluation harness gives Elsy a deterministic quality gate before any live
model calls, SMS sends, or production data are involved.

It exists to catch regressions like:

- passive shadow/front-step quests;
- generic "what do you notice" prompts;
- abstract dinner-game/resource questions;
- dinner questions about atmosphere without human stakes;
- formulaic parent moves;
- missing `whyThis` rationale;
- school-like, therapy-like, screen-based, or research-based outputs.

## Command

```bash
npm run check:quality-fixtures
```

The command runs:

- `scripts/evaluate-quality-fixtures.mjs`
- fixture data from `scripts/quality-fixtures.mjs`

It does not call OpenAI, Supabase, Telnyx, Vercel, or any live service.

## Fixture Contract

Each fixture has:

- `id`: stable fixture name;
- `expected`: `pass` or `fail`;
- `note`: why the fixture exists;
- `output`: the generated quest or dinner payload.

Known-good fixtures should score as acceptable. Known-bad fixtures must fail.
If a bad fixture starts passing, the harness should fail because the quality
gate has become too weak.

## Current Coverage

Daily quest fixtures cover:

- a concrete evidence-seeking quest;
- a concrete fairness-rule quest;
- the weak shadow/front-step pattern;
- generic "look around" activity-book energy;
- an adversarial shadow fixture whose `whyThis` and `skill` try to launder
  weak core content with evidence language.

Dinner fixtures cover:

- a table-ready last-bite fairness question;
- an epistemic-honesty memory-disagreement question;
- the weak evening-air/sunset pattern;
- the abstract game/resource-sharing pattern;
- an adversarial game/resource fixture whose "tonight" and "today" anchors try
  to launder abstract core content.

## How To Extend

Add a fixture when:

- a parent reports an ignorable, boring, unanswerable, childish, generic, or
  formulaic message;
- a reviewer rejects a prompt for a reason likely to recur;
- a new generator surface ships;
- a new rubric dimension needs a regression example.

Keep fixtures short and realistic. Use actual weak examples when possible, but
remove private family data.

## Relationship To The Rubric

`docs/ELSY_QUALITY_RUBRIC.md` is the canonical standard. The harness is a
practical regression gate for examples that can be checked deterministically.

The harness should not replace human review. It should make weak outputs harder
to accidentally reintroduce.
