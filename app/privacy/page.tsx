import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Else handles your family's information and SMS program.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-pool-bg text-pool-ink">
      <header className="border-b border-pool-line bg-white px-6 py-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-pool-ink hover:text-pool-blue">
            ← Else
          </Link>
          <p className="text-xs text-pool-muted">Last updated June 14, 2026</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="pool-display-sm mb-8">Privacy Policy</h1>

        <div className="space-y-8 text-sm leading-relaxed text-pool-ink">
          <section>
            <h2 className="mb-2 text-base font-semibold">Who we are</h2>
            <p className="text-pool-muted">
              Else (&ldquo;we,&rdquo; &ldquo;us&rdquo;) operates the family curiosity
              service at{" "}
              <a href="https://elsey.app" className="text-pool-blue hover:underline">
                elsey.app
              </a>
              . Parents text Elsy by SMS to receive daily curiosity quests and
              coaching replies. Children do not have their own accounts.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Information we collect</h2>
            <ul className="list-disc space-y-2 pl-5 text-pool-muted">
              <li>Mobile phone number (to send and receive SMS)</li>
              <li>Parent name and messaging preferences (e.g. preferred quest time)</li>
              <li>Child name, age, and interests you provide during onboarding</li>
              <li>Messages you send us, including relayed child responses</li>
              <li>Quest history and service metadata needed to operate the product</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">SMS &amp; mobile information (10DLC)</h2>
            <p className="mb-3 text-pool-muted">
              This section describes how Else handles mobile phone numbers, SMS
              opt-in data, and messaging consent.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-pool-muted">
              <li>
                <strong>No marketing sharing:</strong> We will not sell, rent, or
                share your mobile phone number, SMS opt-in data, or messaging
                consent status with third parties or affiliates for their
                marketing or promotional purposes.
              </li>
              <li>
                <strong>Service providers only:</strong> We may share personal
                data, including your phone number and SMS opt-in or consent
                status, with vendors that help us operate the Else messaging
                program (for example, SMS carriers, delivery platforms, hosting,
                database, and AI processing providers). Those vendors may use the
                data only to provide services to Else — not for their own
                marketing.
              </li>
              <li>
                <strong>No purchase of lists:</strong> We do not buy lists of
                phone numbers and do not send messages to anyone who has not
                opted in.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">SMS program</h2>
            <p className="text-pool-muted">
              By texting <strong>HELLO</strong> to our number or otherwise opting in,
              you consent to receive recurring automated SMS from Else, including
              onboarding messages, daily curiosity quests, and replies. Message
              frequency varies (typically 1–3 messages per day). Message and data rates
              may apply. Reply <strong>STOP</strong> to cancel. Reply{" "}
              <strong>HELP</strong> for help. Consent is not a condition of purchase.
              See our{" "}
              <Link href="/terms" className="text-pool-blue hover:underline">
                Terms of Service
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">How we use information</h2>
            <p className="text-pool-muted">
              We use this information to onboard your family, deliver daily quests,
              personalize Elsy&rsquo;s replies, improve the service, and comply with
              legal obligations. We do not sell your personal information. We do not
              run advertising in SMS or on behalf of third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Service providers</h2>
            <p className="text-pool-muted">
              We use trusted providers to operate Else (e.g. SMS delivery, hosting,
              database, and AI processing). They process data only to provide
              services to us under contractual safeguards and not for their own
              marketing. This does not override the SMS non-sharing commitments in
              the section above.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Retention &amp; security</h2>
            <p className="text-pool-muted">
              We retain information while your account is active and as needed for
              legitimate business and legal purposes. We use reasonable technical and
              organizational measures to protect your data.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Your choices</h2>
            <p className="text-pool-muted">
              You may opt out of SMS at any time by replying <strong>STOP</strong>.
              You may request access, correction, or deletion of your information by
              emailing{" "}
              <a href="mailto:hello@elsey.app" className="text-pool-blue hover:underline">
                hello@elsey.app
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Children</h2>
            <p className="text-pool-muted">
              Else is designed for parents. The parent is the SMS subscriber and
              controls participation. We do not knowingly collect information directly
              from children under 13 without parental involvement through the parent
              account.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Contact</h2>
            <p className="text-pool-muted">
              Questions about this policy:{" "}
              <a href="mailto:hello@elsey.app" className="text-pool-blue hover:underline">
                hello@elsey.app
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
