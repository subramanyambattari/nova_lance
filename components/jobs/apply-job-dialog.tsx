"use client"

import { Loader2, Send, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Job } from "@/components/jobs/types"

export type ProposalPayload = {
  jobId: string
  source: string
  externalId?: string
  externalUrl?: string
  coverLetter: string
  budget: number
  timeline: string
  portfolioLinks: string
  resumeUrl?: string
}

export function ApplyJobDialog({
  job,
  open,
  submitting,
  onClose,
  onSubmit,
}: {
  job: Job | null
  open: boolean
  submitting: boolean
  onClose: () => void
  onSubmit: (payload: ProposalPayload) => void
}) {
  const [coverLetter, setCoverLetter] = useState("")
  const [budget, setBudget] = useState(2500)
  const [timeline, setTimeline] = useState("2 weeks")
  const [portfolioLinks, setPortfolioLinks] = useState("https://subburoy.dev")
  const [resumeUrl, setResumeUrl] = useState("")

  if (!open || !job) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Apply to {job.title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{job.company} · {job.salary}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="size-4" />
          </Button>
        </div>
        <div className="mt-5 grid gap-4">
          <div className="space-y-2">
            <Label>Cover letter</Label>
            <Textarea
              value={coverLetter}
              onChange={(event) => setCoverLetter(event.target.value)}
              placeholder="Explain why you are a strong fit, your relevant work, and how you would approach delivery..."
              className="min-h-40 rounded-xl border-white/10 bg-white/[0.04] text-zinc-100"
            />
            <p className="text-xs text-zinc-500">Minimum 80 characters for spam prevention.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Proposed budget</Label>
              <Input type="number" value={budget} onChange={(event) => setBudget(Number(event.target.value))} className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100" />
            </div>
            <div className="space-y-2">
              <Label>Estimated delivery time</Label>
              <Input value={timeline} onChange={(event) => setTimeline(event.target.value)} className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Portfolio links</Label>
            <Input value={portfolioLinks} onChange={(event) => setPortfolioLinks(event.target.value)} className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100" />
          </div>
          <div className="space-y-2">
            <Label>Resume attachment URL</Label>
            <Input value={resumeUrl} onChange={(event) => setResumeUrl(event.target.value)} placeholder="https://..." className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100 placeholder:text-zinc-500" />
          </div>
          <Button
            type="button"
            disabled={submitting || coverLetter.length < 80}
            onClick={() =>
              onSubmit({
                jobId: job.id,
                source: job.source,
                externalId: job.externalId,
                externalUrl: job.externalUrl,
                coverLetter,
                budget,
                timeline,
                portfolioLinks,
                resumeUrl,
              })
            }
            className="rounded-xl bg-white text-zinc-950 hover:bg-blue-100"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Submit proposal
          </Button>
        </div>
      </div>
    </div>
  )
}
