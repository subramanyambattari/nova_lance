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
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="rounded-[18px] bg-gradient-to-br from-blue-400/30 via-zinc-200 to-violet-500/30 p-px shadow-sm dark:from-blue-400/35 dark:via-white/10 dark:to-violet-500/30 dark:shadow-xl dark:shadow-black/20"
          >
            <div className="h-full rounded-[17px] border border-zinc-200 bg-white p-4 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80">
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-blue-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-blue-200">
                  <Icon className="size-5" />
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                  {card.trend}
                </span>
              </div>
              <p className="mt-5 text-sm text-zinc-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">{card.value}</p>
            </div>
          </motion.div>
        )
      })}
    </section>
  )
}
