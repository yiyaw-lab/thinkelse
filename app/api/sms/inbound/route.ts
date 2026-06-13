import { NextResponse } from "next/server";

import { generateQuest } from "@/lib/agents/generateQuest";
import { interpretResponse } from "@/lib/agents/interpretResponse";
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
  updateQuestResponse,
} from "@/lib/db/quests";
import { sendSms } from "@/lib/telnyx/sendSms";
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

          const interpretation = await interpretResponse({
            childName: child.name,
            age: child.age,
            questPrompt: latestQuest.prompt,
            questFollowUp: latestQuest.follow_up ?? "",
            childResponse: body,
          });

          replyText = `${interpretation.encouragement}

${interpretation.followUp}`;
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
          const generatedQuest = await generateQuest({
            childName: child.name,
            age: child.age,
            interests: child.interests,
          });

          await createQuest({
            childId: child.id,
            prompt: generatedQuest.prompt,
            mission: generatedQuest.mission,
            followUp: generatedQuest.followUp,
            skill: generatedQuest.skill,
          });

          replyText += `

🌱 ${generatedQuest.title}

${generatedQuest.prompt}

Mission:
${generatedQuest.mission}

Think about:
${generatedQuest.followUp}`;
        }
      }
    }
  }

  if (replyText) {
    await sendSms(from, replyText);
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  if (shouldVerifyTelnyxWebhook()) {
    const publicKey = process.env.TELNYX_PUBLIC_KEY;

    if (!publicKey) {
      return NextResponse.json({ ok: false, error: "Misconfigured" }, { status: 500 });
    }

    const isValid = verifyTelnyxWebhookSignature({
      rawBody,
      signature: request.headers.get("telnyx-signature-ed25519"),
      timestamp: request.headers.get("telnyx-timestamp"),
      publicKeyBase64: publicKey,
    });

    if (!isValid) {
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

  await handleInboundMessage(from, body);

  return NextResponse.json({ ok: true });
}
