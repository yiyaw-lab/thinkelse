"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { ElsyAvatar } from "@/components/brand/elsy-avatar";

type Scene = {
  id: string;
  label: string;
  messages: Message[];
};

type Message = {
  id: string;
  from: "user" | "elsy";
  text: string;
  meta?: string;
  card?: {
    label: string;
    title: string;
    body: string;
    mission?: string;
  };
};

const SCENES: Scene[] = [
  {
    id: "onboard",
    label: "Hello",
    messages: [
      { id: "1", from: "user", text: "HELLO" },
      {
        id: "2",
        from: "elsy",
        text: "Welcome to Else! I'm Elsy, your family's curiosity coach. Tell me a little about your explorer — their name, age, and what kinds of questions light them up. We'll send the first quest tomorrow morning.",
      },
      {
        id: "3",
        from: "elsy",
        text: "Perfect — you're all set. Look for your first quest tomorrow at 8:00 AM. In the meantime, keep an eye out for one beautiful question today.",
      },
    ],
  },
  {
    id: "quest",
    label: "Quest",
    messages: [
      {
        id: "1",
        from: "elsy",
        meta: "Today's quest · 8:00 AM",
        text: "",
        card: {
          label: "Daily quest",
          title: "The Shadow Detective",
          body: "Why do shadows change shape throughout the day? What do you think is making them stretch and shrink?",
          mission:
            "Go outside at three different times today. Trace your shadow with chalk each time and notice when it's longest and shortest.",
        },
      },
      {
        id: "2",
        from: "elsy",
        text: "Text me back when they've tried the mission — I'll send a follow-up to stretch their thinking one level deeper.",
      },
    ],
  },
  {
    id: "followup",
    label: "Deeper",
    messages: [
      {
        id: "1",
        from: "user",
        text: "Mira noticed her shadow was longest right before dinner, and she wondered if shadows ever disappear completely.",
      },
      {
        id: "2",
        from: "elsy",
        text: "Sharp noticing — that's exactly the kind of observation quests are built for. Ask her: where do shadows go when clouds cover the sky? See what theory she comes up with before you explain.",
      },
    ],
  },
];

function TypingIndicator() {
  return (
    <div className="flex max-w-[72%] items-center gap-1.5 rounded-2xl rounded-bl-md bg-cream-50/90 px-4 py-3">
      <span className="demo-typing-dot h-1.5 w-1.5 rounded-full bg-muted-fg/50" />
      <span className="demo-typing-dot h-1.5 w-1.5 rounded-full bg-muted-fg/50 [animation-delay:0.15s]" />
      <span className="demo-typing-dot h-1.5 w-1.5 rounded-full bg-muted-fg/50 [animation-delay:0.3s]" />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.from === "user") {
    return (
      <div className="ml-auto max-w-[82%] animate-[demo-in_0.4s_ease-out]">
        <div className="rounded-2xl rounded-br-md bg-orchid-500 px-4 py-2.5 text-[13px] font-medium leading-relaxed text-white">
          {message.text}
        </div>
      </div>
    );
  }

  if (message.card && !message.text) {
    return (
      <div className="max-w-[94%] animate-[demo-in_0.4s_ease-out]">
        {message.meta && (
          <p className="mb-1.5 t-label text-violet-300">{message.meta}</p>
        )}
        <div className="surface-glass overflow-hidden rounded-2xl">
          <div className="border-b border-border bg-rose-100/50 px-3.5 py-2">
            <p className="t-label text-muted">{message.card.label}</p>
          </div>
          <div className="space-y-2.5 p-3.5">
            <p className="font-display text-[15px] font-semibold leading-snug text-ink-800">
              {message.card.title}
            </p>
            <p className="text-[13px] leading-relaxed text-muted">{message.card.body}</p>
            {message.card.mission && (
              <div className="rounded-xl bg-mint-200/40 px-3 py-2.5">
                <p className="mb-0.5 t-label text-ink-800">Mission</p>
                <p className="text-[13px] leading-relaxed text-muted">
                  {message.card.mission}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[88%] animate-[demo-in_0.4s_ease-out]">
      {message.text && (
        <div className="rounded-2xl rounded-bl-md bg-cream-50/95 px-4 py-2.5 text-[13px] leading-relaxed text-ink-800">
          {message.text}
        </div>
      )}
    </div>
  );
}

export function PhoneDemo({ className = "" }: { className?: string }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  const scene = SCENES[sceneIndex];
  const messages = scene.messages;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    setVisibleCount(0);
    setTyping(false);
  }, [sceneIndex]);

  useEffect(() => {
    if (paused || reducedMotion) {
      if (reducedMotion) setVisibleCount(messages.length);
      return;
    }

    if (visibleCount >= messages.length) {
      const pause = window.setTimeout(() => {
        setSceneIndex((i) => (i + 1) % SCENES.length);
      }, 2800);
      return () => window.clearTimeout(pause);
    }

    const next = messages[visibleCount];
    const isElsy = next.from === "elsy";
    const delay = visibleCount === 0 ? 400 : isElsy ? 1100 : 750;

    if (isElsy && visibleCount > 0) {
      setTyping(true);
      const typingTimer = window.setTimeout(() => {
        setTyping(false);
        setVisibleCount((c) => c + 1);
      }, delay);
      return () => window.clearTimeout(typingTimer);
    }

    const timer = window.setTimeout(() => setVisibleCount((c) => c + 1), delay);
    return () => window.clearTimeout(timer);
  }, [visibleCount, messages, reducedMotion, paused]);

  return (
    <div
      className={`relative mx-auto w-full max-w-[360px] ${className}`}
      aria-label="Else SMS demo"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="surface-glass depth-float overflow-hidden rounded-2xl">
        <div className="flex items-center gap-3 border-b border-border bg-white/60 px-4 py-3.5">
          <ElsyAvatar size={36} alive depth3d />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink-800">Elsy</p>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-mint-200" aria-hidden />
              curiosity coach
            </p>
          </div>
        </div>

        <div className="flex min-h-[400px] flex-col justify-end gap-2.5 bg-cream-50/50 p-4">
          {messages.slice(0, visibleCount).map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {typing && <TypingIndicator />}
        </div>

        <div className="border-t border-border bg-white/40 px-4 py-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-cream-50/80 px-3.5 py-2 text-sm text-muted">
            <span className="flex-1">Message</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orchid-500 text-white">
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-[280px] gap-2">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSceneIndex(i)}
            aria-pressed={i === sceneIndex}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              i === sceneIndex
                ? "bg-orchid-500 text-white"
                : "bg-white/60 text-muted hover:text-ink-800"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
