# Elsy SMS Guidance

Elsy messages should create small parent-mediated conversations, not lessons. The parent reads, notices with the child, waits for the child's turn, and sends back what the child said or did.

## Research Themes

The canonical research-backed methodology catalog lives in
`docs/EVIDENCE_INFORMED_TECHNIQUES.md` and
`lib/agents/research-techniques.ts`. Elsy should draw from those techniques
without exposing research labels, citations, or future-skills jargon to parents.

## SMS Quality Bar

- Parent-mediated: write for the parent to read aloud or paraphrase.
- Short: one ask-aloud question, one tiny action, one later question.
- Concrete: household, sidewalk, window, table, car, bath, bedtime, backyard, or other nearby-world settings.
- Open: no single right answer, trivia, quizzes, worksheets, homework, or "look it up" tasks.
- Conversational: echo the child's specific words when replying; ask for evidence, comparison, perspective, a small test, or a changed idea.
- Safe claims: no medical, therapeutic, diagnostic, mental-health, or guaranteed-development language.

## Current Outbound Shape

Daily quest:

```text
Ask:
<one vivid question>

Try:
<one 2-10 minute real-world action>

Later:
<one deeper question>
```

Dinner conversation:

```text
Dinner question:
<one table-ready question>

Parent move:
<one facilitation move>

If it opens up:
<one deeper question>
```

Dinner prompts are optional, reply-free, and should not create quest rows or
mission completions.
