import { waitUntil } from "@vercel/functions";
import { NextResponse } from "next/server";

import { generateQuest } from "@/lib/agents/generateQuest";
import { interpretResponse } from "@/lib/agents/interpretResponse";
import {
  buildInterpretContext,
  buildQuestContext,
} from "@/lib/agents/build-family-context";
import {
  getOnboardingReply,
  invalidDinnerConversationReply,
  invalidTimezoneReply,
  parseDinnerConversationOptIn,
  validateOnboardingInput,
} from "@/lib/onboarding";
import {
  createFamily,
  findFamilyByPhone,
  updateFamily,
} from "@/lib/db/families";
import {
  createChild,
  getFirstChildForFamily,
  updateChildrenForFamily,
} from "@/lib/db/children";
import {
  createQuest,
  getLatestQuestForChild,
  hasQuestOnLocalDay,
  saveElsyReply,
  updateQuestResponse,
} from "@/lib/db/quests";
import { reviewStatusForFamily } from "@/lib/quests/review-policy";
import { handleSmsKeyword } from "@/lib/sms/handle-keyword";
import { sendSms } from "@/lib/telnyx/sendSms";
import {
  formatInterpretationMessage,
  formatQuestMessage,
} from "@/lib/sms/format-quest";
import { isLikelySmsQuestion, isQuestRequestKeyword } from "@/lib/sms/keywords";
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

async function createOnDemandQuestMessage(
  family: NonNullable<Awaited<ReturnType<typeof findFamilyByPhone>>>,
): Promise<string> {
  const child = await getFirstChildForFamily(family.id);

  if (!child) {
    return "You're all set, but I need your child's profile before I can make a quest.";
  }

  const timezone =
    typeof family.timezone === "string" && family.timezone
      ? family.timezone
      : DEFAULT_TIMEZONE;
  const alreadySentToday = await hasQuestOnLocalDay(
    child.id,
    formatLocalDateKey(timezone, new Date()),
    timezone,
  );

  if (alreadySentToday) {
    await logSmsGuardrailEvent({
      phone: family.phone,
      familyId: family.id,
      eventType: "quest_request",
      status: "blocked",
      reason: "quest_already_sent_today",
    });

    return "Elsy has already sent today's quest. Try it together, then reply with what your child noticed.";
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

  return formatQuestMessage(generatedQuest);
}

function getQuestResponseGuidance(): string {
  return "I can help with quests by text. Reply with what your child noticed from the latest quest, or reply QUEST for a new one. Reply HELP for support.";
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
      const child = await getFirstChildForFamily(existingFamily.id);

      if (isQuestRequestKeyword(body)) {
        replyText = await createOnDemandQuestMessage(existingFamily);
      } else if (child) {
        const latestQuest = await getLatestQuestForChild(child.id);

        if (latestQuest) {
          if (isLikelySmsQuestion(body)) {
            replyText = getQuestResponseGuidance();
          } else {
            const interpretationLimit = await checkAndRecordAction({
              phone: from,
              familyId: existingFamily.id,
              eventType: "interpretation_request",
              bodyLength: body.length,
            });

            if (!interpretationLimit.allowed) {
              replyText =
                "Elsy needs a little time before another coaching reply. Please pause and try again later.";
            } else {
              await updateQuestResponse(latestQuest.id, body, latestQuest.completed_at);

              const interpretation = await interpretResponse(
                await buildInterpretContext(existingFamily, child, latestQuest, body),
              );

              replyText = formatInterpretationMessage(interpretation);
              await saveElsyReply(latestQuest.id, replyText);
            }
          }
        } else {
          replyText = "You're all set. Elsy will send your first quest at your preferred time. Reply QUEST if you'd like one now.";
        }
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

        if (currentStep === "child_name") {
          await createChild(existingFamily.id, validation.value as string);
        }

        if (currentStep === "child_age") {
          await updateChildrenForFamily(existingFamily.id, {
            age: validation.value as number,
          });
        }

        if (currentStep === "child_interests") {
          await updateChildrenForFamily(existingFamily.id, {
            interests: validation.value as string[],
          });
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
          } else {
            await updateFamily(existingFamily.id, {
              onboarding_step: "complete",
              parent_name: existingFamily.parent_name,
              preferred_time: existingFamily.preferred_time,
              dinner_conversation_opt_in: dinnerConversationOptIn,
            });

            const preferenceReply = dinnerConversationOptIn
              ? "Great, I'll remember you'd like dinner conversation questions."
              : "No problem, we'll stick to daily curiosity quests.";

            replyText = `${preferenceReply} ${getOnboardingReply("dinner_conversation", body).reply} Reply QUEST if you'd like one now.`;
          }
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
