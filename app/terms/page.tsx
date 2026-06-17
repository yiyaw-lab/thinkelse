import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { LEGAL, SMS_NON_SHARING, SMS_SERVICE_PROVIDER_SHARING } from "@/lib/legal/constants";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "Terms for using Else by SMS, including messaging program disclosures.",
  path: "/terms",
});

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-base font-semibold">{title}</h2>
      <div className="space-y-3 text-pool-muted">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-pool-bg text-pool-ink">
      <header className="border-b border-pool-line bg-white px-6 py-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-pool-ink hover:text-pool-blue">
            ← Else
          </Link>
          <p className="text-xs text-pool-muted">Effective {LEGAL.effectiveDate}</p>
        </div>
      </header>

      <main className="legal-content mx-auto max-w-2xl px-6 py-12 text-sm leading-relaxed">
        <h1 className="pool-display-sm mb-3">Terms of Service</h1>
        <p className="mb-8 text-pool-muted">
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of {LEGAL.brand}{" "}
          and the {LEGAL.programName} at{" "}
          <a href={LEGAL.siteUrl} className="text-pool-blue hover:underline">
            {LEGAL.siteUrl}
          </a>
          . Please read them carefully. Our{" "}
          <Link href="/privacy" className="text-pool-blue hover:underline">
            Privacy Policy
          </Link>{" "}
          explains how we handle your information and is incorporated into these Terms.
        </p>

        <div className="space-y-8">
          <Section title="1. Agreement to these Terms">
            <p>
              By texting <strong>HELLO</strong> (or another designated opt-in keyword)
              to our Else phone number, visiting {LEGAL.siteUrl}, or otherwise using
              Else, you agree to these Terms and our Privacy Policy. If you do not
              agree, do not use the service.
            </p>
          </Section>

          <Section title="2. Description of the service">
            <p>
              Else provides parents and legal guardians with daily curiosity quests and
              conversational coaching by SMS through Elsy, an AI-powered companion. The
              parent is the account holder and SMS subscriber. Parents relay a
              child&rsquo;s thinking; children do not text Else directly and do not have
              separate accounts.
            </p>
            <p>
              Else is an educational curiosity service. It is not a school, therapist,
              medical provider, emergency service, or childcare provider.
            </p>
          </Section>

          <Section title="3. Eligibility">
            <p>
              You must be at least 18 years old and a parent or legal guardian to use
              Else on behalf of a child in your care. By using Else, you represent that
              you meet these requirements and have authority to provide information about
              your child.
            </p>
          </Section>

          <Section title="4. SMS messaging program terms">
            <p>
              <strong>Program name:</strong> {LEGAL.programName} ({LEGAL.brand})
            </p>
            <p>
              <strong>Opt-in:</strong> You consent to receive recurring automated SMS
              when you opt in, including by texting <strong>HELLO</strong> to our Else
              number from {LEGAL.siteUrl} or another disclosed opt-in point.
            </p>
            <p>
              <strong>Message types:</strong> onboarding messages, daily curiosity
              quests, Elsy&rsquo;s replies, and occasional service or account notices.
            </p>
            <p>
              <strong>Message frequency:</strong> {LEGAL.messageFrequency}.
            </p>
            <p>
              <strong>Message and data rates:</strong> Message and data rates may apply.
              Contact your wireless carrier for details about your mobile plan.
            </p>
            <p>
              <strong>Opt-out:</strong> Reply <strong>STOP</strong> at any time to
              unsubscribe from Else SMS. You will receive a one-time confirmation. No
              further messages will be sent unless you opt in again.
            </p>
            <p>
              <strong>Help:</strong> Reply <strong>HELP</strong> for help or contact{" "}
              <a href={`mailto:${LEGAL.email}`} className="text-pool-blue hover:underline">
                {LEGAL.email}
              </a>
              .
            </p>
            <p>
              <strong>Re-opt-in:</strong> After opting out, you may text{" "}
              <strong>HELLO</strong> or <strong>START</strong> to rejoin.
            </p>
            <p>
              <strong>Consent not required for purchase:</strong> Consent to receive SMS
              is not a condition of purchasing any goods or services.
            </p>
            <p>
              <strong>Carrier liability:</strong> Wireless carriers are not liable for
              delayed or undelivered messages.
            </p>
            <p>
              <strong>Supported devices:</strong> SMS is available on participating
              carriers and compatible devices. Delivery is not guaranteed.
            </p>
          </Section>

          <Section title="5. Mobile information & privacy">
            <p>{SMS_NON_SHARING}</p>
            <p>{SMS_SERVICE_PROVIDER_SHARING}</p>
            <p>
              See our{" "}
              <Link href="/privacy" className="text-pool-blue hover:underline">
                Privacy Policy
              </Link>{" "}
              for full details.
            </p>
          </Section>

          <Section title="6. Subscriptions, trials & fees">
            <p>
              Else may offer a free trial followed by a paid subscription. Applicable
              fees, billing intervals, and cancellation terms will be disclosed before
              you are charged. Carrier SMS and data charges apply regardless of
              subscription status.
            </p>
            <p>
              You are responsible for any messaging charges from your wireless carrier.
            </p>
          </Section>

          <Section title="7. Acceptable use">
            <p>You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Use Else for unlawful, harassing, abusive, or harmful purposes</li>
              <li>Provide false or misleading information during onboarding</li>
              <li>Attempt to disrupt, scrape, reverse engineer, or overload the service</li>
              <li>Use Else in emergencies or for medical, legal, or crisis situations</li>
              <li>Opt in anyone other than yourself without their consent</li>
            </ul>
          </Section>

          <Section title="8. AI-generated content">
            <p>
              Quests and Elsy&rsquo;s replies are generated using artificial
              intelligence and may occasionally be incomplete, inaccurate, or
              inappropriate for your specific situation. You are responsible for
              supervising your child&rsquo;s participation and determining what is
              suitable for your family. Do not rely on Else as a substitute for
              professional advice.
            </p>
          </Section>

          <Section title="9. Intellectual property">
            <p>
              Else, Elsy, and related content, branding, and software are owned by Else
              or its licensors. We grant you a limited, personal, non-transferable
              license to use the service for your family&rsquo;s private, non-commercial
              use. You may not copy, resell, or redistribute Else content without
              permission.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              You may stop using Else at any time by texting <strong>STOP</strong>. We
              may suspend or terminate your access if you violate these Terms, misuse the
              service, or as required by law or carrier policy. Upon termination, your
              right to receive SMS from Else ends.
            </p>
          </Section>

          <Section title="11. Disclaimers">
            <p>
              ELSE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
              WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING IMPLIED
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
              NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
              UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.
            </p>
          </Section>

          <Section title="12. Limitation of liability">
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, ELSE AND ITS OFFICERS, DIRECTORS,
              EMPLOYEES, AND SERVICE PROVIDERS WILL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL
              LIABILITY FOR ANY CLAIM ARISING FROM THE SERVICE WILL NOT EXCEED THE
              GREATER OF (A) THE AMOUNT YOU PAID ELSE IN THE TWELVE MONTHS BEFORE THE
              CLAIM OR (B) ONE HUNDRED U.S. DOLLARS ($100).
            </p>
          </Section>

          <Section title="13. Indemnification">
            <p>
              You agree to indemnify and hold harmless Else from claims, damages, losses,
              and expenses (including reasonable attorneys&rsquo; fees) arising from your
              use of the service, your violation of these Terms, or your violation of any
              rights of another person.
            </p>
          </Section>

          <Section title="14. Dispute resolution & governing law">
            <p>
              These Terms are governed by the laws of the State of California, United
              States, without regard to conflict-of-law principles. Any dispute arising
              from these Terms or the service will be resolved in the state or federal
              courts located in California, unless applicable law requires otherwise.
            </p>
          </Section>

          <Section title="15. Changes to these Terms">
            <p>
              We may update these Terms from time to time. We will post the updated Terms
              at {LEGAL.siteUrl}/terms with a revised effective date. Material changes
              may be communicated via SMS or email where appropriate. Continued use after
              changes constitutes acceptance.
            </p>
          </Section>

          <Section title="16. Contact">
            <p>
              Questions about these Terms:
            </p>
            <p>
              Email:{" "}
              <a href={`mailto:${LEGAL.email}`} className="text-pool-blue hover:underline">
                {LEGAL.email}
              </a>
              <br />
              Website:{" "}
              <a href={LEGAL.siteUrl} className="text-pool-blue hover:underline">
                {LEGAL.siteUrl}
              </a>
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}
