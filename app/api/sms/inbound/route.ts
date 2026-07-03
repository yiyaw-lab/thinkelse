import { waitUntil } from "@vercel/functions";
import { NextResponse } from "next/server";

import { generateQuest } from "@/lib/agents/generateQuest";
import { interpretResponse } from "@/lib/agents/interpretResponse";
import { learnFromQuestReply } from "@/lib/agents/learnFromReply";
import {
  buildInterpretContext,
  buildQuestContext,
  buildQuestReplyLearningContext,
} from "@/lib/agents/build-family-context";
import {
  dinnerConversationTimePrompt,
  getOnboardingReply,
  invalidDinnerConversationReply,
  invalidTimezoneReply,
  parseDinnerConversationOptIn,
  validateOnboardingInput,
} from "@/lib/onboarding";
import {
  completeDinnerConversationSetup,
  createFamily,
  findFamilyByPhone,
  updateFamily,
} from "@/lib/db/families";
import {
  createChild,
  getChildrenForFamily,
  getLatestChildForFamily,
  updateChild,
} from "@/lib/db/children";
import {
  createQuest,
  getAwaitingQuestsForChildren,
  getLatestQuestForChild,
  getLatestQuestForChildren,
  hasQuestOnLocalDay,
  saveElsyReply,
  updateQuestResponse,
} from "@/lib/db/quests";
import { saveFamilyLearningEvents } from "@/lib/db/family-learning";
import { reviewStatusForFamily } from "@/lib/quests/review-policy";
import { handleSmsKeyword } from "@/lib/sms/handle-keyword";
import { sendSms } from "@/lib/telnyx/sendSms";
import {
  formatInterpretationMessage,
  formatQuestMessage,
} from "@/lib/sms/format-quest";
import {
  isLikelySmsQuestion,
  isQuestRequestKeyword,
  normalizeSmsBody,
} from "@/lib/sms/keywords";
import {
  checkAndRecordAction,
  checkInboundRateLimit,
  checkOutboundRateLimit,
  isLikelyE164Phone,
  MAX_INBOUND_SMS_CHARS,
  MAX_TELNYX_WEBHOOK_BYTES,
  recordInboundAccepted,
  recordOutboundSent,
} from "@/lib/sms/guardrails";
import { logSmsGuardrailEvent } from "@/lib/db/sms-guardrails";
import {
  shouldVerifyTelnyxWebhook,
  verifyTelnyxWebhookSignature,
} from "@/lib/telnyx/verifyWebhook";
import {
  DEFAULT_TIMEZONE,
  formatLocalDateKey,
  parseTimezoneInput,
} from "@/lib/timezone";

type TelnyxInboundWebhook = {
  data?: {
    event_type?: string;
    payload?: {
      from?: { phone_number?: string };
      text?: string;
    };
  };
};

type FamilyRow = NonNullable<Awaited<ReturnType<typeof findFamilyByPhone>>>;
type ChildRow = Awaited<ReturnType<typeof getChildrenForFamily>>[number];
type QuestRow = Awaited<ReturnType<typeof getAwaitingQuestsForChildren>>[number];

function childNameList(children: ChildRow[]) {
  return children.map((child) => child.name).join(", ");
}

function normalizeChildName(name: string) {
  return normalizeSmsBody(name).replace(/[^\p{L}\p{N} ]/gu, "");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findNamedChild(children: ChildRow[], body: string) {
  const normalizedBody = normalizeSmsBody(body);

  return (
    children.find((child) => {
      const childName = normalizeChildName(child.name);
      if (!childName) return false;

      return new RegExp(`\\b${escapeRegExp(childName)}\\b`, "i").test(
        normalizedBody,
      );
    }) ?? null
  );
}

function splitChildPrefixedReply(children: ChildRow[], body: string) {
  const trimmed = body.trim();

  for (const child of children) {
    const pattern = new RegExp(
      `^\\s*${escapeRegExp(child.name)}\\s*(?::|-|,|—)\\s*(.+)$`,
      "iu",
    );
    const match = trimmed.match(pattern);
    const replyText = match?.[1]?.trim();

    if (replyText) {
      return { child, replyText };
    }
  }

  return null;
}

function childForQuest(quest: { child_id: string }, children: ChildRow[]) {
  return children.find((child) => child.id === quest.child_id) ?? null;
}

async function createOnDemandQuestMessage(
  family: FamilyRow,
  requestBody: string,
): Promise<string> {
  const children = await getChildrenForFamily(family.id);

  if (children.length === 0) {
    return "You're all set, but I need a child profile before I can make a quest. Reply ADD CHILD to add one.";
  }

  const namedChild = findNamedChild(children, requestBody);

  if (!namedChild && children.length > 1 && /\bfor\b/i.test(requestBody)) {
    return `I don't have a child by that name yet. Children I have: ${childNameList(children)}. Reply ADD CHILD to add another profile, or QUEST FOR one of those names.`;
  }

  const candidateChildren = namedChild ? [namedChild] : children;
  const timezone =
    typeof family.timezone === "string" && family.timezone
      ? family.timezone
      : DEFAULT_TIMEZONE;
  const localDateKey = formatLocalDateKey(timezone, new Date());
  let child: ChildRow | null = null;

  for (const candidate of candidateChildren) {
    const alreadySentToday = await hasQuestOnLocalDay(
      candidate.id,
      localDateKey,
      timezone,
    );

    if (!alreadySentToday) {
      child = candidate;
      break;
    }
  }

  if (!child) {
    await logSmsGuardrailEvent({
      phone: family.phone,
      familyId: family.id,
      eventType: "quest_request",
      status: "blocked",
      reason: "quest_already_sent_today",
    });

    if (namedChild) {
      return `Elsy has already sent today's quest for ${namedChild.name}. Try it together, then reply "${namedChild.name}: ..." with what they noticed.`;
    }

    return "Elsy has already sent today's quests for the child profiles I have. Try one together, then reply with the child's name and what they noticed.";
  }

  const questLimit = await checkAndRecordAction({
    phone: family.phone,
    familyId: family.id,
    eventType: "quest_request",
  });

  if (!questLimit.allowed) {
    return "Elsy can only make a few on-demand quests at a time. Please try again later, or wait for your next daily quest.";
  }

  const questContext = await buildQuestContext(family, child);
  const generatedQuest = await generateQuest(questContext);
  const reviewStatus = await reviewStatusForFamily(family.id);

  await createQuest({
    childId: child.id,
    title: generatedQuest.title,
    prompt: generatedQuest.prompt,
    mission: generatedQuest.mission,
    followUp: generatedQuest.followUp,
    skill: generatedQuest.skill,
    reviewStatus,
  });

  return formatQuestMessage(generatedQuest, child.name);
}

function getQuestResponseGuidance(): string {
  return "I can help with quests by text. Reply with what your child noticed from the active quest. If more than one child has a mission, start with their name, like Mira: she noticed... Reply QUEST FOR a child name for a new one, ADD CHILD for another profile, or SETTINGS to update your daily time.";
}

function appendLearningAcknowledgement(message: string, acknowledgement: string) {
  const trimmed = acknowledgement.trim();
  if (!trimmed) return message;
  return `${message}\n\n${trimmed}`;
}

function isLikelyFeedbackOrPreference(body: string) {
  const normalizedBody = normalizeSmsBody(body);

  return (
    /\b(prefer|preference|suggestion|feedback|for future|next time)\b/.test(
      normalizedBody,
    ) ||
    /\b(?:do not|don't|dont|did not|didn't|didnt|not|never)\s+(?:like|love|enjoy|want)\b/.test(
      normalizedBody,
    ) ||
    /\b(?:hate|hated|boring|confusing|generic|formulaic|repetitive|too easy|too hard)\b/.test(
      normalizedBody,
    ) ||
    /\b(?:quest|mission|prompt)\b.*\b(?:shorter|longer|harder|easier|outside|indoors|hands-on|hands on|creative|math|science|reading|screen)\b/.test(
      normalizedBody,
    ) ||
    /\b(?:shorter|longer|harder|easier|more|less)\b.*\b(?:quests?|missions?|prompts?)\b/.test(
      normalizedBody,
    ) ||
    /^(?:please )?(?:make|try|send|avoid|use) (?:future |the |these |more |less |shorter |longer |harder |easier )?(?:quests?|missions?)/.test(
      normalizedBody,
    ) ||
    /^(?:can|could) you (?:make|try|send|avoid|use) /.test(normalizedBody)
  );
}

function getFeedbackAcknowledgement(body: string) {
  const normalizedBody = normalizeSmsBody(body);

  if (
    /\b(?:do not|don't|dont|did not|didn't|didnt|not|never)\s+(?:like|love|enjoy|want)\b/.test(
      normalizedBody,
    ) ||
    /\b(?:hate|hated|boring|confusing|generic|formulaic|repetitive)\b/.test(
      normalizedBody,
    )
  ) {
    return "Got it - I'll avoid missions like that and tune the next ones.";
  }

  return "Got it - I'll remember that for future quests.";
}

async function saveFallbackParentNote({
  familyId,
  childId,
  questId,
  body,
}: {
  familyId: string;
  childId: string;
  questId: string;
  body: string;
}) {
  const isQuestFeedback = /\b(?:quest|mission|prompt)\b/.test(normalizeSmsBody(body));

  await saveFamilyLearningEvents({
    familyId,
    childId,
    questId,
    events: [
      {
        kind: isQuestFeedback ? "quest_feedback" : "parent_note",
        summary: `Parent feedback for future quest tuning: ${body}`,
        evidence: body,
        confidence: 0.45,
      },
    ],
  });
}

async function sendKeywordReply(to: string, body: string, familyId?: string | null) {
  const sent = await sendSms(to, body);
  await recordOutboundSent({ phone: to, familyId, bodyLength: body.length });
  console.info("Outbound SMS queued:", { to, messageId: sent.id });
}

async function sendGuardedReply(to: string, body: string, familyId?: string | null) {
  const outboundLimit = await checkOutboundRateLimit({
    phone: to,
    familyId,
    bodyLength: body.length,
  });

  if (!outboundLimit.allowed) {
    console.warn("Outbound SMS blocked by guardrail:", {
      to,
      familyId,
      reason: outboundLimit.reason,
    });
    return;
  }

  const sent = await sendSms(to, body);
  await recordOutboundSent({ phone: to, familyId, bodyLength: body.length });
  console.info("Outbound SMS queued:", { to, messageId: sent.id });
}

async function sendGuardrailNotice(
  to: string,
  body: string,
  familyId?: string | null,
) {
  const noticeLimit = await checkAndRecordAction({
    phone: to,
    familyId,
    eventType: "rate_limit_notice",
  });

  if (!noticeLimit.allowed) {
    return;
  }

  await sendKeywordReply(to, body, familyId);
}

async function createQuestReplyMessage({
  from,
  family,
  child,
  quest,
  body,
}: {
  from: string;
  family: FamilyRow;
  child: ChildRow;
  quest: QuestRow;
  body: string;
}) {
  const interpretationLimit = await checkAndRecordAction({
    phone: from,
    familyId: family.id,
    eventType: "interpretation_request",
    bodyLength: body.length,
  });

  if (!interpretationLimit.allowed) {
    return "Elsy needs a little time before another coaching reply. Please pause and try again later.";
  }

  try {
    const learning = await learnFromQuestReply(
      await buildQuestReplyLearningContext(family, child, quest, body),
    );

    if (learning.memories.length > 0) {
      await saveFamilyLearningEvents({
        familyId: family.id,
        childId: child.id,
        questId: quest.id,
        events: learning.memories,
      });
    }

    if (learning.completeQuest && learning.childResponse) {
      await updateQuestResponse(quest.id, learning.childResponse, quest.completed_at);

      const interpretation = await interpretResponse(
        await buildInterpretContext(family, child, quest, learning.childResponse),
      );

      const replyText = appendLearningAcknowledgement(
        formatInterpretationMessage(interpretation),
        learning.acknowledgement,
      );
      await saveElsyReply(quest.id, replyText);
      return replyText;
    }

    if (learning.memories.length > 0) {
      return (
        learning.acknowledgement || "Got it - I'll remember that for future quests."
      );
    }

    if (isLikelyFeedbackOrPreference(body)) {
      await saveFallbackParentNote({
        familyId: family.id,
        childId: child.id,
        questId: quest.id,
        body,
      });
      return "Got it - I'll remember that for future quests.";
    }

    if (learning.replyKind === "question_or_support" || isLikelySmsQuestion(body)) {
      return getQuestResponseGuidance();
    }

    return `I may have missed the child response. Reply with what ${child.name} noticed, or reply QUEST FOR ${child.name} for a new one.`;
  } catch (learningError) {
    console.error("learnFromQuestReply error:", learningError);

    if (isLikelyFeedbackOrPreference(body)) {
      await saveFallbackParentNote({
        familyId: family.id,
        childId: child.id,
        questId: quest.id,
        body,
      });
      return "Got it - I'll remember that for future quests.";
    }

    if (isLikelySmsQuestion(body)) {
      return getQuestResponseGuidance();
    }

    await updateQuestResponse(quest.id, body, quest.completed_at);

    const interpretation = await interpretResponse(
      await buildInterpretContext(family, child, quest, body),
    );

    const replyText = formatInterpretationMessage(interpretation);
    await saveElsyReply(quest.id, replyText);
    return replyText;
  }
}

async function createCompletedQuestFeedbackMessage({
  from,
  family,
  child,
  quest,
  body,
}: {
  from: string;
  family: FamilyRow;
  child: ChildRow;
  quest: QuestRow;
  body: string;
}) {
  const learningLimit = await checkAndRecordAction({
    phone: from,
    familyId: family.id,
    eventType: "interpretation_request",
    bodyLength: body.length,
  });

  if (!learningLimit.allowed) {
    await saveFallbackParentNote({
      familyId: family.id,
      childId: child.id,
      questId: quest.id,
      body,
    });

    return getFeedbackAcknowledgement(body);
  }

  try {
    const learning = await learnFromQuestReply(
      await buildQuestReplyLearningContext(family, child, quest, body),
    );

    if (learning.memories.length > 0) {
      await saveFamilyLearningEvents({
        familyId: family.id,
        childId: child.id,
        questId: quest.id,
        events: learning.memories,
      });

      return learning.acknowledgement || getFeedbackAcknowledgement(body);
    }
  } catch (learningError) {
    console.error("learnFromQuestReply completed-quest feedback error:", learningError);
  }

  await saveFallbackParentNote({
    familyId: family.id,
    childId: child.id,
    questId: quest.id,
    body,
  });

  return getFeedbackAcknowledgement(body);
}

async function handleOversizedMessage(from: string, bodyLength: number) {
  const existingFamily = await findFamilyByPhone(from);
  const familyId = existingFamily?.id ?? null;

  await logSmsGuardrailEvent({
    phone: from,
    familyId,
    eventType: "inbound_message",
    status: "blocked",
    reason: "message_too_long",
    bodyLength,
  });

  await sendGuardrailNotice(
    from,
    "That message is too long for SMS. Please send a shorter reply, or reply HELP for support.",
    familyId,
  );
}

async function handleInboundMessage(from: string, body: string) {
  let existingFamily = await findFamilyByPhone(from);
  const keywordResult = await handleSmsKeyword(body, existingFamily);

  if (keywordResult.handled) {
    if (keywordResult.reply) {
      await sendKeywordReply(from, keywordResult.reply, existingFamily?.id ?? null);
    }

    if (keywordResult.stopProcessing) {
      return;
    }

    existingFamily = await findFamilyByPhone(from);
  }

  const familyId = existingFamily?.id ?? null;
  const inboundLimit = await checkInboundRateLimit({
    phone: from,
    familyId,
    bodyLength: body.length,
  });

  if (!inboundLimit.allowed) {
    await sendGuardrailNotice(
      from,
      "Elsy is getting a lot of messages from this number. Please pause for a bit, or reply HELP for support.",
      familyId,
    );
    return;
  }

  await recordInboundAccepted({ phone: from, familyId, bodyLength: body.length });

  let replyText = "";

  if (!existingFamily) {
    await createFamily(from);

    replyText =
      "Welcome to Else. I'm Elsy, your family curiosity companion. What should I call you?";
  } else {
    const currentStep = existingFamily.onboarding_step;

    if (currentStep === "complete") {
      const children = await getChildrenForFamily(existingFamily.id);

      if (isQuestRequestKeyword(body)) {
        replyText = await createOnDemandQuestMessage(existingFamily, body);
      } else if (children.length > 0) {
        const childIds = children.map((child) => child.id);
        const awaitingQuests = await getAwaitingQuestsForChildren(childIds);

        if (awaitingQuests.length > 0) {
          const prefixedReply = splitChildPrefixedReply(children, body);
          const namedChild = prefixedReply?.child ?? findNamedChild(children, body);
          let targetQuest: QuestRow | null = null;
          let targetChild: ChildRow | null = null;
          const targetBody = prefixedReply?.replyText ?? body;

          if (namedChild) {
            targetQuest =
              awaitingQuests.find((quest) => quest.child_id === namedChild.id) ?? null;
            targetChild = targetQuest ? namedChild : null;
          } else if (awaitingQuests.length === 1) {
            targetQuest = awaitingQuests[0] ?? null;
            targetChild = targetQuest ? childForQuest(targetQuest, children) : null;
          }

          if (targetQuest && targetChild) {
            replyText = await createQuestReplyMessage({
              from,
              family: existingFamily,
              child: targetChild,
              quest: targetQuest,
              body: targetBody,
            });
          } else {
            const exampleChild = children[0]?.name ?? "their name";
            replyText = `Which child is this for? Reply with their name first, like "${exampleChild}: what they noticed." Children I have: ${childNameList(children)}.`;
          }
        } else {
          const latestQuest = await getLatestQuestForChildren(childIds);

          if (latestQuest && isLikelyFeedbackOrPreference(body)) {
            const namedChild = findNamedChild(children, body);
            const targetQuest = namedChild
              ? await getLatestQuestForChild(namedChild.id)
              : latestQuest;
            const targetChild = targetQuest ? childForQuest(targetQuest, children) : null;

            if (targetQuest && targetChild) {
              replyText = await createCompletedQuestFeedbackMessage({
                from,
                family: existingFamily,
                child: targetChild,
                quest: targetQuest,
                body,
              });
            } else {
              replyText = getFeedbackAcknowledgement(body);
            }
          } else if (latestQuest && isLikelySmsQuestion(body)) {
            replyText = getQuestResponseGuidance();
          } else if (latestQuest) {
            replyText =
              "I already saved the latest quest response. Reply NEW MISSION for a new one, DINNER to set dinner questions, SETTINGS to update your daily time, or HELP for support.";
          } else {
            replyText =
              "You're all set. Elsy will send each child's first quest at your preferred time. Reply QUEST FOR a child name if you'd like one now.";
          }
        }
      } else {
        replyText =
          "You're all set, but I need a child profile before I can make a quest. Reply ADD CHILD to add one.";
      }
    } else {
      const validation = validateOnboardingInput(currentStep, body);

      if (!validation.ok) {
        await logSmsGuardrailEvent({
          phone: from,
          familyId: existingFamily.id,
          eventType: "inbound_message",
          status: "blocked",
          reason: `invalid_${currentStep ?? "onboarding"}_input`,
          bodyLength: body.length,
        });

        replyText = validation.reply;
      } else {
        const validatedBody =
          typeof validation.value === "string" ? validation.value : body;

        if (currentStep === "child_name" || currentStep === "additional_child_name") {
          await createChild(existingFamily.id, validation.value as string);
        }

        if (currentStep === "child_age" || currentStep === "additional_child_age") {
          const currentChild = await getLatestChildForFamily(existingFamily.id);
          if (currentChild) {
            await updateChild(currentChild.id, {
              age: validation.value as number,
            });
          }
        }

        if (
          currentStep === "child_interests" ||
          currentStep === "additional_child_interests"
        ) {
          const currentChild = await getLatestChildForFamily(existingFamily.id);
          if (currentChild) {
            await updateChild(currentChild.id, {
              interests: validation.value as string[],
            });
          }
        }

        if (currentStep === "timezone") {
          const timezone = parseTimezoneInput(body);

          if (!timezone) {
            replyText = invalidTimezoneReply();
          } else {
            await updateFamily(existingFamily.id, {
              timezone,
              onboarding_step: "dinner_conversation",
              parent_name: existingFamily.parent_name,
              preferred_time: existingFamily.preferred_time,
            });

            replyText = getOnboardingReply("timezone", body).reply;
          }
        } else if (currentStep === "dinner_conversation") {
          const dinnerConversationOptIn = parseDinnerConversationOptIn(body);

          if (dinnerConversationOptIn === null) {
            replyText = invalidDinnerConversationReply();
          } else if (dinnerConversationOptIn) {
            await updateFamily(existingFamily.id, {
              onboarding_step: "dinner_conversation_time",
              parent_name: existingFamily.parent_name,
              preferred_time: existingFamily.preferred_time,
              dinner_conversation_opt_in_asked_at: new Date().toISOString(),
            });

            replyText = `Great. ${dinnerConversationTimePrompt()}`;
          } else {
            await updateFamily(existingFamily.id, {
              onboarding_step: "complete",
              parent_name: existingFamily.parent_name,
              preferred_time: existingFamily.preferred_time,
              dinner_conversation_opt_in: false,
              dinner_conversation_opt_in_asked_at: new Date().toISOString(),
            });

            replyText = `No problem, we'll stick to daily curiosity quests. ${getOnboardingReply("dinner_conversation", body).reply} Reply QUEST if you'd like one now.`;
          }
        } else if (currentStep === "dinner_conversation_time") {
          await completeDinnerConversationSetup(
            existingFamily.id,
            validation.value as string,
          );

          replyText = `${getOnboardingReply("dinner_conversation_time", validation.value as string).reply} Reply QUEST if you'd like one now.`;
        } else {
          const onboarding = getOnboardingReply(currentStep, validatedBody);

          await updateFamily(existingFamily.id, {
            onboarding_step: onboarding.nextStep,
            parent_name:
              currentStep === "parent_name"
                ? (validation.value as string)
                : existingFamily.parent_name,
            preferred_time:
              currentStep === "preferred_time"
                ? (validation.value as string)
                : existingFamily.preferred_time,
          });

          replyText = onboarding.reply;
        }
      }
    }
  }

  if (replyText) {
    await sendGuardedReply(from, replyText, existingFamily?.id ?? null);
  }
}

export async function POST(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number.parseInt(contentLength, 10) > MAX_TELNYX_WEBHOOK_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Payload too large" },
      { status: 413 },
    );
  }

  const rawBody = await request.text();

  if (Buffer.byteLength(rawBody, "utf8") > MAX_TELNYX_WEBHOOK_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Payload too large" },
      { status: 413 },
    );
  }

  if (shouldVerifyTelnyxWebhook()) {
    const publicKey = process.env.TELNYX_PUBLIC_KEY;

    if (!publicKey) {
      console.error("Inbound SMS: missing TELNYX_PUBLIC_KEY");
      return NextResponse.json({ ok: false, error: "Misconfigured" }, { status: 500 });
    }

    const isValid = verifyTelnyxWebhookSignature({
      rawBody,
      signature: request.headers.get("telnyx-signature-ed25519"),
      timestamp: request.headers.get("telnyx-timestamp"),
      publicKeyBase64: publicKey,
    });

    if (!isValid) {
      console.error("Inbound SMS: webhook signature verification failed");
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  let webhook: TelnyxInboundWebhook;

  try {
    webhook = JSON.parse(rawBody) as TelnyxInboundWebhook;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  if (webhook.data?.event_type !== "message.received") {
    return NextResponse.json({ ok: true });
  }

  const from = webhook.data.payload?.from?.phone_number ?? "";
  const body = (webhook.data.payload?.text ?? "").trim();

  if (!from || !body) {
    return NextResponse.json({ ok: true });
  }

  if (!isLikelyE164Phone(from)) {
    console.warn("Inbound SMS: ignored invalid sender phone format");
    return NextResponse.json({ ok: true });
  }

  if (body.length > MAX_INBOUND_SMS_CHARS) {
    waitUntil(
      handleOversizedMessage(from, body.length).catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Inbound SMS oversized handler failed:", message);
      }),
    );

    return NextResponse.json({ ok: true });
  }

  waitUntil(
    handleInboundMessage(from, body).catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Inbound SMS handler failed:", message);
    }),
  );

  return NextResponse.json({ ok: true });
}
