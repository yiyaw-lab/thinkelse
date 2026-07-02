export const ELSY_SYSTEM_PROMPT = `You are Elsy, the voice of Else — a family curiosity companion by SMS.

Mission: help parents raise thoughtful children in the AI age through real-world wonder, better questions, and warm conversation — never worksheets, trivia drills, or screen time.

Method: playful inquiry the parent can mediate in real life. Create tiny back-and-forth moments: notice what the child attends to, name a detail, wait for their turn, then ask one question that helps them use evidence, imagine alternatives, or reflect on how their thinking changed.

Learning principles:
- Ask open questions with no single right answer; prefer "What do you notice?", "What makes you say that?", "What else could we try?", and "Did your idea change?"
- Keep quests concrete, sensory, and doable with household or nearby-world materials
- Treat curiosity as a family conversation, not a performance by the child
- Encourage creative tinkering and metacognition without using jargon
- Avoid medical, therapeutic, diagnostic, or mental-health claims

Voice:
- Warm, concise, intellectually playful — never academic, preachy, or generic
- Magical enough for children; intelligent enough for parents
- React to specifics; never filler praise ("Great job!", "Amazing!")
- SMS-length: every word earns its place

Never:
- Sound like school, homework, or a quiz with one right answer
- Moralize or lecture parents
- Give the child answers; ask better questions
- Mention AI, chatbots, or being an assistant
- Promise developmental, health, therapeutic, or emotional outcomes
- Use streaks, points, or gamification language`;

export const COGNITIVE_SKILLS = [
  "observation",
  "comparison",
  "questioning",
  "pattern-finding",
  "perspective-taking",
  "listening",
  "conversation",
  "hypothesis-testing",
  "evidence-seeking",
  "source-evaluation",
  "uncertainty-calibration",
  "epistemic-honesty",
  "intellectual-humility",
  "assumption-spotting",
  "critical-thinking",
  "reasoning",
  "argumentation",
  "systems-thinking",
  "cause-and-effect",
  "decision-making",
  "values-reasoning",
  "self-regulation",
  "cognitive-flexibility",
  "planning",
  "attention",
  "memory",
  "transfer",
  "problem-solving",
  "future-thinking",
  "communication",
  "kindness-in-action",
  "metacognition",
  "creative-thinking",
] as const;

export type CognitiveSkill = (typeof COGNITIVE_SKILLS)[number];

export function getAgeGuidance(age: number | null): string {
  if (age === null) {
    return "Age unknown — keep language concrete, sensory, playful, and parent-mediated for roughly ages 5–10.";
  }
  if (age <= 7) {
    return "Ages 5–7: sensory, playful, one clear action. Short sentences. Let the parent wonder aloud, name what the child notices, and wait; don't test or over-explain.";
  }
  if (age <= 10) {
    return "Ages 8–10: invite patterns, comparisons, and evidence. Tie to something they can spot today and ask what makes them think that.";
  }
  return "Ages 11–12: hypotheses, perspectives, gentle challenge, and reflection. Invite testing an idea, considering another view, or revising with evidence.";
}

export function formatQuestHistory(
  recentQuests: Array<{
    title: string | null;
    prompt: string;
    skill: string | null;
    response: string | null;
    elsyReply?: string | null;
  }>,
): string {
  if (recentQuests.length === 0) {
    return "No prior quests — make a memorable first impression. Easy win, high wonder.";
  }

  return recentQuests
    .map((quest, index) => {
      const label = quest.title ?? quest.prompt.slice(0, 60);
      const skill = quest.skill ? ` [${quest.skill}]` : "";
      const childNote = quest.response
        ? ` — child shared: "${quest.response.slice(0, 120)}"`
        : "";
      const elsyNote = quest.elsyReply
        ? ` — Elsy replied: "${quest.elsyReply.slice(0, 100)}"`
        : "";
      return `${index + 1}.${skill} ${label}${childNote}${elsyNote}`;
    })
    .join("\n");
}

export function formatFamilyLearning(
  learningEvents: Array<{
    kind: string;
    summary: string;
    evidence?: string | null;
    confidence?: number | null;
  }>,
): string {
  if (learningEvents.length === 0) {
    return "No durable family learning yet.";
  }

  return learningEvents
    .map((event, index) => {
      const evidence = event.evidence ? ` Evidence: "${event.evidence.slice(0, 100)}"` : "";
      const confidence =
        typeof event.confidence === "number" ? ` Confidence: ${event.confidence}.` : "";
      return `${index + 1}. [${event.kind}] ${event.summary}${evidence}${confidence}`;
    })
    .join("\n");
}

export function suggestNextSkills(
  recentQuests: Array<{ skill: string | null }>,
): string {
  const used = new Set(
    recentQuests
      .map((q) => q.skill?.toLowerCase())
      .filter((skill): skill is string => Boolean(skill)),
  );

  const fresh = COGNITIVE_SKILLS.filter((skill) => !used.has(skill));
  const pool = fresh.length > 0 ? fresh : [...COGNITIVE_SKILLS];
  return pool.slice(0, 4).join(", ");
}
