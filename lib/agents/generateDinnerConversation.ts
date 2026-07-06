import { openai } from "@/lib/openai";

import {
  COGNITIVE_SKILLS,
  ELSY_SYSTEM_PROMPT,
  formatFamilyLearning,
  formatQuestHistory,
  getAgeGuidance,
} from "./elsy-system";
import { formatTechniqueGuidance, selectQuestTechniques } from "./research-techniques";
import { formatTemporalContext } from "./temporal-context";
import { validateDinnerConversation } from "./dinner-quality";
import {
  formatWorldContextGuidance,
  selectWorldContextCard,
  type SelectedWorldContextCard,
  type WorldContextLevel,
} from "./world-context-cards";
import type { FamilyDinnerContext } from "./build-dinner-context";
import type { FamilyQuestContext } from "./types";

export type GeneratedDinnerConversation = {
  question: string;
  whyThis: string;
  parentMove: string;
  followUp: string;
  skill: string;
  worldContextCard?: {
    id: string;
    title: string;
    sensitivity: SelectedWorldContextCard["sensitivity"];
  };
};

export type DinnerGenerationOptions = {
  worldContextLevel?: WorldContextLevel;
};

function childLine(child: FamilyDinnerContext["children"][number]) {
  const interests = child.interests.length > 0 ? child.interests.join(", ") : "not specified";
  return `${child.name}, age ${child.age ?? "unknown"}, interests: ${interests}`;
}

function formatChildren(context: FamilyDinnerContext): string {
  if (context.children.length === 0) {
    return "No child profiles available.";
  }

  return context.children.map((child, index) => `${index + 1}. ${childLine(child)}`).join("\n");
}

function formatRecentArcs(context: FamilyDinnerContext): string {
  if (context.children.length === 0) {
    return "No child quest history available.";
  }

  return context.children
    .map((child) => {
      return `${child.name}:\n${formatQuestHistory(child.recentQuests)}`;
    })
    .join("\n\n");
}

function formatDinnerHistory(context: FamilyDinnerContext): string {
  if (context.recentDinnerConversations.length === 0) {
    return "No prior dinner questions yet.";
  }

  return context.recentDinnerConversations
    .map((dinner, index) => {
      const skill = dinner.skill ? ` [${dinner.skill}]` : "";
      return `${index + 1}.${skill} ${dinner.question}`;
    })
    .join("\n");
}

function selectDinnerTechniqueGuidance(context: FamilyDinnerContext): string {
  const selected = new Map<string, ReturnType<typeof selectQuestTechniques>[number]>();

  for (const child of context.children) {
    const pseudoQuestContext: FamilyQuestContext = {
      parentName: context.parentName,
      childName: child.name,
      age: child.age,
      interests: child.interests,
      questNumber: child.recentQuests.length + 1,
      recentQuests: child.recentQuests,
      learningEvents: child.learningEvents,
      temporal: context.temporal,
    };

    for (const technique of selectQuestTechniques(pseudoQuestContext, 2)) {
      selected.set(technique.id, technique);
    }
  }

  const dinnerFirst = [...selected.values()].sort((a, b) => {
    const aDinnerScore =
      Number(a.domains.includes("social-perspective")) +
      Number(a.domains.includes("epistemic-honesty")) +
      Number(a.domains.includes("future-readiness"));
    const bDinnerScore =
      Number(b.domains.includes("social-perspective")) +
      Number(b.domains.includes("epistemic-honesty")) +
      Number(b.domains.includes("future-readiness"));

    return bDinnerScore - aDinnerScore;
  });

  return formatTechniqueGuidance(dinnerFirst.slice(0, 3));
}

function buildDinnerPrompt(
  context: FamilyDinnerContext,
  worldContextCard: SelectedWorldContextCard | null,
  revisionNotes?: string[],
): string {
  const revisionBlock =
    revisionNotes && revisionNotes.length > 0
      ? `\nFix these issues in your next draft:\n${revisionNotes.map((note) => `- ${note}`).join("\n")}\n`
      : "";

  const ageGuidance = context.children
    .map((child) => `${child.name}: ${getAgeGuidance(child.age)}`)
    .join("\n");

  return `
Create ONE optional dinner-table conversation prompt for this family.

Parent name: ${context.parentName ?? "unknown"}
Children:
${formatChildren(context)}

${formatTemporalContext(context.temporal)}

Age guidance:
${ageGuidance || "Age unknown - keep it concrete, sensory, and parent-mediated."}

Recent quest arcs - use these to build continuity without repeating a quest:
${formatRecentArcs(context)}

Recent dinner questions - do NOT repeat themes, wording, or skills:
${formatDinnerHistory(context)}

Durable family learning - use this to personalize the question and avoid what did not work:
${formatFamilyLearning(context.familyLearningEvents)}

Evidence-informed method lens - invisible design layer. Choose ONE best-fit lens below. Do not mention research, citations, technique names, "brain training", or future-skills jargon to the parent:
${selectDinnerTechniqueGuidance(context)}

${formatWorldContextGuidance(worldContextCard)}

Dinner conversation bar:
- Make this feel worth asking at dinner. Prefer a small dilemma, choice, tradeoff, perspective clash, family value, changed mind, or "how do we know?" question over passive noticing.
- Anticipation bar: this should sound like a question someone at the table might still be talking about five minutes later. It needs a spark: a real tension, surprising angle, personal story, or safe disagreement.
- The first question should have human stakes: fairness, honesty, trust, courage, kindness, disagreement, responsibility, promises, belonging, evidence, uncertainty, or how people should decide.
- Make it answerable in the first 10 seconds by the youngest listed child. Anchor abstract ideas in lived dinner-scale examples: a turn, last bite, seat, family rule, game they already know, friend situation, school moment, or something from today.
- Do not ask the child to design a whole game, system, society, or decision-making model. Avoid "players", "resource", "keeping it all to themselves", "families make decisions together", and other adult/academic abstractions unless translated into a concrete family example.
- Use the season/time/place only as texture. Do not make the core question about air, light, breeze, clouds, sunset, or generic sensory observation.
- If you use a child's interest, connect it to a real-life judgment or perspective, not trivia about the interest.
- Parent move should help the parent run a better conversation: start with a tiny example, pause, invite a reason, ask for evidence, ask for the opposite view, ask another child to build on it, or ask what would change their mind. Do not repeat the formula "Ask what makes you say that and invite another family member..."
- Avoid bland frames like "What patterns do you notice..." or "Name one thing you hear, see, or feel..." unless paired with a meaningful human decision.
- Avoid adult-seminar energy and generic facilitation. No "share your ideas", "add their ideas", "tricky choices", "players", or "what could happen in the game" phrasing.
- If a world-context lens is present, translate it into a durable family-scale question. Do not mention the news, headlines, parties, politicians, named public figures, violent events, or adult-coded policy debates.
- Strong examples to learn from, not copy:
  - If two people remember the same moment differently, how could we figure out what probably happened without making either person feel small?
  - When is it better to tell the truth even if it makes the next few minutes harder?
  - If our family could test one new rule this week to help everyone feel heard, what rule would you try?
  - If two people wanted the same last bite, turn, or seat tonight, what fair rule would you try first?
  - Think of a game you already know: when does a rule feel fair even if you lose?
  - What is something kids might notice about the world that grown-ups often miss?

Quality bar:
- This is a dinner conversation, not a quest. No mission, task list, reporting ask, homework, worksheet, trivia, screen use, or "look it up."
- question: one table-ready question with no single right answer; it should invite evidence, uncertainty, perspective, tradeoffs, imagination, values, or a changed mind.
- whyThis: one parent-facing sentence, 12–24 words, explaining why this was selected and how it helps the family think else together. No citations, grand claims, or research jargon.
- parentMove: one short facilitation move the parent can use at the table, such as wait, ask what makes you say that, invite another child to add on, ask for the opposite view, or ask what evidence would change their mind.
- followUp: one deeper question for later in the same conversation.
- Works for all listed children; if ages differ, let older children go deeper while younger children can answer concretely.
- Use family learning and interests naturally, never force them.
- Keep it warm, brief, and SMS-ready.
- No medical, therapeutic, diagnostic, mental-health, productivity, IQ, or guaranteed-development claims.
- skill: one primary cognitive skill from this vocabulary: ${COGNITIVE_SKILLS.join(" | ")}
${revisionBlock}
Return valid JSON only:
{
  "question": "one dinner-table question ending with ?",
  "whyThis": "one short parent-facing rationale",
  "parentMove": "one short parent facilitation move",
  "followUp": "one deeper question ending with ?",
  "skill": "${COGNITIVE_SKILLS.join(" | ")}"
}
`;
}

function fallbackQuestionForWorldContext(
  worldContextCard: SelectedWorldContextCard | null,
): string {
  if (!worldContextCard) {
    return "When two people at this table have different good reasons, what is one fair way to choose what to try first?";
  }

  switch (worldContextCard.id) {
    case "ai-human-judgment":
      return "When should a person double-check a tool before trusting its answer at home or school?";
    case "rumors-and-evidence":
      return "If someone told a story at school but nobody saw it happen, what clue would help you check it kindly?";
    case "fair-rules":
      return "Think of one rule from home or a game you already know: when should it bend for someone's needs?";
    case "limited-resources":
      return "If two people wanted the same last bite, turn, or seat tonight, what fair rule would you try first?";
    case "climate-tradeoffs":
      return "When a family choice is easier tonight but less caring for the future, how should we decide what to do?";
    case "public-spaces":
      return "What is one small thing people can do in a shared place so it feels cared for by everyone?";
    case "disagreement-without-contempt":
      return "How can you tell someone is really listening during a disagreement?";
    case "accountability-apologies":
      return "How can you tell whether an apology is helping repair trust, not just using the right words?";
    case "popularity-and-courage":
      return "When is it worth doing the kind thing even if a group might laugh?";
    case "privacy-and-sharing":
      return "When should you ask before sharing something about another person?";
    case "helping-near-and-far":
      return "If two people need help, one nearby and one farther away, how would you decide whom to help first?";
    case "experts-disagree":
      return "If two careful experts disagree, what question would help you decide whom to trust more?";
    default:
      return "When two people at this table have different good reasons, what is one fair way to choose what to try first?";
  }
}

function buildFallbackDinnerConversation(
  worldContextCard: SelectedWorldContextCard | null,
): GeneratedDinnerConversation {
  return {
    question: fallbackQuestionForWorldContext(worldContextCard),
    whyThis:
      "This turns a small shared choice into practice hearing reasons, weighing fairness, and thinking else together.",
    parentMove:
      "Start with a tiny example from today, then ask each person for one reason.",
    followUp:
      "What would make the decision feel fair even if someone did not get their first choice?",
    skill: "perspective-taking",
    worldContextCard: worldContextCard
      ? {
          id: worldContextCard.id,
          title: worldContextCard.title,
          sensitivity: worldContextCard.sensitivity,
        }
      : undefined,
  };
}

async function requestDinnerConversation(
  context: FamilyDinnerContext,
  worldContextCard: SelectedWorldContextCard | null,
  revisionNotes?: string[],
): Promise<GeneratedDinnerConversation> {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: ELSY_SYSTEM_PROMPT },
      { role: "user", content: buildDinnerPrompt(context, worldContextCard, revisionNotes) },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No dinner conversation generated.");
  }

  return JSON.parse(content) as GeneratedDinnerConversation;
}

function attachWorldContextCard(
  dinner: GeneratedDinnerConversation,
  worldContextCard: SelectedWorldContextCard | null,
): GeneratedDinnerConversation {
  if (!worldContextCard) return dinner;
  return {
    ...dinner,
    worldContextCard: {
      id: worldContextCard.id,
      title: worldContextCard.title,
      sensitivity: worldContextCard.sensitivity,
    },
  };
}

export async function generateDinnerConversation(
  context: FamilyDinnerContext,
  options: DinnerGenerationOptions = {},
): Promise<GeneratedDinnerConversation> {
  const worldContextCard = selectWorldContextCard(
    context,
    options.worldContextLevel,
  );
  let dinner = await requestDinnerConversation(context, worldContextCard);
  let issues = validateDinnerConversation(dinner, worldContextCard, context);

  if (issues.length > 0) {
    dinner = await requestDinnerConversation(context, worldContextCard, issues);
    issues = validateDinnerConversation(dinner, worldContextCard, context);
    if (issues.length > 0) {
      console.warn("Dinner conversation quality issues after retry:", issues);
      return buildFallbackDinnerConversation(worldContextCard);
    }
  }

  return attachWorldContextCard(dinner, worldContextCard);
}
