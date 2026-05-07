"use client"

import {
  BriefcaseBusiness,
  Clock3,
  DollarSign,
  FileText,
  Percent,
  TrendingUp,
} from "lucide-react"

import { StatsCard, type StatCardData } from "@/components/dashboard/stats-card"

const stats: StatCardData[] = [
  {
    label: "Open Proposals",
    value: "8",
    trend: "+3 this week",
    description: "Warm leads moving through review.",
    icon: FileText,
    tone: "blue",
  },
  {
    label: "Active Jobs",
    value: "5",
    trend: "2 due soon",
    description: "Projects currently in delivery.",
    icon: BriefcaseBusiness,
    tone: "violet",
  },
  {
    label: "Monthly Earnings",
    value: "$12.4k",
    trend: "+18.7%",
    description: "Booked and released this month.",
    icon: DollarSign,
    tone: "emerald",
  },
  {
    label: "Success Rate",
    value: "96%",
    trend: "+4%",
    description: "Client satisfaction and completion.",
    icon: Percent,
    tone: "blue",
  },
  {
    label: "Hours Worked",
    value: "128h",
    trend: "+11h",
    description: "Tracked across active contracts.",
    icon: Clock3,
    tone: "violet",
  },
  {
    label: "Weekly Growth",
    value: "+24%",
    trend: "Strong",
    description: "Proposal views and profile momentum.",
    icon: TrendingUp,
    tone: "emerald",
  },
]

export function StatsGrid() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat, index) => (
        <StatsCard key={stat.label} stat={stat} index={index} />
      ))}
    </section>
  )
}
