import { CurrentWork } from "@/components/dashboard/current-work"
import { DashboardNavbar } from "@/components/dashboard/navbar"
import { DeadlinesWidget } from "@/components/dashboard/deadlines-widget"
import { EarningsChart } from "@/components/dashboard/earnings-chart"
import { RecentMessages } from "@/components/dashboard/recent-messages"
import { RecommendedJobs } from "@/components/dashboard/recommended-jobs"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"

export default async function DashboardPage() {
  const user = await requireUser()

  const availableJobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  })

  const serializedJobs = availableJobs.map(job => ({
    id: job.id,
    title: job.title,
    budget: job.salary || "$0",
    skills: job.skills,
  }))

  const activeJobs = await prisma.activeJob.findMany({
    where: { freelancerId: user.id },
    include: { client: true },
    orderBy: { updatedAt: "desc" },
    take: 4,
  })

  const serializedActiveJobs = activeJobs.map(job => ({
    id: job.id,
    title: job.title,
    client: job.client ? { name: job.client.name } : null,
    status: job.status,
    deadline: job.deadline ? job.deadline.toISOString() : null,
    progress: job.progress,
  }))

  const milestones = await prisma.milestone.findMany({
    where: {
      job: { freelancerId: user.id },
      completed: true,
    }
  })

  const totalEarnings = milestones.reduce((sum, m) => sum + (m.amount || 0), 0)
  const formattedEarnings = `$${totalEarnings.toLocaleString()}`

  const stats = {
    activeJobs: activeJobs.length,
    earnings: formattedEarnings,
    openProposals: await prisma.proposal.count({ where: { freelancerId: user.id, status: "DRAFT" } })
  }

  return (
    <div className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
      <DashboardNavbar />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/3 top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute right-10 top-80 h-80 w-80 rounded-full bg-violet-200/35 blur-3xl dark:bg-violet-500/10" />
      </div>
      <div className="relative z-0 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035] dark:shadow-2xl dark:shadow-black/20 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-300">Freelancer dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950 dark:text-white sm:text-4xl">
              Welcome back, {user.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
              Track your freelance performance and active work.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-white/10 dark:bg-zinc-950/60">
            {[
              ["Profile rank", "Top 3%"],
              ["Avg. reply", "12m"],
              ["Booked", "86%"],
            ].map(([label, value]) => (
              <div key={label} className="min-w-20">
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-1 text-sm font-semibold text-zinc-950 dark:text-zinc-100">{value}</p>
              </div>
            ))}
          </div>
        </header>

        <StatsGrid initialStats={stats} />

        <EarningsChart />

        <section className="grid gap-4 xl:grid-cols-[1.6fr_0.9fr]">
          <CurrentWork initialActiveJobs={serializedActiveJobs} />
          <RecentMessages />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
          <RecommendedJobs initialJobs={serializedJobs} />
          <DeadlinesWidget />
        </section>
      </div>
    </div>
  )
}
