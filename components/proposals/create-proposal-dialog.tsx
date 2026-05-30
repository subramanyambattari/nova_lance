"use client"

import { Dialog as DialogPrimitive } from "radix-ui"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Paperclip, Save, Send, Sparkles, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

  useEffect(() => {
    if (!open) return

    const localDraft = !proposal ? localStorage.getItem(draftKey) : null
    form.reset(localDraft ? JSON.parse(localDraft) : defaults)
    setAttachments(proposal?.attachments ?? [])
  }, [defaults, form, open, proposal])

  useEffect(() => {
    if (!open || proposal) return

    const subscription = form.watch((value) => {
      localStorage.setItem(draftKey, JSON.stringify(value))
    })

    return () => subscription.unsubscribe()
  }, [form, open, proposal])

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

    if (!name || !url) return
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
    const current = form.getValues("coverLetter")
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
        form.setValue(
          "coverLetter", 
          current ? `${current}\n\n[AI Feedback]: ${data.suggestion}` : data.suggestion, 
          { shouldValidate: true }
        )
      }
    } catch (e) {
      console.error("AI feedback failed", e)
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
              <DialogPrimitive.Title className="text-xl font-semibold text-white">
                {isEditing ? "Edit proposal" : "Create proposal"}
              </DialogPrimitive.Title>
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

          <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Job ID or reference</Label>
                <Input {...form.register("jobId")} className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-100" />
                {form.formState.errors.jobId ? <p className="text-xs text-rose-300">{form.formState.errors.jobId.message}</p> : null}
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
              <Textarea
                {...form.register("coverLetter")}
                aria-invalid={Boolean(form.formState.errors.coverLetter)}
                className="min-h-44 rounded-xl border-white/10 bg-white/[0.04] text-zinc-100 placeholder:text-zinc-600"
                placeholder="Describe your relevant experience, delivery plan, communication cadence, and outcomes..."
              />
              {form.formState.errors.coverLetter ? <p className="text-xs text-rose-300">{form.formState.errors.coverLetter.message}</p> : null}
              <p className="text-xs text-zinc-500">Drafts allow 20+ characters. Submitted proposals require 80+ characters.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Budget</Label>
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
                  <Button type="button" variant="outline" onClick={addAttachment} className="rounded-xl">
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

          <div className="sticky bottom-0 -mx-5 -mb-5 flex flex-col-reverse gap-3 border-t border-white/10 bg-zinc-950/95 px-5 py-4 backdrop-blur sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" disabled={loading} onClick={() => submitProposal(false)} className="rounded-xl">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save draft
            </Button>
            <Button type="button" disabled={loading || coverLetter.trim().length < 80} onClick={() => submitProposal(true)} className="rounded-xl bg-white text-zinc-950 hover:bg-blue-100">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Submit proposal
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
