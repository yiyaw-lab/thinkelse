import { normalizePreferredTimeInput, timezonePrompt } from "@/lib/timezone";

const YES_RESPONSES = new Set(["yes", "y", "yeah", "yep", "sure", "ok", "okay"]);
const NO_RESPONSES = new Set(["no", "n", "nope", "not now"]);
const MAX_NAME_LENGTH = 40;
const MIN_CHILD_AGE = 5;
const MAX_CHILD_AGE = 12;
const MAX_INTERESTS = 6;
const MAX_INTEREST_LENGTH = 40;
const MAX_INTERESTS_BODY_LENGTH = 240;

function cleanSmsInput(body: string): string {
  return body.replace(/[\u0000-\u001f\u007f]/g, " ").trim().replace(/\s+/g, " ");
}

function isReasonableName(value: string): boolean {
  return value.length >= 1 && value.length <= MAX_NAME_LENGTH && !/https?:\/\//i.test(value);
}

export type OnboardingValidation =
  | { ok: true; value: string | number | string[] }
  | { ok: false; reply: string };

export function validateOnboardingInput(
  step: string | null,
  body: string,
): OnboardingValidation {
  const cleaned = cleanSmsInput(body);

  if (step === "parent_name" || step === "child_name") {
    if (!isReasonableName(cleaned)) {
      return {
        ok: false,
        reply: "Please reply with a first name or short nickname, up to 40 characters.",
      };
    }

    return { ok: true, value: cleaned };
  }

  if (step === "child_age") {
    if (!/^\d{1,2}$/.test(cleaned)) {
      return {
        ok: false,
        reply: `Please reply with your child's age as a number from ${MIN_CHILD_AGE} to ${MAX_CHILD_AGE}.`,
      };
    }

    const age = Number.parseInt(cleaned, 10);
    if (age < MIN_CHILD_AGE || age > MAX_CHILD_AGE) {
      return {
        ok: false,
        reply: `Else is designed for ages ${MIN_CHILD_AGE}-${MAX_CHILD_AGE}. Please reply with an age in that range.`,
      };
    }

    return { ok: true, value: age };
  }

  if (step === "child_interests") {
    if (cleaned.length > MAX_INTERESTS_BODY_LENGTH) {
      return {
        ok: false,
        reply: `Please send up to ${MAX_INTERESTS} short interests separated by commas.`,
      };
    }

    const interests = cleaned
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean)
      .slice(0, MAX_INTERESTS);

    if (
      interests.length === 0 ||
      interests.some(
        (interest) =>
          interest.length > MAX_INTEREST_LENGTH || /https?:\/\//i.test(interest),
      )
    ) {
      return {
        ok: false,
        reply: `Please send up to ${MAX_INTERESTS} short interests separated by commas.`,
      };
    }

    return { ok: true, value: interests };
  }

  if (step === "preferred_time") {
    const preferredTime = normalizePreferredTimeInput(cleaned);

    if (!preferredTime) {
      return {
        ok: false,
        reply: "Please reply with a daily quest time on the hour or half-hour, like 8am, 8:30am, 6pm, or 6:30pm.",
      };
    }

    return { ok: true, value: preferredTime };
  }

  return { ok: true, value: cleaned };
}

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
        nextStep: "dinner_conversation",
        reply: `Would you also like optional dinner questions for richer family conversations? Reply YES or NO.`,
      };

    case "dinner_conversation":
      return {
        nextStep: "complete",
        reply: `You're all set. Elsy will send tiny curiosity quests you can try together. Ask, notice, wonder. Think Else.`,
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

export function parseDinnerConversationOptIn(body: string): boolean | null {
  const normalized = body.trim().toLowerCase().replace(/\s+/g, " ");

  if (YES_RESPONSES.has(normalized)) {
    return true;
  }

  if (NO_RESPONSES.has(normalized)) {
    return false;
  }

  return null;
}

export function invalidDinnerConversationReply(): string {
  return `Please reply YES or NO for optional dinner questions.`;
}
