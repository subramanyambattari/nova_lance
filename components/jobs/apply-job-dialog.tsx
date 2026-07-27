"use client"

import { Bot, Link as LinkIcon, Loader2, Send, X, Clock, DollarSign, FileText } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

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
  const [budget, setBudget] = useState<number | "">(2500)
  const [timeline, setTimeline] = useState("2 weeks")
  const [portfolioLinks, setPortfolioLinks] = useState("https://subburoy.dev")
  const [resumeUrl, setResumeUrl] = useState("")

  const [isGenerating, setIsGenerating] = useState(false)
  const typingIntervalRef = useRef<number | null>(null)

  // Reset state when a new job is selected
  useEffect(() => {
    if (job) {
      setCoverLetter("")
      setBudget(2500)
      setTimeline("2 weeks")
      setPortfolioLinks("https://subburoy.dev")
      setResumeUrl("")
      setIsGenerating(false)
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    }
  }, [job])

  if (!open || !job) return null

  // Clean title for display (remove duplicate [Live] tags if any)
  const displayTitle = job.title.replace(/(\[Live\]\s*)+/g, "[Live] ").trim()

  const handleGenerateAI = () => {
    if (isGenerating) return
    setIsGenerating(true)
    setCoverLetter("")

    const prompt = `Hi ${job.company ?? "Team"},\n\nI am extremely interested in the ${displayTitle.replace("[Live]", "").trim()} position. I have over 5 years of extensive experience delivering high-quality solutions matching your requirements.\n\nMy approach emphasizes clean code, scalability, and robust deployment pipelines. I'd love to jump on a quick call to discuss how I can bring immediate value to your project.\n\nBest regards,\nSubburoy`
    
    let index = 0
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    
    typingIntervalRef.current = window.setInterval(() => {
      setCoverLetter((prev) => prev + prompt.charAt(index))
      index++
      if (index >= prompt.length) {
        clearInterval(typingIntervalRef.current!)
        setIsGenerating(false)
      }
    }, 15)
  }

  const handleClose = () => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    setIsGenerating(false)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-zinc-200/80 bg-white/95 p-1 shadow-2xl dark:border-white/10 dark:bg-zinc-950/90 dark:shadow-black/80 backdrop-blur-xl"
        >
          <div className="absolute -left-20 -top-20 size-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute right-0 top-0 size-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative rounded-2xl bg-white/50 p-6 dark:bg-zinc-900/50">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-200/50 pb-5 dark:border-white/5">
              <div>
                <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-white">Apply to {displayTitle}</h2>
                <p className="mt-1.5 font-medium text-sm text-zinc-500 dark:text-zinc-400">{job.company ?? "Confidential Client"} • <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{job.salary ?? "Budget unlisted"}</span></p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={handleClose} className="rounded-xl hover:bg-zinc-200/50 dark:hover:bg-white/10">
                <X className="size-5" />
              </Button>
            </div>
            
            <div className="mt-6 grid gap-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-900 font-semibold dark:text-zinc-100">Cover letter</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="h-8 rounded-lg border-blue-200 bg-blue-50 font-bold text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                  >
                    {isGenerating ? <Loader2 className="size-3.5 mr-1.5 animate-spin" /> : <Bot className="size-3.5 mr-1.5" />}
                    AI Draft
                  </Button>
                </div>
                <Textarea
                  value={coverLetter}
                  onChange={(event) => setCoverLetter(event.target.value)}
                  placeholder="Explain why you are a strong fit, your relevant work, and how you would approach delivery..."
                  className="min-h-48 resize-none rounded-2xl border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm focus:border-blue-500 focus:ring-blue-500/20 dark:border-white/10 dark:bg-black/40 dark:text-zinc-100 dark:focus:border-blue-400"
                />
              </div>
              
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-zinc-900 font-semibold dark:text-zinc-100">Proposed budget</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-zinc-400" />
                    <Input type="number" value={budget} onChange={(event) => setBudget(event.target.value === "" ? "" : Number(event.target.value))} className="h-12 pl-10 rounded-2xl border-zinc-200 bg-white font-medium text-zinc-900 shadow-sm focus:border-blue-500 focus:ring-blue-500/20 dark:border-white/10 dark:bg-black/40 dark:text-zinc-100 dark:focus:border-blue-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-zinc-900 font-semibold dark:text-zinc-100">Estimated delivery time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-zinc-400" />
                    <Input value={timeline} onChange={(event) => setTimeline(event.target.value)} className="h-12 pl-10 rounded-2xl border-zinc-200 bg-white font-medium text-zinc-900 shadow-sm focus:border-blue-500 focus:ring-blue-500/20 dark:border-white/10 dark:bg-black/40 dark:text-zinc-100 dark:focus:border-blue-400" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-zinc-900 font-semibold dark:text-zinc-100">Portfolio links</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-zinc-400" />
                  <Input value={portfolioLinks} onChange={(event) => setPortfolioLinks(event.target.value)} className="h-12 pl-10 rounded-2xl border-zinc-200 bg-white font-medium text-zinc-900 shadow-sm focus:border-blue-500 focus:ring-blue-500/20 dark:border-white/10 dark:bg-black/40 dark:text-zinc-100 dark:focus:border-blue-400" />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-zinc-900 font-semibold dark:text-zinc-100">Resume attachment URL</Label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-zinc-400" />
                  <Input value={resumeUrl} onChange={(event) => setResumeUrl(event.target.value)} placeholder="https://..." className="h-12 pl-10 rounded-2xl border-zinc-200 bg-white font-medium text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-blue-500 focus:ring-blue-500/20 dark:border-white/10 dark:bg-black/40 dark:text-zinc-100 dark:focus:border-blue-400" />
                </div>
              </div>
              
              <Button
                type="button"
                disabled={
                  submitting ||
                  isGenerating ||
                  !coverLetter.trim() ||
                  !budget ||
                  !timeline.trim() ||
                  !portfolioLinks.trim() ||
                  !resumeUrl.trim()
                }
                onClick={() => {
                  if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
                  onSubmit({
                    jobId: job.id,
                    source: job.source,
                    externalId: job.externalId,
                    externalUrl: job.externalUrl,
                    coverLetter,
                    budget: Number(budget) || 0,
                    timeline,
                    portfolioLinks,
                    resumeUrl,
                  })
                }}
                className="mt-4 h-12 w-full rounded-2xl bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                {submitting ? <Loader2 className="size-5 mr-2 animate-spin" /> : <Send className="size-5 mr-2" />}
                Submit application
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
