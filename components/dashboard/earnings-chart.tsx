"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"



function chartCard(title: string, badge: string, children: React.ReactNode) {
  return (
    <Card className="overflow-hidden rounded-2xl border-zinc-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20">
      <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-950 dark:text-zinc-200">{title}</CardTitle>
        <Badge variant="premium">{badge}</Badge>
      </CardHeader>
      <CardContent className="h-72 min-h-0 min-w-0 pt-4">{children}</CardContent>
    </Card>
  )
}

export function EarningsChart({ initialStats }: { initialStats?: any }) {
  const earningsData = initialStats?.earningsTrend || [
    { month: "Jan", earnings: 0, target: 5400 },
    { month: "Feb", earnings: 0, target: 6600 },
  ]
  
  // Format earnings to match chart expected keys
  const displayEarningsData = earningsData.map((d: any) => ({
    month: d.month,
    earnings: d.paid || d.earnings || 0,
    target: d.booked || d.target || 0
  }))

  const activityData = initialStats?.weeklyChart || [
    { day: "Mon", hours: 0 },
  ]
  
  // Format activity
  const displayActivityData = activityData.map((d: any) => ({
    day: d.day,
    hours: d.value || d.hours || 0
  }))

  const conversionData = initialStats?.proposalStats || [
    { stage: "Viewed", value: 0 },
    { stage: "Shortlisted", value: 0 },
    { stage: "Interview", value: 0 },
    { stage: "Won", value: 0 },
  ]

  // Calculate close rate for badge
  const won = conversionData.find((d: any) => d.stage === "Won" || d.name === "Won")?.value || 0
  const viewed = conversionData.find((d: any) => d.stage === "Viewed" || d.name === "Viewed")?.value || 1
  const closeRate = Math.round((won / (viewed || 1)) * 100)

  // Map "name" to "stage" for the chart if needed
  const displayConversionData = conversionData.map((d: any) => ({
    stage: d.name || d.stage,
    value: d.value
  }))
  const [mounted, setMounted] = useState(false)
  const tooltipStyle = {
    background: "rgba(9, 9, 11, 0.94)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#fafafa",
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {chartCard("Earnings overview", "+18.7%", <Skeleton className="h-full w-full bg-zinc-100 dark:bg-white/10" />)}
        </div>
        {chartCard("Weekly activity", "128h", <Skeleton className="h-full w-full bg-zinc-100 dark:bg-white/10" />)}
        <div className="xl:col-span-3">
          {chartCard("Proposal conversion", "19% close rate", <Skeleton className="h-full w-full bg-zinc-100 dark:bg-white/10" />)}
        </div>
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="grid gap-4 xl:grid-cols-3"
    >
      <div className="xl:col-span-2">
        {chartCard(
          "Earnings overview",
          "+18.7%",
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={displayEarningsData} margin={{ left: -18, right: 8 }}>
              <defs>
                <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(96,165,250,0.25)" }} />
              <Area type="monotone" dataKey="earnings" stroke="#60a5fa" strokeWidth={3} fill="url(#earningsFill)" />
              <Line type="monotone" dataKey="target" stroke="#a78bfa" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      {chartCard(
        "Weekly activity",
        `${initialStats?.hoursWorked || 128}h`,
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={displayActivityData}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Bar dataKey="hours" radius={[8, 8, 2, 2]} fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      )}
      <div className="xl:col-span-3">
        {chartCard(
          "Proposal conversion",
          `${closeRate}% close rate`,
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart data={displayConversionData} margin={{ left: -18, right: 12 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(167,139,250,0.3)" }} />
              <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5, fill: "#0ea5e9", strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.section>
  )
}
