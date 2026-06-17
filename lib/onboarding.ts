import { timezonePrompt } from "@/lib/timezone";

export function getOnboardingReply(step: string | null, body: string) {
  switch (step) {
    case "parent_name":
      return {
        nextStep: "child_name",
        reply: `Lovely to meet you, ${body}. What is your child's name?`,
      };

    case "child_name":
      return {
        nextStep: "child_age",
        reply: `Beautiful. How old is ${body}?`,
      };

    case "child_age":
      return {
        nextStep: "child_interests",
        reply: `Got it. What are 3 things your child is curious about or loves right now?`,
      };

    case "child_interests":
      return {
        nextStep: "preferred_time",
        reply: `Perfect. What time should Elsy send your daily curiosity quest? Example: 8am or 6:30pm.`,
      };

    case "preferred_time":
      return {
        nextStep: "timezone",
        reply: timezonePrompt(),
      };

    case "timezone":
      return {
        nextStep: "complete",
        reply: `You're all set. Elsy will start sending tiny curiosity quests to help your child think beyond the obvious. Think Else.`,
      };

    default:
      return {
        nextStep: "parent_name",
        reply: `Welcome to Else. I'm Elsy, your family curiosity companion. What should I call you?`,
      };
  }
}

export function invalidTimezoneReply(): string {
  return `I didn't catch that timezone. Reply 1 for Pacific, 2 for Mountain, 3 for Central, 4 for Eastern, 5 for Alaska, or 6 for Hawaii.`;
}
