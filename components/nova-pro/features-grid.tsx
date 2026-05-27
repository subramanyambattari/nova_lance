"use client"

import {
  BadgeCheck,
  Brain,
  ChartLine,
  Eye,
  Headphones,
  Send,
  Users,
  Wallet,
} from "lucide-react"
import { motion } from "framer-motion"

import { Card } from "@/components/ui/card"

const features = [
  { title: "AI Job Matching", description: "Find roles that match your rate, skills, and close probability.", icon: Brain },
  { title: "Advanced Analytics", description: "Track views, wins, earnings, and profile conversion in one place.", icon: ChartLine },
  { title: "Priority Support", description: "Get faster help for proposals, disputes, billing, and payout questions.", icon: Headphones },
  { title: "Verified Freelancer Badge", description: "Earn a premium trust signal clients can spot instantly.", icon: BadgeCheck },
  { title: "Unlimited Proposals", description: "Apply freely to high-fit work without monthly limits.", icon: Send },
  { title: "Faster Withdrawals", description: "Move earnings out sooner with priority payout processing.", icon: Wallet },
  { title: "Team Collaboration", description: "Invite collaborators for larger retainers and agency-style work.", icon: Users },
  { title: "Smart Portfolio Insights", description: "See which case studies drive profile views and client replies.", icon: Eye },
]

export function FeaturesGrid() {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white sm:text-3xl">Premium tools built for serious freelancers</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Every Nova Pro feature is designed to improve visibility, conversion, and payout speed.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full rounded-2xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.045] p-5 shadow-sm dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl transition hover:border-blue-500/30 dark:hover:border-blue-400/30">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 text-blue-700 dark:from-blue-500/30 dark:to-violet-500/20 dark:text-blue-100">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-zinc-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-650 dark:text-zinc-400">{feature.description}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
