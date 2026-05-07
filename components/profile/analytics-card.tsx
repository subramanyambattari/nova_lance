"use client"

import { BriefcaseBusiness, DollarSign, Eye, Star, Target } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const metrics = [
  { label: "Profile views", value: "2.8k", icon: Eye, bars: [36, 52, 44, 68] },
  { label: "Acceptance rate", value: "42%", icon: Target, bars: [20, 28, 34, 42] },
  { label: "Total earnings", value: "$148k", icon: DollarSign, bars: [40, 48, 64, 72] },
  { label: "Completed jobs", value: "86", icon: BriefcaseBusiness, bars: [24, 42, 56, 66] },
  { label: "Client rating", value: "4.98", icon: Star, bars: [60, 62, 64, 70] },
]

export function AnalyticsCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.3 }}>
      <Card className="rounded-2xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-zinc-100">Profile analytics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => {
            const Icon = metric.icon

            return (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-zinc-950/55 p-4 transition hover:-translate-y-1 hover:border-blue-400/30">
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-200">
                    <Icon className="size-4" />
                  </span>
                  <div className="flex h-8 items-end gap-1">
                    {metric.bars.map((height) => (
                      <span
                        key={height}
                        className="w-1.5 rounded-full bg-gradient-to-t from-violet-400 to-blue-300"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-5 text-2xl font-semibold text-white">{metric.value}</p>
                <p className="mt-1 text-sm text-zinc-500">{metric.label}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}
