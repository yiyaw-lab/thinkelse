"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function HeroVisual() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion || !sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -7, y: px * 9 });
  }

  function handleLeave() {
    setTilt({ x: 0, y: 0 });
  }

  const stackStyle =
    reducedMotion
      ? undefined
      : {
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        };

  return (
    <div
      ref={sceneRef}
      className="hero-scene relative mx-auto w-full max-w-md lg:max-w-lg"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="hero-alive">
        <span className="depth-orb depth-orb-back" aria-hidden />
        <span className="depth-orb depth-orb-mid" aria-hidden />

        <div className="hero-depth-stack" style={stackStyle}>
          <div
            className="hero-glow-pulse pointer-events-none absolute -inset-10 rounded-full"
            style={{ transform: "translateZ(-60px)" }}
            aria-hidden
          />

          <span
            className="firefly firefly-1"
            style={{ transform: "translateZ(48px)" }}
            aria-hidden
          />
          <span
            className="firefly firefly-2"
            style={{ transform: "translateZ(64px)" }}
            aria-hidden
          />
          <span
            className="firefly firefly-3"
            style={{ transform: "translateZ(32px)" }}
            aria-hidden
          />

          <div className="hero-frame" style={{ transform: "translateZ(36px)" }}>
            <div className="hero-frame-rim" aria-hidden />
            <div className="hero-frame-inner overflow-hidden rounded-2xl">
              <Image
                src="/images/hero-elsy-night-garden.png"
                alt="Elsy, a small glowing spark companion, beside a child's window under a starlit night sky"
                width={640}
                height={640}
                priority
                className="hero-image-breathe h-auto w-full object-cover"
                sizes="(max-width: 1024px) 90vw, 512px"
              />
              <div className="hero-light-pass" aria-hidden />
              <div className="hero-vignette" aria-hidden />
            </div>
            <div className="hero-ground-shadow" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
