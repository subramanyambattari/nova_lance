"use client"

import Link from "next/link"
import { Suspense, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Activity, AlertTriangle, BriefcaseBusiness, CalendarClock, DollarSign, Search } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { JobsQueryProvider } from "@/components/jobs/query-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ActiveJobItem, ActiveJobsResponse, JobStatus } from "@/components/active-jobs/types"

const statuses: Array<{ value: "ALL" | JobStatus; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "REVIEW", label: "Review" },
  { value: "COMPLETED", label: "Completed" },
  { value: "AT_RISK", label: "At Risk" },
  { value: "BLOCKED", label: "Blocked" },
]

export function ActiveJobsClient({ initialData }: { initialData: ActiveJobsResponse }) {
  return (
    <JobsQueryProvider>
      <Suspense fallback={<ActiveJobsLoading />}>
        <ActiveJobsWorkspace initialData={initialData} />
      </Suspense>
    </JobsQueryProvider>
  )
}

function ActiveJobsWorkspace({ initialData }: { initialData: ActiveJobsResponse }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    q: searchParams.get("q") ?? "",
    status: searchParams.get("status") ?? "ALL",
    sort: searchParams.get("sort") ?? "updated",
    client: searchParams.get("client") ?? "all",
    priority: searchParams.get("priority") ?? "all",
  })
  const debouncedSearch = useDebouncedValue(filters.q, 250)

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set("q", debouncedSearch)
    if (filters.status !== "ALL") params.set("status", filters.status)
    if (filters.sort !== "updated") params.set("sort", filters.sort)
    if (filters.client !== "all") params.set("client", filters.client)
    if (filters.priority !== "all") params.set("priority", filters.priority)
    return params.toString()
  }, [debouncedSearch, filters.client, filters.priority, filters.sort, filters.status])

  const { data = initialData, isFetching } = useQuery({
    queryKey: ["active-jobs", queryString],
    queryFn: async () => {
      const response = await fetch(`/api/active-jobs${queryString ? `?${queryString}` : ""}`)
      const json = await response.json()
      if (!response.ok) throw new Error(json.error ?? "Unable to load active jobs")
      return json as ActiveJobsResponse
    },
    initialData,
    refetchInterval: 15_000,
  })

  useEffect(() => {
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
  }, [pathname, queryString, router])

  return (
    <main className="min-h-screen overflow-hidden bg-transparent text-zinc-900 dark:text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-8 top-72 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <div className="relative z-0 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-300">
                <Activity className="h-4 w-4" />
                Live workspace {isFetching ? "syncing" : "ready"}
              </div>
              <h1 className="mt-3 text-3xl font-semibold text-zinc-950 dark:text-white sm:text-4xl">Active Jobs</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Manage contracts, milestones, deliverables, deadlines, and client communication from real project data.
              </p>
            </div>
            <Button asChild className="bg-blue-500 text-white hover:bg-blue-400">
              <Link href="/dashboard/proposals">Review proposals</Link>
            </Button>
          </div>
        </header>

        <StatsGrid data={data} />
        <Filters filters={filters} data={data} onChange={setFilters} />

        <section className="grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="grid gap-4">
            {data.jobs.length ? data.jobs.map((job) => <JobCard key={job.id} job={job} />) : <EmptyState />}
          </div>
          <AnalyticsPanel data={data} />
        </section>
      </div>
    </main>
  )
}

function StatsGrid({ data }: { data: ActiveJobsResponse }) {
  const stats = [
    { label: "In progress", value: data.stats.inProgress, icon: BriefcaseBusiness, detail: "Live contracts" },
    { label: "Milestones", value: data.stats.activeMilestones, icon: Activity, detail: "Open delivery steps" },
    { label: "At risk", value: data.stats.atRisk, icon: AlertTriangle, detail: "Overdue or flagged" },
    { label: "Due this week", value: data.stats.deadlinesThisWeek, icon: CalendarClock, detail: "Deadline pressure" },
    { label: "Active earnings", value: currency(data.stats.totalActiveEarnings), icon: DollarSign, detail: "Open contract value" },
  ]

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-xl dark:shadow-black/10 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-zinc-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{stat.detail}</p>
              </div>
              <stat.icon className="h-5 w-5 text-blue-500 dark:text-blue-300" />
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

function Filters({
  filters,
  data,
  onChange,
}: {
  filters: { q: string; status: string; sort: string; client: string; priority: string }
  data: ActiveJobsResponse
  onChange: (filters: { q: string; status: string; sort: string; client: string; priority: string }) => void
}) {
  return (
    <Card className="border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04] backdrop-blur-xl">
      <CardContent className="grid gap-3 p-4 lg:grid-cols-[1.2fr_0.75fr_0.75fr_0.75fr]">
        <div className="relative">
          <Search className="absolute left-3 top-[calc(50%-1px)] h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={filters.q}
            onChange={(event) => onChange({ ...filters, q: event.target.value })}
            placeholder="Search projects, clients, scope"
            className="border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/60 pl-9 text-zinc-900 dark:text-zinc-100"
          />
        </div>
        <Tabs
          value={filters.status}
          onValueChange={(status) => onChange({ ...filters, status })}
          className="min-w-0 overflow-x-auto lg:col-span-3"
        >
          <TabsList className="flex h-auto min-w-full w-max justify-start gap-1 bg-zinc-100 dark:bg-zinc-950/60">
            {statuses.map((status) => (
              <TabsTrigger key={status.value} value={status.value} className="h-9 min-w-max flex-1 px-3 py-2 text-xs">
                {status.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Select value={filters.client} onChange={(event) => onChange({ ...filters, client: event.target.value })} className="border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100">
          <option value="all">All clients</option>
          {data.filters.clients.map((client) => (
            <option key={client} value={client}>
              {client}
            </option>
          ))}
        </Select>
        <Select value={filters.priority} onChange={(event) => onChange({ ...filters, priority: event.target.value })} className="border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100">
          <option value="all">All priorities</option>
          {data.filters.priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </Select>
        <Select value={filters.sort} onChange={(event) => onChange({ ...filters, sort: event.target.value })} className="border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100">
          <option value="updated">Latest activity</option>
          <option value="deadline">Deadline</option>
          <option value="budget-high">Budget high</option>
          <option value="budget-low">Budget low</option>
        </Select>
      </CardContent>
    </Card>
  )
}

function JobCard({ job }: { job: ActiveJobItem }) {
  const nextMilestone = job.milestones.find((milestone) => !milestone.completed)

  return (
    <Link href={`/active-jobs/${job.id}`} className="block">
      <Card className="border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/10 backdrop-blur-xl transition hover:border-blue-500/40 dark:hover:border-blue-400/40 hover:bg-zinc-50/50 dark:hover:bg-white/[0.065]">
        <CardContent className="grid gap-5 p-5 lg:grid-cols-[1fr_220px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={job.status} />
              {job.milestones.some((milestone) => milestone.overdue) ? (
                <Badge variant="outline" className="border-amber-400/30 bg-amber-500/10 text-amber-200">
                  Overdue milestone
                </Badge>
              ) : null}
              <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                {job.paymentStatus}
              </Badge>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-zinc-950 dark:text-white">{job.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{job.description}</p>
            <div className="mt-4 grid gap-3 text-sm text-zinc-500 dark:text-zinc-400 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="Client" value={job.client.name} />
              <Metric label="Deadline" value={job.deadline ? formatDate(job.deadline) : "Not set"} />
              <Metric label="Milestones" value={`${job.milestones.filter((item) => item.completed).length}/${job.milestones.length}`} />
              <Metric label="Last message" value={job.latestMessageAt ? relativeTime(job.latestMessageAt) : "No messages"} />
            </div>
            {nextMilestone ? (
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
                Current milestone: <span className="font-semibold text-zinc-900 dark:text-white">{nextMilestone.title}</span>
              </p>
            ) : null}
          </div>
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950/50 p-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Progress</span>
                <span className="font-medium text-zinc-900 dark:text-white">{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="mt-3 h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Payment</span>
                <span className="font-medium text-zinc-900 dark:text-white">{job.paymentProgress}%</span>
              </div>
              <Progress value={job.paymentProgress} className="mt-3 h-2" />
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 dark:border-white/10 pt-4">
              <span className="text-sm text-zinc-500">Budget</span>
              <span className="text-lg font-semibold text-zinc-900 dark:text-white">{currency(job.budget ?? 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function AnalyticsPanel({ data }: { data: ActiveJobsResponse }) {
  return (
    <div className="grid gap-4">
      <Card className="border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-zinc-950 dark:text-white">Live analytics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid grid-cols-3 gap-3">
            <Metric label="Completion" value={`${data.analytics.completionRate}%`} />
            <Metric label="Milestones" value={`${data.analytics.milestoneCompletion}%`} />
            <Metric label="Overdue" value={String(data.analytics.overdueTasks)} />
          </div>
          <div className="h-52 min-h-0 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={data.analytics.weeklyProductivity}>
                <defs>
                  <linearGradient id="productivity" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(120,120,120,0.08)" vertical={false} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="completed" stroke="#60a5fa" fill="url(#productivity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-zinc-950 dark:text-white">Status mix</CardTitle>
        </CardHeader>
        <CardContent className="h-56 min-h-0 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={data.analytics.statusCounts}>
              <CartesianGrid stroke="rgba(120,120,120,0.08)" vertical={false} />
              <XAxis dataKey="status" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", borderRadius: 12 }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyState() {
  return (
    <Card className="border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] backdrop-blur-xl">
      <CardContent className="p-8 text-center">
        <BriefcaseBusiness className="mx-auto h-10 w-10 text-zinc-400 dark:text-zinc-600" />
        <h2 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-white">No active jobs yet</h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Accepted proposals with a client-backed job will appear here automatically.</p>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: JobStatus }) {
  const classes: Record<JobStatus, string> = {
    IN_PROGRESS: "border-blue-400/30 bg-blue-500/10 text-blue-200",
    REVIEW: "border-violet-400/30 bg-violet-500/10 text-violet-200",
    COMPLETED: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
    BLOCKED: "border-red-400/30 bg-red-500/10 text-red-200",
    AT_RISK: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  }

  return (
    <Badge variant="outline" className={classes[status]}>
      {status.replace("_", " ")}
    </Badge>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{value}</p>
    </div>
  )
}

function useDebouncedValue(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [delay, value])

  return debounced
}

function ActiveJobsLoading() {
  return (
    <div className="min-h-screen bg-transparent p-6 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto grid max-w-7xl gap-4">
        <Skeleton className="h-40 bg-zinc-200 dark:bg-white/[0.06]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-28 bg-zinc-200 dark:bg-white/[0.06]" />
          ))}
        </div>
        <Skeleton className="h-96 bg-zinc-200 dark:bg-white/[0.06]" />
      </div>
    </div>
  )
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value))
}

function relativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.max(1, Math.round(diff / 60_000))
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}
