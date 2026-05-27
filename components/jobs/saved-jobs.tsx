"use client"

import { BookmarkCheck, BellRing } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SavedJobs() {
  return (
    <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
      <CardHeader className="flex-row items-center gap-2">
        <BookmarkCheck className="size-4 text-blue-600 dark:text-blue-300" />
        <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Saved jobs & alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-zinc-650 dark:text-zinc-400">
        <div className="rounded-xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-white/[0.03] p-3">
          Saved jobs persist to PostgreSQL and update optimistically in the feed.
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-white/[0.03] p-3">
          <BellRing className="size-4 text-emerald-600 dark:text-emerald-300" />
          Alerts are ready for saved searches.
        </div>
      </CardContent>
    </Card>
  )
}
