"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ProposalStatus } from "@/components/proposals/types"

const statusStyles: Record<ProposalStatus, string> = {
  DRAFT: "border-zinc-500/30 bg-zinc-500/10 text-zinc-300",
  SUBMITTED: "border-blue-400/30 bg-blue-500/10 text-blue-200",
  VIEWED: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
  INTERVIEW: "border-violet-400/30 bg-violet-500/10 text-violet-200",
  ACCEPTED: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  REJECTED: "border-rose-400/30 bg-rose-500/10 text-rose-200",
  WITHDRAWN: "border-amber-400/30 bg-amber-500/10 text-amber-200",
}

export function ProposalStatusBadge({ status }: { status: ProposalStatus }) {
  return (
    <Badge variant="outline" className={cn("capitalize", statusStyles[status])}>
      {status.toLowerCase()}
    </Badge>
  )
}
