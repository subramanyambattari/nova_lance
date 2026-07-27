"use client"

import { Brain, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const recommendations = [
  "92% Match for your React + Prisma skills",
  "88% Match for SaaS dashboard work",
  "84% Match for TypeScript platform builds",
]

export function RecommendedJobs() {
  return (
    <Card className="relative overflow-hidden rounded-3xl border-zinc-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900/40 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-50" />
      <CardHeader className="relative z-10 flex-row items-center gap-3 border-b border-zinc-100 dark:border-white/5 pb-4">
        <div className="rounded-xl bg-violet-50 p-2 dark:bg-violet-500/10">
          <Brain className="size-4.5 text-violet-600 dark:text-violet-400" />
        </div>
        <CardTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Recommended jobs</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4 pt-5">
        {recommendations.map((item) => (
          <div key={item} className="group cursor-pointer rounded-2xl border border-zinc-200/80 bg-zinc-50/50 dark:border-white/10 dark:bg-zinc-950/40 p-4 transition-all hover:shadow-md hover:border-violet-200 dark:hover:border-violet-500/30 dark:hover:bg-zinc-900/80">
            <Badge variant="premium" className="mb-3 gap-1.5 px-2.5 py-1 text-xs font-semibold shadow-sm">
              <Sparkles className="size-3.5" />
              AI-style match
            </Badge>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">{item}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
