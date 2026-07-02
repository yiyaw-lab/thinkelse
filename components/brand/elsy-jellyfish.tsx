"use client";

import { useEffect, useId, useState } from "react";

type ElsyJellyfishProps = {
  className?: string;
  height?: number;
  interactive?: boolean;
  showControls?: boolean;
};

export function ElsyJellyfish({
  className = "",
  height = 520,
  showControls = false,
}: ElsyJellyfishProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const uid = useId().replace(/:/g, "");
  const ids = {
    bell: `elsy-bell-${uid}`,
    bellGlow: `elsy-bell-glow-${uid}`,
    rim: `elsy-rim-${uid}`,
    rimShadow: `elsy-rim-shadow-${uid}`,
    shellSheen: `elsy-shell-sheen-${uid}`,
    caustic: `elsy-caustic-${uid}`,
    eye: `elsy-eye-${uid}`,
    cheek: `elsy-cheek-${uid}`,
    tentacleA: `elsy-tentacle-a-${uid}`,
    tentacleB: `elsy-tentacle-b-${uid}`,
    blushFilter: `elsy-blush-filter-${uid}`,
    softBlur: `elsy-soft-blur-${uid}`,
    shadow: `elsy-shadow-${uid}`,
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-pool-line bg-gradient-to-b from-[#fffaff] via-[#f7f0ff] to-[#ede5ff] ${className}`}
      style={{ height }}
      role="img"
      aria-label="Elsy as a warm, softly glowing moon jellyfish companion"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 34%, rgba(255,222,239,0.38), transparent 42%), radial-gradient(circle at 50% 64%, rgba(214,199,255,0.34), transparent 52%), linear-gradient(180deg, rgba(255,255,255,0.42), rgba(238,230,255,0.34))",
        }}
      />

      <svg
        viewBox="0 0 900 640"
        className={`relative z-10 h-full w-full ${reducedMotion ? "" : "elsy-live"}`}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={ids.bell} cx="56%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#fff7ee" />
            <stop offset="26%" stopColor="#ffd8eb" />
            <stop offset="58%" stopColor="#efdcff" />
            <stop offset="100%" stopColor="#bca9df" />
          </radialGradient>

          <radialGradient id={ids.bellGlow} cx="55%" cy="42%" r="54%">
            <stop offset="0%" stopColor="#fff7c9" stopOpacity="0.72" />
            <stop offset="52%" stopColor="#ffcce5" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ffcce5" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={ids.rim} x1="210" x2="690" y1="363" y2="363">
            <stop offset="0%" stopColor="#c7b8ee" />
            <stop offset="35%" stopColor="#ffd3e6" />
            <stop offset="68%" stopColor="#fff0b8" />
            <stop offset="100%" stopColor="#d1c2ff" />
          </linearGradient>

          <linearGradient id={ids.rimShadow} x1="210" x2="690" y1="390" y2="390">
            <stop offset="0%" stopColor="#8f7fc1" stopOpacity="0.46" />
            <stop offset="45%" stopColor="#b991c1" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#8f7fc1" stopOpacity="0.42" />
          </linearGradient>

          <linearGradient id={ids.shellSheen} x1="280" x2="650" y1="170" y2="344">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="38%" stopColor="#ffffff" stopOpacity="0.34" />
            <stop offset="58%" stopColor="#fff5cb" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id={ids.caustic} x1="270" x2="640" y1="220" y2="340">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.24" />
            <stop offset="62%" stopColor="#fff4bc" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <radialGradient id={ids.eye} cx="34%" cy="27%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="22%" stopColor="#ffffff" />
            <stop offset="28%" stopColor="#352d4c" />
            <stop offset="100%" stopColor="#1d1730" />
          </radialGradient>

          <radialGradient id={ids.cheek} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff8dbd" stopOpacity="0.9" />
            <stop offset="58%" stopColor="#ff8dbd" stopOpacity="0.44" />
            <stop offset="100%" stopColor="#ff8dbd" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={ids.tentacleA} x1="0" x2="0" y1="360" y2="594">
            <stop offset="0%" stopColor="#fff2b6" />
            <stop offset="48%" stopColor="#f3b4d6" />
            <stop offset="100%" stopColor="#b7a6ef" />
          </linearGradient>

          <linearGradient id={ids.tentacleB} x1="0" x2="0" y1="360" y2="594">
            <stop offset="0%" stopColor="#c7f2ff" />
            <stop offset="55%" stopColor="#c9b8ff" />
            <stop offset="100%" stopColor="#ffb9d7" />
          </linearGradient>

          <filter id={ids.blushFilter} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>

          <filter id={ids.softBlur} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>

          <filter id={ids.shadow} x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="13" />
            <feOffset dx="0" dy="16" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.22" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="elsy-scene">
          <ellipse cx="450" cy="570" rx="164" ry="28" fill="#6a5b94" opacity="0.12" filter={`url(#${ids.softBlur})`} />

          <g className="elsy-drift">
            <g className="elsy-tentacles" strokeLinecap="round" fill="none">
              <path
                className="elsy-tentacle elsy-tentacle-one"
                d="M420 350 C405 406 426 446 408 500 C396 536 386 555 378 590"
                stroke={`url(#${ids.tentacleB})`}
                strokeWidth="16"
              />
              <path
                className="elsy-tentacle elsy-tentacle-two"
                d="M452 352 C438 418 459 461 445 520 C438 552 427 570 416 604"
                stroke={`url(#${ids.tentacleA})`}
                strokeWidth="18"
              />
              <path
                className="elsy-tentacle elsy-tentacle-three"
                d="M482 350 C498 405 477 454 493 505 C507 550 526 568 534 602"
                stroke={`url(#${ids.tentacleB})`}
                strokeWidth="15"
              />
              <path
                className="elsy-tentacle elsy-tentacle-four"
                d="M510 346 C536 396 526 441 548 492 C566 534 578 558 585 590"
                stroke={`url(#${ids.tentacleA})`}
                strokeWidth="12"
                opacity="0.74"
              />
              <path
                className="elsy-tentacle elsy-tentacle-five"
                d="M392 346 C367 391 377 434 355 484 C338 523 330 552 320 582"
                stroke={`url(#${ids.tentacleA})`}
                strokeWidth="12"
                opacity="0.72"
              />
            </g>

            <g className="elsy-tip-dots">
              {([
                [378, 590, "#b7a6ef"],
                [416, 604, "#ffd78a"],
                [534, 602, "#ff9ec8"],
                [585, 590, "#ffe6a7"],
                [320, 582, "#bfefff"],
              ] as const).map(([cx, cy, fill], index) => (
                <circle key={index} cx={cx} cy={cy} r="15" fill={fill} opacity="0.92" />
              ))}
            </g>

            <g className="elsy-body" filter={`url(#${ids.shadow})`}>
              <path
                className="elsy-bell"
                d="M202 346 C198 221 299 126 450 126 C604 126 704 224 698 346 C696 374 687 389 660 394 C579 410 321 410 240 394 C214 389 204 374 202 346 Z"
                fill={`url(#${ids.bell})`}
              />
              <path
                className="elsy-shell-sheen"
                d="M260 318 C290 195 382 154 486 159 C590 164 653 235 671 337 C584 352 346 353 260 318 Z"
                fill={`url(#${ids.shellSheen})`}
              />
              <g className="elsy-caustics" fill="none" stroke={`url(#${ids.caustic})`} strokeLinecap="round">
                <path d="M312 260 C352 229 417 224 470 244" strokeWidth="5" opacity="0.34" />
                <path d="M382 213 C430 188 507 202 548 239" strokeWidth="4" opacity="0.24" />
                <path d="M290 314 C369 286 537 292 612 324" strokeWidth="3" opacity="0.24" />
              </g>
              <path
                d="M238 362 C334 390 573 390 662 362"
                stroke={`url(#${ids.rimShadow})`}
                strokeWidth="30"
                strokeLinecap="round"
                fill="none"
                opacity="0.28"
              />
              <path
                className="elsy-rim"
                d="M238 362 C334 390 573 390 662 362"
                stroke={`url(#${ids.rim})`}
                strokeWidth="22"
                strokeLinecap="round"
                fill="none"
                opacity="0.82"
              />
              <ellipse className="elsy-inner-glow" cx="474" cy="276" rx="178" ry="104" fill={`url(#${ids.bellGlow})`} opacity="0.72" />
              <path
                d="M238 346 C322 368 579 368 662 346"
                stroke="#fff5ff"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.38"
              />
              <g className="elsy-speculars">
                <circle cx="555" cy="215" r="11" fill="#fffdf7" opacity="0.84" />
                <circle cx="592" cy="254" r="6" fill="#fffdf7" opacity="0.54" />
                <circle cx="350" cy="244" r="7" fill="#fffdf7" opacity="0.48" />
                <circle cx="640" cy="333" r="8" fill="#fffdf7" opacity="0.68" />
                <ellipse cx="582" cy="202" rx="26" ry="7" fill="#ffffff" opacity="0.16" transform="rotate(28 582 202)" />
              </g>
            </g>

            <g className="elsy-face">
              <ellipse cx="450" cy="285" rx="118" ry="62" fill="#ffd4e9" opacity="0.22" />

              <g className="elsy-cheeks">
                <circle cx="346" cy="318" r="31" fill={`url(#${ids.cheek})`} filter={`url(#${ids.blushFilter})`} />
                <circle cx="554" cy="318" r="31" fill={`url(#${ids.cheek})`} filter={`url(#${ids.blushFilter})`} />
                <circle cx="346" cy="318" r="18" fill="#ff8dbd" opacity="0.76" />
                <circle cx="554" cy="318" r="18" fill="#ff8dbd" opacity="0.76" />
              </g>

              <g className="elsy-eyes">
                <ellipse cx="407" cy="275" rx="28" ry="34" fill={`url(#${ids.eye})`} />
                <ellipse cx="493" cy="275" rx="28" ry="34" fill={`url(#${ids.eye})`} />
                <circle cx="397" cy="263" r="9" fill="#ffffff" opacity="0.96" />
                <circle cx="483" cy="263" r="9" fill="#ffffff" opacity="0.96" />
                <circle cx="419" cy="286" r="5" fill="#ffffff" opacity="0.38" />
                <circle cx="505" cy="286" r="5" fill="#ffffff" opacity="0.38" />
              </g>

              <path
                className="elsy-smile"
                d="M397 326 C413 371 489 371 505 326"
                stroke="#342b4f"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                opacity="0.82"
              />
            </g>

            <g className="elsy-sparks">
              {([
                [282, 240, 5, "#fff6cc"],
                [638, 222, 7, "#ffffff"],
                [684, 308, 4, "#fff6cc"],
                [238, 360, 8, "#ffffff"],
                [618, 410, 5, "#fff6cc"],
                [315, 426, 6, "#ffffff"],
              ] as const).map(([cx, cy, r, fill], index) => (
                <circle key={index} cx={cx} cy={cy} r={r} fill={fill} opacity="0.55" />
              ))}
            </g>
          </g>
        </g>
      </svg>

      {showControls ? (
        <p className="absolute right-5 top-5 z-20 rounded-full bg-white/60 px-3 py-1 text-xs text-pool-muted shadow-sm backdrop-blur">
          Wait for her shy hello
        </p>
      ) : null}

      <style>{`
        .elsy-live .elsy-drift {
          animation: elsy-drift 7.2s cubic-bezier(.2,.8,.2,1) infinite;
          transform-origin: 450px 340px;
        }

        .elsy-live .elsy-bell {
          animation: elsy-bell-breathe 7.2s cubic-bezier(.2,.8,.2,1) infinite;
          transform-origin: 450px 350px;
        }

        .elsy-live .elsy-rim,
        .elsy-live .elsy-inner-glow,
        .elsy-live .elsy-shell-sheen,
        .elsy-live .elsy-caustics,
        .elsy-live .elsy-speculars {
          transform-origin: 450px 350px;
        }

        .elsy-live .elsy-rim {
          animation: elsy-rim-squish 7.2s cubic-bezier(.2,.8,.2,1) infinite;
        }

        .elsy-live .elsy-inner-glow {
          animation: elsy-inner-glow 7.2s ease-in-out infinite;
        }

        .elsy-live .elsy-shell-sheen {
          animation: elsy-shell-sheen 7.2s ease-in-out infinite;
        }

        .elsy-live .elsy-caustics {
          animation: elsy-caustics 7.2s ease-in-out infinite;
        }

        .elsy-live .elsy-speculars {
          animation: elsy-speculars 7.2s ease-in-out infinite;
        }

        .elsy-live .elsy-tentacle {
          transform-origin: 450px 350px;
        }

        .elsy-live .elsy-tentacle-one { animation: elsy-ribbon-a 4.6s ease-in-out infinite; }
        .elsy-live .elsy-tentacle-two { animation: elsy-ribbon-b 5.2s ease-in-out infinite; }
        .elsy-live .elsy-tentacle-three { animation: elsy-ribbon-a 4.9s ease-in-out infinite reverse; }
        .elsy-live .elsy-tentacle-four { animation: elsy-ribbon-c 5.8s ease-in-out infinite; }
        .elsy-live .elsy-tentacle-five { animation: elsy-ribbon-c 5.5s ease-in-out infinite reverse; }

        .elsy-live .elsy-tip-dots {
          animation: elsy-tip-follow 7.2s cubic-bezier(.2,.8,.2,1) infinite;
          transform-origin: 450px 350px;
        }

        .elsy-live .elsy-face {
          animation: elsy-face-hello 7.2s cubic-bezier(.2,.8,.2,1) infinite;
          transform-origin: 450px 318px;
        }

        .elsy-live .elsy-eyes {
          animation: elsy-blink 4.8s ease-in-out infinite;
          transform-origin: 450px 275px;
        }

        .elsy-live .elsy-cheeks {
          animation: elsy-cheek-glow 7.2s ease-in-out infinite;
          transform-origin: 450px 318px;
        }

        .elsy-live .elsy-smile {
          animation: elsy-smile 7.2s ease-in-out infinite;
          transform-origin: 450px 350px;
        }

        .elsy-live .elsy-sparks circle {
          animation: elsy-sparkle 5.6s ease-in-out infinite;
          transform-origin: center;
        }

        .elsy-live .elsy-sparks circle:nth-child(2n) {
          animation-delay: -1.8s;
        }

        @keyframes elsy-drift {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          12% { transform: translateY(2px) rotate(-.25deg) scale(.998, 1.004); }
          18% { transform: translateY(5px) rotate(-.8deg) scale(.988, 1.018); }
          26% { transform: translateY(-20px) rotate(1.8deg) scale(1.038, .982); }
          36% { transform: translateY(3px) rotate(-.8deg) scale(.996, 1.01); }
          52% { transform: translateY(-6px) rotate(.25deg) scale(1); }
        }

        @keyframes elsy-bell-breathe {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1); }
          19% { transform: scale(.976, 1.035); }
          26% { transform: scale(1.065, .952); }
          37% { transform: scale(.992, 1.018); }
          54% { transform: scale(1); }
        }

        @keyframes elsy-rim-squish {
          0%, 100% { transform: scaleX(1) translateY(0); opacity: .82; }
          19% { transform: scaleX(.985) translateY(-1px); opacity: .78; }
          26% { transform: scaleX(1.08) translateY(4px); opacity: .92; }
          38% { transform: scaleX(.99) translateY(-1px); opacity: .84; }
        }

        @keyframes elsy-inner-glow {
          0%, 15%, 45%, 100% { opacity: .68; transform: scale(1); }
          24% { opacity: .94; transform: scale(1.08); }
          34% { opacity: .72; transform: scale(.99); }
        }

        @keyframes elsy-shell-sheen {
          0%, 100% { opacity: .7; transform: translateX(0) scale(1); }
          24% { opacity: .95; transform: translateX(8px) scale(1.02); }
          44% { opacity: .62; transform: translateX(-2px) scale(1); }
        }

        @keyframes elsy-caustics {
          0%, 100% { opacity: .8; transform: translateY(0); }
          24% { opacity: 1; transform: translateY(-4px); }
          44% { opacity: .66; transform: translateY(1px); }
        }

        @keyframes elsy-speculars {
          0%, 100% { opacity: .86; transform: translate(0, 0); }
          24% { opacity: 1; transform: translate(5px, -5px); }
          44% { opacity: .72; transform: translate(-2px, 1px); }
        }

        @keyframes elsy-face-hello {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          16% { transform: translateY(1px) rotate(-.5deg) scale(.995); }
          25% { transform: translateY(-12px) rotate(1.3deg) scale(1.065); }
          37% { transform: translateY(1px) rotate(-.55deg) scale(.998); }
          52% { transform: translateY(0) rotate(0deg) scale(1); }
        }

        @keyframes elsy-blink {
          0%, 6%, 100% { transform: scaleY(1); }
          3% { transform: scaleY(.16); }
        }

        @keyframes elsy-cheek-glow {
          0%, 14%, 46%, 100% { opacity: .86; transform: scale(1); }
          25% { opacity: 1; transform: scale(1.28); }
          36% { opacity: .94; transform: scale(1.08); }
        }

        @keyframes elsy-smile {
          0%, 14%, 46%, 100% { transform: scaleX(1); opacity: .82; }
          25% { transform: scaleX(1.18) translateY(-2px); opacity: .95; }
          36% { transform: scaleX(.98) translateY(1px); opacity: .86; }
        }

        @keyframes elsy-ribbon-a {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          24% { transform: rotate(-1.2deg) translateX(-2px); }
          48% { transform: rotate(3.2deg) translateX(8px); }
          72% { transform: rotate(-1deg) translateX(-3px); }
        }

        @keyframes elsy-ribbon-b {
          0%, 100% { transform: rotate(0deg) translateX(0); }
          26% { transform: rotate(1deg) translateX(2px); }
          54% { transform: rotate(-3deg) translateX(-7px); }
          78% { transform: rotate(1.1deg) translateX(3px); }
        }

        @keyframes elsy-ribbon-c {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(-.8deg); }
          60% { transform: rotate(2.1deg); }
        }

        @keyframes elsy-tip-follow {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(8px) scale(.98); }
          48% { transform: translateY(-10px) scale(1.04); }
          72% { transform: translateY(4px) scale(1); }
        }

        @keyframes elsy-sparkle {
          0%, 100% { opacity: .22; transform: scale(.82); }
          45% { opacity: .68; transform: scale(1.18); }
        }
      `}</style>
    </div>
  );
}
