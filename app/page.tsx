"use client";

import { useEffect, useMemo, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { EntryForm } from "@/components/EntryForm";
import { EntryTable } from "@/components/EntryTable";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { computeTimeframeStats, seedEntries } from "@/lib/stats";
import type { TrackerEntry } from "@/lib/types";

const STORAGE_KEY = "momentum-matrix-entries";

export default function HomePage() {
  const [entries, setEntries] = useState<TrackerEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as TrackerEntry[];
        setEntries(parsed);
        return;
      } catch (error) {
        console.error("Failed to parse stored entries", error);
      }
    }
    setEntries(seedEntries);
  }, []);

  useEffect(() => {
    if (entries.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  const stats = useMemo(() => computeTimeframeStats(entries), [entries]);

  const handleCreate = (entry: TrackerEntry) => {
    setEntries((prev) => [entry, ...prev].sort((a, b) => (a.date < b.date ? 1 : -1)));
  };

  const handleUpdate = (updated: TrackerEntry) => {
    setEntries((prev) =>
      prev
        .map((entry) => (entry.id === updated.id ? { ...entry, ...updated } : entry))
        .sort((a, b) => (a.date < b.date ? 1 : -1))
    );
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-20 pt-12">
      <header className="rounded-3xl border border-primary-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-primary-900/40 p-10 shadow-glow">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-primary-300">Momentum Matrix</p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Spreadsheet precision meets habit intelligence.
            </h1>
            <p className="text-base text-slate-300 sm:text-lg">
              Design your personal command center with a Google Sheets inspired journal that tracks habits and
              projects, surfaces daily-to-yearly trends, and turns every win into momentum.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white backdrop-blur">
              <span className="text-xs uppercase tracking-[0.25em] text-slate-200">Entries Logged</span>
              <span className="text-3xl font-semibold">{entries.length}</span>
            </div>
            <div className="flex flex-col rounded-2xl border border-primary-500/40 bg-primary-500/10 px-4 py-3 text-primary-100 backdrop-blur">
              <span className="text-xs uppercase tracking-[0.25em]">Streak Mode</span>
              <span className="text-sm">Track consistency by logging daily.</span>
            </div>
          </div>
        </div>
      </header>

      <section>
        <div className="grid gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.key} stat={stat} />
          ))}
        </div>
      </section>

      <EntryForm onSubmit={handleCreate} />

      <AnalyticsPanel entries={entries} />

      <EntryTable entries={entries} onUpdate={handleUpdate} onDelete={handleDelete} />
    </main>
  );
}
