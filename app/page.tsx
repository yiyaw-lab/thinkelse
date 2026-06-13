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

export default function Home() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "#fafaf7", color: "#1c1917" }}>
      {/* Nav */}
      <nav className="px-6 py-6 flex items-center justify-between max-w-5xl mx-auto">
        <span className="text-xl font-semibold tracking-tight">Else</span>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-28 max-w-5xl mx-auto">
        <p
          className="text-sm font-medium tracking-widest uppercase mb-8"
          style={{ color: "#7c9e87" }}
        >
          Meet Elsy
        </p>
        <h1 className="text-5xl sm:text-6xl font-semibold leading-tight tracking-tight max-w-2xl mb-8">
          Tiny curiosity quests for your child.
        </h1>
        <p className="text-lg leading-relaxed max-w-xl mb-12" style={{ color: "#57534e" }}>
          Each day, Elsy sends your child a playful prompt — something to observe, wonder about,
          or try in the real world. You share what they found. Elsy listens, encourages, and
          goes deeper. All over text.
        </p>
        <a
          href={PHONE_HREF}
          className="inline-flex items-center gap-3 rounded-full px-7 py-4 text-base font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "#7c9e87" }}
        >
          <span>Text HELLO to {PHONE_NUMBER}</span>
          <span aria-hidden>→</span>
        </a>
      </section>

      {/* How it works */}
      <section
        className="px-6 py-24 border-t"
        style={{ borderColor: "#e7e5e4" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium tracking-widest uppercase mb-16" style={{ color: "#7c9e87" }}>
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Tell Elsy about your child",
                body: "Elsy asks a few quick questions — your child's name, age, and what they're into. It takes about two minutes.",
              },
              {
                step: "02",
                title: "A quest arrives each day",
                body: "At a time you choose, Elsy sends a short curiosity quest — a prompt, a mission, and a question to sit with.",
              },
              {
                step: "03",
                title: "Share what they found",
                body: "Text Elsy your child's response. Elsy reacts with genuine warmth and nudges their thinking one step further.",
              },
            ].map(({ step, title, body }) => (
              <div key={step}>
                <p className="text-4xl font-semibold mb-6 tabular-nums" style={{ color: "#d6d3d1" }}>
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

      {/* Sample quest */}
      <section className="px-6 py-24" style={{ background: "#f0f0ec" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium tracking-widest uppercase mb-16" style={{ color: "#7c9e87" }}>
            A quest looks like this
          </h2>
          <div
            className="max-w-sm rounded-2xl p-6 shadow-sm"
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
                longer or shorter? Which way does it point?
              </p>
            </div>
            <div
              className="rounded-xl p-4 text-sm leading-relaxed"
              style={{ background: "#fafaf7", color: "#44403c" }}
            >
              <p className="font-medium mb-1">Think about</p>
              <p>If you could follow your shadow around all day, where do you think it goes at night?</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-32 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl font-semibold tracking-tight mb-6">
            Start thinking else.
          </h2>
          <p className="mb-10 leading-relaxed" style={{ color: "#57534e" }}>
            No app to download. No account to create. Just text.
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

      {/* Footer */}
      <footer
        className="px-6 py-8 border-t text-sm text-center"
        style={{ borderColor: "#e7e5e4", color: "#a8a29e" }}
      >
        Else · Think beyond the obvious.
      </footer>
    </div>
  );
}
