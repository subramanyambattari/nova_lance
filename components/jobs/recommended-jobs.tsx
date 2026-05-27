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
    <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
      <CardHeader className="flex-row items-center gap-2">
        <Brain className="size-4 text-violet-600 dark:text-violet-300" />
        <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Recommended jobs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((item) => (
          <div key={item} className="rounded-xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-white/[0.03] p-3">
            <Badge variant="premium" className="mb-2 gap-1">
              <Sparkles className="size-3" />
              AI-style match
            </Badge>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{item}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
