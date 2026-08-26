"use client"

import { Dialog as DialogPrimitive } from "radix-ui"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2, Paperclip, Save, Send, Sparkles, X, AlertCircle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { ProposalAttachmentItem, ProposalItem } from "@/components/proposals/types"

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function optionalUrl(message: string) {
  return z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || isValidUrl(value), message)
}

const draftSchema = z.object({
  jobId: z.string().optional(),
  externalJobId: z.string().optional(),
  externalJobUrl: optionalUrl("Enter a valid external job URL."),
  coverLetter: z.string().trim().min(20, "Drafts need at least 20 characters."),
  budget: z.number().min(1).optional().or(z.nan()).optional(),
  timeline: z.string().optional(),
  portfolioLinks: z
    .string()
    .optional()
    .superRefine((value, context) => {
      const invalidLink = (value ?? "")
        .split(/\n|,/)
        .map((link) => link.trim())
        .filter(Boolean)
        .find((link) => !isValidUrl(link))

      if (invalidLink) {
        context.addIssue({
          code: "custom",
          message: `Enter a valid portfolio URL: ${invalidLink}`,
        })
      }
    }),
  resumeUrl: optionalUrl("Enter a valid resume URL."),
  attachmentName: z.string().optional(),
  attachmentUrl: optionalUrl("Enter a valid attachment URL."),
})

const submitSchema = draftSchema.extend({
  coverLetter: z.string().min(80, "Submitted proposals need at least 80 characters."),
})

type ProposalForm = z.input<typeof draftSchema>

const draftKey = "nova-lance-proposal-draft"

export function CreateProposalDialog({
  open,
  proposal,
  loading,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  proposal: ProposalItem | null
  loading: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: Record<string, unknown>) => void
}) {
  const [attachments, setAttachments] = useState<ProposalAttachmentItem[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  
  // Real-time features state
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [jobDetails, setJobDetails] = useState<{ title: string; budget: number } | null>(null)
  const [jobLoading, setJobLoading] = useState(false)
  const [jobError, setJobError] = useState(false)

  const isEditing = Boolean(proposal)

  const defaults = useMemo<ProposalForm>(() => {
    if (proposal) {
      return {
        jobId: proposal.job?.id ?? "",
        externalJobId: proposal.externalJobId ?? "",
        externalJobUrl: proposal.externalJobUrl ?? "",
        coverLetter: proposal.coverLetter,
        budget: proposal.budget ?? undefined,
        timeline: proposal.timeline ?? "2 weeks",
        portfolioLinks: proposal.portfolioLinks.join("\n"),
        resumeUrl: proposal.resumeUrl ?? "",
      }
    }

    return {
      coverLetter: "",
      budget: 2500,
      timeline: "2 weeks",
      portfolioLinks: "",
      resumeUrl: "",
    }
  }, [proposal])

  const form = useForm<ProposalForm>({
    resolver: zodResolver(draftSchema),
    defaultValues: defaults,
  })

  const coverLetter = form.watch("coverLetter") ?? ""
  const watchedJobId = form.watch("jobId")
  const watchedBudget = form.watch("budget")

  // Character count & Progress bar logic
  const charCount = coverLetter.length
  const minSubmitChars = 80
  const progressPercent = Math.min((charCount / minSubmitChars) * 100, 100)
  const progressColor = charCount >= minSubmitChars ? "bg-emerald-400" : charCount >= 20 ? "bg-blue-400" : "bg-zinc-600"

  // 1. Initial Load & Hydrate
  useEffect(() => {
    if (!open) return
    const localDraft = !proposal ? localStorage.getItem(draftKey) : null
    form.reset(localDraft ? JSON.parse(localDraft) : defaults)
    setAttachments(proposal?.attachments ?? [])
  }, [defaults, form, open, proposal])

  // 2. Real-Time Saving Indicator
  useEffect(() => {
    if (!open || proposal) return
    setIsSaving(true)
    const timer = setTimeout(() => {
      const values = form.getValues()
      localStorage.setItem(draftKey, JSON.stringify(values))
      setLastSaved(new Date())
      setIsSaving(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [coverLetter, watchedBudget, watchedJobId, form.watch("timeline"), open, proposal]) // watch key fields

  // 3. Smart Timeline Suggestion
  useEffect(() => {
    if (watchedBudget && !Number.isNaN(watchedBudget)) {
      let suggestedTimeline = "2 weeks"
      if (watchedBudget < 1000) suggestedTimeline = "1 week"
      else if (watchedBudget > 5000) suggestedTimeline = "1 month"
      
      const currentTimeline = form.getValues("timeline")
      if (currentTimeline !== suggestedTimeline) {
        form.setValue("timeline", suggestedTimeline, { shouldValidate: true })
      }
    }
  }, [watchedBudget, form])

  // 4. Live Job Details Fetching
  useEffect(() => {
    if (!watchedJobId || watchedJobId.length < 5) {
      setJobDetails(null)
      setJobError(false)
      return
    }

    const fetchJob = async () => {
      setJobLoading(true)
      setJobError(false)
      try {
        const res = await fetch(`/api/jobs/${watchedJobId}`)
        if (res.ok) {
          const data = await res.json()
          setJobDetails(data)
          if (data.budget && !form.getValues("budget")) {
            form.setValue("budget", data.budget, { shouldValidate: true })
          }
        } else {
          setJobDetails(null)
          setJobError(true)
        }
      } catch (err) {
        setJobDetails(null)
        setJobError(true)
      } finally {
        setJobLoading(false)
      }
    }

    const timer = setTimeout(fetchJob, 1000)
    return () => clearTimeout(timer)
  }, [watchedJobId, form])


  function applyValidationErrors(error: z.ZodError<ProposalForm>) {
    const firstIssue = error.issues[0]

    error.issues.forEach((issue) => {
      const field = issue.path[0]
      if (typeof field === "string") {
        form.setError(field as keyof ProposalForm, { message: issue.message })
      }
    })

    const firstField = firstIssue?.path[0]
    if (typeof firstField === "string") {
      form.setFocus(firstField as keyof ProposalForm)
    }
  }

  function submitProposal(submit: boolean) {
    const values = form.getValues()
    const parsed = (submit ? submitSchema : draftSchema).safeParse(values)
    form.clearErrors()

    if (!parsed.success) {
      applyValidationErrors(parsed.error)
      return
    }

    if (parsed.data.jobId && jobError) {
      form.setError("jobId", { message: "Invalid internal Job ID. Leave blank if this is an external job." })
      form.setFocus("jobId")
      return
    }

    const portfolioLinks = (parsed.data.portfolioLinks ?? "")
      .split(/\n|,/)
      .map((link) => link.trim())
      .filter(Boolean)

    onSubmit({
      ...(proposal ? { id: proposal.id } : {}),
      jobId: parsed.data.jobId?.trim() || undefined,
      externalJobId: parsed.data.externalJobId?.trim() || undefined,
      externalJobUrl: parsed.data.externalJobUrl?.trim() || undefined,
      coverLetter: parsed.data.coverLetter,
      budget: Number.isFinite(parsed.data.budget) ? parsed.data.budget : undefined,
      timeline: parsed.data.timeline,
      portfolioLinks,
      resumeUrl: parsed.data.resumeUrl?.trim() || undefined,
      attachments,
      submit,
    })

    if (!proposal && submit) {
      localStorage.removeItem(draftKey)
    }
  }

  function addAttachment() {
    const name = form.getValues("attachmentName")?.trim()
    const url = form.getValues("attachmentUrl")?.trim()

    if (!url) {
      form.setError("attachmentUrl", { message: "Enter an attachment URL first." })
      return
    }
    if (!name) {
      form.setError("attachmentName", { message: "Please provide a name for this attachment." })
      return
    }
    if (!isValidUrl(url)) {
      form.setError("attachmentUrl", { message: "Enter a valid attachment URL." })
      form.setFocus("attachmentUrl")
      return
    }

    setAttachments((current) => [...current, { fileName: name, fileUrl: url }])
    form.setValue("attachmentName", "")
    form.setValue("attachmentUrl", "")
    form.clearErrors(["attachmentName", "attachmentUrl"])
  }

  async function useAiSuggestion() {
    const current = form.getValues("coverLetter") || ""
    const jobId = form.getValues("jobId")
    
    setAiLoading(true)
    try {
      const res = await fetch("/api/ai/proposal-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter: current || "I want to apply to this job.", jobId })
      })
      const data = await res.json()
      
      if (data.suggestion) {
        const newValue = current.trim() 
          ? `${current}\n\n[AI Feedback]: ${data.suggestion}` 
          : data.suggestion

        form.setValue("coverLetter", newValue, { 
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        })
        toast.success("AI suggestion applied!")
      } else if (data.error) {
        toast.error(data.error)
      }
    } catch (e) {
      console.error("AI feedback failed", e)
      toast.error("Failed to connect to AI service.")
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-open:animate-in data-open:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 grid max-h-[90vh] w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950 p-5 text-zinc-100 shadow-2xl shadow-black/60 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <DialogPrimitive.Title className="text-xl font-semibold text-white">
                  {isEditing ? "Edit proposal" : "Create proposal"}
                </DialogPrimitive.Title>
                
                {/* Real-time Draft Saving Indicator */}
                {!isEditing && (
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    {isSaving ? (
                      <>
                        <Loader2 className="size-3 animate-spin text-blue-400" />
                        Saving draft...
                      </>
                    ) : lastSaved ? (
                      <>
                        <Check className="size-3 text-emerald-400" />
                        Draft saved
                      </>
                    ) : null}
                  </div>
                )}
              </div>
              <DialogPrimitive.Description className="mt-1 text-sm text-zinc-500">
                Save as a draft or submit when the proposal is ready for the client.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild>
              <Button type="button" variant="ghost" size="icon" className="rounded-xl">
                <X className="size-4" />
              </Button>
            </DialogPrimitive.Close>
          </div>

          <form className="grid gap-4 pb-4" onSubmit={(event) => event.preventDefault()}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Job ID or reference</Label>
                  {jobLoading && <Loader2 className="size-3.5 animate-spin text-zinc-400" />}
                </div>
                <Input {...form.register("jobId")} className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100" />
                {form.formState.errors.jobId && <p className="text-xs text-rose-300">{form.formState.errors.jobId.message}</p>}
                
                {/* Real-time Job Lookup Result */}
                {jobDetails && (
                  <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <Check className="size-3.5" /> Found: {jobDetails.title} (${jobDetails.budget})
                  </p>
                )}
                {jobError && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-400">
                    <AlertCircle className="size-3.5" /> Job not found. Leave blank for external jobs.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>External job URL</Label>
                <Input {...form.register("externalJobUrl")} placeholder="https://..." className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100 placeholder:text-zinc-600" />
                {form.formState.errors.externalJobUrl ? <p className="text-xs text-rose-300">{form.formState.errors.externalJobUrl.message}</p> : null}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label>Cover letter editor</Label>
                <Button type="button" variant="outline" size="sm" onClick={useAiSuggestion} disabled={aiLoading} className="rounded-xl border-violet-400/20 bg-violet-500/10 text-violet-100 hover:bg-violet-500/20">
                  {aiLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                  {aiLoading ? "Thinking..." : "AI improve"}
                </Button>
              </div>
              <div className="relative">
                <Textarea
                  {...form.register("coverLetter")}
                  aria-invalid={Boolean(form.formState.errors.coverLetter)}
                  className="min-h-44 rounded-xl border-white/10 bg-white/[0.04] text-zinc-100 placeholder:text-zinc-600 pb-8"
                  placeholder="Describe your relevant experience, delivery plan, communication cadence, and outcomes..."
                />
                
                {/* Live Character Count Progress Bar */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                    <div 
                      className={`h-full transition-all duration-300 ease-out ${progressColor}`} 
                      style={{ width: `${progressPercent}%` }} 
                    />
                  </div>
                  <span className={`ml-3 text-xs ${charCount >= minSubmitChars ? "text-emerald-400" : "text-zinc-500"}`}>
                    {charCount}/{minSubmitChars}
                  </span>
                </div>
              </div>
              {form.formState.errors.coverLetter ? <p className="text-xs text-rose-300">{form.formState.errors.coverLetter.message}</p> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Budget (auto-adjusts timeline)</Label>
                <Input type="number" {...form.register("budget", { valueAsNumber: true })} className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100" />
                {form.formState.errors.budget ? <p className="text-xs text-rose-300">{form.formState.errors.budget.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label>Timeline</Label>
                <Select {...form.register("timeline")} className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100">
                  <option value="3 days">3 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="Flexible">Flexible</option>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Portfolio links</Label>
              <Textarea {...form.register("portfolioLinks")} className="min-h-20 rounded-xl border-white/10 bg-white/[0.04] text-zinc-100" placeholder="One URL per line" />
              {form.formState.errors.portfolioLinks ? <p className="text-xs text-rose-300">{form.formState.errors.portfolioLinks.message}</p> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Attachment name</Label>
                <Input {...form.register("attachmentName")} placeholder="Case study.pdf" className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100 placeholder:text-zinc-600" />
                {form.formState.errors.attachmentName ? <p className="text-xs text-rose-300">{form.formState.errors.attachmentName.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label>Attachment URL</Label>
                <div className="flex gap-2">
                  <Input {...form.register("attachmentUrl")} placeholder="https://..." className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100 placeholder:text-zinc-600" />
                  <Button type="button" variant="outline" onClick={addAttachment} className="rounded-xl border-white/10">
                    <Paperclip className="size-4" />
                  </Button>
                </div>
                {form.formState.errors.attachmentUrl ? <p className="text-xs text-rose-300">{form.formState.errors.attachmentUrl.message}</p> : null}
              </div>
            </div>

            {attachments.length ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                {attachments.map((attachment, index) => (
                  <div key={`${attachment.fileName}-${index}`} className="flex items-center justify-between gap-3 py-1 text-sm text-zinc-300">
                    <span>{attachment.fileName}</span>
                    <button type="button" className="text-zinc-500 hover:text-rose-300" onClick={() => setAttachments((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </form>

          <div className="mt-2 -mx-5 -mb-5 flex flex-col-reverse gap-3 border-t border-white/10 bg-zinc-950 px-5 py-4 sm:flex-row sm:justify-end rounded-b-2xl">
            <Button type="button" variant="outline" disabled={loading} onClick={() => submitProposal(false)} className="rounded-xl border-white/10 hover:bg-white/5">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save draft
            </Button>
            <Button type="button" disabled={loading || charCount < minSubmitChars} onClick={() => submitProposal(true)} className="rounded-xl bg-white text-zinc-950 hover:bg-blue-100 disabled:opacity-50">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Submit proposal
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
