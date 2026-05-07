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
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Response analytics</h2>
          <p className="text-sm text-zinc-500">Success, interview, and acceptance rates.</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={funnel}>
              <defs>
                <linearGradient id="proposalRates" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#71717a" />
              <YAxis stroke="#71717a" unit="%" />
              <ChartTooltip
                contentStyle={{ background: "#09090b", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12 }}
              />
              <Area type="monotone" dataKey="value" stroke="#60a5fa" fill="url(#proposalRates)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Status mix</h2>
          <p className="text-sm text-zinc-500">Live proposal counts by stage.</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="status" stroke="#71717a" tickFormatter={(value) => String(value).slice(0, 4)} />
              <YAxis stroke="#71717a" allowDecimals={false} />
              <ChartTooltip
                contentStyle={{ background: "#09090b", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12 }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
