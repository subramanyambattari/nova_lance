"use client"

import { useQuery } from "@tanstack/react-query"
import { FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function fetchProposals() {
  const response = await fetch("/api/proposals")
  if (!response.ok) throw new Error("Unable to load proposals")
  return response.json()
}

export function MyApplications() {
  const query = useQuery({ queryKey: ["proposals"], queryFn: fetchProposals })
  const proposals = query.data?.proposals ?? []

  return (
    <Card className="relative overflow-hidden rounded-3xl border-zinc-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900/40 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50" />
      <CardHeader className="relative z-10 flex-row items-center gap-3 border-b border-zinc-100 dark:border-white/5 pb-4">
        <div className="rounded-xl bg-emerald-50 p-2 dark:bg-emerald-500/10">
          <FileText className="size-4.5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <CardTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-100">My Applications</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4 pt-5">
        {proposals.length === 0 ? (
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Submitted, viewed, interview, accepted, and rejected applications will appear here.</p>
        ) : (
          proposals.slice(0, 5).map((proposal: { id: string; status: string; budget: number | null; job?: { title: string } | null; externalJobId?: string }) => (
            <div key={proposal.id} className="group cursor-pointer rounded-2xl border border-zinc-200/80 bg-zinc-50/50 dark:border-white/10 dark:bg-zinc-950/40 p-4 transition-all hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-500/30 dark:hover:bg-zinc-900/80">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{proposal.job?.title ?? proposal.externalJobId}</p>
                <Badge variant="success" className="shadow-sm">{proposal.status}</Badge>
              </div>
              <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {proposal.budget ? `$${proposal.budget.toLocaleString()} proposed` : "Budget open"}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
