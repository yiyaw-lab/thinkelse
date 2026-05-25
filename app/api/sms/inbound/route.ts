import { NextResponse } from "next/server";

import { getOnboardingReply } from "@/lib/onboarding";
import {
  createFamily,
  findFamilyByPhone,
  updateFamily,
} from "@/lib/db/families";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createSmsReply } from "@/lib/twilio/twiml";

export async function POST(request: Request) {
  const formData = await request.formData();

  const from = String(formData.get("From") || "");
  const body = String(formData.get("Body") || "").trim();

  const { data: existingFamily, error: findError } = await supabaseAdmin
    .from("families")
    .select("*")
    .eq("phone", from)
    .maybeSingle();

  if (findError) {
    console.error(findError);
  }

  let replyText = "";

  if (!existingFamily) {
    await createFamily(from);

    replyText =
      "Welcome to Else. I’m Elsy, your family curiosity companion. What should I call you?";
  } else {
    const currentStep = existingFamily.onboarding_step;

    if (currentStep === "child_name") {
      await supabaseAdmin.from("children").insert({
        family_id: existingFamily.id,
        name: body,
      });
    }

    if (currentStep === "child_age") {
      const age = Number.parseInt(body, 10);

      await supabaseAdmin
        .from("children")
        .update({
          age: Number.isNaN(age) ? null : age,
        })
        .eq("family_id", existingFamily.id);
    }

    if (currentStep === "child_interests") {
      const interests = body
        .split(",")
        .map((interest) => interest.trim())
        .filter(Boolean);

      await supabaseAdmin
        .from("children")
        .update({
          interests,
        })
        .eq("family_id", existingFamily.id);
    }

    const onboarding = getOnboardingReply(currentStep, body);

    await updateFamily(existingFamily.id, {
        onboarding_step: onboarding.nextStep,
        parent_name:
          currentStep === "parent_name"
            ? body
            : existingFamily.parent_name,
        preferred_time:
          currentStep === "preferred_time"
            ? body
            : existingFamily.preferred_time,
      });

    replyText = onboarding.reply;
  }

  const twiml = createSmsReply(replyText);

  return new NextResponse(twiml, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}