import type { Metadata } from "next";
import Link from "next/link";

import { ElsyJellyfishSketch } from "@/components/brand/elsy-jellyfish-sketch";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Elsy jellyfish sketch",
  description: "3D motion study — Elsy as a moon jelly curiosity companion.",
  path: "/elsy",
});

export default function ElsySketchPage() {
  return (
    <div className="min-h-screen bg-pool-bg text-pool-ink">
      <header className="border-b border-pool-line bg-white px-6 py-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold hover:text-pool-blue">
            ← Else
          </Link>
          <p className="text-xs text-pool-muted">3D motion sketch</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <p className="pool-eyebrow mb-3">Character study</p>
        <h1 className="pool-display-sm mb-4">Elsy, moon jelly.</h1>
        <p className="pool-lead mb-10 max-w-2xl">
          Translucent bell, bioluminescent pulse, ribbon tendrils. She drifts in with
          questions — no stingers, no screen, just wonder.
        </p>

        <ElsyJellyfishSketch />

        <div className="grid gap-4 text-sm text-pool-muted sm:grid-cols-3">
          <div className="pool-panel">
            <p className="mb-1 font-semibold text-pool-ink">Bell</p>
            <p>Transmission glass + inner glow. Gentle pulse like breathing.</p>
          </div>
          <div className="pool-panel">
            <p className="mb-1 font-semibold text-pool-ink">Tendrils</p>
            <p>Seven soft ribbons with phase-offset sway — curiosity reaching.</p>
          </div>
          <div className="pool-panel">
            <p className="mb-1 font-semibold text-pool-ink">Motion</p>
            <p>Float, bloom, sparkles. Respects reduced-motion preferences.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
