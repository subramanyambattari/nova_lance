"use client"

import { Rocket, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

export function FinalCta() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-14 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-8"
    >
      <div className="absolute inset-x-0 top-0 mx-auto h-48 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="relative">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-violet-500/25 text-blue-100">
          <Rocket className="size-6" />
        </div>
        <h2 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">
          Start Growing Faster with Nova Pro
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-400">
          Upgrade visibility, win better-fit clients, and understand your freelance business with premium insights.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button className="h-11 rounded-xl bg-white px-5 text-zinc-950 hover:bg-blue-100">
            <Sparkles className="size-4" />
            Upgrade to Pro
          </Button>
          <Button variant="outline" className="h-11 rounded-xl border-white/10 bg-white/[0.04] px-5 text-zinc-100">
            Start Free Trial
          </Button>
        </div>
      </div>
    </motion.section>
  )
}
