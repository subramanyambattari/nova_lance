import { Download, Plus, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="grid gap-5 border-b border-zinc-200 pb-6 dark:border-white/10 lg:grid-cols-[1fr_360px]">
      <div className="flex min-w-0 flex-col justify-end">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            Client workspace
          </Badge>
          <Badge
            variant="outline"
            className="rounded-md border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
          >
            Verified business
          </Badge>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">
          Hire, manage, and pay talent with Nova AI.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
          A complete client command center for posting jobs, reviewing proposals, managing contracts,
          tracking spend, and getting real-time AI hiring guidance.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button>
            <Plus className="size-4" />
            Post job
          </Button>
          <Button variant="outline">
            <Sparkles className="size-4" />
            Ask Nova
          </Button>
          <Button variant="outline">
            <Download className="size-4" />
            Monthly report
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
            <Sparkles className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold">Nova best action</p>
            <p className="text-sm text-zinc-500">Review 3 shortlisted AI engineers before May 26.</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          {[
            ["Fit", "94%"],
            ["Risk", "Low"],
            ["Savings", "$1.2k"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-zinc-200 p-3 dark:border-white/10">
              <p className="text-xs text-zinc-500">{label}</p>
              <p className="mt-1 font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
