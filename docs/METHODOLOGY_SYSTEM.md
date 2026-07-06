# Methodology System

Elsy's methodology system is the evidence-informed substrate behind quest and
dinner generation. It has two layers:

- `lib/agents/research-techniques.ts`: the runtime catalog used by generation.
- `docs/EVIDENCE_INFORMED_TECHNIQUES.md`: the human-readable methodology
  standard.

## Operating Rules

- Every technique must have source keys, domains, age bands, quest skills, a
  mechanism, a quest move, a follow-up move, and an avoid boundary.
- Strong techniques need at least one consensus, review, meta-analysis,
  systematic review, or randomized source.
- Moderate techniques cannot rely only on future-skills frameworks.
- Foresight techniques can shape direction and tradeoffs, but must not imply
  validated child outcomes.
- Emerging techniques need extra caution and must avoid overclaiming.
- Family feedback overrides generic methodology when safe.
- No method may claim to diagnose, treat, provide therapy, boost IQ, guarantee
  outcomes, or provide brain training.

## Adding a Technique

1. Add or reuse a source in `TECHNIQUE_SOURCE_REGISTRY`.
2. Add the technique to `RESEARCH_TECHNIQUES`.
3. Translate the method into one concrete quest move and one follow-up move.
4. Add a clear avoid boundary.
5. Add the technique to `docs/EVIDENCE_INFORMED_TECHNIQUES.md`.
6. Run `npm run check:methodology`.

## Verification

`npm run check:methodology` audits:

- source registry completeness and HTTPS links
- duplicate technique IDs
- source-key integrity
- age-band and domain coverage
- evidence-strength/source compatibility
- banned medical, therapy, IQ, guarantee, and brain-training claims
- docs alignment for every technique
