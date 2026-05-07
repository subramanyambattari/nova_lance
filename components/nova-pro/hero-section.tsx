"use client"

import { ArrowRight, Crown, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] px-5 py-16 shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-8 lg:px-12">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative mx-auto max-w-4xl text-center"
      >
        <Badge variant="premium" className="mb-6 gap-2 px-3 py-1">
          <Crown className="size-3.5" />
          Premium freelancer growth suite
        </Badge>
        <h1 className="text-4xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">
          Upgrade Your Freelance Career with Nova Pro
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
          Unlock premium tools, better visibility, advanced analytics, and
          priority opportunities.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button className="h-11 rounded-xl bg-white px-5 text-zinc-950 hover:bg-blue-100">
            <Sparkles className="size-4" />
            Upgrade Now
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-xl border-white/10 bg-white/[0.04] px-5 text-zinc-100 hover:bg-white/[0.08]"
          >
            Compare Plans
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
