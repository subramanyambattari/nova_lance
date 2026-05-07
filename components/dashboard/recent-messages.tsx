"use client"

import { motion } from "framer-motion"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  name: string
  initials: string
  message: string
  time: string
  online: boolean
}

const messages: Message[] = [
  {
    name: "Maya Chen",
    initials: "MC",
    message: "Can we review the final screens today?",
    time: "4m",
    online: true,
  },
  {
    name: "Arjun Mehta",
    initials: "AM",
    message: "The dashboard prototype looks sharp.",
    time: "21m",
    online: true,
  },
  {
    name: "Elena Ruiz",
    initials: "ER",
    message: "I added notes to the milestone brief.",
    time: "1h",
    online: false,
  },
]

export function RecentMessages() {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.25 }}>
      <Card className="rounded-2xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-zinc-100">Recent messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {messages.map((item) => (
            <button
              key={item.name}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-blue-400/30 hover:bg-white/[0.06]"
            >
              <div className="relative">
                <Avatar className="size-10 border border-white/10">
                  <AvatarFallback className="bg-zinc-800 text-xs text-zinc-100">
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
                  <span className="truncate text-sm font-medium text-zinc-100">{item.name}</span>
                  <span className="text-xs text-zinc-500">{item.time}</span>
                </span>
                <span className="mt-1 block truncate text-sm text-zinc-400">{item.message}</span>
              </span>
            </button>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
