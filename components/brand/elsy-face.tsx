"use client";

import { useId } from "react";

type ElsyFaceProps = {
  className?: string;
  blink?: boolean;
  showStar?: boolean;
  mood?: "curious" | "comforting";
  variant?: "night" | "pastel";
};

/**
 * Elsy spark face — flame silhouette with optional held star.
 * 80×80 unit space.
 */
export function ElsyFace({
  className = "",
  blink = false,
  showStar = false,
  mood = "curious",
  variant = "pastel",
}: ElsyFaceProps) {
  const uid = useId().replace(/:/g, "");
  const bodyGrad = `elsy-body-${uid}`;
  const blinkClass = blink ? "buddy-blink" : undefined;
  const isComforting = mood === "comforting";
  const isPastel = variant === "pastel";
  const starY = isComforting ? 56 : 62;
  const starClass = isComforting ? "star-pulse-slow" : "star-pulse";

  return (
    <g className={className}>
      <ellipse
        cx="40"
        cy="48"
        rx="32"
        ry="34"
        fill={isPastel ? "#b8a6f5" : "var(--orchid-500)"}
        fillOpacity={isComforting ? "0.1" : "0.16"}
      />

      <path
        d="M40 10C40 10 51 23 53 38C55 53 48 66 40 70C32 66 25 53 27 38C29 23 40 10 40 10Z"
        fill={`url(#${bodyGrad})`}
        stroke={isPastel ? "#d4c4ff" : "var(--violet-300)"}
        strokeWidth="1.25"
        strokeOpacity="0.65"
      />

      <path
        d="M40 15C40 15 35 10 31 13C28 16 30 20 34 18"
        stroke="#f8e9b8"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      <ellipse cx="40" cy="45" rx="16" ry="18" fill="#fff" fillOpacity="0.14" />

      <ellipse
        cx="28"
        cy="49"
        rx="4.5"
        ry="3"
        fill={isPastel ? "#f0b8d8" : "var(--blush-400)"}
        fillOpacity="0.45"
      />
      <ellipse
        cx="52"
        cy="49"
        rx="4.5"
        ry="3"
        fill={isPastel ? "#f0b8d8" : "var(--blush-400)"}
        fillOpacity="0.45"
      />

      <g className={blinkClass}>
        <ellipse cx="33" cy="43" rx="5.5" ry="6.5" fill="#fff" fillOpacity="0.96" />
        <ellipse cx="33" cy="44" rx="2.8" ry="3.2" fill="#3d3558" />
        <circle cx="32.2" cy="42.5" r="1" fill="#fff" />
      </g>
      <g className={blinkClass}>
        <ellipse cx="47" cy="43" rx="5.5" ry="6.5" fill="#fff" fillOpacity="0.96" />
        <ellipse cx="47" cy="44" rx="2.8" ry="3.2" fill="#3d3558" />
        <circle cx="46.2" cy="42.5" r="1" fill="#fff" />
      </g>

      <path
        d="M35 53.5C37 55.5 43 55.5 45 53.5"
        stroke="#3d3558"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />

      {showStar && (
        <g className={starClass} transform={`translate(40, ${starY})`}>
          <circle cx="0" cy="0" r="9" fill="#f8e9b8" fillOpacity={isComforting ? "0.22" : "0.12"} />
          <path
            d="M0 -5.5C0.4 -1.8 2.8 0 5.5 0C2.8 0 0.4 1.8 0 5.5C-0.4 1.8 -2.8 0 -5.5 0C-2.8 0 -0.4 -1.8 0 -5.5Z"
            fill="#f8e9b8"
          />
        </g>
      )}

      <defs>
        <radialGradient id={bodyGrad} cx="40" cy="38" r="28">
          <stop stopColor={isPastel ? "#f5efff" : "var(--peach-300)"} />
          <stop offset="0.55" stopColor={isPastel ? "#c9b8ff" : "var(--orchid-500)"} stopOpacity="0.95" />
          <stop offset="1" stopColor={isPastel ? "#9f8fef" : "var(--plum-700)"} />
        </radialGradient>
      </defs>
    </g>
  );
}
