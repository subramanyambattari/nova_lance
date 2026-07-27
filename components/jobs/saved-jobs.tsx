"use client"

import { BookmarkCheck, BellRing } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SavedJobs() {
  return (
    <Card className="relative overflow-hidden rounded-3xl border-zinc-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900/40 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-50" />
      <CardHeader className="relative z-10 flex-row items-center gap-3 border-b border-zinc-100 dark:border-white/5 pb-4">
        <div className="rounded-xl bg-blue-50 p-2 dark:bg-blue-500/10">
          <BookmarkCheck className="size-4.5 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Saved jobs & alerts</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4 pt-5 text-sm text-zinc-600 dark:text-zinc-400">
        <div className="group rounded-2xl border border-zinc-200/80 bg-zinc-50/50 dark:border-white/10 dark:bg-zinc-950/40 p-4 font-medium transition-all hover:border-blue-200 dark:hover:border-blue-500/30 dark:hover:bg-zinc-900/80">
          Saved jobs persist to PostgreSQL and update optimistically in the feed.
        </div>
        <div className="group flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 dark:border-white/10 dark:bg-zinc-950/40 p-4 font-medium transition-all hover:border-emerald-200 dark:hover:border-emerald-500/30 dark:hover:bg-zinc-900/80">
          <div className="rounded-full bg-emerald-50 p-1.5 dark:bg-emerald-500/10">
            <BellRing className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          Alerts are ready for saved searches.
        </div>
      </CardContent>
    </Card>
  )
}
