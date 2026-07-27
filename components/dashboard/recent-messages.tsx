"use client"

import { motion } from "framer-motion"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/lib/toast"

interface Message {
  name: string
  initials: string
  message: string
  time: string
  online: boolean
}

export function RecentMessages({ initialMessages }: { initialMessages?: Message[] }) {
  const displayMessages = initialMessages || []
  
  if (displayMessages.length === 0) {
    return (
      <Card className="flex flex-col rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <CardHeader className="flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-bold text-zinc-950 dark:text-zinc-100">Recent messages</CardTitle>
          <Badge variant="outline" className="border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950">
            0 unread
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center p-8 text-center text-sm text-zinc-500">
          No recent messages.
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.25 }}>
      <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20">
        <CardHeader className="flex-row items-center justify-between pb-3">
          <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Recent messages</CardTitle>
          <Badge variant="outline" className="border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950">
            {displayMessages.length} unread
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayMessages.map((item) => (
            <button
              key={item.name + item.time}
              type="button"
              onClick={() => toast.info(`Opening message thread with ${item.name}...`)}
              className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left transition hover:border-blue-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-400/30 dark:hover:bg-white/[0.06]"
            >
              <div className="relative">
                <Avatar className="size-10 border border-zinc-200 dark:border-white/10">
                  <AvatarFallback className="bg-zinc-200 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                    {item.initials}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 size-2.5 rounded-full border border-zinc-950 ${
                    item.online ? "bg-emerald-400" : "bg-zinc-500"
                  }`}
                />
              </div>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-100">{item.name}</span>
                  <span className="text-xs text-zinc-500">{item.time}</span>
                </span>
                <span className="mt-1 block truncate text-sm text-zinc-600 dark:text-zinc-400">{item.message}</span>
              </span>
            </button>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
