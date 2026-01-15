"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { formatDisplayDate } from "@/lib/stats";
import type { TrackerEntry } from "@/lib/types";

interface EntryTableProps {
  entries: TrackerEntry[];
  onUpdate: (entry: TrackerEntry) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<TrackerEntry["status"], string> = {
  completed: "bg-emerald-500/20 text-emerald-200",
  "in-progress": "bg-amber-500/20 text-amber-200",
  missed: "bg-rose-500/20 text-rose-200",
};

export function EntryTable({ entries, onUpdate, onDelete }: EntryTableProps) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    return entries.filter((entry) => {
      const needle = search.toLowerCase();
      return (
        entry.name.toLowerCase().includes(needle) ||
        entry.focusArea.toLowerCase().includes(needle) ||
        entry.notes?.toLowerCase().includes(needle)
      );
    });
  }, [entries, search]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur">
      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Momentum table</h2>
          <p className="text-sm text-slate-400">
            Filter, update, and audit every habit and project milestone in one view.
          </p>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by habit, project, focus area, or notes"
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:border-primary-500 focus:outline-none md:w-80"
        />
      </div>
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-950/90 text-left text-xs uppercase tracking-[0.2em] text-slate-500 backdrop-blur">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Focus</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Score</th>
              <th className="px-6 py-4 font-medium">Notes</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                  No entries yet. Log your first habit or project above.
                </td>
              </tr>
            ) : (
              filtered.map((entry) => (
                <EntryRow key={entry.id} entry={entry} onUpdate={onUpdate} onDelete={onDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EntryRow({
  entry,
  onUpdate,
  onDelete,
}: {
  entry: TrackerEntry;
  onUpdate: (entry: TrackerEntry) => void;
  onDelete: (id: string) => void;
}) {
  const [localNotes, setLocalNotes] = useState(entry.notes ?? "");

  const handleScoreChange = (value: number) => {
    onUpdate({ ...entry, score: Math.min(100, Math.max(0, value)) });
  };

  const handleStatusChange = (status: TrackerEntry["status"]) => {
    onUpdate({ ...entry, status });
  };

  const handleBlurNotes = () => {
    if (localNotes !== entry.notes) {
      onUpdate({ ...entry, notes: localNotes });
    }
  };

  return (
    <tr className="border-t border-slate-800/60 transition hover:bg-slate-900/40">
      <td className="px-6 py-4 text-slate-300">{formatDisplayDate(entry.date)}</td>
      <td className="px-6 py-4 capitalize text-slate-300">{entry.type}</td>
      <td className="px-6 py-4 font-medium text-white">{entry.name}</td>
      <td className="px-6 py-4 text-slate-300">{entry.focusArea}</td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          {(
            [
              { label: "Completed", value: "completed" },
              { label: "Progress", value: "in-progress" },
              { label: "Missed", value: "missed" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={clsx(
                "rounded-full px-3 py-1 text-xs font-semibold transition",
                entry.status === option.value
                  ? statusColors[option.value]
                  : "bg-slate-800/70 text-slate-400 hover:bg-slate-800"
              )}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <input
          type="number"
          min={0}
          max={100}
          step={1}
          value={entry.score}
          onChange={(event) => handleScoreChange(Number(event.target.value))}
          className="w-20 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-primary-500 focus:outline-none"
        />
      </td>
      <td className="px-6 py-4">
        <input
          value={localNotes}
          onChange={(event) => setLocalNotes(event.target.value)}
          onBlur={handleBlurNotes}
          placeholder="Add reflection"
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-primary-500 focus:outline-none"
        />
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onDelete(entry.id)}
          className="rounded-full border border-rose-500/30 px-3 py-1 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
          type="button"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
