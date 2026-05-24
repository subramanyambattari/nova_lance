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

export function OverviewPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="relative z-0 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035] dark:shadow-2xl dark:shadow-black/20 lg:grid-cols-[1fr_360px] lg:p-6"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="premium" className="gap-1">
                <Sparkles className="size-3" />
                Main overview
              </Badge>
              <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                May 21, 2026
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal text-zinc-950 dark:text-white sm:text-4xl lg:text-5xl">
              Command center for your freelance business
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
              See what needs attention, where money is moving, which clients are active, and how the pipeline is converting across Nova Lance.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild className="rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-sky-100">
                <Link href="/find-jobs">
                  <Search className="size-4" />
                  Find Jobs
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-xl border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
              >
                <Link href="/proposals">
                  <FileText className="size-4" />
                  Review Proposals
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-zinc-950/65">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-500">Workspace health</p>
                <p className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-white">86%</p>
              </div>
              <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
                <TrendingUp className="size-5" />
              </span>
            </div>
            <Progress value={86} className="mt-4" />
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              {[
                ["Reply", "12m"],
                ["Booked", "86%"],
                ["Rank", "Top 3%"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs text-zinc-500">{label}</p>
                  <p className="mt-1 font-medium text-zinc-950 dark:text-zinc-100">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {commandStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <Card className="h-full rounded-2xl border-zinc-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20">
                <CardContent className="p-5">
                  <stat.icon className={`size-5 ${stat.tone}`} />
                  <p className="mt-5 text-sm text-zinc-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">{stat.value}</p>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{stat.detail}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1fr_1.15fr]">
          <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Priority actions</CardTitle>
              <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                Today
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {priorityActions.map((item) => (
                <div key={item.title} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-200">
                        <item.icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-zinc-950 dark:text-zinc-100">{item.title}</p>
                          <Badge variant="outline" className={item.tone}>
                            {item.badge}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm leading-5 text-zinc-500">{item.meta}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 w-full rounded-xl border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
                  >
                    <Link href={item.route}>
                      {item.cta}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Pipeline momentum</CardTitle>
              <Badge variant="premium">42% close rate</Badge>
            </CardHeader>
            <CardContent className="h-96 min-h-0 min-w-0 pt-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={pipeline} margin={{ left: -16, right: 8, top: 10 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" hide />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                    <Bar yAxisId="left" dataKey="count" fill="#38bdf8" radius={[8, 8, 2, 2]} />
                    <Line yAxisId="right" type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={3} dot={{ r: 4, fill: "#a78bfa", strokeWidth: 0 }} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-full w-full bg-zinc-100 dark:bg-white/10" />
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
          <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Active delivery</CardTitle>
              <Button asChild variant="outline" size="sm" className="rounded-xl border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08]">
                <Link href="/active-jobs">
                  View all
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-200 hover:bg-transparent dark:border-white/10">
                    <TableHead className="text-zinc-500">Project</TableHead>
                    <TableHead className="hidden text-zinc-500 sm:table-cell">Client</TableHead>
                    <TableHead className="text-zinc-500">State</TableHead>
                    <TableHead className="hidden text-zinc-500 md:table-cell">Due</TableHead>
                    <TableHead className="min-w-36 text-zinc-500">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeWork.map((project) => (
                    <TableRow key={project.project} className="border-zinc-200 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/[0.03]">
                      <TableCell className="font-medium text-zinc-950 dark:text-zinc-100">{project.project}</TableCell>
                      <TableCell className="hidden text-zinc-600 dark:text-zinc-400 sm:table-cell">{project.client}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-sky-400/20 bg-sky-500/10 text-sky-200">
                          {project.state}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-zinc-600 dark:text-zinc-400 md:table-cell">{project.due}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={project.progress} />
                          <span className="w-9 text-right text-xs text-zinc-500">{project.progress}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Client activity</CardTitle>
              <Badge variant="outline" className="gap-1 border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                <Bell className="size-3" />
                3 unread
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {messages.map((item) => (
                <Link
                  key={item.name}
                  href="/messages"
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 transition hover:border-sky-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-sky-400/30 dark:hover:bg-white/[0.06]"
                >
                  <Avatar className="size-10 border border-zinc-200 dark:border-white/10">
                    <AvatarFallback className="bg-zinc-200 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                      {item.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-100">{item.name}</span>
                      <span className="text-xs text-zinc-500">{item.time}</span>
                    </span>
                    <span className="mt-1 block truncate text-sm text-zinc-600 dark:text-zinc-400">{item.message}</span>
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Earnings snapshot</CardTitle>
              <Badge variant="success">+$12.4k MTD</Badge>
            </CardHeader>
            <CardContent className="h-80 min-h-0 min-w-0 pt-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={earningsTrend} margin={{ left: -16, right: 8 }}>
                    <defs>
                      <linearGradient id="overviewBooked" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.38} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(52,211,153,0.25)" }} />
                    <Area type="monotone" dataKey="booked" stroke="#34d399" strokeWidth={3} fill="url(#overviewBooked)" />
                    <Line type="monotone" dataKey="paid" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-full w-full bg-zinc-100 dark:bg-white/10" />
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Workspace shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {shortcuts.map((shortcut) => (
                <Link
                  key={shortcut.title}
                  href={shortcut.href}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 transition hover:border-sky-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-sky-400/30 dark:hover:bg-white/[0.06]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-200">
                      <shortcut.icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-zinc-950 dark:text-zinc-100">{shortcut.title}</span>
                      <span className="mt-1 block truncate text-xs text-zinc-500">{shortcut.detail}</span>
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-sky-200" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Next deadline", value: "Today, 6:00 PM", detail: "Mobile onboarding scope update", icon: CalendarClock },
            { title: "Proposal response", value: "3 waiting", detail: "Average reply time is 12 minutes", icon: Clock3 },
            { title: "Account readiness", value: "Verified", detail: "Profile, payout, and billing are active", icon: CheckCircle2 },
          ].map((item) => (
            <Card key={item.title} className="rounded-2xl border-zinc-200 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-200">
                  <item.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-zinc-500">{item.title}</p>
                  <p className="mt-1 truncate font-medium text-zinc-950 dark:text-zinc-100">{item.value}</p>
                  <p className="mt-1 truncate text-xs text-zinc-500">{item.detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  )
}
