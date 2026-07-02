"use client";

import dynamic from "next/dynamic";

const ElsyJellyfish = dynamic(
  () => import("./elsy-jellyfish-3d").then((mod) => mod.ElsyJellyfish3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(72vh,640px)] items-center justify-center rounded-[2rem] border border-pool-line bg-pool-bg text-sm text-pool-muted">
        Elsy is drifting in…
      </div>
    ),
  },
);

export function ElsyJellyfishSketch() {
  return (
    <ElsyJellyfish
      className="mb-8 shadow-[0_40px_100px_rgba(94,83,145,0.18)]"
      height={640}
      interactive
      showControls
    />
  );
}
