# Family Memory Engine

Elsy learns from family replies through `family_learning_events`. This document
defines how those events should be interpreted before they are passed into quest,
dinner, and reply generation.

The current implementation is schema-compatible: it does not require a new
migration. It groups existing event rows into a profile view at prompt time.

## Event Kinds

| Kind | Meaning | Prompt Priority |
|---|---|---|
| `avoidance` | Something the parent disliked or wants avoided | Highest |
| `quest_feedback` | Feedback about quest style, difficulty, topic, or format | High, but not automatically an avoidance |
| `family_preference` | Stable family preference such as shorter, hands-on, outside, calmer, harder | High |
| `successful_pattern` | A pattern that created good engagement | Medium |
| `child_interest` | Interest, hobby, topic, or spark | Medium |
| `parent_note` | Useful but lower-confidence context | Low |

Avoidances are surfaced before interests. Quest feedback is separate from
avoidance because feedback can be positive, neutral, or corrective. A child
interest should not override a parent's "please stop sending this kind of
mission" signal, but neutral feedback like "try shadows as a test" should not be
treated as a hard constraint.

## Profile View

`lib/agents/family-memory.ts` turns recent events into grouped sections:

- Avoid
- Quest feedback
- Family preferences
- What worked
- Child interests and sparks
- Parent notes
- Other context

Each item includes summary, scope, date, confidence label, and evidence when
available. The profile is consumed through `formatFamilyLearning(...)`, so
existing quest, dinner, interpretation, and reply-learning prompts receive a
stronger memory view without changing their call sites.

## Why This Matters

Flat memory lists are easy for the model to skim past. Grouped memory makes the
important distinction explicit:

- "Do not repeat this" is a constraint.
- "The parent commented on this" is feedback to interpret, not necessarily a
  constraint.
- "We liked this" is a reusable pattern.
- "The child likes this" is a personalization hook.
- "The parent mentioned this once" is low-confidence context.

This is the first step toward a real durable family profile.

## Check

```bash
npm run check:family-memory
```

The check verifies that grouped formatting separates avoidances, quest feedback,
preferences, successes, interests, and parent notes; preserves evidence; labels
confidence; keeps child-scoped vs family-wide context visible; includes dates;
and places avoidances before quest feedback before preferences.

## Future Schema Work

A later migration can promote repeated event patterns into explicit profile
tables, such as:

- child likes and dislikes;
- parent preferences;
- successful quest patterns;
- avoidances;
- sibling dynamics;
- confidence and decay timestamps.

That migration should be reviewed separately because it changes production data
shape.
