import { openai } from "@/lib/openai";

type InterpretResponseInput = {
  childName: string;
  age: number | null;
  questPrompt: string;
  questFollowUp: string;
  childResponse: string;
};

export type InterpretedResponse = {
  encouragement: string;
  followUp: string;
};

export async function interpretResponse({
  childName,
  age,
  questPrompt,
  questFollowUp,
  childResponse,
}: InterpretResponseInput): Promise<InterpretedResponse> {
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
A child just answered a curiosity quest. Respond with warm encouragement and one follow-up question to deepen their thinking.

Child name: ${childName}
Age: ${age ?? "unknown"}

The quest prompt they received:
"${questPrompt}"

The follow-up they were asked to think about:
"${questFollowUp}"

The child's response (as shared by the parent):
"${childResponse}"

Rules:
- Keep the tone warm, curious, and playful — never academic.
- The encouragement should feel genuine, not generic. React to what they actually said.
- The follow-up question should push their thinking one step further.
- Be concise. This is an SMS reply.
- Return valid JSON only.

JSON shape:
{
  "encouragement": "2-3 sentences reacting to the child's response",
  "followUp": "one follow-up question"
}
`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No interpretation generated.");
  }

  return JSON.parse(content) as InterpretedResponse;
}
