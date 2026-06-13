"use client";

import { ElsyFace } from "./elsy-face";

type ElsyBuddyProps = {
  className?: string;
  mood?: "curious" | "comforting";
};

/** Full spark mascot — night-light companion with held star. */
export function ElsyBuddy({ className = "", mood = "curious" }: ElsyBuddyProps) {
  const isComforting = mood === "comforting";

  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${isComforting ? "buddy-glow-soft" : "buddy-glow buddy-float"} ${className}`}
      role="img"
      aria-label="Elsy, Else's curiosity companion"
    >
      <ellipse
        cx="60"
        cy="128"
        rx="28"
        ry="5"
        fill="var(--star-300)"
        fillOpacity={isComforting ? "0.12" : "0.2"}
      />

      <g>
        <path
          d="M60 52C60 52 78 68 80 88C82 108 72 118 60 120C48 118 38 108 40 88C42 68 60 52 60 52Z"
          fill="var(--orchid-500)"
          fillOpacity={isComforting ? "0.15" : "0.25"}
        />

        <ellipse cx="48" cy="118" rx="8" ry="5" fill="var(--peach-300)" fillOpacity="0.5" />
        <ellipse cx="72" cy="118" rx="8" ry="5" fill="var(--peach-300)" fillOpacity="0.5" />

        {/* Both arms resting when comforting */}
        <path
          d="M88 78C94 84 96 94 92 102"
          stroke="var(--peach-300)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M32 78C26 84 24 94 28 102"
          stroke="var(--peach-300)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />

        <g transform="translate(20, 8)">
          <ElsyFace blink showStar mood={mood} variant="pastel" />
        </g>

        {!isComforting && (
          <path
            d="M32 76C24 68 20 56 24 46"
            stroke="var(--peach-300)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
        )}
      </g>
    </svg>
  );
}
