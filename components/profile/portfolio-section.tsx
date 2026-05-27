"use client"

import { ExternalLink, ImagePlus, Plus } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const projects = [
  {
    title: "Nova Metrics",
    description: "A premium analytics dashboard for subscription teams.",
    url: "novametrics.dev",
    accent: "from-blue-500/40 to-violet-500/20",
  },
  {
    title: "Relay Commerce",
    description: "Checkout optimization and storefront rebuild.",
    url: "relaycommerce.io",
    accent: "from-cyan-500/35 to-blue-500/10",
  },
]

export function PortfolioSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.35 }}>
      <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Portfolio showcase</CardTitle>
          <Button type="button" variant="outline" className="rounded-xl border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-200">
            <Plus className="size-4" />
            Add project
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3 rounded-2xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-zinc-950/55 p-4">
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/30 dark:border-white/15 dark:bg-white/[0.03] p-4">
              <ImagePlus className="size-5 text-blue-600 dark:text-blue-300" />
              <p className="mt-2 text-sm font-medium text-zinc-800 dark:text-zinc-100">Upload project images</p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Show the work clients need to inspect.</p>
            </div>
            <div className="space-y-2">
              <Label>Project title</Label>
              <Input className="rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500" placeholder="Project title" />
            </div>
            <div className="space-y-2">
              <Label>Project description</Label>
              <Textarea className="rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500" placeholder="What did you build?" />
            </div>
            <div className="space-y-2">
              <Label>Live demo URL</Label>
              <Input className="rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500" placeholder="https://..." />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((project) => (
              <div key={project.title} className="overflow-hidden rounded-2xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-zinc-950/55 transition hover:-translate-y-1 hover:border-violet-500/30 dark:hover:border-violet-400/30">
                <div className={`h-32 bg-gradient-to-br ${project.accent}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{project.title}</h3>
                    <ExternalLink className="size-4 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <p className="mt-2 text-sm leading-5 text-zinc-650 dark:text-zinc-400">{project.description}</p>
                  <Badge variant="outline" className="mt-4 border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                    {project.url}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
