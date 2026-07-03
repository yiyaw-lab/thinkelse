import {
  completeDinnerConversationSetup,
  pauseDinnerConversation,
  restartFamilySettingsOnboarding,
  startDinnerConversationSetup,
  updateFamily,
} from "@/lib/db/families";
import { dinnerConversationTimePrompt } from "@/lib/onboarding";
import {
  getHelpMessage,
  getAlreadySubscribedMessage,
  getSettingsRestartMessage,
  getStartConfirmation,
  getStopConfirmation,
  isAddChildKeyword,
  isDinnerOffKeyword,
  isDinnerSetupKeyword,
  isHelloKeyword,
  isHelpKeyword,
  isSettingsKeyword,
  isStartKeyword,
  isStopKeyword,
  normalizeSmsBody,
} from "@/lib/sms/keywords";
import { normalizePreferredTimeInput } from "@/lib/timezone";

type FamilyRow = {
  id: string;
  sms_opted_in?: boolean | null;
  onboarding_step?: string | null;
};

export type KeywordResult =
  | { handled: true; reply: string; stopProcessing: true }
  | { handled: true; reply: string; stopProcessing: false }
  | { handled: false };

function dinnerTimeFromKeyword(body: string): string | null {
  const normalized = normalizeSmsBody(body)
    .replace(/^please\s+/, "")
    .replace(/^dinner(?:\s+(?:questions?|conversations?|convo))?\s*/, "")
    .replace(/^(?:set up|setup|start|enable|turn on)\s+dinner(?:\s+questions?)?\s*/, "")
    .replace(/^turn\s+dinner\s+on\s*/, "")
    .replace(/^(?:at|on|around|for)\s+/, "")
    .replace(/\s+please$/, "")
    .trim();

  if (!normalized) {
    return null;
  }

  return normalizePreferredTimeInput(normalized);
}

export async function handleSmsKeyword(
  body: string,
  family: FamilyRow | null,
): Promise<KeywordResult> {
  const normalizedBody = normalizeSmsBody(body);

  if (isStopKeyword(body)) {
    if (family) {
      await updateFamily(family.id, { sms_opted_in: false });
    }

    return {
      handled: true,
      reply: getStopConfirmation(),
      stopProcessing: true,
    };
  }

  if (isHelpKeyword(body)) {
    return {
      handled: true,
      reply: getHelpMessage(),
      stopProcessing: true,
    };
  }

  if (isStartKeyword(body)) {
    if (!family) {
      return { handled: false };
    }

    if (family.sms_opted_in === false) {
      await updateFamily(family.id, { sms_opted_in: true });
      return {
        handled: true,
        reply: getStartConfirmation(),
        stopProcessing: true,
      };
    }

    if (normalizedBody === "yes" && family.onboarding_step !== "complete") {
      return { handled: false };
    }

    return {
      handled: true,
      reply: getAlreadySubscribedMessage(),
      stopProcessing: true,
    };
  }

  if (isHelloKeyword(body) && family?.sms_opted_in === false) {
    await updateFamily(family.id, { sms_opted_in: true });
    return {
      handled: true,
      reply: getStartConfirmation(),
      stopProcessing: true,
    };
  }

  if (isHelloKeyword(body) && family && family.onboarding_step === "complete") {
    return {
      handled: true,
      reply: getAlreadySubscribedMessage(),
      stopProcessing: true,
    };
  }

  if (family?.sms_opted_in === false) {
    return {
      handled: true,
      reply: `You're unsubscribed from Else SMS. Reply START to rejoin, or HELP for support.`,
      stopProcessing: true,
    };
  }

  if (isDinnerOffKeyword(body)) {
    if (!family) {
      return { handled: false };
    }

    if (family.onboarding_step !== "complete") {
      return {
        handled: true,
        reply:
          "You're still setting up Else. Reply to the current setup question, or reply HELP for support.",
        stopProcessing: true,
      };
    }

    await pauseDinnerConversation(family.id);
    return {
      handled: true,
      reply:
        "Dinner questions are paused. Daily curiosity quests will keep coming. Reply DINNER anytime to set dinner questions back up.",
      stopProcessing: true,
    };
  }

  if (isDinnerSetupKeyword(body)) {
    if (!family) {
      return { handled: false };
    }

    if (family.onboarding_step !== "complete") {
      return {
        handled: true,
        reply:
          "You're still setting up Else. Reply to the current setup question first, then reply DINNER to add dinner questions.",
        stopProcessing: true,
      };
    }

    const dinnerTime = dinnerTimeFromKeyword(body);
    if (dinnerTime) {
      await completeDinnerConversationSetup(family.id, dinnerTime);
      return {
        handled: true,
        reply: `Done. I'll send one dinner-table question around ${dinnerTime}. Reply DINNER OFF anytime to pause it.`,
        stopProcessing: true,
      };
    }

    await startDinnerConversationSetup(family.id);
    return {
      handled: true,
      reply: dinnerConversationTimePrompt(),
      stopProcessing: true,
    };
  }

  if (isAddChildKeyword(body)) {
    if (!family) {
      return { handled: false };
    }

    if (family.onboarding_step !== "complete") {
      return {
        handled: true,
        reply:
          "You're still setting up Else. Finish this child first, then reply ADD CHILD to add another.",
        stopProcessing: true,
      };
    }

    await updateFamily(family.id, { onboarding_step: "additional_child_name" });
    return {
      handled: true,
      reply: "Let's add another child. What is their first name or nickname?",
      stopProcessing: true,
    };
  }

  if (isSettingsKeyword(body)) {
    if (!family) {
      return { handled: false };
    }

    if (family.onboarding_step !== "complete") {
      return {
        handled: true,
        reply:
          "You're still setting up Else. Reply to the current setup question, or reply HELP for support.",
        stopProcessing: true,
      };
    }

    await restartFamilySettingsOnboarding(family.id);
    return {
      handled: true,
      reply: getSettingsRestartMessage(),
      stopProcessing: true,
    };
  }

  return { handled: false };
}
