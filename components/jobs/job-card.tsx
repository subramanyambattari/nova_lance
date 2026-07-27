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
      <Card className="group flex flex-col justify-between h-full relative overflow-hidden rounded-3xl border-zinc-200/80 bg-white p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:border-white/10 dark:bg-zinc-900/40 dark:shadow-2xl dark:shadow-black/40 dark:hover:border-blue-500/30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-900/10" />
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="premium" className="gap-1 px-2 py-0.5 text-[11px]">
                <Sparkles className="size-3" />
                {job.match}% match
              </Badge>
              {job.remote ? <Badge variant="success" className="px-2 py-0.5 text-[11px]">Remote</Badge> : null}
              {job.verifiedClient ? (
                <Badge variant="outline" className="gap-1 px-2 py-0.5 text-[11px] border-zinc-200/80 bg-zinc-50 font-medium text-zinc-700 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-300 shadow-sm">
                  <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                  Verified
                </Badge>
              ) : null}
            </div>
            <Link href={`/jobs/${encodeURIComponent(job.id)}`} className="text-lg font-bold tracking-tight text-zinc-950 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {job.title}
            </Link>
            <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">{job.company}</p>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={() => onSave(job)} 
            className={`h-8 w-8 rounded-full shadow-sm transition-all ${job.saved ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-zinc-50 text-zinc-400 hover:text-zinc-700 dark:bg-white/5 dark:hover:text-zinc-200'}`}
          >
            <SaveIcon className="size-4" />
          </Button>
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {plainText(job.description).slice(0, 160)}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-zinc-100/80 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-white/5 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors">{skill}</Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="secondary" className="bg-zinc-100/50 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-white/[0.02] dark:text-zinc-400">+{job.skills.length - 4}</Badge>
            )}
          </div>
          <div className="mt-auto pt-4">
            <div className="grid gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 sm:grid-cols-2 mb-4">
              <span className="flex items-center gap-1.5"><BriefcaseBusiness className="size-3.5 text-blue-500 dark:text-blue-400" />{job.salary}</span>
              <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-violet-500 dark:text-violet-400" />{job.location}</span>
              <span className="flex items-center gap-1.5"><Clock3 className="size-3.5 text-emerald-500 dark:text-emerald-400" />{postedAgo(job.postedAt)}</span>
              <span className="flex items-center gap-1.5"><ExternalLink className="size-3.5 text-zinc-400" />{job.source}</span>
            </div>
            <div className="flex gap-2.5">
              <Button type="button" onClick={() => onApply(job)} className="flex-1 h-10 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all">
                Apply Now
              </Button>
              <Button asChild type="button" variant="outline" className="h-10 px-4 rounded-xl border-zinc-200/80 bg-zinc-50/50 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-200 dark:hover:bg-white/[0.06] transition-all">
                <Link href={`/jobs/${encodeURIComponent(job.id)}`}>Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
