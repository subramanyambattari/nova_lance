"use client"

import { CheckCircle2, FileText, MessageSquare, PenLine } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const activity = [
  { title: "Updated profile", meta: "Added new SaaS dashboard case study", icon: PenLine },
  { title: "Submitted proposal", meta: "React analytics dashboard project", icon: FileText },
  { title: "Completed milestone", meta: "Mobile app audit handoff", icon: CheckCircle2 },
  { title: "Client review received", meta: "5.0 rating from Relay Cloud", icon: MessageSquare },
]

export function RecentActivity() {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.4 }}>
      <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activity.map((item) => {
            const Icon = item.icon

            return (
              <div key={item.title} className="flex items-center gap-3 rounded-xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-white/[0.03] p-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-200">
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">{item.title}</span>
                  <span className="mt-1 block text-xs text-zinc-550 dark:text-zinc-400">{item.meta}</span>
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}
