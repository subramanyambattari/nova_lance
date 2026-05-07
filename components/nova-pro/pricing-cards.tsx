"use client"

import { Check, Crown } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For freelancers getting started.",
    features: ["Basic proposals", "Limited analytics", "Standard profile listing"],
  },
  {
    name: "Nova Pro",
    price: "$29",
    yearly: "$290",
    description: "For freelancers ready to grow faster.",
    highlighted: true,
    features: [
      "Priority proposals",
      "Advanced analytics",
      "AI job recommendations",
      "Unlimited applications",
      "Verified freelancer badge",
      "Premium profile visibility",
      "Faster payouts",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For agencies and specialist teams.",
    features: ["Team workspace", "Dedicated support", "Agency management"],
  },
]

export function PricingCards() {
  const [interval, setInterval] = useState("monthly")

  return (
    <section className="space-y-6">
      <div className="sticky top-28 z-10 flex justify-center">
        <Tabs value={interval} onValueChange={setInterval}>
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
            whileHover={{ y: -6 }}
          >
            <Card
              className={cn(
                "relative h-full overflow-hidden rounded-2xl border-white/10 bg-white/[0.045] p-px shadow-2xl shadow-black/20 backdrop-blur-xl",
                plan.highlighted && "border-violet-300/40 shadow-violet-500/20"
              )}
            >
              {plan.highlighted ? (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/35 via-violet-500/25 to-transparent" />
              ) : null}
              <div className="relative flex h-full flex-col rounded-2xl bg-zinc-950/80 p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  {plan.highlighted ? (
                    <Badge variant="premium" className="gap-1">
                      <Crown className="size-3" />
                      Recommended
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-3 text-sm text-zinc-400">{plan.description}</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-4xl font-semibold text-white">
                    {interval === "yearly" && plan.yearly ? plan.yearly : plan.price}
                  </span>
                  {plan.price.startsWith("$") ? (
                    <span className="pb-1 text-sm text-zinc-500">
                      /{interval === "yearly" ? "year" : "month"}
                    </span>
                  ) : null}
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-zinc-300">
                      <Check className="mt-0.5 size-4 shrink-0 text-blue-300" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={cn(
                    "mt-8 w-full rounded-xl",
                    plan.highlighted
                      ? "bg-white text-zinc-950 hover:bg-blue-100"
                      : "border border-white/10 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.08]"
                  )}
                >
                  {plan.name === "Starter" ? "Current Plan" : "Choose Plan"}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
