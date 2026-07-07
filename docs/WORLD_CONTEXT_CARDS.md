# World-Context Cards

World-context cards are curated current-issue-adjacent inputs for dinner
questions. They are not live news. They translate durable social tensions into
safe, table-scale family conversations.

## Contract

- Disabled by default through `DINNER_WORLD_CONTEXT_ENABLED=0`.
- `light` mode can only use light-sensitivity cards.
- `deeper` mode can use medium cards only after human preview.
- A no-news or no-politics family preference disables the lens.
- Cards must include an issue family, review date, focus terms, child-friendly
  frame, and at least two table-scale translations.
- Child-facing fields must not mention headlines, politicians, parties,
  elections, war, shootings, crime, graphic harm, or adult policy debates.

## Translation Rule

Each broad issue must become a concrete family-scale example:

- automation becomes a tool answer that still needs human judgment
- misinformation becomes a school story or memory that needs a clue
- resource allocation becomes a last bite, turn, seat, or attention window
- climate or stewardship becomes a family habit with a visible future ripple
- civic disagreement becomes listening well when two people care and disagree

The dinner question should never ask children to know the news. It should let
them practice reasoning about the underlying tension from lived experience.

## Verification

Run `npm run check:world-context` to audit the card catalog and selector. The
check proves:

- every card has issue-family metadata and table-scale translations
- child-facing card fields avoid banned adult-coded terms
- light mode excludes medium cards
- no-news preferences disable the lens
- age gating blocks older-child cards for younger children
- formatted guidance includes review and translation context
