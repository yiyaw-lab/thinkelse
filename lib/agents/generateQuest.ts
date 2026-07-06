import { openai } from "@/lib/openai";

import {
  COGNITIVE_SKILLS,
  ELSY_SYSTEM_PROMPT,
  formatFamilyLearning,
  formatQuestHistory,
  getAgeGuidance,
  suggestNextSkills,
} from "./elsy-system";
import { formatTechniqueGuidance, selectQuestTechniques } from "./research-techniques";
import { formatTemporalContext } from "./temporal-context";
import { validateQuest } from "./quest-quality";
import { formatQuestVarietyGuidance } from "./quest-variety";
import type { FamilyQuestContext } from "./types";

export type GeneratedQuest = {
  title: string;
  whyThis: string;
  prompt: string;
  mission: string;
  followUp: string;
  skill: string;
};

function buildQuestPrompt(context: FamilyQuestContext, revisionNotes?: string[]) {
  const interests =
    context.interests.length > 0 ? context.interests.join(", ") : "not specified yet";
  const parentLine = context.parentName
    ? `Parent name: ${context.parentName} (warmly acknowledge when natural — SMS is to the parent)`
    : "Parent name: unknown";
  const isFirstQuest = context.questNumber <= 1 || context.recentQuests.length === 0;
  const techniqueGuidance = formatTechniqueGuidance(selectQuestTechniques(context));
  const varietyGuidance = formatQuestVarietyGuidance(context);
  const launchGuidance = isFirstQuest
    ? `
First quest launch moment:
- This is the family's first real taste of Elsy. Make it feel like a tiny invitation into wonder, not a sample lesson.
- Aim for a "we can do this right now" win: one household or nearby-world object, one sensory action, one memorable noticing.
- Give the parent an easy line they can read aloud; no setup, supplies, app, research, or perfect timing.
- Delight comes from specificity (spoon reflection, backpack zipper, window sound, cereal pattern), not extra words.
- Avoid big nature scavenger hunts, chores, lectures, or anything that feels like school.
`
    : "";

  const revisionBlock =
    revisionNotes && revisionNotes.length > 0
      ? `\nFix these issues in your next draft:\n${revisionNotes.map((note) => `- ${note}`).join("\n")}\n`
      : "";

  return `
Create ONE daily curiosity quest for this specific child.

${parentLine}
Child name: ${context.childName}
Age: ${context.age ?? "unknown"}
Interests: ${interests}
This is quest #${context.questNumber} for this child.

${formatTemporalContext(context.temporal)}
Use these time/place hints as optional texture only. Never let them override recent quest history or family feedback.

${getAgeGuidance(context.age)}

Recent quests — do NOT repeat themes, settings, or skills; build forward if a prior response invites it:
${formatQuestHistory(context.recentQuests)}

Durable family learning — use this to personalize future quests, honor preferences, repeat what worked, and avoid what did not:
${formatFamilyLearning(context.learningEvents)}

Evidence-informed method lens — invisible design layer. Choose ONE best-fit lens below and make the quest feel natural. Do not mention research, citations, technique names, "brain training", or future-skills jargon to the parent:
${techniqueGuidance}

${varietyGuidance}

Prefer a fresh cognitive skill from: ${suggestNextSkills(context.recentQuests)}

${launchGuidance}

Quality bar:
- audience: parent reads the SMS and shares with ${context.childName} — never write as if the child is texting Elsy
- anticipation: the parent should think "I want to try this today." Give the quest a small hook, tension, or promised payoff: a surprising answer, a clue to test, a fair rule to invent, a tiny redesign, a changed mind, or a choice with tradeoffs.
- whyThis: one parent-facing sentence, 12–24 words, explaining why this was selected for this child/family and how it helps them think else together. No citations, grand claims, or research jargon.
- prompt: one vivid ask-aloud curiosity question ${context.childName} can hold all day (you may use their name); concrete enough to picture; no single right answer
- mission: 2–10 min real-world action parent + child can do without prep; one clear action beats a list; include a tiny parent facilitation move when natural (notice together, name a detail, wait, compare, or try one change)
- followUp: one Socratic question for later — invite evidence, perspective, creative alternatives, or "did your idea change?"
- title: 2–4 words, poetic but clear (e.g. "Fair Referee", "Trust the Clue", "Tiny Redesign")
- skill: one primary cognitive skill trained today from this vocabulary: ${COGNITIVE_SKILLS.join(" | ")}
- weave in an interest when it fits naturally — never forced
- if a recent child response is listed, optionally nod to their curiosity arc
- if durable family learning lists preferences or avoidances, follow them unless they conflict with safety or the core real-world quest format
- favor family conversation starters like "What makes you say that?", "What else could be true?", "How could we test it?", or "What would you change?"
- concrete > abstract; kitchen, sidewalk, backpack, table, shared object, game, or family routine > generic "nature"
- For quest #2 and beyond, do not default to front-step/window-light/shadow/shape/color/pattern noticing. If recent quests used those surfaces, choose a different kind of thinking today: fairness, trust, evidence, redesign, perspective, tradeoff, or a tiny test.
- A morning quest can still be concrete without being bland: make the action about a choice, claim, rule, design, tradeoff, or perspective when recent quests were mostly sensory observation.
- Avoid ignorable SMS energy: no "look around and notice something", "fun little activity", generic scavenger hunt, vague exploration, or preschool-craft tone unless the family profile clearly calls for it.
- dullness check: reject anything that could appear in a worksheet, generic activity book, or chatbot demo
- safety/copy: no medical, therapeutic, diagnostic, or guaranteed-development language
${revisionBlock}
Return valid JSON only:
{
  "title": "short title",
  "whyThis": "one short parent-facing rationale",
  "prompt": "one curiosity question",
  "mission": "small real-world activity",
  "followUp": "one follow-up question ending with ?",
  "skill": "${COGNITIVE_SKILLS.join(" | ")}"
}
`;
}

async function requestQuest(
  context: FamilyQuestContext,
  revisionNotes?: string[],
): Promise<GeneratedQuest> {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.9,
    messages: [
      { role: "system", content: ELSY_SYSTEM_PROMPT },
      { role: "user", content: buildQuestPrompt(context, revisionNotes) },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No quest generated.");
  }

  return JSON.parse(content) as GeneratedQuest;
}

function buildFallbackQuest(context: FamilyQuestContext): GeneratedQuest {
  const childName = context.childName;
  const profile = [
    context.interests.join(" "),
    context.learningEvents.map((event) => `${event.summary} ${event.evidence ?? ""}`).join(" "),
    context.recentQuests.map((quest) => `${quest.title ?? ""} ${quest.prompt} ${quest.mission}`).join(" "),
  ]
    .join(" ")
    .toLowerCase();

  const fallbackPool: GeneratedQuest[] = [
    {
      title: "Trust the Clue",
      whyThis:
        `This gives ${childName} a tiny evidence habit you can practice together before deciding what to trust.`,
      prompt: `${childName}, when someone makes a guess, what kind of clue would help you decide whether to trust it?`,
      mission:
        "Make one tiny prediction about a door, cup, backpack, or toy and check one clue to see if your idea gets stronger.",
      followUp: "What else could be true if your first idea is wrong?",
      skill: "evidence-seeking",
    },
    {
      title: "Fair Referee",
      whyThis:
        `This turns fairness into something ${childName} can test with you, not just talk about abstractly.`,
      prompt: `${childName}, when two people both want the same thing, what would make the rule fair?`,
      mission:
        "Pick one shared object today and invent two possible turn-taking rules. Ask who each rule helps most.",
      followUp: "What would make you change the rule after trying it?",
      skill: "values-reasoning",
    },
    {
      title: "Tiny Redesign",
      whyThis:
        `This helps ${childName} see everyday design choices and imagine how small changes affect people.`,
      prompt: `${childName}, what is one small thing at home that could work better for someone else?`,
      mission:
        "Choose one everyday object or routine and imagine one tiny change. Say who it helps and what tradeoff it creates.",
      followUp: "What would you test before changing it for real?",
      skill: "systems-thinking",
    },
  ];

  if (/draw|build|invent|design|robot|make|create/.test(profile)) {
    return fallbackPool[2];
  }
  if (/fair|rule|game|soccer|team|share|sibling/.test(profile)) {
    return fallbackPool[1];
  }
  return fallbackPool[context.questNumber % fallbackPool.length];
}

export async function generateQuest(context: FamilyQuestContext): Promise<GeneratedQuest> {
  let quest = await requestQuest(context);
  let issues = validateQuest(quest, context);

  if (issues.length > 0) {
    quest = await requestQuest(context, issues);
    issues = validateQuest(quest, context);
    if (issues.length > 0) {
      console.warn("Quest quality issues after retry:", issues);
      return buildFallbackQuest(context);
    }
  }

  return quest;
}
