"use client"

import { motion } from "framer-motion"
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  MessageSquare,
  Radar,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const commandStats = [
  {
    label: "Today focus",
    value: "7",
    detail: "Actions need attention",
    icon: Radar,
    tone: "text-sky-300",
  },
  {
    label: "Pipeline value",
    value: "$42.8k",
    detail: "Across proposals and leads",
    icon: Target,
    tone: "text-violet-300",
  },
  {
    label: "Active work",
    value: "5",
    detail: "2 milestones due soon",
    icon: BriefcaseBusiness,
    tone: "text-amber-300",
  },
  {
    label: "Available balance",
    value: "$8.2k",
    detail: "Ready to withdraw",
    icon: Wallet,
    tone: "text-emerald-300",
  },
]

const priorityActions = [
  {
    title: "Send revised scope",
    meta: "Northstar Labs requested a narrower milestone estimate.",
    route: "/proposals",
    cta: "Open proposals",
    icon: Send,
    badge: "High",
    tone: "border-rose-300/20 bg-rose-400/10 text-rose-200",
  },
  {
    title: "Review dashboard notes",
    meta: "FinOps Studio left 4 comments on the analytics build.",
    route: "/active-jobs",
    cta: "View job",
    icon: MessageSquare,
    badge: "Today",
    tone: "border-amber-300/20 bg-amber-400/10 text-amber-200",
  },
  {
    title: "Withdraw cleared funds",
    meta: "$3,600 cleared from the latest dashboard milestone.",
    route: "/earnings",
    cta: "Go to earnings",
    icon: ArrowDownToLine,
    badge: "Ready",
    tone: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  },
]

const pipeline = [
  { stage: "Leads", count: 18, value: 54000 },
  { stage: "Proposals", count: 8, value: 28600 },
  { stage: "Interviews", count: 4, value: 16400 },
  { stage: "Won", count: 2, value: 9200 },
]

const earningsTrend = [
  { month: "Jan", booked: 6200, paid: 5400 },
  { month: "Feb", booked: 7600, paid: 6900 },
  { month: "Mar", booked: 7100, paid: 7200 },
  { month: "Apr", booked: 9800, paid: 8700 },
  { month: "May", booked: 11200, paid: 10100 },
  { month: "Jun", booked: 12400, paid: 8200 },
]

const activeWork = [
  {
    project: "Analytics dashboard build",
    client: "FinOps Studio",
    state: "In delivery",
    due: "May 24",
    progress: 72,
  },
  {
    project: "SaaS landing page redesign",
    client: "Relay Cloud",
    state: "Client review",
    due: "May 23",
    progress: 88,
  },
  {
    project: "Mobile onboarding audit",
    client: "Northstar Labs",
    state: "Scope update",
    due: "Today",
    progress: 46,
  },
]

const messages = [
  {
    name: "Maya Chen",
    initials: "MC",
    message: "Can we review the final screens today?",
    time: "4m",
  },
  {
    name: "Arjun Mehta",
    initials: "AM",
    message: "The prototype looks ready for stakeholder review.",
    time: "21m",
  },
  {
    name: "Elena Ruiz",
    initials: "ER",
    message: "I added notes to the milestone brief.",
    time: "1h",
  },
]

const shortcuts = [
  { title: "Find matched jobs", detail: "12 high-fit jobs available", href: "/find-jobs", icon: Search },
  { title: "Proposal pipeline", detail: "8 open, 3 awaiting replies", href: "/proposals", icon: FileText },
  { title: "Active delivery", detail: "5 current contracts", href: "/active-jobs", icon: BriefcaseBusiness },
  { title: "Messages", detail: "3 unread client threads", href: "/messages", icon: MessageSquare },
  { title: "Earnings", detail: "$8.2k available", href: "/earnings", icon: CircleDollarSign },
  { title: "Settings", detail: "Security and workspace defaults", href: "/settings", icon: ShieldCheck },
]

const tooltipStyle = {
  background: "rgba(9, 9, 11, 0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#fafafa",
}

export function OverviewPage({ stats }: { stats?: any }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  // Merge dynamic stats with command stats if available
  const dynamicCommandStats = [
    {
      label: "Today focus",
      value: "7",
      detail: "Actions need attention",
      icon: Radar,
      tone: "text-sky-300",
    },
    {
      label: "Pipeline value",
      value: stats ? `$${(stats.pipeline.reduce((acc: number, curr: any) => acc + curr.value, 0) / 1000).toFixed(1)}k` : "$42.8k",
      detail: "Across proposals and leads",
      icon: Target,
      tone: "text-violet-300",
    },
    {
      label: "Active work",
      value: stats ? stats.activeWorkCount.toString() : "5",
      detail: "Currently active contracts",
      icon: BriefcaseBusiness,
      tone: "text-amber-300",
    },
    {
      label: "Available balance",
      value: stats ? `$${(stats.availableBalance / 1000).toFixed(1)}k` : "$8.2k",
      detail: "Ready to withdraw",
      icon: Wallet,
      tone: "text-emerald-300",
    },
  ]

  const displayPipeline = stats ? stats.pipeline : pipeline;
  const displayActiveWork = stats ? stats.activeWork : activeWork;
  const displayEarningsTrend = stats && stats.earningsTrend ? stats.earningsTrend : earningsTrend;
  const displayPriorityActions = stats && stats.priorityActions ? stats.priorityActions : priorityActions;
  const displayClientActivity = stats && stats.clientActivity && stats.clientActivity.length > 0 ? stats.clientActivity : messages;
  const unreadMessagesCount = stats?.unreadMessagesCount ?? 3;
  const healthScore = stats?.healthScore ?? 86;
  const nextDeadline = stats?.nextDeadline ?? { value: "Today, 6:00 PM", detail: "Mobile onboarding scope update" };
  const waitingProposals = stats?.waitingProposals ?? 3;
  const userName = stats?.userName ? stats.userName.split(" ")[0] : "there";

  const currentDateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const currentHour = new Date().getHours();
  
  let greeting = "Good evening";
  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 17) greeting = "Good afternoon";

  let subHeadline = "See what needs attention, where money is moving, and how your pipeline is converting.";
  if (unreadMessagesCount > 0) {
    subHeadline = `You have ${unreadMessagesCount} unread message${unreadMessagesCount > 1 ? 's' : ''} waiting. Let's see what needs attention today.`;
  } else if (displayPriorityActions.some((a: any) => a.badge === "Today")) {
    subHeadline = "You have upcoming deadlines. Here is your workspace overview for today.";
  } else if (displayPriorityActions.some((a: any) => a.badge === "Ready")) {
    subHeadline = "You have funds ready to withdraw! Here is your workspace overview.";
  }

  return (
    <div className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="relative z-0 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header
          className="relative overflow-hidden grid gap-6 rounded-3xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 lg:grid-cols-[1fr_360px] lg:p-8"
        >
          <div className="absolute -left-20 -top-20 size-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute right-0 top-0 size-64 rounded-full bg-violet-500/10 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="premium" className="gap-1.5 px-3 py-1 text-sm shadow-sm">
                <Sparkles className="size-3.5" />
                Main overview
              </Badge>
              <Badge variant="outline" className="border-zinc-200/80 bg-zinc-50/80 text-zinc-700 dark:border-white/10 dark:bg-zinc-950/50 dark:text-zinc-300 px-3 py-1 text-sm font-semibold shadow-sm">
                {currentDateStr}
              </Badge>
            </div>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-4xl lg:text-5xl">
              {greeting}, {userName}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base font-medium">
              {subHeadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="h-11 rounded-xl bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all px-6">
                <Link href="/find-jobs">
                  <Search className="size-4.5 mr-2" />
                  Find Jobs
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-zinc-800 font-semibold hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-200 dark:hover:bg-white/[0.06] shadow-sm transition-all px-6"
              >
                <Link href="/proposals">
                  <FileText className="size-4.5 mr-2" />
                  Review Proposals
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative z-10 rounded-3xl border border-zinc-200/80 bg-zinc-50/80 p-6 dark:border-white/10 dark:bg-zinc-950/60 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Workspace health</p>
                <p className="mt-1 text-3xl font-bold text-zinc-950 dark:text-white">{healthScore}%</p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 shadow-sm">
                <TrendingUp className="size-6" />
              </span>
            </div>
            <Progress value={healthScore} className="mt-5 h-2.5 bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              {[
                ["Reply", "12m"],
                ["Booked", "86%"],
                ["Rank", "Top 3%"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-zinc-200/60 bg-white/60 p-3.5 dark:border-white/5 dark:bg-white/[0.02] shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</p>
                  <p className="mt-1.5 font-bold text-zinc-950 dark:text-zinc-100">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dynamicCommandStats.map((stat, index) => (
            <div key={stat.label} className="group">
              <Card className="relative h-full overflow-hidden rounded-3xl border-zinc-200/80 bg-white shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/5" />
                <CardContent className="relative z-10 p-6">
                  <div className={`inline-flex rounded-2xl bg-zinc-50 p-3 dark:bg-white/[0.03] shadow-sm ${stat.tone.replace('text', 'text').replace('300', '600')} dark:${stat.tone}`}>
                    <stat.icon className="size-5.5" />
                  </div>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-zinc-950 dark:text-white">{stat.value}</p>
                  <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">{stat.detail}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1fr_1.15fr]">
          <Card className="relative overflow-hidden rounded-3xl border-zinc-200/80 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-50" />
            <CardHeader className="relative z-10 flex-row items-center justify-between gap-3 border-b border-zinc-100 dark:border-white/5 pb-4">
              <CardTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-100">Priority actions</CardTitle>
              <Badge variant="outline" className="border-zinc-200/80 bg-zinc-50/80 text-zinc-700 dark:border-white/10 dark:bg-zinc-950/50 dark:text-zinc-300 font-semibold shadow-sm">
                Today
              </Badge>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4 pt-5">
              {displayPriorityActions.map((item: any) => (
                <div key={item.title} className="group rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 transition-all hover:border-amber-200 hover:shadow-md dark:border-white/10 dark:bg-zinc-950/40 dark:hover:border-amber-500/30 dark:hover:bg-zinc-900/80">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-zinc-700 shadow-sm dark:bg-white/[0.04] dark:text-zinc-200">
                        {item.icon ? <item.icon className="size-5.5" /> : <ShieldCheck className="size-5.5" />}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <p className="font-bold text-zinc-950 dark:text-zinc-100">{item.title}</p>
                          <Badge variant="outline" className={`font-semibold shadow-sm ${item.tone}`}>
                            {item.badge}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">{item.meta}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-5 h-11 w-full rounded-xl border-zinc-200/80 bg-white font-semibold text-zinc-800 shadow-sm transition-all hover:bg-zinc-100 hover:text-amber-700 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-amber-400"
                  >
                    <Link href={item.route}>
                      {item.cta}
                      <ArrowRight className="size-4.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden rounded-3xl border-zinc-200/80 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-50" />
            <CardHeader className="relative z-10 flex-row items-center justify-between gap-3 border-b border-zinc-100 dark:border-white/5 pb-4">
              <CardTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-100">Pipeline momentum</CardTitle>
              <Badge variant="premium" className="px-2.5 py-1 text-sm font-semibold shadow-sm">42% close rate</Badge>
            </CardHeader>
            <CardContent className="relative z-10 h-96 min-h-0 min-w-0 pt-5">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={displayPipeline} margin={{ left: -16, right: 8, top: 10 }}>
                    <CartesianGrid stroke="currentColor" className="text-zinc-200/50 dark:text-white/5" vertical={false} />
                    <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12, fontWeight: 500 }} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12, fontWeight: 500 }} />
                    <YAxis yAxisId="right" orientation="right" hide />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(167, 139, 250, 0.05)" }} />
                    <Bar yAxisId="left" dataKey="count" fill="#8b5cf6" radius={[6, 6, 2, 2]} barSize={40} />
                    <Line yAxisId="right" type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: "#38bdf8", strokeWidth: 0 }} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-full w-full rounded-2xl bg-zinc-100 dark:bg-white/5" />
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
          <Card className="relative overflow-hidden rounded-3xl border-zinc-200/80 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50" />
            <CardHeader className="relative z-10 flex-row items-center justify-between gap-3 border-b border-zinc-100 dark:border-white/5 pb-4">
              <CardTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-100">Active delivery</CardTitle>
              <Button asChild variant="outline" size="sm" className="h-9 rounded-xl border-zinc-200/80 bg-zinc-50/50 font-semibold text-zinc-800 shadow-sm transition-all hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-200 dark:hover:bg-white/[0.06]">
                <Link href="/active-jobs">
                  View all
                  <ArrowUpRight className="size-4 ml-1.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="relative z-10 p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-100 bg-zinc-50/50 hover:bg-transparent dark:border-white/5 dark:bg-white/[0.01]">
                    <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-xs">Project</TableHead>
                    <TableHead className="hidden font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-xs sm:table-cell">Client</TableHead>
                    <TableHead className="font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-xs">State</TableHead>
                    <TableHead className="hidden font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-xs md:table-cell">Due</TableHead>
                    <TableHead className="min-w-36 font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-xs">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayActiveWork.length > 0 ? (
                    displayActiveWork.map((project: any) => (
                      <TableRow key={project.project} className="border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/[0.03]">
                        <TableCell className="font-bold text-zinc-950 dark:text-zinc-100">{project.project}</TableCell>
                        <TableCell className="hidden font-medium text-zinc-600 dark:text-zinc-400 sm:table-cell">{project.client}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-sky-200 bg-sky-50 font-semibold text-sky-700 shadow-sm dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
                            {project.state}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden font-medium text-zinc-600 dark:text-zinc-400 md:table-cell">{project.due}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Progress value={project.progress} className="h-2 bg-zinc-100 dark:bg-zinc-800" />
                            <span className="w-10 text-right text-xs font-bold text-zinc-600 dark:text-zinc-400">{project.progress}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center font-medium text-zinc-500 dark:text-zinc-400">No active delivery contracts found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden rounded-3xl border-zinc-200/80 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-50" />
            <CardHeader className="relative z-10 flex-row items-center justify-between gap-3 border-b border-zinc-100 dark:border-white/5 pb-4">
              <CardTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-100">Client activity</CardTitle>
              <Badge variant="outline" className="gap-1.5 border-zinc-200/80 bg-zinc-50/80 font-semibold text-zinc-700 shadow-sm dark:border-white/10 dark:bg-zinc-950/50 dark:text-zinc-300">
                <Bell className="size-3.5" />
                {unreadMessagesCount} unread
              </Badge>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4 pt-5">
              {displayClientActivity.map((item: any) => (
                <Link
                  key={item.name + item.time}
                  href="/messages"
                  className="group flex items-center gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 transition-all hover:border-sky-200 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-zinc-950/40 dark:hover:border-sky-500/30 dark:hover:bg-zinc-900/80"
                >
                  <Avatar className="size-11 border border-zinc-200 shadow-sm dark:border-white/10">
                    <AvatarFallback className="bg-zinc-100 font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                      {item.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-bold text-zinc-950 transition-colors group-hover:text-sky-700 dark:text-zinc-100 dark:group-hover:text-sky-400">{item.name}</span>
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{item.time}</span>
                    </span>
                    <span className="mt-1 block truncate text-sm font-medium text-zinc-600 dark:text-zinc-400">{item.message}</span>
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="relative overflow-hidden rounded-3xl border-zinc-200/80 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50" />
            <CardHeader className="relative z-10 flex-row items-center justify-between gap-3 border-b border-zinc-100 dark:border-white/5 pb-4">
              <CardTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-100">Earnings snapshot</CardTitle>
              <Badge variant="success" className="px-2.5 py-1 text-sm font-semibold shadow-sm">+$12.4k MTD</Badge>
            </CardHeader>
            <CardContent className="relative z-10 h-80 min-h-0 min-w-0 pt-5">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={displayEarningsTrend} margin={{ left: -16, right: 8 }}>
                    <defs>
                      <linearGradient id="overviewBooked" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.38} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="currentColor" className="text-zinc-200/50 dark:text-white/5" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12, fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12, fontWeight: 500 }} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(16, 185, 129, 0.25)" }} />
                    <Area type="monotone" dataKey="booked" stroke="#10b981" strokeWidth={3} fill="url(#overviewBooked)" />
                    <Line type="monotone" dataKey="paid" stroke="#0ea5e9" strokeWidth={3} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-full w-full rounded-2xl bg-zinc-100 dark:bg-white/5" />
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-zinc-200/80 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40">
            <CardHeader className="border-b border-zinc-100 dark:border-white/5 pb-4">
              <CardTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-100">Workspace shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 pt-5">
              {shortcuts.map((shortcut) => (
                <Link
                  key={shortcut.title}
                  href={shortcut.href}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 transition-all hover:border-sky-300 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-zinc-950/40 dark:hover:border-sky-500/30 dark:hover:bg-zinc-900/80"
                >
                  <span className="flex min-w-0 items-center gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-zinc-700 shadow-sm dark:bg-white/[0.04] dark:text-zinc-200">
                      <shortcut.icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-zinc-950 transition-colors group-hover:text-sky-700 dark:text-zinc-100 dark:group-hover:text-sky-400">{shortcut.title}</span>
                      <span className="mt-1 block truncate text-xs font-medium text-zinc-500">{shortcut.detail}</span>
                    </span>
                  </span>
                  <ArrowRight className="size-4.5 shrink-0 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-sky-500" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {[
            { title: "Next deadline", value: nextDeadline.value, detail: nextDeadline.detail, icon: CalendarClock },
            { title: "Proposal response", value: `${waitingProposals} waiting`, detail: "Average reply time is 12 minutes", icon: Clock3 },
            { title: "Account readiness", value: "Verified", detail: "Profile, payout, and billing are active", icon: CheckCircle2 },
          ].map((item) => (
            <Card key={item.title} className="group overflow-hidden rounded-3xl border-zinc-200/80 bg-white shadow-sm backdrop-blur-xl transition-all hover:shadow-md dark:border-white/10 dark:bg-zinc-900/40">
              <CardContent className="flex items-center gap-4 p-6">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-700 shadow-sm transition-transform group-hover:scale-105 dark:bg-white/[0.03] dark:text-zinc-300">
                  <item.icon className="size-5.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{item.title}</p>
                  <p className="mt-1.5 truncate text-lg font-bold text-zinc-950 dark:text-zinc-100">{item.value}</p>
                  <p className="mt-1 truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">{item.detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  )
}
