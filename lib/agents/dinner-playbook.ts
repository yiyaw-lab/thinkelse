import type { FamilyDinnerContext } from "./build-dinner-context";
import type { SelectedWorldContextCard } from "./world-context-cards";

export type DinnerPlaybookFrameId =
  | "table-fairness"
  | "memory-truth"
  | "trust-the-claim"
  | "listening-disagreement"
  | "kind-courage"
  | "future-ripple";

export type DinnerPlaybookFrame = {
  id: DinnerPlaybookFrameId;
  title: string;
  skill: string;
  bestSignals: readonly RegExp[];
  repeatPattern: RegExp;
  worldContextIds: readonly string[];
  questionMove: string;
  tableAnchors: readonly string[];
  parentMove: string;
  followUpMove: string;
  fallbackQuestion: string;
  fallbackFollowUp: string;
  avoid: string;
};

export const DINNER_PLAYBOOK_FRAMES: readonly DinnerPlaybookFrame[] = [
  {
    id: "table-fairness",
    title: "Table Fairness",
    skill: "values-reasoning",
    bestSignals: [
      /\b(fair|rule|share|turn|seat|last bite|game|soccer|team|sibling)\b/,
      /\b(choice|choose|tradeoff|helps|harder|lose|win|first choice)\b/,
    ],
    repeatPattern: /\b(last bite|same turn|turn|seat|family rule|fair rule)\b/i,
    worldContextIds: ["fair-rules", "limited-resources"],
    questionMove:
      "Ask about one concrete shared thing at the table or from today where two reasonable people might want different outcomes.",
    tableAnchors: ["last bite", "same turn", "favorite seat", "family rule", "game they already know"],
    parentMove:
      "Ask each person for one reason, then ask who the rule helps and who it makes wait.",
    followUpMove:
      "Change one constraint and ask whether the fair rule should change too.",
    fallbackQuestion:
      "If two people wanted the same last bite, turn, or seat tonight, what fair rule would you try first?",
    fallbackFollowUp:
      "What would make the rule feel fair even if someone did not get their first choice?",
    avoid:
      "Do not ask the child to design a game, manage abstract resources, or solve fairness for everyone.",
  },
  {
    id: "memory-truth",
    title: "Kind Truth-Seeking",
    skill: "epistemic-honesty",
    bestSignals: [
      /\b(memory|remember|truth|true|happened|mistake|wrong|evidence|clue)\b/,
      /\b(change your mind|check kindly|probably happened|sure|less sure)\b/,
    ],
    repeatPattern: /\b(remember|same moment|probably happened|change your mind|evidence)\b/i,
    worldContextIds: ["rumors-and-evidence", "experts-disagree"],
    questionMove:
      "Ask how the family could seek what probably happened while protecting dignity.",
    tableAnchors: ["same moment remembered differently", "school story", "mistake", "uncertain memory"],
    parentMove:
      "Start with a harmless example and ask what clue would help without making anyone feel small.",
    followUpMove:
      "Ask what evidence would change someone's mind kindly.",
    fallbackQuestion:
      "If two people remember the same moment differently, how could we check kindly what probably happened?",
    fallbackFollowUp: "What would make you change your mind without feeling embarrassed?",
    avoid:
      "Do not turn truth-seeking into blame, interrogation, or a right-answer quiz.",
  },
  {
    id: "trust-the-claim",
    title: "Trust the Claim",
    skill: "source-evaluation",
    bestSignals: [
      /\b(claim|trust|source|story|rumor|heard|saw|news|article|video|ad|package|sign)\b/,
      /\b(who would know|who made|reliable|believe|double-check|tool)\b/,
    ],
    repeatPattern: /\b(claim|trust|source|rumor|who would know|double-check)\b/i,
    worldContextIds: ["ai-human-judgment", "rumors-and-evidence", "experts-disagree"],
    questionMove:
      "Use a non-screen everyday claim and ask who would know, why, and what would make it trustworthy.",
    tableAnchors: ["a package claim", "a school story", "a tool answer", "a sign", "something someone heard"],
    parentMove:
      "Ask who would know best, then ask what clue would make the claim stronger or weaker.",
    followUpMove:
      "Ask when it is kind or responsible to double-check before repeating something.",
    fallbackQuestion:
      "If someone told a story at school but nobody saw it happen, what clue would help you check it kindly?",
    fallbackFollowUp:
      "When should you double-check before repeating something someone told you?",
    avoid:
      "Do not send children online or make the conversation about adult misinformation.",
  },
  {
    id: "listening-disagreement",
    title: "Listening in Disagreement",
    skill: "listening",
    bestSignals: [
      /\b(listen|disagree|different view|opposite view|argument|talk|conversation)\b/,
      /\b(friend|sibling|family member|heard|understand|really listening)\b/,
    ],
    repeatPattern: /\b(disagree|really listening|opposite view|different view)\b/i,
    worldContextIds: ["disagreement-without-contempt", "privacy-and-sharing"],
    questionMove:
      "Ask what real listening looks like when two people disagree but still care about each other.",
    tableAnchors: ["friend disagreement", "sibling disagreement", "different dinner opinions", "team choice"],
    parentMove:
      "Have one person repeat the strongest part of another view before adding their own reason.",
    followUpMove:
      "Ask what someone might be missing if they only defend their own side.",
    fallbackQuestion:
      "How can you tell someone is really listening during a disagreement?",
    fallbackFollowUp:
      "What is one fair thing the other person might notice that you could miss?",
    avoid:
      "Do not stage a debate to win or force a child to disclose a real conflict.",
  },
  {
    id: "kind-courage",
    title: "Kind Courage",
    skill: "kindness-in-action",
    bestSignals: [
      /\b(kind|kindness|brave|courage|laugh|popular|group|help|stand up)\b/,
      /\b(apology|apologize|repair|trust|promise|privacy|sharing)\b/,
    ],
    repeatPattern: /\b(kind|brave|courage|apology|repair|promise|privacy)\b/i,
    worldContextIds: ["accountability-apologies", "popularity-and-courage", "privacy-and-sharing"],
    questionMove:
      "Ask about a small social moment where doing the kind thing has a real cost.",
    tableAnchors: ["group laugh", "left-out classmate", "apology", "promise", "sharing someone's story"],
    parentMove:
      "Ask what makes the choice hard, then ask what a caring person could do first.",
    followUpMove:
      "Ask how to repair trust if the first try does not work.",
    fallbackQuestion:
      "When is it worth doing the kind thing even if a group might laugh?",
    fallbackFollowUp:
      "What is the smallest first move someone could try without making things worse?",
    avoid:
      "Do not make the child confess, perform virtue, or relive a painful situation.",
  },
  {
    id: "future-ripple",
    title: "Future Ripple",
    skill: "systems-thinking",
    bestSignals: [
      /\b(future|later|tomorrow|world|community|climate|technology|ai|robot)\b/,
      /\b(ripple|consequence|responsible|care|easier tonight|harder later|shared place)\b/,
    ],
    repeatPattern: /\b(future|ripple|community|shared place|easier tonight|harder later)\b/i,
    worldContextIds: ["climate-tradeoffs", "public-spaces", "helping-near-and-far"],
    questionMove:
      "Translate a big future issue into one local family-scale choice with a visible ripple.",
    tableAnchors: ["shared place", "family habit", "helping nearby or far away", "easy now versus better later"],
    parentMove:
      "Ask who is helped now, who might be affected later, and what small adjustment would be more caring.",
    followUpMove:
      "Ask what evidence would show the choice worked better for more people.",
    fallbackQuestion:
      "When a family choice is easier tonight but less caring for the future, how should we decide what to do?",
    fallbackFollowUp:
      "Who is helped now, who might be affected later, and what would you adjust?",
    avoid:
      "Do not ask children to solve global problems or predict jobs, politics, or disasters.",
  },
] as const;

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function normalize(parts: readonly string[]): string {
  return parts.join(" ").toLowerCase();
}

function familyText(context: FamilyDinnerContext): string {
  return normalize([
    context.parentName ?? "",
    context.children
      .map((child) =>
        [
          child.name,
          child.age?.toString() ?? "",
          child.interests.join(" "),
          child.learningEvents
            .map((event) => `${event.summary} ${event.evidence ?? ""}`)
            .join(" "),
          child.recentQuests
            .map((quest) => `${quest.title ?? ""} ${quest.skill ?? ""} ${quest.response ?? ""}`)
            .join(" "),
        ].join(" "),
      )
      .join(" "),
    context.familyLearningEvents
      .map((event) => `${event.summary} ${event.evidence ?? ""}`)
      .join(" "),
  ]);
}

function recentDinnerText(context: FamilyDinnerContext): string {
  return normalize(
    context.recentDinnerConversations.map((dinner) =>
      [dinner.question, dinner.parent_move, dinner.follow_up, dinner.skill ?? ""].join(" "),
    ),
  );
}

function signalBoost(frame: DinnerPlaybookFrame, text: string): number {
  return frame.bestSignals.reduce((score, pattern) => score + (pattern.test(text) ? 4 : 0), 0);
}

function worldContextBoost(
  frame: DinnerPlaybookFrame,
  worldContextCard: SelectedWorldContextCard | null,
): number {
  if (!worldContextCard) return 0;
  return frame.worldContextIds.includes(worldContextCard.id) ? 8 : -1;
}

function youngestAge(context: FamilyDinnerContext): number | null {
  const ages = context.children
    .map((child) => child.age)
    .filter((age): age is number => typeof age === "number");
  return ages.length > 0 ? Math.min(...ages) : null;
}

function ageFit(frame: DinnerPlaybookFrame, context: FamilyDinnerContext): number {
  const youngest = youngestAge(context);
  if (youngest === null) return 0;
  if (youngest <= 7 && frame.id === "trust-the-claim") return -2;
  if (youngest <= 7 && frame.id === "future-ripple") return -1;
  return 0;
}

export function selectDinnerPlaybookFrame(
  context: FamilyDinnerContext,
  worldContextCard: SelectedWorldContextCard | null = null,
): DinnerPlaybookFrame {
  const profile = familyText(context);
  const recent = recentDinnerText(context);
  const seed = `${context.parentName ?? ""}|${context.children
    .map((child) => `${child.name}:${child.age ?? "unknown"}`)
    .join("|")}|${context.recentDinnerConversations.length}`;

  const scored = DINNER_PLAYBOOK_FRAMES.map((frame) => {
    const repeatPenalty = frame.repeatPattern.test(recent) ? -12 : 0;
    const tieBreak = stableHash(`${seed}|${frame.id}`) / 0xffffffff;

    return {
      frame,
      score:
        5 +
        signalBoost(frame, profile) +
        worldContextBoost(frame, worldContextCard) +
        ageFit(frame, context) +
        repeatPenalty +
        tieBreak,
    };
  }).sort((a, b) => b.score - a.score);

  return scored[0].frame;
}

export function formatDinnerPlaybookGuidance(
  context: FamilyDinnerContext,
  worldContextCard: SelectedWorldContextCard | null = null,
): string {
  const frame = selectDinnerPlaybookFrame(context, worldContextCard);
  const youngest = youngestAge(context);
  const ageLine =
    youngest === null
      ? "Make the first answer concrete enough for a roughly 5-10-year-old."
      : `Make the first answer concrete enough for the youngest child, age ${youngest}.`;

  return `Dinner playbook - pre-shape the conversation before writing.
Selected frame: ${frame.title}
Question move: ${frame.questionMove}
Table anchors: ${frame.tableAnchors.join(", ")}
Parent move seed: ${frame.parentMove}
Follow-up seed: ${frame.followUpMove}
Primary skill: ${frame.skill}
Youngest-child test: ${ageLine}
Avoid: ${frame.avoid}
Do not expose this playbook label in the SMS. The final question should sound like a parent naturally asking one good question at dinner.`;
}
