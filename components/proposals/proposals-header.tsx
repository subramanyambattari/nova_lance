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
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 lg:flex-row lg:items-end lg:justify-between"
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
            <Sparkles className="size-3.5" />
            Proposal command center
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
            <Bell className="size-3.5" />
            {liveUpdates} live updates
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
          Proposals
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
          Build, submit, edit, and track client responses across every active opportunity.
        </p>
      </div>
      <Button
        type="button"
        onClick={onCreate}
        className="h-10 rounded-xl bg-white px-4 text-zinc-950 hover:bg-blue-100"
      >
        <Plus className="size-4" />
        New proposal
      </Button>
    </motion.header>
  )
}
