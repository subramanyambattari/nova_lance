"use client"

import { CalendarClock, CheckCircle2, CircleDashed, Video } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/lib/toast"



export function DeadlinesWidget({ initialDeadlines }: { initialDeadlines?: any[] }) {
  const displayDeadlines = initialDeadlines || []
  
  if (displayDeadlines.length === 0) {
    return (
      <Card className="flex flex-col rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <CardHeader className="flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-bold text-zinc-950 dark:text-zinc-100">Upcoming deadlines</CardTitle>
          <Badge variant="outline" className="border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950">
            0 due
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center p-8 text-center text-sm text-zinc-500">
          No upcoming deadlines.
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.35 }}>
      <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Upcoming deadlines</CardTitle>
          <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
            This week
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayDeadlines.map((item) => {
            const Icon = item.urgency === "urgent" ? CalendarClock : CheckCircle2
            const tone = item.urgency === "urgent" ? "text-rose-400" : "text-blue-300"

            return (
              <button 
                key={item.id} 
                type="button"
                onClick={() => toast.info(`Navigating to: ${item.title}`)}
                className="w-full text-left flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] transition"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-white/[0.05]">
                  <Icon className={`size-4 ${tone}`} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-zinc-950 dark:text-zinc-100">{item.title}</span>
                  <span className="mt-1 block text-xs text-zinc-500">{item.time}</span>
                </span>
              </button>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}
