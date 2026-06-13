import { ArrowRight, Eye, HandHeart, ShieldCheck, Sprout } from "lucide-react";
import { HeroVisual } from "@/components/brand/hero-visual";
import { ElsyAvatar } from "@/components/brand/elsy-avatar";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { PhoneDemo } from "@/components/demo/phone-demo";
import { QuestShowcase } from "@/components/demo/quest-showcase";
import { SiteHeader } from "@/components/layout/site-header";

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

const QUEST_FLOW = [
  {
    step: "Spark",
    body: "A beautiful question arrives in your messages each morning.",
  },
  {
    step: "Wonder",
    body: "Your child sits with why it's interesting — no rush to answer.",
  },
  {
    step: "Quest",
    body: "A small real-world mission: notice, sketch, listen, or try.",
  },
  {
    step: "Talk",
    body: "You text back what they found. Elsy meets them with warmth.",
  },
  {
    step: "Reflect",
    body: "A gentle follow-up stretches the thinking one level deeper.",
  },
] as const;

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
    <span className="hidden rounded-full border border-border-soft bg-white/60 px-2.5 py-1 text-[11px] font-medium text-muted sm:inline-flex">
      {DEPLOY_SHA}
    </span>
  );
}

function PrimaryCta({
  className = "",
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <a
      href={PHONE_HREF}
      className={`btn-primary group flex-col gap-0.5 sm:flex-row sm:gap-2.5 ${
        inverted ? "bg-white text-ink-800 hover:bg-cream-50 hover:shadow-none" : ""
      } ${className}`}
    >
      <span className="flex items-center gap-2 text-base font-semibold">
        Text HELLO
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
      <span className={`text-sm font-normal ${inverted ? "text-muted" : "text-white/85"}`}>
        {PHONE_NUMBER}
      </span>
    </a>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-card focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <SiteHeader phoneHref={PHONE_HREF} deployBadge={<DeployBadge />} />

      <main id="main">
        {/* Hero */}
        <section className="bg-night-wonder star-dust depth-atmosphere relative overflow-hidden px-6 pb-24 pt-12 text-cream-50 sm:pt-20">
          <div className="depth-bokeh depth-bokeh-1" aria-hidden />
          <div className="depth-bokeh depth-bokeh-2" aria-hidden />
          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="t-label mb-6 text-violet-300">Curiosity by text</p>
              <h1 className="t-hero mb-6 text-cream-50">
                One question. One quest. Each morning.
              </h1>
              <p className="mb-3 max-w-xl text-lg leading-relaxed text-violet-300">
                Raising thoughtful kids in the AI age.
              </p>
              <p className="mb-8 max-w-xl leading-relaxed text-cream-50/80">
                Elsy sends a beautiful question and a real-world mission to your
                phone — no app, no kid account, just a few minutes of wonder.
              </p>

              <div className="flex flex-col items-start gap-5">
                <PrimaryCta />
                <ul className="flex flex-wrap gap-2">
                  {["Ages 5–12", "2-min setup", "iMessage & SMS"].map((item) => (
                    <li
                      key={item}
                      className="chip border-white/20 bg-white/10 text-violet-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="bg-soft-morning border-b border-border-soft px-6 py-14">
          <div className="mx-auto max-w-3xl text-center">
            <blockquote className="font-display text-xl leading-relaxed text-ink-800 sm:text-2xl">
              &ldquo;She asked me three more questions at dinner. That never
              happens.&rdquo;
            </blockquote>
            <p className="mt-3 text-sm text-muted">Parent, early family</p>
            <p className="t-hand mt-8 text-xl text-orchid-500">
              Our ritual: one question, one quest, one magical moment at a time.
            </p>
          </div>
        </section>

        {/* Quest flow */}
        <section id="how" className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="reveal mb-14 max-w-2xl">
              <p className="t-label mb-3 text-muted">How a quest works</p>
              <h2 className="t-h2 text-ink-800">From spark to reflection.</h2>
              <p className="mt-4 leading-relaxed text-muted">
                Every quest follows the same gentle rhythm — delivered by text,
                lived in the real world.
              </p>
            </div>

            <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
              <div
                className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-border lg:block"
                aria-hidden
              />
              {QUEST_FLOW.map(({ step, body }, i) => (
                <li key={step} className="reveal relative">
                  <article className="surface-glass depth-lift relative z-10 h-full rounded-2xl p-5">
                    <span className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-ink-800 text-xs font-semibold text-cream-50">
                      {i + 1}
                    </span>
                    <h3 className="t-h3 mb-2 text-ink-800">{step}</h3>
                    <p className="text-sm leading-relaxed text-muted">{body}</p>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Messages proof */}
        <section className="bg-soft-morning px-6 py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
            <div className="reveal max-w-xl">
              <p className="t-label mb-3 text-muted">By text</p>
              <h2 className="t-h2 mb-5 text-ink-800">
                A thoughtful friend, in the app you already use.
              </h2>
              <p className="leading-relaxed text-muted">
                No dashboard. No streaks. No logins. Elsy handles onboarding,
                sends the daily quest, and follows up — all in your messages app.
              </p>
            </div>
            <div className="reveal flex justify-center lg:justify-end">
              <PhoneDemo />
            </div>
          </div>
        </section>

        {/* Quests */}
        <section id="quests" className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="reveal mb-12 max-w-2xl">
              <p className="t-label mb-3 text-muted">Example quests</p>
              <h2 className="t-h2 mb-4 text-ink-800">
                Not worksheets. Windows into the world.
              </h2>
              <p className="leading-relaxed text-muted">
                Every quest has a question, a mission outside, and a follow-up
                that goes one level deeper.
              </p>
            </div>
            <div className="reveal">
              <QuestShowcase />
            </div>
          </div>
        </section>

        {/* Why Else */}
        <section id="why" className="bg-soft-morning px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 lg:grid-cols-4 lg:grid-rows-2">
              <article className="reveal surface-glass flex flex-col justify-between rounded-2xl bg-rose-100/60 p-8 lg:col-span-2 lg:row-span-2">
                <p className="t-label text-muted">Why Else</p>
                <div className="mt-8">
                  <h2 className="t-h2 mb-4 text-ink-800">Curiosity, not consumption.</h2>
                  <p className="max-w-md leading-relaxed text-muted">
                    Most kid products optimize for time-on-screen. Else optimizes
                    for moments of noticing — the pause before an answer, the
                    follow-up question, the look when something clicks.
                  </p>
                </div>
              </article>

              {PILLARS.map(({ icon: Icon, title, body }) => (
                <article key={title} className="reveal surface-glass rounded-2xl p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-ink-800/5">
                    <Icon className="h-5 w-5 text-ink-800" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="t-h3 mb-2 text-ink-800">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-night-wonder star-dust depth-atmosphere relative overflow-hidden px-6 py-24 text-cream-50 sm:py-32">
          <div className="depth-bokeh depth-bokeh-3" aria-hidden />
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
            <ElsyAvatar
              size={112}
              glow
              alive
              depth3d
              className="reveal mb-4"
            />
            <h2 className="t-display reveal mb-6">Try a tiny quest.</h2>
            <p className="reveal mb-8 max-w-md leading-relaxed text-violet-300">
              One text to begin. Elsy takes it from there.
            </p>
            <div className="reveal">
              <PrimaryCta inverted />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-soft bg-cream-50 px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <ElsyAvatar size={56} glow alive depth3d className="shrink-0" />
            <div>
              <LogoLockup markSize={24} showSpark={false} />
              <p className="mt-2 text-sm text-muted">Curiosity changes everything.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm text-muted sm:items-end">
            <a href="mailto:hello@elsey.app" className="hover:text-orchid-500">
              hello@elsey.app
            </a>
            <a href={PHONE_HREF} className="hover:text-orchid-500">
              {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
