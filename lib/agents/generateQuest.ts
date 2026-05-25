import { openai } from "@/lib/openai";

export type GeneratedQuest = {
  title: string;
  prompt: string;
  mission: string;
  followUp: string;
  skill: string;
};

type GenerateQuestInput = {
  childName: string;
  age: number | null;
  interests: string[] | null;
};

export async function generateQuest({
  childName,
  age,
  interests,
}: GenerateQuestInput): Promise<GeneratedQuest> {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You are Elsy, a warm, concise, intellectually playful family curiosity companion. You help parents raise thoughtful children in the AI age.",
      },
      {
        role: "user",
        content: `
Generate ONE short curiosity quest for a child.

Child name: ${childName}
Age: ${age ?? "unknown"}
Interests: ${interests?.join(", ") || "unknown"}

Rules:
- Encourage real-world observation or imagination.
- Avoid sounding like school.
- Make it magical, thoughtful, and concise.
- Use age-appropriate language.
- Return valid JSON only.

JSON shape:
{
  "title": "short title",
  "prompt": "one-sentence curiosity prompt",
  "mission": "small real-world activity",
  "followUp": "one follow-up question",
  "skill": "main cognitive skill trained"
}
`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No quest generated.");
  }

  return JSON.parse(content) as GeneratedQuest;
}