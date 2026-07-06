# Parent Companion Layer

The parent companion layer powers the `WHY` SMS response after a quest or dinner
question. It should help the parent run the moment well without making the main
SMS longer or more academic.

## Contract

- Keep the main quest/dinner SMS child-facing and concise.
- Use `WHY` for parent-only context after the prompt arrives.
- Make the response useful even if the parent never opens the source link.
- Include one facilitation move, one observable signal, one if-stuck recovery,
  one optional source, and one safety boundary.
- Do not make developmental, therapeutic, diagnostic, IQ, or guaranteed-outcome
  claims.

## Message Shape

```text
Parent context for this mission/dinner question:
<why this prompt is shaped this way>

Parent move:
<one concrete facilitation move>

Watch for:
<what a good thinking moment may sound like>

If it stalls:
<one recovery move>

Resource:
<source and link>

Note:
<safety boundary>
```

## Verification

Run `npm run check:parent-companion` to prove:

- every resource card has companion fields
- selected resources respect age bands
- `WHY` formatting includes all companion sections
- dinner and quest labels remain correct
- banned clinical or guaranteed-development claims are rejected
