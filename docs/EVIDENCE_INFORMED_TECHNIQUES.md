# Evidence-Informed Technique Database

This database is the methodology source of truth for Elsy quests. The runtime
catalog lives in `lib/agents/research-techniques.ts`; this document explains the
evidence standard and how each method should translate into SMS.

Elsy should never claim to diagnose, treat, boost IQ, or guarantee child
development outcomes. "Neuro-enhancement" is treated conservatively as
non-medical cognitive flourishing: movement as a learning context,
executive-function practice, metacognition, curiosity, and family conversation.
Do not make supplement, treatment, therapy, or brain-training claims.

## Evidence Standard

| Level | Meaning | How Elsy Uses It |
|---|---|---|
| Strong | Consensus reports, meta-analyses, major reviews, or replicated learning-science principles | Can guide default quest structure |
| Moderate | Focused empirical studies, theory-backed interventions, or narrower reviews | Use as a method lens when it fits age/context |
| Emerging | Plausible but variable or context-dependent evidence | Use only as a light context; avoid claims |
| Foresight | Future-skills frameworks and labor/education forecasts | Use for direction-setting, not as proof of child outcomes |

## Technique Catalog

| Technique | Evidence | Age Bands | What It Trains | Quest Translation |
|---|---:|---|---|---|
| Serve-and-return noticing | Strong | 5-10, all | Listening, observation, conversation | Parent follows what the child notices, names one detail, waits, and builds from the child's next move. |
| Evidence from noticing | Strong | All | Evidence-seeking, critical thinking, epistemic honesty | Ask for a claim about something visible, then one detail that supports or challenges it. |
| Predict-test-revise | Strong | All | Hypothesis testing, uncertainty, metacognition | Child predicts, changes one variable, compares what happened, then updates the idea. |
| Self-explanation | Strong | 8-12, all | Reasoning, transfer, metacognition | After a choice or observation, the child explains why it made sense. |
| Retrieval and revisit | Strong | 8-12, all | Memory, transfer, metacognition | Lightly bring back a prior quest theme and apply it in a new setting. |
| Uncertainty calibration | Moderate | 8-12, all | Honest uncertainty, confidence, revision | Child makes a best guess and names what would make them more or less sure. |
| Opposing-view curiosity | Moderate | 8-12, all | Intellectual humility, perspective-taking | Child considers one fair alternative view without turning it into a debate. |
| Two reasons and a maybe | Moderate | 8-12, all | Argumentation, reasons, exceptions | Child gives two reasons for an idea and one possible exception. |
| Lateral source sense | Moderate | 11-12 | Source evaluation, epistemic vigilance | Use a non-screen everyday claim and ask who would know, why, and how to check. |
| Diverge then converge | Moderate | All | Creative thinking, decision-making | Child generates several possibilities, then chooses one to test or compare. |
| Tiny prototype | Moderate | All | Making, testing, iteration | Child builds/draws/changes one thing with nearby materials, then observes what improved or failed. |
| Systems ripple | Foresight | 8-12, all | Systems thinking, interdependence, tradeoffs | Trace two ripples from one tiny change in a local system. |
| Tradeoff dilemma | Foresight | 8-12, all | Decision-making, responsibility, values reasoning | Offer a small choice with no perfect answer and ask what each option protects. |
| Mistake as data | Moderate | All | Epistemic honesty, metacognition, revision | Try something low-stakes, notice what missed, and use that miss as information for the next strategy. |
| Plan-monitor-adjust | Strong | All | Executive function, self-regulation, metacognition | Child makes a tiny plan, tries it, pauses once, and adjusts. |
| Rule switch | Moderate | 5-10, all | Cognitive flexibility, inhibition, attention | Use one simple rule, switch the rule, and notice what became harder or more interesting. |
| Learn by teaching | Moderate | 8-12, all | Communication, organization, transfer | Child teaches the parent one small thing they noticed using an example. |
| Movement and attention | Emerging | 5-10, all | Attention, self-regulation, observation | Use light movement, pausing, or balance as context for noticing; make no fitness or brain claims. |
| Possible futures | Foresight | 8-12, all | Futures thinking, systems, creativity | Imagine two possible futures for an ordinary object/routine and one choice people could make today. |

## Source Registry

- National Academies, `How People Learn II`:
  https://www.nationalacademies.org/read/24783
- National Research Council, `Education for Life and Work`:
  https://www.nationalacademies.org/read/13398/chapter/3
- Dunlosky et al., `Improving Students' Learning With Effective Learning Techniques`:
  https://pubmed.ncbi.nlm.nih.gov/26173288/
- Abrami et al., `Strategies for Teaching Students to Think Critically`:
  https://journals.sagepub.com/doi/abs/10.3102/0034654314551063
- Chi and Wylie, `The ICAP Framework`:
  https://www.tandfonline.com/doi/abs/10.1080/00461520.2014.965823
- Barzilai and Chinn, `A Review of Educational Responses to the Post-Truth Condition`:
  https://www.tandfonline.com/doi/full/10.1080/00461520.2020.1786388
- Wineburg and McGrew, `Lateral Reading and Civic Online Reasoning`:
  https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3048994
- Diamond and Lee, `Interventions Shown to Aid Executive Function Development`:
  https://pmc.ncbi.nlm.nih.gov/articles/PMC3159917/
- Harvard Center on the Developing Child, `Serve and Return`:
  https://developingchild.harvard.edu/key-concept/serve-and-return/
- Porter and Schumann, `Intellectual Humility and Openness to the Opposing View`:
  https://www.researchwithrowan.com/en/publications/intellectual-humility-and-openness-to-the-opposing-view/
- Bisra et al., `Inducing Self-Explanation`:
  https://gwern.net/doc/psychology/spaced-repetition/2018-bisra.pdf
- Yeager et al., `A National Experiment Reveals Where a Growth Mindset Improves Achievement`:
  https://www.nature.com/articles/s41586-019-1466-y
- National Research Council, `Taking Science to School`:
  https://www.nationalacademies.org/publications/11625
- OECD, `Learning Compass 2030`:
  https://www.oecd.org/content/dam/oecd/en/about/projects/edu/education-2040/concept-notes/OECD_Learning_Compass_2030_concept_note.pdf
- OECD, `Seven Questions About Creativity and Creative Thinking`:
  https://www.oecd.org/en/publications/seven-questions-about-creativity-and-creative-thinking_0aa52128-en.html
- UNESCO, `Futures of Education`:
  https://www.unesco.org/en/futures-education
- Donnelly et al., `Physical Activity, Fitness, Cognitive Function, and Academic Achievement`:
  https://pubmed.ncbi.nlm.nih.gov/27182986/

## Runtime Rules

- Select a small number of age-appropriate lenses, then generate one SMS quest.
- Prefer strong/moderate evidence for normal quests; use foresight techniques to
  shape themes and questions, not to imply validated outcomes.
- Keep methods invisible to families. Parents should receive a vivid question, a
  tiny real-world action, and a later Socratic follow-up.
- Personalization wins when safe: child age, interests, prior responses, and
  family learning should tune the technique selection.
- When a family gives feedback, honor it before generic methodology unless it
  conflicts with safety, compliance, or the real-world quest format.
