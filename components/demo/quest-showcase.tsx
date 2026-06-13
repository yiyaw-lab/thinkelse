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
                ? "bg-white text-pool-ink shadow-sm ring-1 ring-pool-line"
                : "text-pool-muted hover:bg-white hover:text-pool-ink"
            }`}
          >
            {q.title}
          </button>
        ))}
      </nav>

      <article key={quest.id} className="pool-panel demo-quest-card sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ElsyAvatar size={28} />
            <span className="pool-eyebrow text-[0.6875rem]">{quest.tag}</span>
          </div>
          <span className="pool-chip text-xs">{quest.time}</span>
        </div>

        <h3 className="pool-display-sm mb-3 text-[1.75rem]">{quest.title}</h3>
        <p className="mb-6 text-lg leading-relaxed text-pool-muted">{quest.question}</p>

        <div className="mb-3 rounded-xl bg-pool-bg p-5">
          <p className="mb-1.5 pool-eyebrow text-[0.6875rem] text-pool-ink">Mission</p>
          <p className="leading-relaxed text-pool-muted">{quest.mission}</p>
        </div>

        <div className="rounded-xl bg-pool-bg p-5">
          <p className="mb-1.5 pool-eyebrow text-[0.6875rem] text-pool-ink">Think about</p>
          <p className="leading-relaxed text-pool-muted">{quest.think}</p>
        </div>
      </article>
    </div>
  );
}
