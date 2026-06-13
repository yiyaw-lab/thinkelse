"use client";

import { ArrowUp, ChevronLeft, ChevronRight, Mic, Plus, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ElsyAvatar } from "@/components/brand/elsy-avatar";
import {
  type DemoItem,
  type DemoMessage,
  isTimestamp,
  QUEST_NARRATIVE,
} from "@/components/demo/quest-narrative";

type PhoneDemoProps = {
  className?: string;
  activeStep: number;
  messages: readonly DemoItem[];
};

function elsyTypingDelay(message: DemoMessage) {
  return Math.min(1200, 500 + message.text.length * 8);
}

function StatusBar() {
  return (
    <div className="imessage-status-bar" aria-hidden>
      <span>9:41</span>
      <div className="imessage-island" />
      <span className="flex items-center gap-1 text-[0.7rem]">
        <span>5G</span>
        <span className="inline-block h-2.5 w-5 rounded-[2px] border border-current p-px">
          <span className="block h-full w-3/4 rounded-[1px] bg-current" />
        </span>
      </span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="imessage-row imessage-row--received">
      <div className="imessage-typing" aria-label="Elsy is typing">
        <span className="imessage-typing-dot" />
        <span className="imessage-typing-dot [animation-delay:0.15s]" />
        <span className="imessage-typing-dot [animation-delay:0.3s]" />
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: DemoMessage }) {
  if (message.from === "user") {
    return (
      <div className="imessage-row imessage-row--sent demo-message-in">
        <div className="imessage-bubble-sent whitespace-pre-line">{message.text}</div>
      </div>
    );
  }

  return (
    <div className="imessage-row imessage-row--received demo-message-in">
      <div className="imessage-bubble-received whitespace-pre-line">{message.text}</div>
    </div>
  );
}

export function PhoneDemo({ className = "", activeStep, messages }: PhoneDemoProps) {
  const threadRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const prevStepRef = useRef(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [composerText, setComposerText] = useState("");
  const [typing, setTyping] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const targetCount = messages.length;

  function clearTimers() {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }

  function schedule(fn: () => void, ms: number) {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => () => clearTimers(), []);

  // Sync visible messages when scroll step changes
  useEffect(() => {
    clearTimers();
    setTyping(false);
    setComposerText("");

    if (reducedMotion) {
      setVisibleCount(targetCount);
      prevStepRef.current = activeStep;
      return;
    }

    const prevStep = prevStepRef.current;
    if (prevStep === activeStep) return;

    const stepDelta = activeStep - prevStep;
    prevStepRef.current = activeStep;

    if (stepDelta < 0 || stepDelta > 1) {
      setVisibleCount(targetCount);
      return;
    }

    if (stepDelta === 1) {
      const prevTarget = QUEST_NARRATIVE[prevStep]?.messages.length ?? 0;
      setVisibleCount(prevTarget);
    }
  }, [activeStep, targetCount, reducedMotion]);

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [visibleCount, typing, composerText, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    clearTimers();

    if (visibleCount >= targetCount) return;

    const next = messages[visibleCount];
    if (!next) return;

    if (isTimestamp(next)) {
      schedule(() => setVisibleCount((c) => c + 1), 220);
      return clearTimers;
    }

    if (next.from === "user") {
      schedule(() => setComposerText(next.text), 200);
      schedule(() => {
        setComposerText("");
        setVisibleCount((c) => c + 1);
      }, 780);
      return clearTimers;
    }

    schedule(() => setTyping(true), 160);
    schedule(() => {
      setTyping(false);
      setVisibleCount((c) => c + 1);
    }, 160 + elsyTypingDelay(next));

    return clearTimers;
  }, [visibleCount, targetCount, messages, reducedMotion]);

  const visibleItems = messages.slice(0, visibleCount);

  return (
    <div
      className={`relative w-full transition-opacity duration-500 ${className}`}
      aria-label="Else iMessage demo"
    >
      <div className="imessage-device">
        <div className="imessage-screen">
          <StatusBar />

          <div className="imessage-nav">
            <button
              type="button"
              className="flex items-center text-pool-blue"
              aria-hidden
              tabIndex={-1}
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={2.25} />
            </button>

            <div className="imessage-nav-contact">
              <ElsyAvatar size={36} />
              <div className="imessage-nav-name">
                <span>Elsy</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#c7c7cc]" strokeWidth={2.5} />
              </div>
            </div>

            <button
              type="button"
              className="flex items-center justify-end text-pool-blue"
              aria-hidden
              tabIndex={-1}
            >
              <Video className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <div ref={threadRef} className="imessage-thread">
            {visibleItems.map((item) =>
              isTimestamp(item) ? (
                <p key={item.id} className="imessage-timestamp demo-message-in">
                  {item.text}
                </p>
              ) : (
                <MessageBubble key={item.id} message={item} />
              ),
            )}
            {typing && <TypingIndicator />}
          </div>

          <div className="imessage-composer">
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center text-pool-blue"
              aria-hidden
              tabIndex={-1}
            >
              <Plus className="h-6 w-6" strokeWidth={2} />
            </button>
            <div
              className={`imessage-input-pill ${composerText ? "imessage-input-pill--active" : ""}`}
            >
              {composerText || "iMessage"}
            </div>
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center text-pool-blue"
              aria-hidden
              tabIndex={-1}
            >
              {composerText ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pool-blue text-white">
                  <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
              ) : (
                <Mic className="h-5 w-5" strokeWidth={2} />
              )}
            </button>
          </div>

          <div className="imessage-home-indicator" aria-hidden />
        </div>
      </div>
    </div>
  );
}
