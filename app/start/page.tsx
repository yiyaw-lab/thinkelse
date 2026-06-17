import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ElsyAvatar } from "@/components/brand/elsy-avatar";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Start your Else trial",
  description:
    "Start your 14-day Else trial. Daily curiosity quests for families by text.",
  path: "/start",
  ogTitle: "Start your 14-day Else trial",
});

function formatPhoneDisplay(e164: string) {
  const match = e164.match(/^\+1(\d{3})(\d{3})(\d{4})$/);
  if (match) return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
  return e164;
}

const telnyxNumber = process.env.TELNYX_PHONE_NUMBER ?? "";
const PHONE_NUMBER = telnyxNumber
  ? formatPhoneDisplay(telnyxNumber)
  : "+1 (___) ___-____";
const PHONE_HREF = telnyxNumber
  ? `sms:${telnyxNumber}&body=HELLO`
  : "sms:+1__________&body=HELLO";

const INCLUDES = [
  "Daily personalized curiosity quests",
  "Warm replies when you share your child's thinking",
  "Parent-operated — no kid account or app",
  "Cancel anytime by texting STOP",
] as const;

export default function StartPage() {
  return (
    <div className="min-h-screen bg-pool-bg text-pool-ink">
      <header className="border-b border-pool-line bg-white px-6 py-6">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-pool-ink hover:text-pool-blue">
            ← Else
          </Link>
          <Link href="/privacy" className="text-xs text-pool-muted hover:text-pool-blue">
            Privacy
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-6 py-12 sm:py-16">
        <div className="mb-8 flex justify-center">
          <ElsyAvatar size={64} />
        </div>

        <p className="pool-eyebrow mb-4 text-center">14-day free trial</p>
        <h1 className="pool-display-sm mb-4 text-center">Start your morning ritual.</h1>
        <p className="pool-lead mb-10 text-center">
          One question. One quest. Each day. Else sends beautiful curiosity prompts
          to your phone — you relay your child&rsquo;s thinking, Elsy goes deeper.
        </p>

        <div className="pool-panel mb-8">
          <p className="mb-4 text-sm font-semibold text-pool-ink">Family plan</p>
          <p className="mb-1 text-3xl font-bold tracking-tight">
            $9.99<span className="text-lg font-medium text-pool-muted">/mo</span>
          </p>
          <p className="mb-6 text-sm text-pool-muted">
            or $89/year · first 14 days free
          </p>
          <ul className="space-y-3 text-sm text-pool-muted">
            {INCLUDES.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-pool-blue" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={PHONE_HREF}
          className="btn-pool group mb-6 flex w-full flex-col gap-0.5 sm:flex-row sm:justify-center sm:gap-2.5"
        >
          <span className="flex items-center justify-center gap-2 text-base font-semibold">
            Text HELLO to start
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
          <span className="text-center text-sm font-normal text-white/85">{PHONE_NUMBER}</span>
        </a>

        <p className="mb-8 text-center text-xs leading-relaxed text-pool-muted">
          By texting HELLO, you agree to receive recurring SMS from Else and accept
          our{" "}
          <Link href="/terms" className="text-pool-blue hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-pool-blue hover:underline">
            Privacy Policy
          </Link>
          . Message frequency varies (typically 1–3/day). Msg &amp; data rates may
          apply. Reply STOP to cancel, HELP for help. Consent is not required for
          purchase.
        </p>

        <div className="rounded-2xl border border-pool-line bg-white px-5 py-4 text-sm text-pool-muted">
          <p className="mb-1 font-medium text-pool-ink">Already on Else?</p>
          <p>
            Online billing is coming soon. Questions about your trial or
            subscription? Email{" "}
            <a href="mailto:hello@elsey.app" className="text-pool-blue hover:underline">
              hello@elsey.app
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
