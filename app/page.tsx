import { ArrowRight, Eye, HandHeart, ShieldCheck, Sprout } from "lucide-react";
import { ElsyAvatar } from "@/components/brand/elsy-avatar";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { ScrollNarrativeSection } from "@/components/sections/scroll-narrative-section";
import { QuestShowcase } from "@/components/demo/quest-showcase";
import { MarqueeStrip } from "@/components/layout/marquee-strip";
import { SiteHeader } from "@/components/layout/site-header";
import { SITE } from "@/lib/site";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      email: SITE.email,
      description: SITE.description,
    },
  ],
} as const;

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

const SHOW_DEPLOY_BADGE = process.env.VERCEL_ENV !== "production";
const DEPLOY_SHA = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";

const MARQUEE_ITEMS = [
  "Shadow detective",
  "Sound collector",
  "Cloud reporter",
  "Kitchen science",
  "Backyard wonder",
  "Dinner questions",
  "Morning quest",
  "Ages 5–12",
  "iMessage & SMS",
  "2-min setup",
];

const PILLARS = [
  {
    icon: Eye,
    title: "Beyond the first answer",
    body: "Quests train kids to notice, question, and think twice.",
  },
  {
    icon: Sprout,
    title: "Built for real life",
    body: "Short prompts between school and dinner. Observation beats screen time.",
  },
  {
    icon: HandHeart,
    title: "Parent in the loop",
    body: "You relay your child's thinking. Elsy meets them warmly.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "No kid accounts, no tracking feeds, no ads.",
  },
] as const;

function DeployBadge() {
  if (!SHOW_DEPLOY_BADGE) return null;
  return (
    <span className="hidden rounded-full border border-pool-line bg-pool-bg px-2.5 py-1 text-[11px] font-medium text-pool-muted sm:inline-flex">
      {DEPLOY_SHA}
    </span>
  );
}

function PrimaryCta({ className = "" }: { className?: string }) {
  return (
    <a href={PHONE_HREF} className={`btn-pool group flex-col gap-0.5 sm:flex-row sm:gap-2.5 ${className}`}>
      <span className="flex items-center gap-2 text-base font-semibold">
        Text HELLO
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
      <span className="text-sm font-normal text-white/85">{PHONE_NUMBER}</span>
    </a>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-pool-bg text-pool-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <SiteHeader phoneHref={PHONE_HREF} deployBadge={<DeployBadge />} />

      <main id="main">
        {/* Hero */}
        <section className="px-6 pb-16 pt-16 sm:pb-24 sm:pt-24">
          <div className="mx-auto max-w-5xl">
            <p className="pool-eyebrow mb-8">Curiosity by text</p>
            <h1 className="pool-display mb-8 max-w-4xl">
              One question.
              <br />
              One quest.
              <br />
              Each morning.
            </h1>
            <p className="pool-lead mb-10 max-w-2xl">
              Raising thoughtful kids in the AI age. Elsy sends a beautiful
              question and a real-world mission to your phone — just a few
              minutes of wonder.
            </p>

            <div className="flex flex-col items-start gap-5">
              <PrimaryCta />
              <ul className="flex flex-wrap gap-2">
                {["Ages 5–12", "2-min setup", "iMessage & SMS"].map((item) => (
                  <li key={item} className="pool-chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <MarqueeStrip items={MARQUEE_ITEMS} />

        <ScrollNarrativeSection />

        {/* Trust */}
        <section className="border-t border-pool-line px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <blockquote className="pool-display-sm font-normal leading-snug">
              &ldquo;She asked me three more questions at dinner. That never
              happens.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-pool-muted">Parent, early family</p>
          </div>
        </section>

        {/* Quests */}
        <section id="quests" className="border-t border-pool-line bg-white px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <p className="pool-eyebrow mb-4">Example quests</p>
              <h2 className="pool-display-sm mb-4">
                Not worksheets. Windows into the world.
              </h2>
              <p className="pool-lead">
                Every quest has a question, a mission outside, and a follow-up
                that goes one level deeper.
              </p>
            </div>
            <QuestShowcase />
          </div>
        </section>

        {/* Why Else */}
        <section id="why" className="border-t border-pool-line px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <p className="pool-eyebrow mb-4">Why Else</p>
              <h2 className="pool-display-sm">Curiosity, not consumption.</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="pool-panel sm:col-span-2 sm:p-8">
                <p className="pool-lead max-w-2xl">
                  Most kid products optimize for time-on-screen. Else optimizes
                  for moments of noticing — the pause before an answer, the
                  follow-up question, the look when something clicks.
                </p>
              </article>

              {PILLARS.map(({ icon: Icon, title, body }) => (
                <article key={title} className="pool-panel">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-pool-bg">
                    <Icon className="h-5 w-5 text-pool-ink" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold tracking-tight text-pool-ink">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-pool-muted">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-pool-line bg-white px-6 py-24 sm:py-32">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <ElsyAvatar size={72} className="mb-6" />
            <h2 className="pool-display-sm mb-5">Try a tiny quest.</h2>
            <p className="pool-lead mb-8 max-w-md">
              One text to begin. Elsy takes it from there.
            </p>
            <PrimaryCta />
          </div>
        </section>
      </main>

      <footer className="border-t border-pool-line bg-pool-bg px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4">
              <ElsyAvatar size={40} />
              <div>
                <LogoLockup markSize={22} showSpark={false} />
                <p className="mt-2 text-sm text-pool-muted">
                  Curiosity changes everything.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-pool-ink">Else</p>
            <ul className="space-y-2 text-sm text-pool-muted">
              <li>
                <a href="#how" className="hover:text-pool-blue">
                  How it works
                </a>
              </li>
              <li>
                <a href="#quests" className="hover:text-pool-blue">
                  Example quests
                </a>
              </li>
              <li>
                <a href="#why" className="hover:text-pool-blue">
                  Why Else
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-pool-blue">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-pool-blue">
                  Terms
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-pool-ink">Contact</p>
            <ul className="space-y-2 text-sm text-pool-muted">
              <li>
                <a href="mailto:hello@elsey.app" className="hover:text-pool-blue">
                  hello@elsey.app
                </a>
              </li>
              <li>
                <a href={PHONE_HREF} className="hover:text-pool-blue">
                  {PHONE_NUMBER}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
