"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import { ElsyJellyfishModel } from "./elsy-jellyfish-model";

type ElsyJellyfishProps = {
  className?: string;
  height?: number;
  interactive?: boolean;
  showControls?: boolean;
};

function Scene({ interactive }: { interactive: boolean }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.2, 4.2]} fov={42} />
      <ambientLight intensity={0.55} color="#f7f2ff" />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.35}
        color="#fff8ef"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-2, 1, 2]} intensity={0.8} color="#b8a6f5" />
      <pointLight position={[2, -1, 1]} intensity={0.45} color="#f8e9b8" />

      <Environment preset="dawn" environmentIntensity={0.45} />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
        <ElsyJellyfishModel />
      </Float>

      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={0.28}
        scale={8}
        blur={2.8}
        far={4}
        color="#5e5391"
      />

      {interactive ? (
        <OrbitControls
          enablePan={false}
          minDistance={2.8}
          maxDistance={6}
          minPolarAngle={Math.PI * 0.25}
          maxPolarAngle={Math.PI * 0.62}
          autoRotate
          autoRotateSpeed={0.35}
        />
      ) : null}

      <EffectComposer multisampling={4}>
        <Bloom
          intensity={0.65}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export function ElsyJellyfish({
  className = "",
  height = 520,
  interactive = true,
  showControls = false,
}: ElsyJellyfishProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-pool-line bg-gradient-to-b from-[#faf8ff] via-[#f3ecff] to-[#ebe2ff] ${className}`}
      style={{ height }}
      role="img"
      aria-label="Elsy as a glowing moon jellyfish, gently floating"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(248,233,184,0.22) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(184,166,245,0.18) 0%, transparent 45%)",
        }}
      />

      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="relative z-10"
      >
        <Suspense fallback={null}>
          <Scene interactive={interactive && !reducedMotion} />
        </Suspense>
      </Canvas>

      {showControls ? (
        <p className="absolute bottom-4 left-0 right-0 z-20 text-center text-xs text-pool-muted">
          Drag to orbit · bioluminescent pulse
        </p>
      ) : null}
    </div>
  );
}
