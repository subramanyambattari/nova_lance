import { ArrowUpRight, Sparkles, Briefcase, FileText, CheckCircle, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ProgressBar, SectionHeader, StatusBadge } from "./ui-components"
import { activity, deadlines } from "./data"
import type { Job } from "./types"

export function DashboardOverview({ jobsState, stats = { totalJobsPosted: 0, activeContractsCount: 0, totalSpent: 0, interviewsHeld: 0 }, activeContracts = [] }: { jobsState: Job[], stats?: any, activeContracts?: any[] }) {
  
  const overviewStats = [
    {
      label: "Total jobs posted",
      value: stats.totalJobsPosted.toString(),
      trend: "Across all time",
      icon: Briefcase,
      tone: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      label: "Active contracts",
      value: stats.activeContractsCount.toString(),
      trend: "In progress right now",
      icon: FileText,
      tone: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      label: "Total spent",
      value: `$${stats.totalSpent.toLocaleString()}`,
      trend: "All completed milestones",
      icon: CreditCard,
      tone: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      label: "Interviews held",
      value: stats.interviewsHeld.toString(),
      trend: "Total candidates interviewed",
      icon: CheckCircle,
      tone: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    },
  ]

  return (
    <div className="space-y-8">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-zinc-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
              </div>
              <span className={cn("grid size-9 place-items-center rounded-md", stat.tone)}>
                <stat.icon className="size-5" />
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-500">{stat.trend}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div>
          <SectionHeader eyebrow="Project health" title="Active Contracts" />
          <div className="space-y-3">
            {activeContracts.length > 0 ? (
              activeContracts.map((contract, i) => (
                <div key={i} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{contract.project}</h3>
                        <StatusBadge status={contract.state} />
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">
                        {contract.client} • Due {contract.due}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <ArrowUpRight className="size-4" />
                      Open
                    </Button>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <ProgressBar value={contract.progress} className="flex-1" />
                    <span className="w-10 text-right text-sm text-zinc-500">{contract.progress}%</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500">No active contracts found. Hire a freelancer to get started!</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <SectionHeader eyebrow="Activity" title="Recent freelancer activity" />
            <div className="space-y-2">
              {activity.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <span className="mt-0.5 size-2 rounded-full bg-emerald-500" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader eyebrow="Deadlines" title="Upcoming deadlines" />
            <div className="space-y-2">
              {deadlines.map(([date, item]) => (
                <div key={item} className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="w-16 shrink-0 rounded-md bg-zinc-100 px-2 py-1 text-center text-xs font-semibold dark:bg-white/10">
                    {date}
                  </div>
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="AI insights" title="Business recommendations" />
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Shortlist faster", "Your best hires happen within 36 hours of receiving 10 qualified proposals."],
            ["Adjust budget", "The chatbot MVP is priced 12% below similar expert-level projects."],
            ["Reduce risk", "Require repo access, deployment checklist, and acceptance tests in milestone 1."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <Sparkles className="size-5 text-blue-600 dark:text-blue-300" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
