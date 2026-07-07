import type { FamilyDinnerContext } from "./build-dinner-context";

export type WorldContextAgeBand = "5-7" | "8-10" | "11-12";
export type WorldContextLevel = "none" | "light" | "deeper";
export type WorldContextIssueFamily =
  | "automation-and-judgment"
  | "truth-and-trust"
  | "fairness-and-rules"
  | "shared-resources"
  | "future-stewardship"
  | "community-care"
  | "disagreement-and-belonging"
  | "accountability-and-repair"
  | "privacy-and-sharing"
  | "helping-and-responsibility";

export type WorldContextCard = {
  id: string;
  title: string;
  issue: string;
  issueFamily: WorldContextIssueFamily;
  ageBands: readonly WorldContextAgeBand[];
  sensitivity: "light" | "medium";
  skills: readonly string[];
  tags: readonly string[];
  focusTerms: readonly string[];
  childFriendlyFrame: string;
  tableScaleTranslations: readonly string[];
  dinnerQuestionSeeds: readonly string[];
  parentMoveSeeds: readonly string[];
  avoid: readonly string[];
  reviewedAt: string;
};

export type SelectedWorldContextCard = Pick<
  WorldContextCard,
  | "id"
  | "title"
  | "issue"
  | "issueFamily"
  | "sensitivity"
  | "skills"
  | "tags"
  | "focusTerms"
  | "childFriendlyFrame"
  | "tableScaleTranslations"
  | "dinnerQuestionSeeds"
  | "parentMoveSeeds"
  | "avoid"
  | "reviewedAt"
>;

export const WORLD_CONTEXT_CARDS: readonly WorldContextCard[] = [
  {
    id: "ai-human-judgment",
    title: "AI and Human Judgment",
    issue:
      "People increasingly use automated tools to help make choices, but families still need to ask when a human should slow down and judge carefully.",
    issueFamily: "automation-and-judgment",
    ageBands: ["8-10", "11-12"],
    sensitivity: "light",
    skills: ["source-evaluation", "critical-thinking", "decision-making"],
    tags: ["technology", "ai", "fairness", "judgment"],
    focusTerms: ["tool", "machine", "robot", "human", "person", "trust", "judgment"],
    childFriendlyFrame:
      "A tool can be helpful and still miss something important about a person or situation.",
    tableScaleTranslations: [
      "A calculator, map, robot toy, or school tool gives an answer that a person should still double-check.",
      "A rule or tool is efficient, but someone at the table notices a person-specific exception.",
    ],
    dinnerQuestionSeeds: [
      "When should a person double-check a tool before trusting its answer?",
      "What can a person notice that a machine or rule might miss?",
    ],
    parentMoveSeeds: [
      "Ask for one example where a tool helps, then one where a person should decide.",
      "Ask what evidence would make them trust or doubt the tool.",
    ],
    avoid: [
      "Do not mention specific AI companies, job loss, surveillance, or scary future predictions.",
      "Do not imply technology is simply good or bad.",
    ],
    reviewedAt: "2026-07-03",
  },
  {
    id: "rumors-and-evidence",
    title: "Rumors and Evidence",
    issue:
      "Fast-spreading claims can feel true before anyone has checked what actually happened.",
    issueFamily: "truth-and-trust",
    ageBands: ["5-7", "8-10", "11-12"],
    sensitivity: "light",
    skills: ["evidence-seeking", "source-evaluation", "epistemic-honesty"],
    tags: ["rumors", "evidence", "trust", "school"],
    focusTerms: ["story", "true", "check", "evidence", "clue", "rumor"],
    childFriendlyFrame:
      "A story can be interesting before we know whether it is true.",
    tableScaleTranslations: [
      "A school story or family memory sounds believable, but nobody at the table has checked the clue yet.",
      "Someone repeats something they heard, then pauses to ask what would make it fair to believe.",
    ],
    dinnerQuestionSeeds: [
      "If everyone repeated a story but no one saw it happen, what would be a fair way to check it?",
      "What clues help you decide whether a story probably happened?",
    ],
    parentMoveSeeds: [
      "Ask what they know, what they guessed, and what would count as evidence.",
      "Invite someone to name a kind way to slow down a rumor.",
    ],
    avoid: [
      "Do not reference real rumors about a child or school community.",
      "Do not ask the child to investigate other people.",
    ],
    reviewedAt: "2026-07-03",
  },
  {
    id: "fair-rules",
    title: "Fair Rules",
    issue:
      "Rules can help people feel safe and included, but one rule can affect different people differently.",
    issueFamily: "fairness-and-rules",
    ageBands: ["5-7", "8-10", "11-12"],
    sensitivity: "light",
    skills: ["values-reasoning", "perspective-taking", "decision-making"],
    tags: ["fairness", "rules", "games", "school", "family"],
    focusTerms: ["rule", "fair", "same", "everyone", "needs"],
    childFriendlyFrame:
      "A rule can be simple and still not feel fair to everyone.",
    tableScaleTranslations: [
      "A turn, seat, game rule, or family routine works for most people but not everyone tonight.",
      "Two children want a rule to be equal, but one person has a different need.",
    ],
    dinnerQuestionSeeds: [
      "What makes a family or game rule feel fair even when someone does not get their first choice?",
      "When should a rule be the same for everyone, and when should it change for someone's needs?",
    ],
    parentMoveSeeds: [
      "Ask each person to name who the rule helps and who it might make things harder for.",
      "Ask what would make the rule fairer without making it confusing.",
    ],
    avoid: [
      "Do not turn this into discipline advice or a debate about a current family conflict.",
    ],
    reviewedAt: "2026-07-03",
  },
  {
    id: "limited-resources",
    title: "Limited Resources",
    issue:
      "Families, classrooms, and communities often decide how to share limited time, attention, space, or materials.",
    issueFamily: "shared-resources",
    ageBands: ["5-7", "8-10", "11-12"],
    sensitivity: "light",
    skills: ["systems-thinking", "values-reasoning", "decision-making"],
    tags: ["scarcity", "sharing", "community", "fairness"],
    focusTerms: ["share", "enough", "first", "needs", "fair"],
    childFriendlyFrame:
      "Sometimes there is not enough of something for everyone to get exactly what they want.",
    tableScaleTranslations: [
      "There is one last bite, turn, seat, charger, or parent attention window and more than one person wants it.",
      "A family has to choose whether first-ask, greatest-need, waiting-longest, or taking-turns is fairest.",
    ],
    dinnerQuestionSeeds: [
      "If there was not enough of something everyone wanted, what would be a fair way to share it?",
      "Should the person who asks first, needs it most, or waited longest get first choice?",
    ],
    parentMoveSeeds: [
      "Ask for two fair-sounding rules, then compare who each rule helps.",
      "Ask what tradeoff they would be willing to accept.",
    ],
    avoid: [
      "Do not mention poverty, disaster, or food insecurity unless the parent has opted into deeper topics.",
    ],
    reviewedAt: "2026-07-03",
  },
  {
    id: "climate-tradeoffs",
    title: "Climate and Everyday Tradeoffs",
    issue:
      "People make choices that balance convenience, cost, care for nature, and care for other people.",
    issueFamily: "future-stewardship",
    ageBands: ["8-10", "11-12"],
    sensitivity: "medium",
    skills: ["systems-thinking", "future-thinking", "values-reasoning"],
    tags: ["climate", "environment", "tradeoffs", "future"],
    focusTerms: ["planet", "future", "nature", "convenience", "care"],
    childFriendlyFrame:
      "Caring for the future often means choosing between more than one good thing.",
    tableScaleTranslations: [
      "A family choice is easier tonight but less caring for a shared place or future person.",
      "A convenient habit helps now, while a slightly harder habit may protect something people care about later.",
    ],
    dinnerQuestionSeeds: [
      "When a choice is easier for us but harder on the planet, how should a family decide what to do?",
      "What is one small family choice where convenience and care pull in different directions?",
    ],
    parentMoveSeeds: [
      "Ask for one benefit, one cost, and one person or place affected later.",
      "Ask what would make a greener choice easier for everyone.",
    ],
    avoid: [
      "Do not use doom, guilt, disaster imagery, or claims that a child is responsible for climate outcomes.",
    ],
    reviewedAt: "2026-07-03",
  },
  {
    id: "public-spaces",
    title: "Public Spaces",
    issue:
      "Shared spaces work only when people balance freedom, responsibility, and care for strangers.",
    issueFamily: "community-care",
    ageBands: ["5-7", "8-10", "11-12"],
    sensitivity: "light",
    skills: ["kindness-in-action", "systems-thinking", "values-reasoning"],
    tags: ["community", "public-spaces", "responsibility", "kindness"],
    focusTerms: ["shared", "belongs", "everyone", "place", "responsibility"],
    childFriendlyFrame:
      "A shared place belongs to everyone, including people we will never meet.",
    tableScaleTranslations: [
      "A table, classroom, park, sidewalk, or shared game space feels different when people leave it better.",
      "Someone can do what they want in a shared place, but that choice changes what others inherit next.",
    ],
    dinnerQuestionSeeds: [
      "How should people act in a place that belongs to everyone?",
      "What is one small thing that makes a shared place feel cared for?",
    ],
    parentMoveSeeds: [
      "Ask who uses the place and what each person might need.",
      "Invite one example of freedom and one example of responsibility.",
    ],
    avoid: [
      "Do not mention crime, homelessness, policing, or unsafe places.",
    ],
    reviewedAt: "2026-07-03",
  },
  {
    id: "disagreement-without-contempt",
    title: "Disagreement Without Contempt",
    issue:
      "People can disagree strongly and still listen well enough to understand the other person's reasons.",
    issueFamily: "disagreement-and-belonging",
    ageBands: ["8-10", "11-12"],
    sensitivity: "light",
    skills: ["perspective-taking", "intellectual-humility", "communication"],
    tags: ["disagreement", "listening", "respect", "family"],
    focusTerms: ["disagree", "listening", "respect", "heard", "reasons"],
    childFriendlyFrame:
      "A disagreement can be serious without turning someone into the bad guy.",
    tableScaleTranslations: [
      "Two people at dinner prefer different things and each has one good reason.",
      "A friend or sibling disagreement becomes easier to handle when someone repeats the other person's strongest point.",
    ],
    dinnerQuestionSeeds: [
      "How can you tell whether someone is really listening during a disagreement?",
      "What is one sentence that helps a disagreement stay respectful?",
    ],
    parentMoveSeeds: [
      "Ask each person to restate the other side before answering.",
      "Ask what would make them feel heard even if minds do not change.",
    ],
    avoid: [
      "Do not reference partisan conflict, culture-war labels, or real family disputes.",
    ],
    reviewedAt: "2026-07-03",
  },
  {
    id: "accountability-apologies",
    title: "Accountability and Apologies",
    issue:
      "A real apology includes truth, repair, and changed behavior, not just the right words.",
    issueFamily: "accountability-and-repair",
    ageBands: ["5-7", "8-10", "11-12"],
    sensitivity: "light",
    skills: ["epistemic-honesty", "kindness-in-action", "self-regulation"],
    tags: ["apology", "accountability", "repair", "honesty"],
    focusTerms: ["apology", "sorry", "repair", "trust", "honest"],
    childFriendlyFrame:
      "Saying sorry matters more when it helps repair what happened.",
    tableScaleTranslations: [
      "A pretend apology at the table has the right words but does not yet repair trust.",
      "Someone makes a small mistake and has to choose between hiding it, naming it, or repairing it.",
    ],
    dinnerQuestionSeeds: [
      "How can you tell whether an apology is real?",
      "What should someone do after saying sorry so the other person can trust them again?",
    ],
    parentMoveSeeds: [
      "Ask for the difference between words, repair, and doing better next time.",
      "Invite a pretend example, not a real family accusation.",
    ],
    avoid: [
      "Do not make any child confess, relive a conflict, or perform an apology.",
    ],
    reviewedAt: "2026-07-03",
  },
  {
    id: "popularity-and-courage",
    title: "Popularity and Courage",
    issue:
      "Doing the kind or honest thing can be harder when a group is watching.",
    issueFamily: "disagreement-and-belonging",
    ageBands: ["8-10", "11-12"],
    sensitivity: "light",
    skills: ["values-reasoning", "kindness-in-action", "perspective-taking"],
    tags: ["peer-pressure", "courage", "kindness", "school"],
    focusTerms: ["kind", "brave", "group", "laugh", "popular"],
    childFriendlyFrame:
      "Sometimes the right thing is harder when it might make you less popular.",
    tableScaleTranslations: [
      "A group laughs, and one person has to decide whether to join in, stay quiet, or make a kind move.",
      "A child sees a small unfairness and wonders what brave could look like without making things worse.",
    ],
    dinnerQuestionSeeds: [
      "When is it worth doing the kind thing even if other people might laugh?",
      "What makes someone brave in a group?",
    ],
    parentMoveSeeds: [
      "Ask for one easy version and one brave version of the same choice.",
      "Ask what support would make the brave choice easier.",
    ],
    avoid: [
      "Do not ask children to disclose bullying, exclusion, or private peer conflicts.",
    ],
    reviewedAt: "2026-07-03",
  },
  {
    id: "privacy-and-sharing",
    title: "Privacy and Sharing",
    issue:
      "People share photos, stories, and information quickly, but not everything that can be shared should be shared.",
    issueFamily: "privacy-and-sharing",
    ageBands: ["8-10", "11-12"],
    sensitivity: "light",
    skills: ["decision-making", "source-evaluation", "perspective-taking"],
    tags: ["privacy", "technology", "trust", "respect"],
    focusTerms: ["share", "ask", "private", "trust", "person"],
    childFriendlyFrame:
      "Sharing something about another person can affect their trust.",
    tableScaleTranslations: [
      "A funny story, photo, drawing, or mistake is easy to share, but it belongs partly to someone else.",
      "Someone wants to tell a story at dinner and pauses to ask whether it is theirs to share.",
    ],
    dinnerQuestionSeeds: [
      "When should you ask before sharing something about another person?",
      "How can you tell whether something is yours to share?",
    ],
    parentMoveSeeds: [
      "Ask who could be affected now and later.",
      "Ask what a respectful pause would sound like.",
    ],
    avoid: [
      "Do not mention sexting, predators, surveillance, or platform-specific harms.",
    ],
    reviewedAt: "2026-07-03",
  },
  {
    id: "helping-near-and-far",
    title: "Helping Near and Far",
    issue:
      "People often choose between helping someone nearby and caring about people they may never meet.",
    issueFamily: "helping-and-responsibility",
    ageBands: ["8-10", "11-12"],
    sensitivity: "medium",
    skills: ["values-reasoning", "systems-thinking", "kindness-in-action"],
    tags: ["helping", "community", "responsibility", "world"],
    focusTerms: ["help", "nearby", "farther", "first", "needs"],
    childFriendlyFrame:
      "Caring can be local, global, immediate, or long-term.",
    tableScaleTranslations: [
      "A family can help someone nearby right now or save effort for someone farther away who also matters.",
      "A child has one helping move to spend and has to choose between what is visible and what may matter more.",
    ],
    dinnerQuestionSeeds: [
      "How should a person decide whom to help first when many people need help?",
      "Is helping nearby more important, easier, or just more visible?",
    ],
    parentMoveSeeds: [
      "Ask for one reason to help close by and one reason to help farther away.",
      "Ask what kind of help the child would actually be able to give.",
    ],
    avoid: [
      "Do not mention war, disasters, graphic suffering, or pressure a child to solve adult problems.",
    ],
    reviewedAt: "2026-07-03",
  },
  {
    id: "experts-disagree",
    title: "When Experts Disagree",
    issue:
      "Experts can disagree because evidence is incomplete, values differ, or a problem has tradeoffs.",
    issueFamily: "truth-and-trust",
    ageBands: ["11-12"],
    sensitivity: "light",
    skills: ["source-evaluation", "uncertainty-calibration", "intellectual-humility"],
    tags: ["experts", "evidence", "uncertainty", "trust"],
    focusTerms: ["expert", "disagree", "trust", "evidence", "unsure"],
    childFriendlyFrame:
      "Disagreement between careful people can be a sign that a question is hard.",
    tableScaleTranslations: [
      "Two careful people at the table disagree because they are using different clues.",
      "A family has to decide what to do when both sides have reasons and nobody is fully sure yet.",
    ],
    dinnerQuestionSeeds: [
      "If two careful experts disagree, what questions would help you decide whom to trust more?",
      "What is the difference between guessing and being honestly unsure?",
    ],
    parentMoveSeeds: [
      "Ask what evidence each expert might be using.",
      "Ask what would make someone update their view.",
    ],
    avoid: [
      "Do not name live medical, political, or legal disputes.",
    ],
    reviewedAt: "2026-07-03",
  },
];

export function getDinnerWorldContextLevel(): WorldContextLevel {
  const raw = process.env.DINNER_WORLD_CONTEXT_ENABLED?.trim().toLowerCase();
  if (raw === "deeper" || raw === "medium") return "deeper";
  if (raw === "1" || raw === "true" || raw === "light") return "light";
  return "none";
}

function ageBandFor(age: number | null): WorldContextAgeBand | null {
  if (age === null) return null;
  if (age <= 7) return "5-7";
  if (age <= 10) return "8-10";
  return "11-12";
}

function familyAgeBands(context: FamilyDinnerContext): Set<WorldContextAgeBand> {
  const bands = new Set<WorldContextAgeBand>();
  for (const child of context.children) {
    const band = ageBandFor(child.age);
    if (band) bands.add(band);
  }
  if (bands.size === 0) {
    bands.add("5-7");
    bands.add("8-10");
  }
  return bands;
}

function contextText(context: FamilyDinnerContext): string {
  const childText = context.children
    .flatMap((child) => [
      child.name,
      ...child.interests,
      ...child.recentQuests.flatMap((quest) => [
        quest.title ?? "",
        quest.prompt,
        quest.mission,
        quest.response ?? "",
      ]),
      ...child.learningEvents.flatMap((event) => [
        event.kind,
        event.summary,
        event.evidence ?? "",
      ]),
    ])
    .join(" ");

  const familyLearning = context.familyLearningEvents
    .flatMap((event) => [event.kind, event.summary, event.evidence ?? ""])
    .join(" ");

  return `${childText} ${familyLearning}`.toLowerCase();
}

function recentDinnerText(context: FamilyDinnerContext): string {
  return context.recentDinnerConversations
    .flatMap((dinner) => [
      dinner.question,
      dinner.parent_move,
      dinner.follow_up,
      dinner.skill ?? "",
    ])
    .join(" ")
    .toLowerCase();
}

function countTerms(text: string, terms: readonly string[]): number {
  return terms.filter((term) => text.includes(term.toLowerCase())).length;
}

function scoreCard(
  card: WorldContextCard,
  context: FamilyDinnerContext,
  level: Exclude<WorldContextLevel, "none">,
): number {
  if (level === "light" && card.sensitivity !== "light") {
    return Number.NEGATIVE_INFINITY;
  }

  const ageBands = familyAgeBands(context);
  if (!card.ageBands.some((band) => ageBands.has(band))) {
    return Number.NEGATIVE_INFINITY;
  }

  const profile = contextText(context);
  const recent = recentDinnerText(context);

  if (
    recent.includes(card.id) ||
    recent.includes(card.title.toLowerCase()) ||
    countTerms(recent, card.focusTerms) >= 2
  ) {
    return Number.NEGATIVE_INFINITY;
  }

  if (/\b(no news|avoid news|too political|politics|no politics|scary news)\b/.test(profile)) {
    return Number.NEGATIVE_INFINITY;
  }

  let score = 0;
  for (const tag of card.tags) {
    if (profile.includes(tag.toLowerCase())) score += 4;
  }
  for (const skill of card.skills) {
    if (profile.includes(skill.toLowerCase())) score += 2;
  }
  if (card.ageBands.some((band) => ageBands.has(band))) score += 2;
  if (card.sensitivity === "light") score += 1;

  return score;
}

export function selectWorldContextCard(
  context: FamilyDinnerContext,
  level: WorldContextLevel = getDinnerWorldContextLevel(),
): SelectedWorldContextCard | null {
  if (level === "none") return null;

  const scored = WORLD_CONTEXT_CARDS.map((card) => ({
    card,
    score: scoreCard(card, context, level),
  }))
    .filter((entry) => Number.isFinite(entry.score))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.card.id.localeCompare(b.card.id);
    });

  const selected = scored[0]?.card;
  if (!selected) return null;

  return {
    id: selected.id,
    title: selected.title,
    issue: selected.issue,
    issueFamily: selected.issueFamily,
    sensitivity: selected.sensitivity,
    skills: selected.skills,
    tags: selected.tags,
    focusTerms: selected.focusTerms,
    childFriendlyFrame: selected.childFriendlyFrame,
    tableScaleTranslations: selected.tableScaleTranslations,
    dinnerQuestionSeeds: selected.dinnerQuestionSeeds,
    parentMoveSeeds: selected.parentMoveSeeds,
    avoid: selected.avoid,
    reviewedAt: selected.reviewedAt,
  };
}

export function formatWorldContextGuidance(
  card: SelectedWorldContextCard | null,
): string {
  if (!card) {
    return "World-context lens: disabled for this generation.";
  }

  return `World-context lens - optional inspiration only. Do not mention headlines, politicians, parties, graphic events, or ask the child to know the news.
Card: ${card.title}
Issue family: ${card.issueFamily}
Reviewed: ${card.reviewedAt}
Underlying issue: ${card.issue}
Child-friendly frame: ${card.childFriendlyFrame}
Skills: ${card.skills.join(", ")}
The dinner question or follow-up must clearly reflect at least one of these focus terms without sounding like a news summary: ${card.focusTerms.join(", ")}
Translate broad issues into a concrete table-scale example the youngest child can answer immediately. Use examples like a turn, last bite, seat, family rule, school moment, friend situation, or a game they already know.
Table-scale translations to adapt, not copy:
${card.tableScaleTranslations.map((translation) => `- ${translation}`).join("\n")}
Do not ask the child to design a whole game, society, system, or policy. Avoid abstract words like "resource", "players", and "decision-making model" when a concrete example can carry the idea.
Question seeds to adapt, not copy:
${card.dinnerQuestionSeeds.map((seed) => `- ${seed}`).join("\n")}
Parent move seeds to adapt, not copy:
${card.parentMoveSeeds.map((seed) => `- ${seed}`).join("\n")}
Avoid:
${card.avoid.map((item) => `- ${item}`).join("\n")}`;
}
