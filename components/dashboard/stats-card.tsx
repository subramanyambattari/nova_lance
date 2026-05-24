"use client"

import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface StatCardData {
  label: string
  value: string
  trend: string
  description: string
  icon: LucideIcon
  tone: "blue" | "violet" | "emerald"
}

const toneClasses: Record<StatCardData["tone"], string> = {
  blue: "from-blue-200/70 via-cyan-100/50 to-transparent dark:from-blue-500/40 dark:via-cyan-400/10",
  violet: "from-violet-200/70 via-fuchsia-100/50 to-transparent dark:from-violet-500/40 dark:via-fuchsia-400/10",
  emerald: "from-emerald-200/70 via-blue-100/50 to-transparent dark:from-emerald-500/35 dark:via-blue-400/10",
}

export function StatsCard({ stat, index }: { stat: StatCardData; index: number }) {
  const Icon = stat.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card className="group relative overflow-hidden rounded-2xl border-zinc-200 bg-white p-px shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-70 transition-opacity group-hover:opacity-100",
            toneClasses[stat.tone]
          )}
        />
        <div className="relative rounded-2xl bg-white p-5 dark:bg-zinc-950/80">
          <div className="flex items-start justify-between gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 shadow-inner shadow-white/60 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-200 dark:shadow-white/5">
              <Icon className="size-5" />
            </span>
            <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
              {stat.trend}
            </Badge>
          </div>
          <div className="mt-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-3xl font-semibold tracking-normal text-zinc-950 dark:text-white">
                {stat.value}
              </p>
              <div className="flex h-8 items-end gap-1">
                {[18, 26, 14, 32].map((height) => (
                  <span
                    key={height}
                    className="w-1.5 rounded-full bg-blue-400/60 transition-colors group-hover:bg-blue-500 dark:bg-blue-300/50 dark:group-hover:bg-blue-300"
                    style={{ height }}
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-zinc-500">{stat.description}</p>
            <Skeleton className="mt-4 h-1.5 w-24 bg-zinc-100 dark:bg-white/10" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
