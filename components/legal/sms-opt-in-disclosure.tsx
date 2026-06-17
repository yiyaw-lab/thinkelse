import Link from "next/link";
import { LEGAL } from "@/lib/legal/constants";

export function SmsOptInDisclosure({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-pool-muted ${className}`}>
      By texting <strong>HELLO</strong> to {LEGAL.brand}, you agree to receive
      recurring automated SMS from the {LEGAL.programName}, including onboarding
      messages, daily curiosity quests, and service replies.{" "}
      {LEGAL.messageFrequency}. Message and data rates may apply. Reply{" "}
      <strong>STOP</strong> to opt out. Reply <strong>HELP</strong> for help. Consent
      is not a condition of purchase. Your mobile information will not be sold or
      shared with third parties for promotional or marketing purposes. See our{" "}
      <Link href="/terms" className="text-pool-blue hover:underline">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link href="/privacy" className="text-pool-blue hover:underline">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
