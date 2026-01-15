"use client";

import { motion } from "framer-motion";
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, MinusIcon } from "@heroicons/react/24/solid";
import type { TimeframeStat } from "@/lib/types";

const TrendIcon = ({ trend }: { trend: TimeframeStat["trend"] }) => {
  if (trend === "up") {
    return <ArrowTrendingUpIcon className="h-5 w-5 text-emerald-400" />;
  }
  if (trend === "down") {
    return <ArrowTrendingDownIcon className="h-5 w-5 text-rose-400" />;
  }
  return <MinusIcon className="h-5 w-5 text-slate-500" />;
};

export function StatCard({ stat }: { stat: TimeframeStat }) {
  const rate = Math.round(stat.successRate * 100);
  const score = Math.round(stat.avgScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur shadow-glow p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</span>
        <TrendIcon trend={stat.trend} />
      </div>
      <div>
        <p className="text-4xl font-semibold text-white">{rate}%</p>
        <span className="text-sm text-slate-400">success rate</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
        <div className="rounded-2xl bg-slate-800/60 p-3">
          <p className="text-lg font-semibold text-primary-400">{stat.completed}</p>
          <p className="text-xs uppercase tracking-widest text-slate-400">Completed</p>
        </div>
        <div className="rounded-2xl bg-slate-800/60 p-3">
          <p className="text-lg font-semibold text-primary-200">{score}</p>
          <p className="text-xs uppercase tracking-widest text-slate-400">Avg score</p>
        </div>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 via-sky-400 to-emerald-400"
          style={{ width: `${rate}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">{stat.total} entries logged in this window.</p>
    </motion.div>
  );
}
