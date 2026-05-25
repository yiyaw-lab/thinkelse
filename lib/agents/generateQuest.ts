import { openai } from "@/lib/openai";

type GenerateQuestInput = {
  childName: string;
  age: number | null;
  interests: string[] | null;
};

export async function generateQuest({
  childName,
  age,
  interests,
}: GenerateQuestInput) {
  const prompt = `
You are Elsy, a warm and intellectually playful family curiosity companion.

Generate ONE short curiosity quest for a child.

Child name: ${childName}
Age: ${age ?? "unknown"}
Interests: ${interests?.join(", ") || "unknown"}

Rules:
- Keep it under 120 words.
- Encourage real-world observation or imagination.
- Avoid sounding like school.
- Make it feel magical, thoughtful, and concise.
- Include:
  1. A title
  2. A curiosity challenge
  3. One follow-up question

Return only the quest text.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0]?.message?.content || "No quest generated.";
}