# Lighthouse Pilot Loop

The lighthouse pilot loop turns early-family replies into a small weekly product
learning brief. It uses existing `family_learning_events`; it does not require a
new table or migration.

## Signal Categories

| Category | Meaning | Typical action |
|---|---|---|
| Delight | A family looked forward to, loved, or deeply engaged with a pattern | Repeat the pattern and consider adding it as a quality example |
| Friction | The family disliked, avoided, or got blocked by something | Follow up or add a constraint before similar sends |
| Feature request | The parent asks for more/less/different behavior | Cluster requests and run a small experiment |
| Personalization | Child interests or family preferences | Use as memory; do not overgeneralize |
| Delivery | Scheduled sends, onboarding, dinner setup, or timing appears broken | Check scheduler and send logs first |
| Quality | Boring, generic, repetitive, childish, or unanswerable content | Add fixtures, rubric examples, or prompt constraints |

## Safety

This loop is for product learning, not child assessment. Do not rank children,
label ability, diagnose, infer family worth, or make claims about outcomes. The
right unit is a family/product signal, not a child score.

## Implementation

`lib/ops/lighthouse-pilot.ts` exports pure helpers:

- `classifyPilotSignal`
- `buildPilotSignals`
- `buildLighthousePilotBrief`
- `formatLighthousePilotBrief`

Future work can connect these helpers to an admin endpoint or weekly report.

## Verification

Run `npm run check:lighthouse-pilot` to prove the loop separates delight,
friction, feature requests, personalization, delivery issues, and quality risks
from representative family-learning events.
