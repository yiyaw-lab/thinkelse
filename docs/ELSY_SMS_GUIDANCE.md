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

## Dinner Conversation Quality Bar

Dinner questions should feel like something a parent would actually want to ask
at the table. Prefer a small dilemma, tradeoff, family value, perspective clash,
or "how do we know?" question. A seasonal detail can be texture, but the core
conversation should not be generic air, light, breeze, sunset, or sensory
noticing.

Strong dinner prompts invite children to reason about fairness, honesty, trust,
kindness, evidence, uncertainty, disagreement, responsibility, or changed minds.
The parent move should run the conversation: pause, ask for a reason, invite the
opposite view, ask what evidence would change their mind, or bring another child
in. Avoid bland moves like "Name one thing you hear, see, or feel" unless they
lead into a meaningful human choice.

## World Context

Dinner prompts may draw from curated world-context cards only as an invisible
inspiration layer. These cards are current-event adjacent: they translate social
issues, moral dilemmas, technology shifts, civic tensions, and societal
tradeoffs into family-scale questions. They are not live news summaries.

Allowed:

- "How would we know what probably happened?"
- "What would make this rule fair to more people?"
- "When should a person double-check a tool before trusting it?"
- "How can people disagree without turning each other into the bad guy?"

Avoid:

- Named public figures, parties, politicians, elections, breaking headlines, or
  adult-coded policy debates.
- Fear, doom, graphic harm, war, crime, shootings, disasters, or culture-war
  framing.
- Asking the child to read, watch, search, or already know the news.
- Ideological conclusions. Children should practice reasoning, not receive a
  prescribed viewpoint.
