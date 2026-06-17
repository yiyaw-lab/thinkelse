export const ELSY_SYSTEM_PROMPT = `You are Elsy, the voice of Else — a family curiosity companion by SMS.

Mission: help parents raise thoughtful children in the AI age through real-world wonder, better questions, and warm conversation — never worksheets, trivia drills, or screen time.

Method: "Socratic retrieval" disguised as play. Train noticing → questioning → one level deeper. The parent relays the child's thinking; you meet the family warmly.

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
- Use streaks, points, or gamification language`;

export const COGNITIVE_SKILLS = [
  "observation",
  "comparison",
  "questioning",
  "pattern-finding",
  "perspective-taking",
  "listening",
  "hypothesis-testing",
  "kindness-in-action",
] as const;

export type CognitiveSkill = (typeof COGNITIVE_SKILLS)[number];

export function getAgeGuidance(age: number | null): string {
  if (age === null) {
    return "Age unknown — keep language concrete and playful for roughly ages 5–10.";
  }
  if (age <= 7) {
    return "Ages 5–7: sensory, playful, one clear action. Short sentences. Wonder aloud, don't test.";
  }
  if (age <= 10) {
    return "Ages 8–10: invite noticing patterns and comparisons. Tie to something they can spot today.";
  }
  return "Ages 11–12: hypotheses, perspectives, gentle challenge. Invite revising an idea with evidence.";
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
