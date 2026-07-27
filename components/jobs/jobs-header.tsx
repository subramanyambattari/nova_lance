"use client"

import { BellRing, Radio, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function JobsHeader({ total, updatedAt }: { total: number; updatedAt?: string }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden flex flex-col gap-5 rounded-3xl border border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 sm:p-8 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="absolute -left-20 -top-20 size-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute right-0 top-0 size-64 rounded-full bg-violet-500/10 blur-3xl" />
      
      <div className="relative z-10">
        <Badge variant="outline" className="gap-2 border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300 px-3 py-1.5 rounded-full shadow-sm">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-blue-500"></span>
          </span>
          Live marketplace feed
        </Badge>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Find Jobs
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base font-medium">
          Discover live remote opportunities from Nova Lance clients and external job APIs.
        </p>
      </div>
      <div className="relative z-10 flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="border-zinc-200/80 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-950/50 px-3 py-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 rounded-lg shadow-sm">
          <span className="font-bold text-zinc-900 dark:text-white mr-1.5">{total}</span> matches
        </Badge>
        <Button type="button" variant="outline" className="rounded-xl h-9 border-zinc-200/80 bg-white hover:bg-zinc-50 hover:text-zinc-900 shadow-sm transition-all dark:border-white/10 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 dark:text-white font-semibold">
          <BellRing className="size-4 mr-2" />
          Save search
        </Button>
        <Badge variant="outline" className="gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg shadow-sm border-emerald-200 bg-emerald-50/50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          <Sparkles className="size-3.5" />
          {updatedAt ? "Updated live" : "Syncing..."}
        </Badge>
      </div>
    </motion.header>
  )
}
