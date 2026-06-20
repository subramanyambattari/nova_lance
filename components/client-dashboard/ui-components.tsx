import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Job, ProposalStatus } from "./types"

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10", className)}>
      <div
        className="h-full rounded-full bg-zinc-950 dark:bg-white"
        style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
      />
    </div>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase text-zinc-500">{eyebrow}</p> : null}
        <h2 className="mt-1 text-xl font-semibold tracking-normal text-zinc-950 dark:text-white">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function StatusBadge({ status }: { status: Job["status"] | ProposalStatus }) {
  const styles: Record<string, string> = {
    Active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
    Draft: "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300",
    Paused: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
    Closed: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300",
    New: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300",
    Shortlisted:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
    Interview:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300",
    Saved: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
  }

  return (
    <Badge variant="outline" className={cn("rounded-md", styles[status])}>
      {status}
    </Badge>
  )
}
