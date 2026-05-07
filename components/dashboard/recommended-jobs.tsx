"use client"

import { ArrowUpRight, MapPin } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Job {
  title: string
  budget: string
  skills: string[]
}

const jobs: Job[] = [
  {
    title: "Fintech onboarding UX review",
    budget: "$4.8k fixed",
    skills: ["UX Audit", "Figma", "SaaS"],
  },
  {
    title: "React analytics dashboard",
    budget: "$75/hr",
    skills: ["React", "Recharts", "TypeScript"],
  },
  {
    title: "Premium Webflow to Next.js build",
    budget: "$6.2k fixed",
    skills: ["Next.js", "Tailwind", "CMS"],
  },
]

export function RecommendedJobs() {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.3 }}>
      <Card className="rounded-2xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-zinc-100">Recommended jobs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.title}
              className="rounded-2xl border border-white/10 bg-zinc-950/55 p-4 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium text-zinc-100">{job.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{job.budget}</p>
                </div>
                <Badge variant="outline" className="gap-1 border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
                  <MapPin className="size-3" />
                  Remote
                </Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-white/5 text-zinc-300">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button className="mt-5 w-full rounded-xl bg-white text-zinc-950 hover:bg-blue-100">
                Apply
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
