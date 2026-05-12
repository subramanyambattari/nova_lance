"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

const growthData = [
  { month: "Jan", earnings: 6800, views: 900 },
  { month: "Feb", earnings: 7600, views: 1200 },
  { month: "Mar", earnings: 9200, views: 1600 },
  { month: "Apr", earnings: 10800, views: 2100 },
  { month: "May", earnings: 12400, views: 2800 },
  { month: "Jun", earnings: 15100, views: 3600 },
]

const successData = [
  { label: "Free", value: 22 },
  { label: "Pro", value: 41 },
  { label: "Top Pro", value: 56 },
]

export function AnalyticsPreview() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  const chart = mounted ? (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <AreaChart data={growthData} margin={{ left: -18, right: 8 }}>
        <defs>
          <linearGradient id="proGrowth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
        <Tooltip contentStyle={{ background: "rgba(9,9,11,.95)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
        <Area type="monotone" dataKey="earnings" stroke="#a78bfa" strokeWidth={3} fill="url(#proGrowth)" />
      </AreaChart>
    </ResponsiveContainer>
  ) : (
    <Skeleton className="h-full w-full bg-white/10" />
  )

  const bars = mounted ? (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <BarChart data={successData}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
        <Tooltip contentStyle={{ background: "rgba(9,9,11,.95)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12 }} />
        <Bar dataKey="value" radius={[8, 8, 2, 2]} fill="#60a5fa" />
      </BarChart>
    </ResponsiveContainer>
  ) : (
    <Skeleton className="h-full w-full bg-white/10" />
  )

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]"
    >
      <Card className="rounded-2xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-zinc-100">Earnings growth preview</CardTitle>
        </CardHeader>
        <CardContent className="h-80 min-h-0 min-w-0">{chart}</CardContent>
      </Card>
      <div className="grid gap-4">
        <Card className="rounded-2xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base text-zinc-100">Proposal success rate</CardTitle>
          </CardHeader>
          <CardContent className="h-52 min-h-0 min-w-0">{bars}</CardContent>
        </Card>
        <Card className="rounded-2xl border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
          {[
            ["Profile visibility increase", 84],
            ["Client engagement metrics", 68],
            ["Priority opportunity fit", 91],
          ].map(([label, value]) => (
            <div key={label} className="mb-4 last:mb-0">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-zinc-400">{label}</span>
                <span className="text-zinc-100">{value}%</span>
              </div>
              <Progress value={Number(value)} />
            </div>
          ))}
        </Card>
      </div>
    </motion.section>
  )
}
