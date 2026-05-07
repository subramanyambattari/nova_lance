"use client"

import { BookmarkCheck, BellRing } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SavedJobs() {
  return (
    <Card className="rounded-2xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <CardHeader className="flex-row items-center gap-2">
        <BookmarkCheck className="size-4 text-blue-300" />
        <CardTitle className="text-base text-zinc-100">Saved jobs & alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-zinc-400">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          Saved jobs persist to PostgreSQL and update optimistically in the feed.
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <BellRing className="size-4 text-emerald-300" />
          Alerts are ready for saved searches.
        </div>
      </CardContent>
    </Card>
  )
}
