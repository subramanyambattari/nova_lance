"use client"

import { Bookmark, BookmarkCheck, BriefcaseBusiness, Clock3, ExternalLink, MapPin, ShieldCheck, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Job } from "@/components/jobs/types"

function postedAgo(date: string) {
  const hours = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 36e5))
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

function plainText(value: string) {
  return value.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim()
}

export function JobCard({
  job,
  onApply,
  onSave,
}: {
  job: Job
  onApply: (job: Job) => void
  onSave: (job: Job) => void
}) {
  const SaveIcon = job.saved ? BookmarkCheck : Bookmark

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}>
      <Card className="group h-full rounded-2xl border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:border-blue-400/30">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="premium" className="gap-1">
                <Sparkles className="size-3" />
                {job.match}% match
              </Badge>
              {job.remote ? <Badge variant="success">Remote</Badge> : null}
              {job.verifiedClient ? (
                <Badge variant="outline" className="gap-1 border-white/10 bg-white/[0.04] text-zinc-300">
                  <ShieldCheck className="size-3" />
                  Verified
                </Badge>
              ) : null}
            </div>
            <Link href={`/jobs/${encodeURIComponent(job.id)}`} className="text-lg font-semibold text-white transition hover:text-blue-200">
              {job.title}
            </Link>
            <p className="mt-2 text-sm text-zinc-400">{job.company}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => onSave(job)} className="rounded-xl text-zinc-400 hover:bg-white/[0.08]">
            <SaveIcon className="size-4" />
          </Button>
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-500">
          {plainText(job.description).slice(0, 240)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.slice(0, 5).map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-white/5 text-zinc-300">{skill}</Badge>
          ))}
        </div>
        <div className="mt-5 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
          <span className="flex items-center gap-2"><BriefcaseBusiness className="size-4 text-blue-300" />{job.salary}</span>
          <span className="flex items-center gap-2"><MapPin className="size-4 text-violet-300" />{job.location}</span>
          <span className="flex items-center gap-2"><Clock3 className="size-4 text-emerald-300" />{postedAgo(job.postedAt)}</span>
          <span className="flex items-center gap-2"><ExternalLink className="size-4 text-zinc-500" />{job.source}</span>
        </div>
        <div className="mt-5 flex gap-2">
          <Button type="button" onClick={() => onApply(job)} className="flex-1 rounded-xl bg-white text-zinc-950 hover:bg-blue-100">
            Apply Now
          </Button>
          <Button asChild type="button" variant="outline" className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-200">
            <Link href={`/jobs/${encodeURIComponent(job.id)}`}>Details</Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
