import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { LEGAL, SMS_NON_SHARING, SMS_SERVICE_PROVIDER_SHARING } from "@/lib/legal/constants";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Else collects, uses, and protects your information, including SMS and mobile data.",
  path: "/privacy",
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

export default function PrivacyPage() {
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

      <main className="mx-auto max-w-2xl px-6 py-12 text-sm leading-relaxed">
        <h1 className="pool-display-sm mb-3">Privacy Policy</h1>
        <p className="mb-8 text-pool-muted">
          {LEGAL.brand} (&ldquo;Else,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) respects your privacy. This Privacy Policy explains how we
          collect, use, disclose, and protect personal information when you use our
          website at{" "}
          <a href={LEGAL.siteUrl} className="text-pool-blue hover:underline">
            {LEGAL.siteUrl.replace("https://", "")}
          </a>{" "}
          and our SMS messaging program. This policy is designed to comply with
          applicable privacy laws and industry messaging requirements, including A2P
          10DLC and CTIA guidelines.
        </p>

        <div className="space-y-8">
          <Section title="1. Who we are">
            <p>
              Else is a family curiosity service operated at {LEGAL.siteUrl}. Parents
              text Elsy by SMS to receive daily curiosity quests and coaching replies.
              The parent is the SMS subscriber. Children do not create accounts and do
              not text Else directly.
            </p>
            <p>
              Contact:{" "}
              <a href={`mailto:${LEGAL.email}`} className="text-pool-blue hover:underline">
                {LEGAL.email}
              </a>
            </p>
          </Section>

          <Section title="2. Scope">
            <p>
              This Privacy Policy applies to information collected through our website,
              SMS program, and related services. By using Else or opting in to our SMS
              program, you acknowledge this policy and our{" "}
              <Link href="/terms" className="text-pool-blue hover:underline">
                Terms of Service
              </Link>
              .
            </p>
          </Section>

          <Section title="3. Information we collect">
            <p>We may collect the following categories of information:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Identifiers:</strong> mobile phone number, parent name
              </li>
              <li>
                <strong>Family profile information:</strong> child&rsquo;s first name,
                age, and interests you provide during onboarding
              </li>
              <li>
                <strong>Communications:</strong> SMS messages you send to Else,
                including relayed child responses and Elsy&rsquo;s replies
              </li>
              <li>
                <strong>Preferences:</strong> preferred quest delivery time and messaging
                settings
              </li>
              <li>
                <strong>Service data:</strong> quest history, onboarding status,
                subscription or trial status, and technical logs needed to operate the
                service
              </li>
              <li>
                <strong>Website data:</strong> basic usage information when you visit
                our website (such as browser type and pages viewed), via standard
                server logs or analytics tools
              </li>
            </ul>
            <p>
              We do not knowingly collect payment card numbers directly unless and until
              we offer online billing; payment processing would be handled by a
              PCI-compliant third-party processor.
            </p>
          </Section>

          <Section title="4. SMS & mobile information (10DLC)">
            <p>
              <strong>This section applies to our SMS program and mobile data.</strong>
            </p>
            <p>{SMS_NON_SHARING}</p>
            <p>{SMS_SERVICE_PROVIDER_SHARING}</p>
            <p>
              SMS opt-in data and consent records are maintained in compliance with
              applicable messaging regulations, including TCPA and A2P 10DLC
              requirements. Even if other sections of this policy describe data sharing
              for business operations, <strong>SMS opt-in data and mobile consent status
              are not shared with third parties or affiliates for marketing or
              promotional purposes.</strong>
            </p>
            <p>
              We do not purchase lists of phone numbers. We send SMS only to individuals
              who have opted in.
            </p>
          </Section>

          <Section title="5. How we use information">
            <p>We use personal information to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide, operate, and improve the Else SMS service</li>
              <li>Onboard your family and personalize daily quests and replies</li>
              <li>Deliver onboarding messages, daily quests, and Elsy&rsquo;s responses</li>
              <li>Maintain quest history and family context over time</li>
              <li>Process subscriptions or trials when billing is enabled</li>
              <li>Respond to HELP, STOP, and support requests</li>
              <li>Monitor service quality, prevent abuse, and ensure security</li>
              <li>Comply with legal obligations and enforce our terms</li>
            </ul>
            <p>
              We do not sell your personal information. We do not use the SMS program
              to deliver third-party advertising.
            </p>
          </Section>

          <Section title="6. SMS program disclosures">
            <p>
              <strong>Program name:</strong> {LEGAL.programName}
            </p>
            <p>
              <strong>Opt-in:</strong> You opt in by texting <strong>HELLO</strong> (or
              another designated keyword) to our Else phone number, or through another
              opt-in method we clearly disclose at the point of collection.
            </p>
            <p>
              <strong>Message types:</strong> onboarding messages, daily curiosity
              quests, service replies, account or billing notices (if applicable), and
              occasional service-related updates.
            </p>
            <p>
              <strong>Message frequency:</strong> {LEGAL.messageFrequency}.
            </p>
            <p>
              <strong>Costs:</strong> Message and data rates may apply. Check with your
              mobile carrier for details.
            </p>
            <p>
              <strong>Opt-out:</strong> Reply <strong>STOP</strong> at any time to
              cancel SMS from Else. After you send STOP, we will send a confirmation and
              you will receive no further messages unless you re-opt in.
            </p>
            <p>
              <strong>Help:</strong> Reply <strong>HELP</strong> for assistance or email{" "}
              <a href={`mailto:${LEGAL.email}`} className="text-pool-blue hover:underline">
                {LEGAL.email}
              </a>
              .
            </p>
            <p>
              <strong>Consent:</strong> Consent to receive SMS is not a condition of
              purchase.
            </p>
            <p>
              <strong>Carriers:</strong> Wireless carriers are not liable for delayed or
              undelivered messages.
            </p>
          </Section>

          <Section title="7. How we share information">
            <p>We may share information in these circumstances:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Service providers:</strong> vendors that help us operate Else
                (SMS delivery such as Telnyx, cloud hosting, database, AI processing,
                email, and payment processing if enabled), subject to contractual
                obligations
              </li>
              <li>
                <strong>Legal compliance:</strong> when required by law, regulation,
                legal process, or governmental request
              </li>
              <li>
                <strong>Protection:</strong> to protect the rights, safety, and security
                of Else, our users, or others
              </li>
              <li>
                <strong>Business transfers:</strong> in connection with a merger,
                acquisition, or sale of assets, subject to this policy&rsquo;s protections
                for SMS data
              </li>
            </ul>
            <p>
              We do not share personal information with third parties for their own
              marketing purposes. SMS opt-in data is never shared for marketing, as
              stated in Section 4.
            </p>
          </Section>

          <Section title="8. Cookies & website analytics">
            <p>
              Our website may use essential cookies or similar technologies for basic
              functionality and security. We do not use website cookies to sell your
              personal information or to share SMS opt-in data.
            </p>
          </Section>

          <Section title="9. Data retention">
            <p>
              We retain personal information for as long as your family uses Else and as
              needed to provide the service, comply with legal obligations, resolve
              disputes, and enforce agreements. SMS and message content may be retained
              to personalize future quests and maintain service continuity. You may
              request deletion as described in Section 11.
            </p>
          </Section>

          <Section title="10. Security">
            <p>
              We use reasonable administrative, technical, and organizational measures
              designed to protect personal information. No method of transmission or
              storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="11. Your choices & rights">
            <p>
              <strong>SMS opt-out:</strong> Reply <strong>STOP</strong> to end SMS
              messages from Else.
            </p>
            <p>
              <strong>Access, correction, deletion:</strong> Email{" "}
              <a href={`mailto:${LEGAL.email}`} className="text-pool-blue hover:underline">
                {LEGAL.email}
              </a>{" "}
              to request access to, correction of, or deletion of your personal
              information, subject to applicable law.
            </p>
            <p>
              <strong>California residents:</strong> You may have additional rights
              under the California Consumer Privacy Act (CCPA/CPRA), including the right
              to know, delete, and opt out of certain processing. We do not sell personal
              information. To exercise rights, contact {LEGAL.email}.
            </p>
            <p>
              <strong>Other U.S. state privacy laws:</strong> Where applicable, you may
              have similar rights regarding access, correction, deletion, and opting out
              of certain processing. Contact us to submit a request.
            </p>
          </Section>

          <Section title="12. Children&rsquo;s privacy">
            <p>
              Else is designed for parents and legal guardians. The parent is the SMS
              subscriber and provides information about their child during onboarding.
              We do not knowingly collect personal information directly from children
              under 13 without parental involvement. If you believe we have collected
              information from a child in error, contact {LEGAL.email}.
            </p>
          </Section>

          <Section title="13. International users">
            <p>
              Else is operated from the United States. If you access the service from
              outside the U.S., your information may be processed in the United States or
              other countries where our service providers operate. By using Else, you
              consent to such processing.
            </p>
          </Section>

          <Section title="14. Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. We will post the
              updated policy at {LEGAL.siteUrl}/privacy with a revised effective date.
              Material changes may also be communicated via SMS or email where
              appropriate. Continued use of Else after changes constitutes acceptance of
              the updated policy.
            </p>
          </Section>

          <Section title="15. Contact us">
            <p>
              Questions about this Privacy Policy or our data practices:
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
