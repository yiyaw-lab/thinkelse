import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Else",
  description: "Terms for using Else by SMS.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-pool-bg text-pool-ink">
      <header className="border-b border-pool-line bg-white px-6 py-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-pool-ink hover:text-pool-blue">
            ← Else
          </Link>
          <p className="text-xs text-pool-muted">Last updated June 13, 2026</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="pool-display-sm mb-8">Terms of Service</h1>

        <div className="space-y-8 text-sm leading-relaxed text-pool-ink">
          <section>
            <h2 className="mb-2 text-base font-semibold">Agreement</h2>
            <p className="text-pool-muted">
              By texting <strong>HELLO</strong> to Else, using{" "}
              <a href="https://elsey.app" className="text-pool-blue hover:underline">
                elsey.app
              </a>
              , or otherwise using the Else SMS service, you agree to these Terms and
              our{" "}
              <Link href="/privacy" className="text-pool-blue hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">The service</h2>
            <p className="text-pool-muted">
              Else provides parents with daily curiosity quests and conversational
              coaching by SMS through Elsy, an AI companion. The parent is the
              account holder and relays a child&rsquo;s thinking; children do not
              text Else directly.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">SMS terms</h2>
            <ul className="list-disc space-y-2 pl-5 text-pool-muted">
              <li>
                You consent to receive recurring automated SMS when you opt in (e.g.
                by texting HELLO).
              </li>
              <li>Message frequency varies. Message and data rates may apply.</li>
              <li>
                Reply <strong>STOP</strong> to unsubscribe. Reply <strong>HELP</strong>{" "}
                for help.
              </li>
              <li>
                Supported carriers are not liable for delayed or undelivered messages.
              </li>
              <li>We may change message frequency or content as the product evolves.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Eligibility</h2>
            <p className="text-pool-muted">
              You must be at least 18 years old and a parent or legal guardian to use
              Else on behalf of a child in your care.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Acceptable use</h2>
            <p className="text-pool-muted">
              Do not use Else for unlawful, abusive, or harmful purposes. Do not attempt
              to disrupt the service or misuse automated systems. Elsy provides
              educational coaching, not medical, legal, or emergency advice.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">AI-generated content</h2>
            <p className="text-pool-muted">
              Quests and replies are generated with AI and may occasionally be
              imperfect. You remain responsible for supervising your child&rsquo;s
              participation and judging what is appropriate for your family.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Fees</h2>
            <p className="text-pool-muted">
              Else may offer free trials and paid subscriptions. Applicable fees will
              be disclosed before you are charged. Carrier SMS/data charges still apply.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Disclaimer</h2>
            <p className="text-pool-muted">
              Else is provided &ldquo;as is&rdquo; without warranties of any kind. To
              the fullest extent permitted by law, we disclaim liability for indirect
              or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold">Changes &amp; contact</h2>
            <p className="text-pool-muted">
              We may update these Terms. Continued use after changes constitutes
              acceptance. Questions:{" "}
              <a href="mailto:hello@elsey.app" className="text-pool-blue hover:underline">
                hello@elsey.app
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
