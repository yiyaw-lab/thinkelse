import { waitUntil } from "@vercel/functions";
import { NextResponse } from "next/server";

import { generateQuest } from "@/lib/agents/generateQuest";
import { interpretResponse } from "@/lib/agents/interpretResponse";
import {
  buildInterpretContext,
  buildQuestContext,
} from "@/lib/agents/build-family-context";
import { getOnboardingReply } from "@/lib/onboarding";
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
  saveElsyReply,
  updateQuestResponse,
} from "@/lib/db/quests";
import { reviewStatusForFamily } from "@/lib/quests/review-policy";
import { sendSms } from "@/lib/telnyx/sendSms";
import {
  formatInterpretationMessage,
  formatQuestMessage,
} from "@/lib/sms/format-quest";
import {
  shouldVerifyTelnyxWebhook,
  verifyTelnyxWebhookSignature,
} from "@/lib/telnyx/verifyWebhook";

type TelnyxInboundWebhook = {
  data?: {
    event_type?: string;
    payload?: {
      from?: { phone_number?: string };
      text?: string;
    };
  };
};

async function handleInboundMessage(from: string, body: string) {
  const existingFamily = await findFamilyByPhone(from);

  let replyText = "";

  if (!existingFamily) {
    await createFamily(from);

    replyText =
      "Welcome to Else. I'm Elsy, your family curiosity companion. What should I call you?";
  } else {
    const currentStep = existingFamily.onboarding_step;

    if (currentStep === "complete") {
      const child = await getFirstChildForFamily(existingFamily.id);

      if (child) {
        const latestQuest = await getLatestQuestForChild(child.id);

        if (latestQuest) {
          await updateQuestResponse(latestQuest.id, body);

          const interpretation = await interpretResponse(
            await buildInterpretContext(existingFamily, child, latestQuest, body),
          );

          replyText = formatInterpretationMessage(interpretation);
          await saveElsyReply(latestQuest.id, replyText);
        } else {
          replyText = "Thanks! Elsy is thinking of a new quest for your child.";
        }
      }
    } else {
      if (currentStep === "child_name") {
        await createChild(existingFamily.id, body);
      }

      if (currentStep === "child_age") {
        const age = Number.parseInt(body, 10);

        await updateChildrenForFamily(existingFamily.id, {
          age: Number.isNaN(age) ? null : age,
        });
      }

      if (currentStep === "child_interests") {
        const interests = body
          .split(",")
          .map((interest) => interest.trim())
          .filter(Boolean);

        await updateChildrenForFamily(existingFamily.id, {
          interests,
        });
      }

      const onboarding = getOnboardingReply(currentStep, body);

      await updateFamily(existingFamily.id, {
        onboarding_step: onboarding.nextStep,
        parent_name:
          currentStep === "parent_name" ? body : existingFamily.parent_name,
        preferred_time:
          currentStep === "preferred_time"
            ? body
            : existingFamily.preferred_time,
      });

      replyText = onboarding.reply;

      if (onboarding.nextStep === "complete") {
        const child = await getFirstChildForFamily(existingFamily.id);

        if (child) {
          const questContext = await buildQuestContext(existingFamily, child);
          const generatedQuest = await generateQuest(questContext);
          const reviewStatus = await reviewStatusForFamily(existingFamily.id);

          await createQuest({
            childId: child.id,
            title: generatedQuest.title,
            prompt: generatedQuest.prompt,
            mission: generatedQuest.mission,
            followUp: generatedQuest.followUp,
            skill: generatedQuest.skill,
            reviewStatus,
          });

          replyText += `

${formatQuestMessage(generatedQuest)}`;
        }
      }
    }
  }

  if (replyText) {
    const sent = await sendSms(from, replyText);
    console.info("Outbound SMS queued:", { to: from, messageId: sent.id });
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();

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

  waitUntil(
    handleInboundMessage(from, body).catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Inbound SMS handler failed:", message);
    }),
  );

  return NextResponse.json({ ok: true });
}
