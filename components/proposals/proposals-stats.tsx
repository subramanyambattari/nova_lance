"use client"

import { BarChart3, BriefcaseBusiness, CheckCircle2, FileText, MessageSquareReply, XCircle } from "lucide-react"
import { motion } from "framer-motion"

import type { ProposalStats } from "@/components/proposals/types"

export function ProposalsStats({ stats }: { stats: ProposalStats }) {
  const cards = [
    { label: "Submitted Proposals", value: stats.submitted, trend: "Live database count", icon: FileText },
    { label: "Draft Proposals", value: stats.drafts, trend: "Autosave ready", icon: BriefcaseBusiness },
    { label: "Response Rate", value: `${stats.responseRate}%`, trend: `${stats.averageResponseHours}h avg reply`, icon: BarChart3 },
    { label: "Interview Requests", value: stats.interviewRequests, trend: `${stats.interviewRate}% interview rate`, icon: MessageSquareReply },
    { label: "Accepted Proposals", value: stats.accepted, trend: `${stats.acceptanceRate}% acceptance`, icon: CheckCircle2 },
    { label: "Rejected Proposals", value: stats.rejected, trend: "Track lost deals", icon: XCircle },
  ]

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="group relative"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/20 via-zinc-200 to-violet-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-400/20 dark:via-white/5 dark:to-violet-500/20 blur-sm" />
            <div className="relative h-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900/40">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/5" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex rounded-2xl border border-zinc-200/60 bg-zinc-50 p-3 text-blue-600 shadow-sm dark:border-white/5 dark:bg-white/[0.03] dark:text-blue-400">
                    <Icon className="size-5.5" />
                  </div>
                  <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {card.trend}
                  </span>
                </div>
                <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{card.label}</p>
                <p className="mt-1.5 text-3xl font-bold text-zinc-950 dark:text-white">{card.value}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </section>
  )
}
