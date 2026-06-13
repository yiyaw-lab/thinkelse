"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneDemo } from "@/components/demo/phone-demo";
import { QUEST_NARRATIVE } from "@/components/demo/quest-narrative";

export function ScrollNarrativeSection() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const elements = stepRefs.current.filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIndex = -1;
        let bestRatio = 0;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = elements.indexOf(entry.target as HTMLElement);
          if (index >= 0 && entry.intersectionRatio >= bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIndex = index;
          }
        }

        if (bestIndex >= 0) setActiveStep(bestIndex);
      },
      {
        threshold: [0, 0.25, 0.5, 0.75],
        rootMargin: "-12% 0px -40% 0px",
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeMessages = QUEST_NARRATIVE[activeStep]?.messages ?? QUEST_NARRATIVE[0].messages;

  return (
    <section id="how" className="border-t border-pool-line bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
        <div className="space-y-4">
          {QUEST_NARRATIVE.map((step, index) => {
            const isActive = index === activeStep;
            return (
              <article
                key={step.headline}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                className={`pool-scroll-step max-w-xl transition-all duration-500 ${
                  isActive ? "pool-scroll-step-active" : "pool-scroll-step-idle"
                }`}
              >
                <h2 className="pool-display-sm mb-5">{step.headline}</h2>
                <p className="pool-lead">{step.body}</p>
              </article>
            );
          })}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <PhoneDemo activeStep={activeStep} messages={activeMessages} />
        </div>
      </div>
    </section>
  );
}
