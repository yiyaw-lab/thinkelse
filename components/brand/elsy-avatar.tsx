"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ElsyAvatarProps = {
  size?: number;
  className?: string;
  /** Soft pulsing glow ring */
  glow?: boolean;
  /** Gentle breathe animation */
  alive?: boolean;
  /** Mouse-tilt 3D depth */
  depth3d?: boolean;
};

/** Generated Elsy portrait — used across demo, CTA, and footer. */
export function ElsyAvatar({
  size = 40,
  className = "",
  glow = false,
  alive = false,
  depth3d = false,
}: ElsyAvatarProps) {
  const sceneRef = useRef<HTMLSpanElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  function handleMove(event: React.MouseEvent<HTMLSpanElement>) {
    if (!depth3d || reducedMotion || !sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -14, y: px * 16 });
  }

  function handleLeave() {
    setTilt({ x: 0, y: 0 });
  }

  const stackStyle =
    depth3d && !reducedMotion
      ? { transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }
      : undefined;

  return (
    <span
      ref={sceneRef}
      className={`depth-portrait ${depth3d ? "depth-portrait-scene" : ""} relative inline-flex shrink-0 ${className}`}
      style={{ width: size, height: size }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {glow && (
        <span
          className="avatar-glow pointer-events-none absolute -inset-2 rounded-full"
          aria-hidden
        />
      )}

      <span className="depth-portrait-stack" style={stackStyle}>
        <span className="depth-portrait-back" aria-hidden />
        <span className="depth-portrait-shadow" aria-hidden />
        <Image
          src="/images/elsy-portrait.png"
          alt="Elsy"
          width={size}
          height={size}
          className={`depth-portrait-face relative rounded-full object-cover ${
            alive ? "avatar-breathe" : ""
          }`}
          style={{ width: size, height: size }}
        />
        <span className="depth-portrait-shine" aria-hidden />
      </span>
    </span>
  );
}
