"use client";

import { useId } from "react";

type LogoMarkProps = {
  className?: string;
  size?: number;
  /** Rounded icon tile behind the spark */
  framed?: boolean;
};

/** Spark mark — pastel lavender star with golden center. */
export function LogoMark({ className = "", size = 32, framed = false }: LogoMarkProps) {
  const uid = useId().replace(/:/g, "");
  const sparkGrad = `spark-grad-${uid}`;
  const glowGrad = `spark-glow-${uid}`;

  const spark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="16" cy="16" r="14" fill={`url(#${glowGrad})`} opacity="0.55" />
      <path
        d="M16 4.5C16.8 10.2 20.2 13.8 26 14.8C20.2 15.8 16.8 19.4 16 25C15.2 19.4 11.8 15.8 6 14.8C11.8 13.8 15.2 10.2 16 4.5Z"
        fill={`url(#${sparkGrad})`}
      />
      <circle cx="16" cy="14.5" r="2.2" fill="#f8e9b8" />
      <circle cx="15.2" cy="13.8" r="0.7" fill="#fff" opacity="0.85" />
      <defs>
        <radialGradient id={glowGrad} cx="16" cy="14" r="14">
          <stop stopColor="#e8deff" />
          <stop offset="1" stopColor="#e8deff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={sparkGrad} x1="8" y1="6" x2="24" y2="24">
          <stop stopColor="#d4c4ff" />
          <stop offset="0.55" stopColor="#b8a6f5" />
          <stop offset="1" stopColor="#9f8fef" />
        </linearGradient>
      </defs>
    </svg>
  );

  if (!framed) return spark;

  const frame = Math.round(size * 1.18);

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[28%] bg-pool-lavender-soft ring-1 ring-pool-blue/20"
      style={{ width: frame, height: frame }}
    >
      {spark}
    </span>
  );
}
