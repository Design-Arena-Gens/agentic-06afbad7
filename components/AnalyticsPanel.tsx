"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { buildFocusBreakdown, buildWeeklyPerformance } from "@/lib/stats";
import type { TrackerEntry } from "@/lib/types";

interface AnalyticsPanelProps {
  entries: TrackerEntry[];
}

const tooltipStyle = {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  borderRadius: "16px",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  color: "#e2e8f0",
  padding: "12px 16px",
};

export function AnalyticsPanel({ entries }: AnalyticsPanelProps) {
  const weeklyData = buildWeeklyPerformance(entries);
  const focusBreakdown = buildFocusBreakdown(entries);

  return (
    <div className="grid gap-6 lg:grid-cols-7">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 lg:col-span-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Weekly momentum graph</h3>
            <p className="text-sm text-slate-400">Completion rate and quality score across the last quarter.</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="3 6" />
              <XAxis dataKey="week" tick={{ fill: "#94a3b8", fontSize: 12 }} interval={1} angle={-35} textAnchor="end" height={70} />
              <YAxis yAxisId="left" tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: "#e2e8f0" }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="completionRate"
                name="Completion %"
                stroke="#60a5fa"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#1d4ed8" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgScore"
                name="Quality Score"
                stroke="#34d399"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#059669" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 lg:col-span-3">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Focus area leaderboard</h3>
          <p className="text-sm text-slate-400">Spot where you are thriving and where momentum is stalling.</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={focusBreakdown}>
              <defs>
                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="3 6" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="completionRate"
                name="Completion %"
                stroke="#c084fc"
                fill="url(#colorFocus)"
                strokeWidth={2}
                dot={{ stroke: "#a855f7", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
