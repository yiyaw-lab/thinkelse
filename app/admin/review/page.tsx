import type { Metadata } from "next";
import Link from "next/link";

import { ReviewQueuePanel } from "@/components/admin/review-queue-panel";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Quest review",
    description: "Internal quest review queue for Else beta families.",
    path: "/admin/review",
  }),
  robots: { index: false, follow: false },
};

export default function AdminReviewPage() {
  return (
    <div className="min-h-screen bg-pool-bg text-pool-ink">
      <header className="border-b border-pool-line bg-white px-6 py-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-pool-ink hover:text-pool-blue">
            ← Else
          </Link>
          <p className="text-xs text-pool-muted">Internal · not indexed</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="pool-display-sm mb-2">Quest review queue</h1>
        <p className="mb-8 text-sm text-pool-muted">
          QA quests from the first 50 families before scaling outbound quality.
        </p>
        <ReviewQueuePanel />
      </main>
    </div>
  );
}
