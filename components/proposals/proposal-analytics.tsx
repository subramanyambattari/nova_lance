"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts"

import type { ProposalStats, ProposalStatus } from "@/components/proposals/types"

export function ProposalAnalytics({
  stats,
  activity,
}: {
  stats: ProposalStats
  activity: Array<{ status: ProposalStatus; count: number }>
}) {
  const funnel = [
    { name: "Response", value: stats.responseRate },
    { name: "Interview", value: stats.interviewRate },
    { name: "Accepted", value: stats.acceptanceRate },
  ]

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Response analytics</h2>
          <p className="text-sm text-zinc-500">Success, interview, and acceptance rates.</p>
        </div>
        <div className="h-64 min-h-0 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={funnel}>
              <defs>
                <linearGradient id="proposalRates" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.12)" />
              <XAxis dataKey="name" stroke="#71717a" />
              <YAxis stroke="#71717a" unit="%" />
              <ChartTooltip
                contentStyle={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)" }}
              />
              <Area type="monotone" dataKey="value" stroke="#60a5fa" fill="url(#proposalRates)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Status mix</h2>
          <p className="text-sm text-zinc-500">Live proposal counts by stage.</p>
        </div>
        <div className="h-64 min-h-0 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.12)" />
              <XAxis dataKey="status" stroke="#71717a" tickFormatter={(value) => String(value).slice(0, 4)} />
              <YAxis stroke="#71717a" allowDecimals={false} />
              <ChartTooltip
                contentStyle={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)" }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
