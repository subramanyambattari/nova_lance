"use client"

import { CalendarClock, CheckCircle2, CircleDashed, Video } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/lib/toast"

const deadlines = [
  {
    title: "Audit milestone delivery",
    meta: "Tomorrow, 10:00 AM",
    icon: CalendarClock,
    tone: "text-blue-300",
  },
  {
    title: "Client strategy call",
    meta: "May 10, 6:30 PM",
    icon: Video,
    tone: "text-violet-300",
  },
  {
    title: "Pending homepage revisions",
    meta: "2 review notes open",
    icon: CircleDashed,
    tone: "text-amber-300",
  },
  {
    title: "Invoice approval",
    meta: "$3.2k awaiting sign-off",
    icon: CheckCircle2,
    tone: "text-emerald-300",
  },
]

export function DeadlinesWidget() {
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
          {deadlines.map((item) => {
            const Icon = item.icon

            return (
              <button 
                key={item.title} 
                type="button"
                onClick={() => toast.info(`Navigating to: ${item.title}`)}
                className="w-full text-left flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.05] transition"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-white/[0.05]">
                  <Icon className={`size-4 ${item.tone}`} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-zinc-950 dark:text-zinc-100">{item.title}</span>
                  <span className="mt-1 block text-xs text-zinc-500">{item.meta}</span>
                </span>
              </button>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}
