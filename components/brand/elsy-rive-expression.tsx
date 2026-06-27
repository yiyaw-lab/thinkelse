"use client";

import { Fit, Layout, Rive } from "@rive-app/react-canvas";
import { useEffect, useMemo, useState } from "react";

type ElsyRiveExpressionProps = {
  reducedMotion: boolean;
};

const RIVE_SRC = "/rive/elsy-expression.riv";
const STATE_MACHINE = "ElsyExpression";

function RiveStyleExpressionFallback({ reducedMotion }: ElsyRiveExpressionProps) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[42%] z-30 h-44 w-64 -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 256 176"
        className={reducedMotion ? "h-full w-full" : "h-full w-full elsy-rive-fallback"}
      >
        <defs>
          <radialGradient id="elsy-rive-eye" cx="34%" cy="26%" r="72%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="18%" stopColor="#ffffff" />
            <stop offset="26%" stopColor="#54416f" />
            <stop offset="100%" stopColor="#211735" />
          </radialGradient>
          <radialGradient id="elsy-rive-cheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff83b9" stopOpacity="0.88" />
            <stop offset="60%" stopColor="#ff9fca" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#ff9fca" stopOpacity="0" />
          </radialGradient>
          <filter id="elsy-rive-blur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <linearGradient id="elsy-rive-smile" x1="84" x2="172" y1="106" y2="106">
            <stop offset="0%" stopColor="#5b4a74" />
            <stop offset="48%" stopColor="#2f2445" />
            <stop offset="100%" stopColor="#6a5687" />
          </linearGradient>
        </defs>

        <g className="elsy-rive-expression">
          <g className="elsy-rive-cheeks">
            <circle cx="74" cy="104" r="23" fill="url(#elsy-rive-cheek)" filter="url(#elsy-rive-blur)" />
            <circle cx="182" cy="104" r="23" fill="url(#elsy-rive-cheek)" filter="url(#elsy-rive-blur)" />
            <ellipse cx="74" cy="104" rx="16" ry="9" fill="#ff9ec8" opacity="0.64" />
            <ellipse cx="182" cy="104" rx="16" ry="9" fill="#ff9ec8" opacity="0.64" />
          </g>

          <g className="elsy-rive-eyes">
            <ellipse cx="102" cy="76" rx="15" ry="22" fill="url(#elsy-rive-eye)" />
            <ellipse cx="154" cy="76" rx="15" ry="22" fill="url(#elsy-rive-eye)" />
            <circle className="elsy-rive-catchlight" cx="96" cy="66" r="5.2" fill="#ffffff" />
            <circle className="elsy-rive-catchlight" cx="148" cy="66" r="5.2" fill="#ffffff" />
            <circle cx="108" cy="86" r="3.2" fill="#ffffff" opacity="0.42" />
            <circle cx="160" cy="86" r="3.2" fill="#ffffff" opacity="0.42" />
          </g>

          <path
            className="elsy-rive-smile"
            d="M94 109 C105 133 151 133 162 109"
            stroke="url(#elsy-rive-smile)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>

      <style>{`
        .elsy-rive-fallback .elsy-rive-expression {
          animation: elsy-rive-expression 7.2s cubic-bezier(.2,.8,.2,1) infinite;
          transform-origin: 128px 96px;
        }

        .elsy-rive-fallback .elsy-rive-eyes {
          animation: elsy-rive-blink 5.2s ease-in-out infinite;
          transform-origin: 128px 76px;
        }

        .elsy-rive-fallback .elsy-rive-cheeks {
          animation: elsy-rive-cheeks 7.2s ease-in-out infinite;
          transform-origin: 128px 104px;
        }

        .elsy-rive-fallback .elsy-rive-smile {
          animation: elsy-rive-smile 7.2s ease-in-out infinite;
          transform-origin: 128px 112px;
        }

        .elsy-rive-fallback .elsy-rive-catchlight {
          animation: elsy-rive-catchlight 7.2s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes elsy-rive-expression {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          17% { transform: translateY(1px) rotate(-.4deg) scale(.992); }
          28% { transform: translateY(-9px) rotate(.9deg) scale(1.045); }
          42% { transform: translateY(1px) rotate(-.25deg) scale(.998); }
          58% { transform: translateY(0) rotate(0deg) scale(1); }
        }

        @keyframes elsy-rive-blink {
          0%, 5%, 100% { transform: scaleY(1); }
          2.8% { transform: scaleY(.12); }
        }

        @keyframes elsy-rive-cheeks {
          0%, 16%, 50%, 100% { opacity: .62; transform: scale(1); }
          29% { opacity: 1; transform: scale(1.22); }
          40% { opacity: .78; transform: scale(1.05); }
        }

        @keyframes elsy-rive-smile {
          0%, 16%, 50%, 100% { opacity: .88; transform: scaleX(1) translateY(0); }
          29% { opacity: 1; transform: scaleX(1.18) translateY(-2px); }
          40% { opacity: .94; transform: scaleX(.98) translateY(1px); }
        }

        @keyframes elsy-rive-catchlight {
          0%, 100% { opacity: .86; transform: translate(0, 0) scale(1); }
          29% { opacity: 1; transform: translate(2px, -2px) scale(1.18); }
          42% { opacity: .9; transform: translate(-1px, 1px) scale(.98); }
        }
      `}</style>
    </div>
  );
}

export function ElsyRiveExpression({ reducedMotion }: ElsyRiveExpressionProps) {
  const [hasRiveAsset, setHasRiveAsset] = useState(false);
  const layout = useMemo(() => new Layout({ fit: Fit.Contain }), []);

  useEffect(() => {
    let cancelled = false;

    fetch(RIVE_SRC, { method: "HEAD" })
      .then((response) => {
        if (!cancelled) setHasRiveAsset(response.ok);
      })
      .catch(() => {
        if (!cancelled) setHasRiveAsset(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!hasRiveAsset) return <RiveStyleExpressionFallback reducedMotion={reducedMotion} />;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[42%] z-30 h-44 w-64 -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <Rive
        src={RIVE_SRC}
        stateMachines={reducedMotion ? "ReducedMotion" : STATE_MACHINE}
        layout={layout}
        shouldDisableRiveListeners
        shouldResizeCanvasToContainer
        className="h-full w-full"
      />
    </div>
  );
}
