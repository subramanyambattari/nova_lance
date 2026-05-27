"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import {
  ArrowDownToLine,
  ArrowUpRight,
  Banknote,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Download,
  FileText,
  Landmark,
  ReceiptText,
  ShieldCheck,
  Wallet,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const monthlyEarnings = [
  { month: "Jan", earned: 6200, pending: 1400, target: 6800 },
  { month: "Feb", earned: 7600, pending: 1800, target: 7200 },
  { month: "Mar", earned: 7100, pending: 2200, target: 7800 },
  { month: "Apr", earned: 9800, pending: 1700, target: 8600 },
  { month: "May", earned: 11200, pending: 3100, target: 9800 },
  { month: "Jun", earned: 12400, pending: 4100, target: 10800 },
]

const incomeSources = [
  { source: "Milestones", amount: 18400, share: 54 },
  { source: "Retainers", amount: 9200, share: 27 },
  { source: "Hourly work", amount: 4800, share: 14 },
  { source: "Rush fees", amount: 1700, share: 5 },
]

const payoutSchedule = [
  { label: "Available now", value: "$8,240", detail: "Bank transfer ready", icon: Wallet, tone: "text-emerald-300" },
  { label: "Next payout", value: "$3,600", detail: "Scheduled May 24", icon: CalendarClock, tone: "text-blue-300" },
  { label: "Client review", value: "$4,100", detail: "2 milestones pending", icon: Clock3, tone: "text-amber-300" },
]

const transactions = [
  {
    id: "PAY-2108",
    project: "Analytics dashboard",
    client: "Northstar Labs",
    date: "May 20, 2026",
    gross: "$4,000",
    fee: "$400",
    net: "$3,600",
    status: "Available",
  },
  {
    id: "PAY-2099",
    project: "Landing page implementation",
    client: "Brightlayer",
    date: "May 18, 2026",
    gross: "$1,800",
    fee: "$180",
    net: "$1,620",
    status: "In review",
  },
  {
    id: "PAY-2084",
    project: "Product strategy sprint",
    client: "Cascade Studio",
    date: "May 14, 2026",
    gross: "$2,400",
    fee: "$240",
    net: "$2,160",
    status: "Paid",
  },
  {
    id: "PAY-2071",
    project: "Design system audit",
    client: "Finch Health",
    date: "May 10, 2026",
    gross: "$3,200",
    fee: "$320",
    net: "$2,880",
    status: "Paid",
  },
]

const taxItems = [
  { label: "Estimated tax reserve", value: "$6,840", progress: 72 },
  { label: "Platform fees YTD", value: "$3,460", progress: 38 },
  { label: "Deductible expenses", value: "$1,280", progress: 24 },
]

const tooltipStyle = {
  background: "rgba(9, 9, 11, 0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#fafafa",
}

function statusBadge(status: string) {
  if (status === "Paid") return <Badge variant="success">{status}</Badge>
  if (status === "Available") return <Badge variant="premium">{status}</Badge>
  return (
    <Badge variant="outline" className="border-amber-300/20 bg-amber-300/10 text-amber-200">
      {status}
    </Badge>
  )
}

export function EarningsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen overflow-hidden bg-transparent text-zinc-900 dark:text-zinc-100">
      <div className="relative z-0 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl sm:p-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="text-sm font-medium text-emerald-500 dark:text-emerald-300">Freelancer earnings</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950 dark:text-white sm:text-4xl">
              Earnings
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
              Track cash flow, payout timing, project income, and tax reserves from one workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
            >
              <Download className="size-4" />
              Export
            </Button>
            <Button type="button" className="rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-emerald-100">
              <ArrowDownToLine className="size-4" />
              Withdraw
            </Button>
          </div>
        </motion.header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Available balance", value: "$8,240", detail: "Ready to withdraw", icon: Wallet, tone: "text-emerald-300" },
            { label: "Pending clearance", value: "$4,100", detail: "Across 2 milestones", icon: Clock3, tone: "text-amber-300" },
            { label: "Month to date", value: "$12,400", detail: "+18.7% vs target", icon: CircleDollarSign, tone: "text-blue-300" },
            { label: "Projected month", value: "$18,900", detail: "Based on active jobs", icon: ArrowUpRight, tone: "text-violet-300" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 * index }}
            >
              <Card className="h-full rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
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

        <section className="grid gap-4 xl:grid-cols-[1.45fr_0.75fr]">
          <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Revenue forecast</CardTitle>
              <Badge variant="premium">+18.7%</Badge>
            </CardHeader>
            <CardContent className="h-80 min-h-0 min-w-0 pt-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <ComposedChart data={monthlyEarnings} margin={{ left: -16, right: 8, top: 10 }}>
                    <defs>
                      <linearGradient id="earningsArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(120,120,120,0.08)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", borderRadius: 12 }} cursor={{ stroke: "rgba(52,211,153,0.25)" }} />
                    <Area type="monotone" dataKey="earned" fill="url(#earningsArea)" stroke="#34d399" strokeWidth={3} />
                    <Bar dataKey="pending" fill="#f59e0b" opacity={0.42} radius={[8, 8, 2, 2]} />
                    <Line type="monotone" dataKey="target" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-full w-full bg-zinc-200 dark:bg-white/10" />
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Payout status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payoutSchedule.map((item) => (
                <div key={item.label} className="rounded-xl border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-zinc-500">{item.label}</p>
                      <p className="mt-2 text-xl font-semibold text-zinc-950 dark:text-white">{item.value}</p>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{item.detail}</p>
                    </div>
                    <item.icon className={`size-5 ${item.tone}`} />
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-200">
                  <ShieldCheck className="size-4" />
                  Payout account verified
                </div>
                <p className="mt-2 text-xs leading-5 text-emerald-800/80 dark:text-emerald-100/70">
                  ACH transfers are enabled for Nova Lance balance withdrawals.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="transactions" className="grid gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="w-full justify-start overflow-x-auto sm:w-auto bg-zinc-100 dark:bg-white/[0.04]">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="taxes">Taxes</TabsTrigger>
            </TabsList>
            <Badge variant="outline" className="w-fit border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
              Updated May 21, 2026
            </Badge>
          </div>

          <TabsContent value="transactions">
            <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
              <CardHeader className="flex-row items-center justify-between gap-3">
                <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Recent transactions</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
                >
                  <FileText className="size-4" />
                  Statement
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-200 dark:border-white/10 hover:bg-transparent">
                      <TableHead className="text-zinc-500">Project</TableHead>
                      <TableHead className="text-zinc-500">Date</TableHead>
                      <TableHead className="text-right text-zinc-500">Gross</TableHead>
                      <TableHead className="text-right text-zinc-500">Fee</TableHead>
                      <TableHead className="text-right text-zinc-500">Net</TableHead>
                      <TableHead className="text-right text-zinc-500">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id} className="border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/[0.03]">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
                              <ReceiptText className="size-5" />
                            </span>
                            <div>
                              <p className="font-medium text-zinc-900 dark:text-zinc-100">{transaction.project}</p>
                              <p className="mt-1 text-xs text-zinc-500">
                                {transaction.id} - {transaction.client}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-500 dark:text-zinc-400">{transaction.date}</TableCell>
                        <TableCell className="text-right text-zinc-600 dark:text-zinc-300">{transaction.gross}</TableCell>
                        <TableCell className="text-right text-zinc-500">{transaction.fee}</TableCell>
                        <TableCell className="text-right font-medium text-zinc-950 dark:text-zinc-100">{transaction.net}</TableCell>
                        <TableCell className="text-right">{statusBadge(transaction.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources">
            <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Income mix</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {incomeSources.map((item) => (
                    <div key={item.source}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">{item.source}</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">${item.amount.toLocaleString()}</span>
                      </div>
                      <Progress className="mt-2" value={item.share} />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Income by source</CardTitle>
                </CardHeader>
                <CardContent className="h-80 min-h-0 min-w-0 pt-2">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={incomeSources} layout="vertical" margin={{ left: 12, right: 16 }}>
                        <CartesianGrid stroke="rgba(120,120,120,0.08)" horizontal={false} />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                        <YAxis dataKey="source" type="category" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} width={86} />
                        <Tooltip contentStyle={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", borderRadius: 12 }} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                        <Bar dataKey="amount" radius={[0, 8, 8, 0]} fill="#38bdf8" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Skeleton className="h-full w-full bg-zinc-200 dark:bg-white/10" />
                  )}
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="taxes">
            <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
              <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Tax snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {taxItems.map((item) => (
                    <div key={item.label} className="rounded-xl border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">{item.label}</span>
                        <span className="font-medium text-zinc-950 dark:text-zinc-100">{item.value}</span>
                      </div>
                      <Progress className="mt-3" value={item.progress} />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Reserve trend</CardTitle>
                </CardHeader>
                <CardContent className="h-80 min-h-0 min-w-0 pt-2">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <AreaChart data={monthlyEarnings} margin={{ left: -16, right: 8 }}>
                        <defs>
                          <linearGradient id="taxReserve" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.38} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(120,120,120,0.08)" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
                        <Tooltip contentStyle={{ background: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)", borderRadius: 12 }} cursor={{ stroke: "rgba(245,158,11,0.25)" }} />
                        <Area type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={3} fill="url(#taxReserve)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <Skeleton className="h-full w-full bg-zinc-200 dark:bg-white/10" />
                  )}
                </CardContent>
              </Card>
            </section>
          </TabsContent>
        </Tabs>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Default payout", value: "Chase Business", detail: "ACH ending 2841", icon: Landmark },
            { title: "Protection", value: "Escrow covered", detail: "$7,900 secured", icon: CheckCircle2 },
            { title: "Documents", value: "4 statements", detail: "Ready for export", icon: Banknote },
          ].map((item) => (
            <Card key={item.title} className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-200">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-zinc-500">{item.title}</p>
                  <p className="mt-1 font-medium text-zinc-950 dark:text-zinc-100">{item.value}</p>
                  <p className="mt-1 text-xs text-zinc-500">{item.detail}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  )
}
