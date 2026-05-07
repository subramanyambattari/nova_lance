"use client"

import { CalendarClock, CheckCircle2, CircleDashed, Video } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
      <Card className="rounded-2xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base text-zinc-100">Upcoming deadlines</CardTitle>
          <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-zinc-300">
            This week
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {deadlines.map((item) => {
            const Icon = item.icon

            return (
              <div key={item.title} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.05]">
                  <Icon className={`size-4 ${item.tone}`} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-zinc-100">{item.title}</span>
                  <span className="mt-1 block text-xs text-zinc-500">{item.meta}</span>
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}
