type ElsyFaceProps = {
  className?: string;
  blink?: boolean;
  showStar?: boolean;
  mood?: "curious" | "comforting";
};

/**
 * Shared Elsy spark face — flame/spark silhouette with crescent curl.
 * 80×80 unit space.
 */
export function ElsyFace({
  className = "",
  blink = false,
  showStar = false,
  mood = "curious",
}: ElsyFaceProps) {
  const blinkClass = blink ? "buddy-blink" : undefined;
  const isComforting = mood === "comforting";
  const starY = isComforting ? 56 : 62;
  const starClass = isComforting ? "star-pulse-slow" : "star-pulse";

  return (
    <g className={className}>
      <ellipse
        cx="40"
        cy="48"
        rx="32"
        ry="34"
        fill="var(--orchid-500)"
        fillOpacity={isComforting ? "0.08" : "0.15"}
      />

      {/* Flame / spark body */}
      <path
        d="M40 8C40 8 52 22 54 38C56 54 48 68 40 72C32 68 24 54 26 38C28 22 40 8 40 8Z"
        fill="url(#elsy-body-grad)"
        stroke="var(--violet-300)"
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />

      {/* Crescent curl at top */}
      <path
        d="M40 14C40 14 34 8 30 12C27 15 29 20 34 18"
        stroke="var(--star-300)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* Inner warmth */}
      <ellipse cx="40" cy="46" rx="18" ry="20" fill="#fff" fillOpacity="0.12" />

      {/* Blush */}
      <ellipse cx="28" cy="50" rx="5" ry="3.5" fill="var(--blush-400)" fillOpacity="0.5" />
      <ellipse cx="52" cy="50" rx="5" ry="3.5" fill="var(--blush-400)" fillOpacity="0.5" />

      {/* Eyes — glossy ovals, slightly below midpoint */}
      <g className={blinkClass}>
        <ellipse cx="33" cy="44" rx="6" ry="7" fill="#fff" fillOpacity="0.95" />
        <ellipse cx="33" cy="45" rx="3" ry="3.5" fill="var(--ink-800)" />
        <circle cx="32" cy="43.5" r="1.2" fill="#fff" />
      </g>
      <g className={blinkClass}>
        <ellipse cx="47" cy="44" rx="6" ry="7" fill="#fff" fillOpacity="0.95" />
        <ellipse cx="47" cy="45" rx="3" ry="3.5" fill="var(--ink-800)" />
        <circle cx="46" cy="43.5" r="1.2" fill="#fff" />
      </g>

      {/* Tiny smile */}
      <path
        d="M35 54C37 56 43 56 45 54"
        stroke="var(--ink-800)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />

      {/* Held star */}
      {showStar && (
        <g className={starClass} transform={`translate(40, ${starY})`}>
          <circle cx="0" cy="0" r="10" fill="var(--star-300)" fillOpacity={isComforting ? "0.25" : "0"} />
          <path
            d="M0 -6C0.5 -2 3 0 6 0C3 0 0.5 2 0 6C-0.5 2 -3 0 -6 0C-3 0 -0.5 -2 0 -6Z"
            fill="var(--star-300)"
          />
        </g>
      )}

      <defs>
        <radialGradient id="elsy-body-grad" cx="40" cy="40" r="30">
          <stop stopColor="var(--peach-300)" />
          <stop offset="0.6" stopColor="var(--orchid-500)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--plum-700)" />
        </radialGradient>
      </defs>
    </g>
  );
}
