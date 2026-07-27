"use client"

import { Bell, Plus, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

export function ProposalsHeader({
  liveUpdates,
  onCreate,
}: {
  liveUpdates: number
  onCreate: () => void
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden flex flex-col gap-6 rounded-3xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 lg:flex-row lg:items-end lg:justify-between lg:p-8"
    >
      <div className="absolute -left-20 -top-20 size-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute right-0 top-0 size-64 rounded-full bg-violet-500/10 blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
            <Sparkles className="size-3.5" />
            Proposal command center
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 shadow-sm dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
            <Bell className="size-3.5" />
            {liveUpdates} live updates
          </span>
        </div>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-4xl lg:text-5xl">
          Proposals
        </h1>
        <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
          Build, submit, edit, and track client responses across every active opportunity.
        </p>
      </div>
      <Button
        type="button"
        onClick={onCreate}
        className="relative z-10 h-11 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
      >
        <Plus className="size-4.5 mr-2" />
        New proposal
      </Button>
    </motion.header>
  )
}
