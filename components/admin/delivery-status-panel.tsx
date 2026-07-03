"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type {
  DeliveryStatusCode,
  DeliveryStatusFamily,
} from "@/lib/db/delivery-status";

const STORAGE_KEY = "else_admin_secret";
const STORAGE_EVENT = "else-admin-secret-change";

const STATUS_LABELS: Record<DeliveryStatusCode, string> = {
  due_now: "Due now",
  sent_today: "Sent today",
  waiting_for_window: "Waiting",
  onboarding_incomplete: "Onboarding",
  opted_out: "Opted out",
  missing_phone: "Missing phone",
  missing_child: "Missing child",
  missing_preferred_time: "Missing time",
  invalid_preferred_time: "Invalid time",
};

const STATUS_STYLES: Record<DeliveryStatusCode, string> = {
  due_now: "border-emerald-200 bg-emerald-50 text-emerald-800",
  sent_today: "border-blue-200 bg-blue-50 text-blue-800",
  waiting_for_window: "border-pool-line bg-white text-pool-muted",
  onboarding_incomplete: "border-amber-200 bg-amber-50 text-amber-800",
  opted_out: "border-slate-200 bg-slate-50 text-slate-700",
  missing_phone: "border-red-200 bg-red-50 text-red-700",
  missing_child: "border-red-200 bg-red-50 text-red-700",
  missing_preferred_time: "border-red-200 bg-red-50 text-red-700",
  invalid_preferred_time: "border-red-200 bg-red-50 text-red-700",
};

type DeliveryResponse = {
  ok: boolean;
  generatedAt?: string;
  total?: number;
  summary?: Record<DeliveryStatusCode, number>;
  families?: DeliveryStatusFamily[];
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

function statusBadge(status: DeliveryStatusCode) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function formatQuestDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function DeliveryStatusPanel() {
  const secret = useSyncExternalStore(subscribeToStoredSecret, getStoredSecret, () => "");
  const [families, setFamilies] = useState<DeliveryStatusFamily[]>([]);
  const [summary, setSummary] = useState<Record<DeliveryStatusCode, number> | null>(
    null,
  );
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDeliveryStatus = useCallback(async (token: string) => {
    try {
      const response = await fetch("/api/admin/delivery-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await response.json()) as DeliveryResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Failed to load delivery status");
      }

      setError(null);
      setFamilies(data.families ?? []);
      setSummary(data.summary ?? null);
      setGeneratedAt(data.generatedAt ?? null);
      setTotal(data.total ?? 0);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load delivery status",
      );
      setFamilies([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!secret) return;

    const timeoutId = window.setTimeout(() => {
      setLoading(true);
      setError(null);
      void loadDeliveryStatus(secret);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [secret, loadDeliveryStatus]);

  if (!secret) {
    return (
      <section className="pool-panel">
        <h2 className="mb-2 text-base font-semibold text-pool-ink">
          Delivery status
        </h2>
        <p className="text-sm text-pool-muted">
          Enter the admin secret above to inspect scheduled mission eligibility.
        </p>
      </section>
    );
  }

  const visibleSummary = summary
    ? (Object.entries(summary) as [DeliveryStatusCode, number][]).filter(
        ([, count]) => count > 0,
      )
    : [];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-pool-ink">Delivery status</h2>
          <p className="text-sm text-pool-muted">
            {total} families
            {generatedAt ? ` · refreshed ${formatQuestDate(generatedAt)}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setError(null);
            void loadDeliveryStatus(secret);
          }}
          className="btn-pool-secondary text-sm"
          disabled={loading}
        >
          Refresh delivery
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {visibleSummary.map(([status, count]) => (
          <div key={status} className="rounded-lg border border-pool-line bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-pool-muted">
              {STATUS_LABELS[status]}
            </p>
            <p className="mt-1 text-2xl font-semibold text-pool-ink">{count}</p>
          </div>
        ))}
      </div>

      {loading && families.length === 0 ? (
        <p className="text-sm text-pool-muted">Loading delivery status…</p>
      ) : null}

      {!loading && families.length === 0 ? (
        <div className="pool-panel">
          <p className="text-sm text-pool-muted">No families found.</p>
        </div>
      ) : null}

      <div className="space-y-3">
        {families.map((family) => (
          <article key={family.familyId} className="pool-panel space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-pool-ink">
                  {family.parentName ?? family.phone ?? "Unknown family"}
                </h3>
                <p className="text-sm text-pool-muted">
                  {family.childName ? `${family.childName} · ` : ""}
                  {family.phone ?? "No phone"}
                </p>
              </div>
              {statusBadge(family.status)}
            </div>

            <p className="text-sm text-pool-muted">{family.reason}</p>

            <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="font-medium text-pool-ink">Preferred</dt>
                <dd className="text-pool-muted">{family.preferredTime ?? "Missing"}</dd>
              </div>
              <div>
                <dt className="font-medium text-pool-ink">Timezone</dt>
                <dd className="text-pool-muted">{family.timezone ?? "Missing"}</dd>
              </div>
              <div>
                <dt className="font-medium text-pool-ink">Local now</dt>
                <dd className="text-pool-muted">
                  {family.localDate} {family.localTime}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-pool-ink">Onboarding</dt>
                <dd className="text-pool-muted">
                  {family.onboardingStep ?? "Unknown"}
                </dd>
              </div>
            </dl>

            {family.latestQuest ? (
              <p className="text-xs text-pool-muted">
                Latest quest: {family.latestQuest.title ?? "Untitled"} ·{" "}
                {formatQuestDate(family.latestQuest.createdAt)} ·{" "}
                {family.latestQuest.isToday ? "today" : "not today"} ·{" "}
                {family.latestQuest.hasResponse ? "has response" : "awaiting response"}
              </p>
            ) : (
              <p className="text-xs text-pool-muted">No quest has been sent yet.</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
