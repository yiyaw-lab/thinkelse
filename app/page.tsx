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

const DEPLOY_SHA = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";
const DEPLOY_ENV = process.env.VERCEL_ENV ?? "development";
const IS_LIVE = DEPLOY_ENV === "production";

function DeployBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium tabular-nums ${className}`}
      style={{
        borderColor: IS_LIVE ? "#bbf7d0" : "#e7e5e4",
        background: IS_LIVE ? "#f0fdf4" : "#fafaf9",
        color: IS_LIVE ? "#166534" : "#57534e",
      }}
      title={`Environment: ${DEPLOY_ENV} · Build ${DEPLOY_SHA}`}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{
          background: IS_LIVE ? "#22c55e" : "#a8a29e",
          boxShadow: IS_LIVE ? "0 0 0 3px rgba(34, 197, 94, 0.2)" : undefined,
        }}
      />
      <span>{IS_LIVE ? "Live" : DEPLOY_ENV}</span>
      <span style={{ color: "#a8a29e" }}>·</span>
      <span className="font-mono">{DEPLOY_SHA}</span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "#fafaf7", color: "#1c1917" }}>
      <nav className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto">
        <span className="text-xl font-semibold tracking-tight">Else</span>
        <DeployBadge />
      </nav>

      <section className="px-6 pt-16 pb-24 max-w-5xl mx-auto">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-8"
          style={{ background: "#eef4f0", color: "#4d6b56" }}
        >
          <span>🌱</span>
          <span>Text-based curiosity coach for families</span>
        </div>

        <p
          className="text-sm font-medium tracking-widest uppercase mb-6"
          style={{ color: "#7c9e87" }}
        >
          Meet Elsy
        </p>
        <h1 className="text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight max-w-2xl mb-8">
          Tiny curiosity quests for your child.
        </h1>
        <p className="text-lg leading-relaxed max-w-xl mb-10" style={{ color: "#57534e" }}>
          Each day, Elsy sends a playful prompt — something to observe, wonder about, or try in
          the real world. You share what your child found. Elsy listens, encourages, and goes
          deeper. All over text.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 text-base font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "#7c9e87" }}
          >
            <span>Text HELLO to {PHONE_NUMBER}</span>
            <span aria-hidden>→</span>
          </a>
          {!telnyxNumber && (
            <p className="text-sm" style={{ color: "#a8a29e" }}>
              Set <code className="font-mono text-xs">TELNYX_PHONE_NUMBER</code> to enable texting
            </p>
          )}
        </div>

        <p className="text-sm" style={{ color: "#a8a29e" }}>
          No app to download. No account to create.
        </p>
      </section>

      <section className="px-6 py-24 border-t" style={{ borderColor: "#e7e5e4" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-sm font-medium tracking-widest uppercase mb-16"
            style={{ color: "#7c9e87" }}
          >
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Tell Elsy about your child",
                body: "Name, age, and what they're into. About two minutes over text.",
              },
              {
                step: "02",
                title: "A quest arrives each day",
                body: "A prompt, a mission, and a question to sit with — at a time you choose.",
              },
              {
                step: "03",
                title: "Share what they found",
                body: "Text back your child's response. Elsy encourages and nudges thinking further.",
              },
            ].map(({ step, title, body }) => (
              <div key={step}>
                <p
                  className="text-4xl font-semibold mb-6 tabular-nums"
                  style={{ color: "#d6d3d1" }}
                >
                  {step}
                </p>
                <h3 className="text-lg font-semibold mb-3 tracking-tight">{title}</h3>
                <p className="leading-relaxed" style={{ color: "#57534e" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24" style={{ background: "#f0f0ec" }}>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="text-sm font-medium tracking-widest uppercase mb-6"
              style={{ color: "#7c9e87" }}
            >
              A quest looks like this
            </h2>
            <p className="text-2xl font-semibold tracking-tight mb-4">
              Real prompts. Real observation. Real wondering.
            </p>
            <p className="leading-relaxed" style={{ color: "#57534e" }}>
              Elsy is warm and playful, but the quests are designed to stretch how kids notice the
              world — not to drill facts.
            </p>
          </div>

          <div
            className="max-w-sm rounded-2xl p-6 shadow-sm lg:ml-auto"
            style={{ background: "#ffffff", border: "1px solid #e7e5e4" }}
          >
            <p className="text-xs font-medium mb-4" style={{ color: "#a8a29e" }}>
              Elsy · 8:00 AM
            </p>
            <p className="font-semibold mb-4">🌱 The Shadow Detective</p>
            <p className="leading-relaxed mb-5" style={{ color: "#1c1917" }}>
              Why do shadows change shape throughout the day?
            </p>
            <div
              className="rounded-xl p-4 mb-4 text-sm leading-relaxed"
              style={{ background: "#fafaf7", color: "#44403c" }}
            >
              <p className="font-medium mb-1">Mission</p>
              <p>
                Go outside at three different times today and look at your shadow. Does it get
                longer or shorter?
              </p>
            </div>
            <div
              className="rounded-xl p-4 text-sm leading-relaxed"
              style={{ background: "#fafaf7", color: "#44403c" }}
            >
              <p className="font-medium mb-1">Think about</p>
              <p>Where do you think your shadow goes at night?</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-28 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl font-semibold tracking-tight mb-6">Start thinking else.</h2>
          <p className="mb-10 leading-relaxed" style={{ color: "#57534e" }}>
            One text to begin. Elsy handles the rest.
          </p>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-3 rounded-full px-7 py-4 text-base font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "#7c9e87" }}
          >
            <span>Text HELLO to {PHONE_NUMBER}</span>
            <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      <footer
        className="px-6 py-8 border-t"
        style={{ borderColor: "#e7e5e4", color: "#a8a29e" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>Else · Think beyond the obvious.</p>
          <DeployBadge />
        </div>
      </footer>
    </div>
  );
}
