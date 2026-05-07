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
    <Card className="rounded-2xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <CardHeader className="flex-row items-center gap-2">
        <FileText className="size-4 text-emerald-300" />
        <CardTitle className="text-base text-zinc-100">My Applications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {proposals.length === 0 ? (
          <p className="text-sm text-zinc-500">Submitted, viewed, interview, accepted, and rejected applications will appear here.</p>
        ) : (
          proposals.slice(0, 5).map((proposal: { id: string; status: string; budget: number | null; job?: { title: string } | null; externalJobId?: string }) => (
            <div key={proposal.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-zinc-100">{proposal.job?.title ?? proposal.externalJobId}</p>
                <Badge variant="success">{proposal.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {proposal.budget ? `$${proposal.budget.toLocaleString()} proposed` : "Budget open"}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
