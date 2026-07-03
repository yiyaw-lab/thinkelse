import type { FamilyQuestContext } from "./types";

export type TechniqueDomain =
  | "epistemic-honesty"
  | "critical-thinking"
  | "learning-science"
  | "executive-function"
  | "creative-futures"
  | "social-perspective"
  | "future-readiness"
  | "wellbeing-foundation";

export type EvidenceStrength = "strong" | "moderate" | "emerging" | "foresight";
export type AgeBand = "5-7" | "8-10" | "11-12" | "all";

export const TECHNIQUE_SOURCE_REGISTRY = {
  hpl2: {
    title: "How People Learn II",
    citation: "National Academies of Sciences, Engineering, and Medicine, 2018",
    url: "https://www.nationalacademies.org/read/24783",
    evidenceType: "consensus report",
  },
  lifeWork: {
    title: "Education for Life and Work",
    citation: "National Research Council, 2012",
    url: "https://www.nationalacademies.org/read/13398/chapter/3",
    evidenceType: "consensus report",
  },
  dunlosky2013: {
    title: "Improving Students' Learning With Effective Learning Techniques",
    citation: "Dunlosky et al., 2013",
    url: "https://pubmed.ncbi.nlm.nih.gov/26173288/",
    evidenceType: "review",
  },
  abrami2015: {
    title: "Strategies for Teaching Students to Think Critically",
    citation: "Abrami et al., 2015",
    url: "https://journals.sagepub.com/doi/abs/10.3102/0034654314551063",
    evidenceType: "meta-analysis",
  },
  chiWylie2014: {
    title: "The ICAP Framework",
    citation: "Chi and Wylie, 2014",
    url: "https://www.tandfonline.com/doi/abs/10.1080/00461520.2014.965823",
    evidenceType: "learning theory synthesis",
  },
  barzilaiChinn2020: {
    title: "A Review of Educational Responses to the Post-Truth Condition",
    citation: "Barzilai and Chinn, 2020",
    url: "https://www.tandfonline.com/doi/full/10.1080/00461520.2020.1786388",
    evidenceType: "review",
  },
  wineburgMcGrew: {
    title: "Lateral Reading and Civic Online Reasoning",
    citation: "Wineburg and McGrew, 2019",
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3048994",
    evidenceType: "empirical study",
  },
  diamondLee2011: {
    title: "Interventions Shown to Aid Executive Function Development",
    citation: "Diamond and Lee, 2011",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3159917/",
    evidenceType: "review",
  },
  serveReturn: {
    title: "Serve and Return Interaction Shapes Brain Architecture",
    citation: "Harvard Center on the Developing Child",
    url: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
    evidenceType: "research translation",
  },
  intellectualHumility: {
    title: "Intellectual Humility and Openness to the Opposing View",
    citation: "Porter and Schumann, 2018",
    url: "https://www.researchwithrowan.com/en/publications/intellectual-humility-and-openness-to-the-opposing-view/",
    evidenceType: "empirical study",
  },
  selfExplanation2018: {
    title: "Inducing Self-Explanation",
    citation: "Bisra et al., 2018",
    url: "https://gwern.net/doc/psychology/spaced-repetition/2018-bisra.pdf",
    evidenceType: "meta-analysis",
  },
  growthMindset2019: {
    title: "A National Experiment Reveals Where a Growth Mindset Improves Achievement",
    citation: "Yeager et al., 2019",
    url: "https://www.nature.com/articles/s41586-019-1466-y",
    evidenceType: "randomized controlled trial",
  },
  k8Science2007: {
    title: "Taking Science to School",
    citation: "National Research Council, 2007",
    url: "https://www.nationalacademies.org/publications/11625",
    evidenceType: "consensus report",
  },
  oecd2030: {
    title: "OECD Learning Compass 2030",
    citation: "OECD, 2019",
    url: "https://www.oecd.org/content/dam/oecd/en/about/projects/edu/education-2040/concept-notes/OECD_Learning_Compass_2030_concept_note.pdf",
    evidenceType: "future-skills framework",
  },
  oecdCreativity: {
    title: "Seven Questions About Creativity and Creative Thinking",
    citation: "OECD, 2024",
    url: "https://www.oecd.org/en/publications/seven-questions-about-creativity-and-creative-thinking_0aa52128-en.html",
    evidenceType: "assessment and practice synthesis",
  },
  unesco2050: {
    title: "Futures of Education",
    citation: "UNESCO",
    url: "https://www.unesco.org/en/futures-education",
    evidenceType: "future-of-education framework",
  },
  physicalActivity2016: {
    title: "Physical Activity, Fitness, Cognitive Function, and Academic Achievement",
    citation: "Donnelly et al., 2016",
    url: "https://pubmed.ncbi.nlm.nih.gov/27182986/",
    evidenceType: "systematic review",
  },
} as const;

export type TechniqueSourceKey = keyof typeof TECHNIQUE_SOURCE_REGISTRY;

export type ResearchTechnique = {
  id: string;
  name: string;
  domains: readonly TechniqueDomain[];
  evidenceStrength: EvidenceStrength;
  ageBands: readonly AgeBand[];
  sourceKeys: readonly TechniqueSourceKey[];
  questSkills: readonly string[];
  mechanism: string;
  questMove: string;
  followUpMove: string;
  avoid: string;
};

export const RESEARCH_TECHNIQUES: readonly ResearchTechnique[] = [
  {
    id: "serve-and-return-noticing",
    name: "Serve-and-return noticing",
    domains: ["learning-science", "social-perspective"],
    evidenceStrength: "strong",
    ageBands: ["5-7", "8-10", "all"],
    sourceKeys: ["serveReturn", "hpl2"],
    questSkills: ["observation", "listening", "conversation"],
    mechanism:
      "Responsive back-and-forth lets the parent share attention, name details, wait, and build from the child's response.",
    questMove:
      "Invite the parent to follow one thing the child notices, name a detail, then wait for the child's next move.",
    followUpMove: "Ask what the child noticed after the parent waited or copied their focus.",
    avoid: "Do not turn the exchange into a lesson, correction, or adult monologue.",
  },
  {
    id: "evidence-from-noticing",
    name: "Evidence from noticing",
    domains: ["epistemic-honesty", "critical-thinking"],
    evidenceStrength: "strong",
    ageBands: ["all"],
    sourceKeys: ["hpl2", "abrami2015"],
    questSkills: ["evidence-seeking", "observation", "critical-thinking"],
    mechanism:
      "Children practice linking claims to visible evidence instead of guessing what an adult wants to hear.",
    questMove:
      "Ask for one claim about a real object or moment, then one concrete detail that supports or challenges it.",
    followUpMove: "Use a version of 'What makes you say that?' or 'What detail changed your mind?'",
    avoid: "Do not ask trivia questions or imply there is one hidden answer.",
  },
  {
    id: "predict-test-revise",
    name: "Predict-test-revise",
    domains: ["critical-thinking", "learning-science"],
    evidenceStrength: "strong",
    ageBands: ["all"],
    sourceKeys: ["k8Science2007", "hpl2", "chiWylie2014"],
    questSkills: ["hypothesis-testing", "uncertainty-calibration", "metacognition"],
    mechanism:
      "A small prediction followed by a visible test helps the child separate expectation from evidence and revise safely.",
    questMove:
      "Have the child make a quick prediction, change one variable, and compare what actually happened.",
    followUpMove: "Ask whether their idea stayed the same, got stronger, or changed after the test.",
    avoid: "Keep the test tiny; do not require supplies, internet searches, or formal experiments.",
  },
  {
    id: "self-explanation",
    name: "Self-explanation",
    domains: ["learning-science", "critical-thinking"],
    evidenceStrength: "strong",
    ageBands: ["8-10", "11-12", "all"],
    sourceKeys: ["selfExplanation2018", "hpl2"],
    questSkills: ["reasoning", "metacognition", "evidence-seeking"],
    mechanism:
      "Explaining one's own reasoning can expose gaps, strengthen transfer, and make thinking visible.",
    questMove:
      "After a choice, sort, design, or guess, ask the child to explain the reason behind it in their own words.",
    followUpMove: "Ask what part of their explanation felt strongest and what part they are less sure about.",
    avoid: "Do not make the child justify themselves defensively; keep it curious and low-stakes.",
  },
  {
    id: "retrieval-revisit",
    name: "Retrieval and revisit",
    domains: ["learning-science"],
    evidenceStrength: "strong",
    ageBands: ["8-10", "11-12", "all"],
    sourceKeys: ["dunlosky2013", "hpl2"],
    questSkills: ["memory", "transfer", "metacognition"],
    mechanism:
      "Brief retrieval and spacing help children reconnect prior observations to a new nearby situation.",
    questMove:
      "Bring back a prior quest theme lightly, then apply it to a different object, place, or family moment.",
    followUpMove: "Ask what felt similar, what felt different, and what they remember noticing last time.",
    avoid: "Avoid quizzes, scores, and recall drills; the revisit should feel like recognition, not a test.",
  },
  {
    id: "uncertainty-calibration",
    name: "Uncertainty calibration",
    domains: ["epistemic-honesty", "critical-thinking"],
    evidenceStrength: "moderate",
    ageBands: ["8-10", "11-12", "all"],
    sourceKeys: ["barzilaiChinn2020", "intellectualHumility"],
    questSkills: ["uncertainty-calibration", "epistemic-honesty", "metacognition"],
    mechanism:
      "Naming confidence and conditions for changing one's mind normalizes honest uncertainty.",
    questMove:
      "Ask the child to make a best guess, say how sure they are in plain language, and name one thing that could change the guess.",
    followUpMove: "Ask what evidence would make them more sure or less sure.",
    avoid: "Do not force numerical confidence or make uncertainty sound like failure.",
  },
  {
    id: "opposing-view",
    name: "Opposing-view curiosity",
    domains: ["epistemic-honesty", "social-perspective"],
    evidenceStrength: "moderate",
    ageBands: ["8-10", "11-12", "all"],
    sourceKeys: ["intellectualHumility", "barzilaiChinn2020"],
    questSkills: ["perspective-taking", "intellectual-humility", "listening"],
    mechanism:
      "Considering a plausible alternative view builds humility without asking the child to abandon their own thinking.",
    questMove:
      "After the child gives an idea, invite one fair alternative that another person might reasonably see.",
    followUpMove: "Ask what both views notice well and what each might be missing.",
    avoid: "Do not frame the exercise as a debate to win.",
  },
  {
    id: "argument-two-reasons",
    name: "Two reasons and a maybe",
    domains: ["critical-thinking", "epistemic-honesty"],
    evidenceStrength: "moderate",
    ageBands: ["8-10", "11-12", "all"],
    sourceKeys: ["abrami2015", "hpl2"],
    questSkills: ["reasoning", "critical-thinking", "argumentation"],
    mechanism:
      "Coordinating reasons, evidence, and possible exceptions gives argumentation a playful structure.",
    questMove:
      "Ask for two reasons supporting an idea and one 'maybe not' case found in the real world.",
    followUpMove: "Ask which reason feels strongest after looking again.",
    avoid: "Do not ask for formal debate language or adult-style persuasion.",
  },
  {
    id: "lateral-source-sense",
    name: "Lateral source sense",
    domains: ["epistemic-honesty", "future-readiness"],
    evidenceStrength: "moderate",
    ageBands: ["11-12"],
    sourceKeys: ["wineburgMcGrew", "barzilaiChinn2020"],
    questSkills: ["source-evaluation", "epistemic-honesty", "critical-thinking"],
    mechanism:
      "Source evaluation improves when children ask who made a claim, why they might know, and what another reliable source would say.",
    questMove:
      "Use a non-screen everyday claim, package, sign, or family statement and ask who would know and how they could check.",
    followUpMove: "Ask what would make the claim more trustworthy.",
    avoid: "Do not send children online or make them evaluate adult misinformation alone.",
  },
  {
    id: "diverge-converge",
    name: "Diverge then converge",
    domains: ["creative-futures", "critical-thinking"],
    evidenceStrength: "moderate",
    ageBands: ["all"],
    sourceKeys: ["oecdCreativity", "chiWylie2014"],
    questSkills: ["creative-thinking", "decision-making", "comparison"],
    mechanism:
      "Generating multiple possibilities before choosing one keeps creativity from collapsing into the first obvious answer.",
    questMove:
      "Ask for three possible uses, explanations, designs, or fixes, then choose one to try or compare.",
    followUpMove: "Ask why they chose that option and what they would change after trying it.",
    avoid: "Do not reward quantity alone; include one small selection or test.",
  },
  {
    id: "tiny-prototype",
    name: "Tiny prototype",
    domains: ["creative-futures", "critical-thinking", "future-readiness"],
    evidenceStrength: "moderate",
    ageBands: ["all"],
    sourceKeys: ["oecdCreativity", "k8Science2007", "lifeWork"],
    questSkills: ["creative-thinking", "hypothesis-testing", "problem-solving"],
    mechanism:
      "Low-stakes making and iteration turn ideas into visible tests, which supports transfer and agency.",
    questMove:
      "Use nearby materials to build, draw, arrange, or change one thing, then observe what improved or failed.",
    followUpMove: "Ask what they would keep, change, or test next.",
    avoid: "Do not require craft supplies, perfection, or a polished final product.",
  },
  {
    id: "systems-ripple",
    name: "Systems ripple",
    domains: ["future-readiness", "critical-thinking"],
    evidenceStrength: "foresight",
    ageBands: ["8-10", "11-12", "all"],
    sourceKeys: ["oecd2030", "unesco2050", "lifeWork"],
    questSkills: ["systems-thinking", "cause-and-effect", "perspective-taking"],
    mechanism:
      "Futures-oriented skills include seeing interdependence, delayed effects, and tradeoffs in ordinary systems.",
    questMove:
      "Pick one tiny change in a family, room, sidewalk, or object system and trace two possible ripples.",
    followUpMove: "Ask who or what is helped, who or what might be bothered, and what they would adjust.",
    avoid: "Do not turn it into abstract global forecasting; keep it local and visible.",
  },
  {
    id: "tradeoff-dilemma",
    name: "Tradeoff dilemma",
    domains: ["future-readiness", "social-perspective", "epistemic-honesty"],
    evidenceStrength: "foresight",
    ageBands: ["8-10", "11-12", "all"],
    sourceKeys: ["oecd2030", "unesco2050", "lifeWork"],
    questSkills: ["decision-making", "perspective-taking", "values-reasoning"],
    mechanism:
      "Reconciling tensions and taking responsibility are future-facing competencies that can be practiced in family-scale choices.",
    questMove:
      "Offer a small real tradeoff with no perfect answer and invite the child to notice what each choice protects.",
    followUpMove: "Ask what they would choose if one person, place, or constraint mattered more.",
    avoid: "Do not moralize or present the adult's values as the only answer.",
  },
  {
    id: "mistake-as-data",
    name: "Mistake as data",
    domains: ["epistemic-honesty", "learning-science"],
    evidenceStrength: "moderate",
    ageBands: ["all"],
    sourceKeys: ["growthMindset2019", "hpl2"],
    questSkills: ["epistemic-honesty", "metacognition", "self-regulation"],
    mechanism:
      "Precise growth-oriented framing works best when it helps children revise strategies in a supportive context.",
    questMove:
      "Invite one low-stakes try, notice what did not work, and treat that miss as information for the next attempt.",
    followUpMove: "Ask what the miss taught them and what strategy they would change next.",
    avoid: "Do not use generic effort praise, fixed labels, or promises that effort always wins.",
  },
  {
    id: "plan-monitor-adjust",
    name: "Plan-monitor-adjust",
    domains: ["executive-function", "learning-science"],
    evidenceStrength: "strong",
    ageBands: ["all"],
    sourceKeys: ["diamondLee2011", "hpl2"],
    questSkills: ["self-regulation", "metacognition", "planning"],
    mechanism:
      "Planning, monitoring, and adjusting a small action exercises executive control without turning it into compliance training.",
    questMove:
      "Have the child make a tiny plan for how to look, listen, build, or compare, then pause once to adjust.",
    followUpMove: "Ask what part of the plan worked and what they changed midstream.",
    avoid: "Do not focus on obedience, behavior correction, or productivity.",
  },
  {
    id: "rule-switch",
    name: "Rule switch",
    domains: ["executive-function", "creative-futures"],
    evidenceStrength: "moderate",
    ageBands: ["5-7", "8-10", "all"],
    sourceKeys: ["diamondLee2011"],
    questSkills: ["cognitive-flexibility", "self-regulation", "creative-thinking"],
    mechanism:
      "Switching rules in a playful task practices flexible attention and inhibition in a concrete way.",
    questMove:
      "Sort, notice, or move using one simple rule, then switch the rule and compare what becomes harder or more interesting.",
    followUpMove: "Ask what changed in their thinking when the rule changed.",
    avoid: "Do not make it competitive or use failure language.",
  },
  {
    id: "learn-by-teaching",
    name: "Learn by teaching",
    domains: ["learning-science", "social-perspective"],
    evidenceStrength: "moderate",
    ageBands: ["8-10", "11-12", "all"],
    sourceKeys: ["hpl2"],
    questSkills: ["communication", "metacognition", "transfer"],
    mechanism:
      "Preparing to teach can help children organize ideas and notice what they understand or still wonder about.",
    questMove:
      "Ask the child to teach the parent one tiny thing they noticed, using an example from the quest.",
    followUpMove: "Ask what was easiest to explain and what still feels tricky.",
    avoid: "Do not make the child perform for praise or correct them publicly.",
  },
  {
    id: "movement-and-attention",
    name: "Movement and attention",
    domains: ["executive-function", "wellbeing-foundation"],
    evidenceStrength: "emerging",
    ageBands: ["5-7", "8-10", "all"],
    sourceKeys: ["physicalActivity2016", "diamondLee2011"],
    questSkills: ["observation", "self-regulation", "attention"],
    mechanism:
      "Light movement can be a useful context for attention and executive-function practice, though effects vary and should not be oversold.",
    questMove:
      "Use a tiny movement pattern, pause, or balance challenge as the setting for noticing, comparing, or rule-switching.",
    followUpMove: "Ask what became easier to notice after moving or pausing.",
    avoid: "Do not make fitness, brain-boosting, medical, or performance claims.",
  },
  {
    id: "possible-futures",
    name: "Possible futures",
    domains: ["future-readiness", "creative-futures"],
    evidenceStrength: "foresight",
    ageBands: ["8-10", "11-12", "all"],
    sourceKeys: ["unesco2050", "oecd2030"],
    questSkills: ["future-thinking", "creative-thinking", "systems-thinking"],
    mechanism:
      "Imagining multiple plausible futures helps children see that the future is shaped, uncertain, and open to responsibility.",
    questMove:
      "Take an ordinary object or family routine and imagine two different futures for it, then one choice people could make today.",
    followUpMove: "Ask which future feels more likely, which feels better, and what evidence would change their view.",
    avoid: "Do not make deterministic predictions about jobs, AI, or society.",
  },
] as const;

function ageBandFor(age: number | null): AgeBand | null {
  if (age === null) return null;
  if (age <= 7) return "5-7";
  if (age <= 10) return "8-10";
  return "11-12";
}

function stableHash(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function evidenceScore(strength: EvidenceStrength): number {
  if (strength === "strong") return 5;
  if (strength === "moderate") return 4;
  if (strength === "emerging") return 2;
  return 1;
}

function supportsAge(technique: ResearchTechnique, band: AgeBand | null): boolean {
  if (technique.ageBands.includes("all")) return true;
  return band !== null && technique.ageBands.includes(band);
}

function familyText(context: FamilyQuestContext): string {
  return [
    context.childName,
    context.interests.join(" "),
    context.learningEvents.map((event) => `${event.summary} ${event.evidence ?? ""}`).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function preferenceBoost(technique: ResearchTechnique, text: string): number {
  let boost = 0;

  if (/\b(build|maker|lego|blocks?|draw|art|craft|design|invent)\b/.test(text)) {
    if (technique.id === "tiny-prototype" || technique.id === "diverge-converge") boost += 3;
  }

  if (/\b(science|experiment|test|why|how|math|numbers?|puzzle)\b/.test(text)) {
    if (technique.id === "predict-test-revise" || technique.id === "evidence-from-noticing") {
      boost += 3;
    }
  }

  if (/\b(shy|quiet|conversation|talk|listen|sibling|friend|feelings?)\b/.test(text)) {
    if (technique.domains.includes("social-perspective")) boost += 2;
  }

  if (/\b(ai|future|robot|technology|climate|world|change)\b/.test(text)) {
    if (technique.domains.includes("future-readiness")) boost += 2;
  }

  return boost;
}

export function selectQuestTechniques(
  context: FamilyQuestContext,
  limit = 3,
): ResearchTechnique[] {
  const band = ageBandFor(context.age);
  const recentSkills = new Set(
    context.recentQuests
      .map((quest) => quest.skill?.toLowerCase())
      .filter((skill): skill is string => Boolean(skill)),
  );
  const text = familyText(context);
  const seed = `${context.childName}|${context.questNumber}|${context.interests.join("|")}`;

  return [...RESEARCH_TECHNIQUES]
    .filter((technique) => supportsAge(technique, band))
    .map((technique) => {
      const repeatedSkillPenalty = technique.questSkills.some((skill) =>
        recentSkills.has(skill.toLowerCase()),
      )
        ? -3
        : 0;
      const firstQuestBoost =
        context.questNumber <= 1 &&
        (technique.id === "serve-and-return-noticing" ||
          technique.id === "evidence-from-noticing" ||
          technique.id === "predict-test-revise")
          ? 2
          : 0;
      const tieBreak = stableHash(`${seed}|${technique.id}`) / 0xffffffff;

      return {
        technique,
        score:
          evidenceScore(technique.evidenceStrength) +
          preferenceBoost(technique, text) +
          firstQuestBoost +
          repeatedSkillPenalty +
          tieBreak,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ technique }) => technique);
}

export function formatTechniqueGuidance(techniques: readonly ResearchTechnique[]): string {
  if (techniques.length === 0) {
    return "No technique lens selected; default to concrete noticing, evidence, and family conversation.";
  }

  return techniques
    .map((technique, index) => {
      return `${index + 1}. ${technique.name} [evidence: ${technique.evidenceStrength}]
   Mechanism: ${technique.mechanism}
   Quest move: ${technique.questMove}
   Follow-up move: ${technique.followUpMove}
   Avoid: ${technique.avoid}
   Skills it can train: ${technique.questSkills.join(", ")}`;
    })
    .join("\n");
}
