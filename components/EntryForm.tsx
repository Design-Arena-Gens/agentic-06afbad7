"use client";

import { useState } from "react";
import { clsx } from "clsx";
import type { TrackerEntry } from "@/lib/types";

const defaultState = {
  type: "habit" as TrackerEntry["type"],
  name: "",
  focusArea: "",
  date: new Date().toISOString().slice(0, 10),
  score: 80,
  status: "completed" as TrackerEntry["status"],
  notes: "",
};

interface EntryFormProps {
  onSubmit: (entry: TrackerEntry) => void;
}

export function EntryForm({ onSubmit }: EntryFormProps) {
  const [form, setForm] = useState(defaultState);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newEntry: TrackerEntry = {
      id: crypto.randomUUID(),
      ...form,
      score: Number(form.score),
    };
    onSubmit(newEntry);
    setForm({ ...defaultState, date: form.date });
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between p-6 text-left text-slate-200"
      >
        <div>
          <p className="text-lg font-semibold">Log a new milestone</p>
          <p className="text-sm text-slate-400">
            Capture habits and project updates to keep your Momentum Matrix fresh.
          </p>
        </div>
        <span
          className={clsx(
            "grid h-10 w-10 place-items-center rounded-full border border-slate-700 text-xl transition",
            isExpanded ? "bg-primary-500 text-white" : "bg-slate-800 text-slate-300"
          )}
        >
          {isExpanded ? "−" : "+"}
        </span>
      </button>
      {isExpanded && (
        <form onSubmit={handleSubmit} className="grid gap-6 border-t border-slate-800 bg-slate-950/50 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="text-slate-300">Entry type</span>
              <select
                className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 text-slate-100 focus:border-primary-500 focus:outline-none"
                value={form.type}
                onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as TrackerEntry["type"] }))}
              >
                <option value="habit">Habit</option>
                <option value="project">Project</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-slate-300">Focus area</span>
              <input
                className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 text-slate-100 focus:border-primary-500 focus:outline-none"
                value={form.focusArea}
                onChange={(event) => setForm((prev) => ({ ...prev, focusArea: event.target.value }))}
                placeholder="Wellness, Deep Work, Skill Building…"
                required
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="text-slate-300">Title</span>
              <input
                className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 text-slate-100 focus:border-primary-500 focus:outline-none"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder={form.type === "habit" ? "Evening reading" : "Launch landing page"}
                required
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-slate-300">Date</span>
              <input
                type="date"
                className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 text-slate-100 focus:border-primary-500 focus:outline-none"
                value={form.date}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                required
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm">
              <span className="text-slate-300">Status</span>
              <div className="flex gap-2">
                {(
                  [
                    { label: "Completed", value: "completed" },
                    { label: "In progress", value: "in-progress" },
                    { label: "Missed", value: "missed" },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, status: option.value }))}
                    className={clsx(
                      "flex-1 rounded-2xl border p-3 text-sm font-medium transition",
                      form.status === option.value
                        ? "border-primary-500 bg-primary-500/20 text-primary-100"
                        : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-slate-300">Score</span>
              <input
                type="number"
                className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 text-slate-100 focus:border-primary-500 focus:outline-none"
                min={0}
                max={100}
                step={5}
                value={form.score}
                onChange={(event) => setForm((prev) => ({ ...prev, score: Number(event.target.value) }))}
                required
              />
            </label>
            <label className="grid gap-2 text-sm md:col-span-1">
              <span className="text-slate-300">Notes</span>
              <input
                className="rounded-2xl border border-slate-700 bg-slate-900/80 p-3 text-slate-100 focus:border-primary-500 focus:outline-none"
                value={form.notes}
                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder="Key learnings, blockers, wins"
              />
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-primary-500 via-blue-500 to-emerald-400 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:opacity-90"
            >
              Add entry
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
