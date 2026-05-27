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
      className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.035] p-5 shadow-sm dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl sm:p-6 lg:flex-row lg:items-end lg:justify-between"
    >
      <div>
        <Badge variant="premium" className="gap-2">
          <Radio className="size-3" />
          Live marketplace feed
        </Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal text-zinc-900 dark:text-white sm:text-4xl">
          Find Jobs
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-650 dark:text-zinc-400 sm:text-base">
          Discover live remote opportunities from Nova Lance clients and external job APIs.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] px-3 py-1 text-zinc-700 dark:text-zinc-300">
          {total} jobs matched
        </Badge>
        <Button type="button" variant="outline" className="rounded-xl border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-200">
          <BellRing className="size-4" />
          Save search
        </Button>
        <Badge variant="success" className="gap-1 px-3 py-1">
          <Sparkles className="size-3" />
          {updatedAt ? "Updated live" : "Syncing"}
        </Badge>
      </div>
    </motion.header>
  )
}
