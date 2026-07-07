# Elsy Learning Arcs

Learning arcs are the continuity layer behind daily quests. A single quest should
feel fresh, concrete, and worth doing today; over several weeks, the sequence
should also develop a recognizable capacity for that child and family.

## Contract

- Select one invisible arc per quest from family preferences, child interests,
  prior replies, and recent quest history.
- Keep the parent-facing SMS natural. Do not name arcs, research methods,
  week numbers, or future-skills language.
- Penalize saturated arcs when recent quests already used the same skills or
  surface patterns.
- Use the arc as a week-level progression, not a script. The quest must still
  obey the quality rubric and feel specific to today.

## Current Arcs

| Arc | Trains | Best when |
|---|---|---|
| Evidence Habits | evidence-seeking, hypothesis-testing, uncertainty-calibration | The family mentions clues, testing, puzzles, guesses, or changing minds |
| Fair Tradeoffs | values-reasoning, decision-making, perspective-taking | The family mentions games, rules, sharing, siblings, teams, or fairness |
| Source Sense | source-evaluation, epistemic-honesty, critical-thinking | Older children are ready to ask who would know and why a claim is trustworthy |
| Creative Prototyping | creative-thinking, problem-solving, comparison | The child likes building, drawing, designing, inventing, or making |
| Perspective Listening | perspective-taking, listening, communication | Replies mention friends, siblings, stories, feelings, or different views |
| Future Responsibility | future-thinking, systems-thinking, values-reasoning | The family is ready for local ripples, stewardship, technology, or world change |

## Implementation

`lib/agents/learning-arcs.ts` exports the typed arc catalog, deterministic
selection, and formatted prompt guidance. The selector scores family signals,
applies age fit, then penalizes recently repeated arc skills and themes. This
lets Elsy build continuity without sending three shadow quests in a row.

The offline regression check is `npm run check:learning-arcs`. It verifies:

- evidence-heavy profiles select the evidence arc
- saturated evidence quests force a fresher arc
- build/design interests select creative prototyping
- source-sense stays age-aware
- quest generation injects the arc guidance
- CI keeps the check pinned
