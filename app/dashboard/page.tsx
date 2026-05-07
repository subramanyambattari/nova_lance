import { CurrentWork } from "@/components/dashboard/current-work"
import { DashboardNavbar } from "@/components/dashboard/navbar"
import { DeadlinesWidget } from "@/components/dashboard/deadlines-widget"
import { EarningsChart } from "@/components/dashboard/earnings-chart"
import { RecentMessages } from "@/components/dashboard/recent-messages"
import { RecommendedJobs } from "@/components/dashboard/recommended-jobs"
import { StatsGrid } from "@/components/dashboard/stats-grid"

export default function DashboardPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <DashboardNavbar />
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute left-1/3 top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-10 top-80 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <div className="relative z-0 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300">Freelancer dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              Welcome back, Subbu
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Track your freelance performance and active work.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
            {[
              ["Profile rank", "Top 3%"],
              ["Avg. reply", "12m"],
              ["Booked", "86%"],
            ].map(([label, value]) => (
              <div key={label} className="min-w-20">
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-1 text-sm font-semibold text-zinc-100">{value}</p>
              </div>
            ))}
          </div>
        </header>

        <StatsGrid />

        <EarningsChart />

        <section className="grid gap-4 xl:grid-cols-[1.6fr_0.9fr]">
          <CurrentWork />
          <RecentMessages />
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
          <RecommendedJobs />
          <DeadlinesWidget />
        </section>
      </div>
    </div>
  )
}
