"use client"

import { motion } from "framer-motion"
import {
  ArrowDownToLine,
  BadgeDollarSign,
  CalendarClock,
  CheckCircle2,
  Crown,
  ReceiptText,
  WalletCards,
} from "lucide-react"
import { toast } from "sonner"

import { PaymentMethods1 } from "@/components/billing/payment-methods1"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const invoices = [
  { id: "INV-2048", item: "Nova Pro monthly", amount: "$29.00", date: "May 1, 2026", status: "Paid" },
  { id: "INV-2031", item: "Featured proposals", amount: "$18.00", date: "Apr 18, 2026", status: "Paid" },
  { id: "INV-2014", item: "Connect bundle", amount: "$12.00", date: "Apr 3, 2026", status: "Paid" },
]

const usage = [
  { label: "Proposal boosts", value: "18 / 25" },
  { label: "Featured portfolio slots", value: "4 / 6" },
  { label: "Client insight reports", value: "12 / 20" },
]

export function BillingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-transparent text-zinc-900 dark:text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/4 top-16 h-72 w-72 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl" />
        <div className="absolute right-10 top-80 h-96 w-96 rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-3xl" />
      </div>
      <div className="relative z-0 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.035] p-5 shadow-sm dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl sm:p-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-300">Freelancer billing</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-900 dark:text-white sm:text-4xl">
              Billing
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
              Manage payment methods, Nova Pro billing, invoices, and account charges.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-200"
              onClick={() => toast.success("Billing statements exported successfully")}
            >
              <ArrowDownToLine className="size-4" />
              Export
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-blue-100"
              onClick={() => toast.success("Redirecting to Stripe checkout...", { description: "You can add funds via credit card or ACH." })}
            >
              <WalletCards className="size-4" />
              Add Funds
            </Button>
          </div>
        </motion.header>

        <section className="grid gap-4 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}>
            <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
              <CardContent className="p-5">
                <Crown className="size-5 text-violet-600 dark:text-violet-300" />
                <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">Current plan</p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-2xl font-semibold text-zinc-900 dark:text-white">Nova Pro</p>
                  <Badge variant="premium">Active</Badge>
                </div>
                <p className="mt-3 text-sm text-zinc-650 dark:text-zinc-400">$29/month · renews June 1</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
            <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
              <CardContent className="p-5">
                <BadgeDollarSign className="size-5 text-emerald-600 dark:text-emerald-300" />
                <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">Platform credits</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">$184.50</p>
                <p className="mt-3 text-sm text-zinc-650 dark:text-zinc-400">Available for connects and boosts</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }}>
            <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
              <CardContent className="p-5">
                <CalendarClock className="size-5 text-blue-600 dark:text-blue-300" />
                <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">Next charge</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">$29.00</p>
                <p className="mt-3 text-sm text-zinc-650 dark:text-zinc-400">Visa ending 4242 on June 1</p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <PaymentMethods1 />

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
            <CardHeader className="flex-row items-center justify-between gap-3">
              <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Recent invoices</CardTitle>
              <Badge variant="outline" className="border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                2026
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex flex-col gap-3 rounded-xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-200">
                      <ReceiptText className="size-5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{invoice.item}</p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {invoice.id} · {invoice.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{invoice.amount}</span>
                    <Badge variant="success">{invoice.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Plan usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {usage.map((item, index) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-550 dark:text-zinc-400">{item.label}</span>
                    <span className="text-zinc-800 dark:text-zinc-100">{item.value}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-400"
                      style={{ width: `${[72, 66, 60][index]}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/10 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="size-4" />
                  Billing account healthy
                </div>
                <p className="mt-2 text-xs leading-5 text-emerald-700/80 dark:text-emerald-100/70">
                  Your default payment method is verified and automatic renewals are enabled.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
