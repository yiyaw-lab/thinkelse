"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { PendingReviewQuest, QuestReviewStatus } from "@/lib/db/quests";

const STORAGE_KEY = "else_admin_secret";
const STORAGE_EVENT = "else-admin-secret-change";

type QueueResponse = {
  ok: boolean;
  pending?: number;
  cohortLimit?: number;
  quests?: PendingReviewQuest[];
  error?: string;
};

function getStoredSecret() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(STORAGE_KEY) ?? "";
}

function subscribeToStoredSecret(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
}

function notifyStoredSecretChanged() {
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function ReviewQueuePanel() {
  const secret = useSyncExternalStore(subscribeToStoredSecret, getStoredSecret, () => "");
  const [inputSecret, setInputSecret] = useState("");
  const [quests, setQuests] = useState<PendingReviewQuest[]>([]);
  const [pending, setPending] = useState(0);
  const [cohortLimit, setCohortLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const loadQueue = useCallback(async (token: string) => {
    try {
      const response = await fetch("/api/admin/review-queue", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await response.json()) as QueueResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Failed to load review queue");
      }

      setError(null);
      setQuests(data.quests ?? []);
      setPending(data.pending ?? 0);
      setCohortLimit(data.cohortLimit ?? 50);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load queue",
      );
      setQuests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!secret) return;

    const timeoutId = window.setTimeout(() => {
      setLoading(true);
      setError(null);
      void loadQueue(secret);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [secret, loadQueue]);

  function saveSecret(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = inputSecret.trim();
    if (!trimmed) return;
    sessionStorage.setItem(STORAGE_KEY, trimmed);
    notifyStoredSecretChanged();
    setInputSecret("");
    setLoading(true);
    setError(null);
  }

  function signOut() {
    sessionStorage.removeItem(STORAGE_KEY);
    notifyStoredSecretChanged();
    setQuests([]);
    setError(null);
    setLoading(false);
  }

  async function reviewQuest(questId: string, status: QuestReviewStatus) {
    if (!secret) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/review-queue", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questId,
          status,
          notes: notes[questId]?.trim() || undefined,
        }),
      });

      const data = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Update failed");
      }

      setQuests((current) => current.filter((quest) => quest.id !== questId));
      setPending((count) => Math.max(0, count - 1));
    } catch (reviewError) {
      setError(
        reviewError instanceof Error ? reviewError.message : "Update failed",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!secret) {
    return (
      <form onSubmit={saveSecret} className="pool-panel max-w-md">
        <h2 className="mb-2 text-base font-semibold text-pool-ink">Admin access</h2>
        <p className="mb-4 text-sm text-pool-muted">
          Enter your <code className="text-pool-ink">ADMIN_SECRET</code> to review
          quests from the first {cohortLimit} families.
        </p>
        <label className="mb-4 block text-sm font-medium text-pool-ink">
          Secret
          <input
            type="password"
            value={inputSecret}
            onChange={(event) => setInputSecret(event.target.value)}
            className="mt-2 w-full rounded-xl border border-pool-line bg-white px-3 py-2 text-sm text-pool-ink"
            autoComplete="current-password"
          />
        </label>
        <button type="submit" className="btn-pool text-sm">
          Continue
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-pool-muted">
            First {cohortLimit} families ·{" "}
            <span className="font-semibold text-pool-ink">{pending} pending</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError(null);
              void loadQueue(secret);
            }}
            className="btn-pool-secondary text-sm"
            disabled={loading}
          >
            Refresh
          </button>
          <button type="button" onClick={signOut} className="btn-pool-secondary text-sm">
            Sign out
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && quests.length === 0 ? (
        <p className="text-sm text-pool-muted">Loading review queue…</p>
      ) : null}

      {!loading && quests.length === 0 ? (
        <div className="pool-panel">
          <p className="text-sm text-pool-muted">No pending quests. Nice work.</p>
        </div>
      ) : null}

      <div className="space-y-4">
        {quests.map((quest) => (
          <article key={quest.id} className="pool-panel space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-pool-muted">
                  {quest.child?.family?.parent_name ?? "Parent"} ·{" "}
                  {quest.child?.name ?? "Child"}
                  {quest.child?.age ? `, ${quest.child.age}` : ""}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-pool-ink">
                  {quest.title ?? "Untitled quest"}
                </h2>
                <p className="mt-1 text-xs text-pool-muted">
                  {new Date(quest.created_at).toLocaleString()}
                </p>
              </div>
              {quest.skill ? (
                <span className="pool-chip">{quest.skill}</span>
              ) : null}
            </div>

            <div className="grid gap-3 text-sm text-pool-muted sm:grid-cols-2">
              <div>
                <p className="font-medium text-pool-ink">Prompt</p>
                <p>{quest.prompt}</p>
              </div>
              <div>
                <p className="font-medium text-pool-ink">Mission</p>
                <p>{quest.mission}</p>
              </div>
              {quest.follow_up ? (
                <div className="sm:col-span-2">
                  <p className="font-medium text-pool-ink">Follow-up</p>
                  <p>{quest.follow_up}</p>
                </div>
              ) : null}
              {quest.response ? (
                <div className="sm:col-span-2">
                  <p className="font-medium text-pool-ink">Parent reply</p>
                  <p>{quest.response}</p>
                </div>
              ) : null}
              {quest.elsy_reply ? (
                <div className="sm:col-span-2">
                  <p className="font-medium text-pool-ink">Elsy reply</p>
                  <p>{quest.elsy_reply}</p>
                </div>
              ) : null}
            </div>

            {quest.child?.interests?.length ? (
              <p className="text-xs text-pool-muted">
                Interests: {quest.child.interests.join(", ")}
              </p>
            ) : null}

            <label className="block text-sm text-pool-muted">
              Notes (optional)
              <textarea
                value={notes[quest.id] ?? ""}
                onChange={(event) =>
                  setNotes((current) => ({
                    ...current,
                    [quest.id]: event.target.value,
                  }))
                }
                rows={2}
                className="mt-2 w-full rounded-xl border border-pool-line bg-white px-3 py-2 text-sm text-pool-ink"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-pool text-sm"
                disabled={loading}
                onClick={() => void reviewQuest(quest.id, "approved")}
              >
                Approve
              </button>
              <button
                type="button"
                className="btn-pool-secondary text-sm"
                disabled={loading}
                onClick={() => void reviewQuest(quest.id, "flagged")}
              >
                Flag
              </button>
              <button
                type="button"
                className="btn-pool-secondary text-sm"
                disabled={loading}
                onClick={() => void reviewQuest(quest.id, "skipped")}
              >
                Skip
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
