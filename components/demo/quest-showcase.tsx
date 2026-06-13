"use client";

import { useState } from "react";
import { ElsyAvatar } from "@/components/brand/elsy-avatar";

const QUESTS = [
  {
    id: "shadow",
    title: "The Shadow Detective",
    question: "Why do shadows change shape throughout the day?",
    mission:
      "Go outside at three different times today and look at your shadow. Does it get longer or shorter?",
    think:
      "If you could follow your shadow around all day, where do you think it goes at night?",
    tag: "Observation",
    time: "~15 min · outside",
  },
  {
    id: "sound",
    title: "The Sound Collector",
    question: "What sounds can you hear that you usually ignore?",
    mission:
      "Sit quietly for two minutes in three different rooms. Write down one surprising sound from each.",
    think: "Why do some sounds feel loud indoors but quiet when you're outside?",
    tag: "Listening",
    time: "~10 min · at home",
  },
  {
    id: "cloud",
    title: "The Cloud Reporter",
    question: "Do clouds move, or does it just look that way?",
    mission:
      "Pick one cloud and watch it for five minutes. Sketch its shape at the start and end.",
    think: "What do you think clouds are made of — and how would you find out?",
    tag: "Wondering",
    time: "~15 min · outside",
  },
] as const;

export function QuestShowcase() {
  const [active, setActive] = useState(0);
  const quest = QUESTS[active];

  return (
    <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr]">
      <nav className="flex flex-row gap-2 lg:flex-col" aria-label="Example quests">
        {QUESTS.map((q, i) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
              i === active
                ? "bg-white/80 text-ink-800 shadow-sm"
                : "text-muted hover:bg-white/40 hover:text-ink-800"
            }`}
          >
            {q.title}
          </button>
        ))}
      </nav>

      <article key={quest.id} className="surface-glass depth-lift demo-quest-card rounded-2xl p-7 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ElsyAvatar size={32} depth3d />
            <span className="t-label text-muted">{quest.tag}</span>
          </div>
          <span className="chip text-xs">{quest.time}</span>
        </div>

        <h3 className="t-h2 mb-3 text-ink-800">{quest.title}</h3>
        <p className="mb-6 text-lg leading-relaxed text-muted">{quest.question}</p>

        <div className="mb-3 rounded-xl bg-rose-100/50 p-5">
          <p className="mb-1.5 t-label text-ink-800">Mission</p>
          <p className="leading-relaxed text-muted">{quest.mission}</p>
        </div>

        <div className="rounded-xl bg-mint-200/30 p-5">
          <p className="mb-1.5 t-label text-ink-800">Think about</p>
          <p className="leading-relaxed text-muted">{quest.think}</p>
        </div>
      </article>
    </div>
  );
}
