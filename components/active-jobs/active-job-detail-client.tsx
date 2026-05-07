"use client"

import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, CheckCircle2, CreditCard, FileText, FileUp, MessageSquare, Send, UploadCloud } from "lucide-react"

import { JobsQueryProvider } from "@/components/jobs/query-provider"
import type { ActiveJobItem } from "@/components/active-jobs/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/toast"

export function ActiveJobDetailClient({ initialJob }: { initialJob: ActiveJobItem }) {
  return (
    <JobsQueryProvider>
      <ActiveJobWorkspace initialJob={initialJob} />
    </JobsQueryProvider>
  )
}

function ActiveJobWorkspace({ initialJob }: { initialJob: ActiveJobItem }) {
  const queryClient = useQueryClient()
  const { data = { job: initialJob }, isFetching } = useQuery({
    queryKey: ["active-job", initialJob.id],
    queryFn: async () => {
      const response = await fetch(`/api/active-jobs/${initialJob.id}`)
      const json = await response.json()
      if (!response.ok) throw new Error(json.error ?? "Unable to load workspace")
      return json as { job: ActiveJobItem }
    },
    initialData: { job: initialJob },
    refetchInterval: 10_000,
  })
  const job = data.job

  const statusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await fetch(`/api/active-jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error ?? "Unable to update status")
      return json
    },
    onSuccess: () => {
      toast.success("Job status updated")
      queryClient.invalidateQueries({ queryKey: ["active-job", job.id] })
      queryClient.invalidateQueries({ queryKey: ["active-jobs"] })
    },
    onError: (error) => toast.error("Status update failed", error instanceof Error ? error.message : undefined),
  })

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-8 top-72 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <div className="relative z-0 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <Button asChild variant="ghost" className="-ml-3 text-zinc-300 hover:text-white">
            <Link href="/active-jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Active jobs
            </Link>
          </Button>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-blue-400/30 bg-blue-500/10 text-blue-200">
                  {job.status.replace("_", " ")}
                </Badge>
                <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-zinc-300">
                  {job.paymentStatus}
                </Badge>
                <span className="text-xs text-zinc-500">{isFetching ? "Syncing live data" : "Live data current"}</span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{job.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">{job.description}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
              <p className="text-xs text-zinc-500">Contract value</p>
              <p className="mt-1 text-2xl font-semibold text-white">{currency(job.budget ?? 0)}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-zinc-400">Progress</span>
                <span>{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="mt-2 h-2" />
              <Select
                value={job.status}
                onChange={(event) => statusMutation.mutate(event.target.value)}
                className="mt-4 bg-zinc-950/70"
              >
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Completed</option>
                <option value="AT_RISK">At Risk</option>
                <option value="BLOCKED">Blocked</option>
              </Select>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <Info label="Client" value={job.client.name} />
          <Info label="Deadline" value={job.deadline ? formatDate(job.deadline) : "Not set"} />
          <Info label="Milestones" value={`${job.milestones.filter((item) => item.completed).length}/${job.milestones.length}`} />
          <Info label="Deliverables" value={String(job.deliverables.length)} />
        </section>

        <Tabs defaultValue="milestones" className="grid gap-4">
          <TabsList className="w-full justify-start bg-white/[0.04]">
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="chat">Live chat</TabsTrigger>
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          <TabsContent value="milestones">
            <MilestonesPanel job={job} />
          </TabsContent>
          <TabsContent value="chat">
            <ChatPanel job={job} />
          </TabsContent>
          <TabsContent value="deliverables">
            <DeliverablesPanel job={job} />
          </TabsContent>
          <TabsContent value="payments">
            <PaymentsPanel job={job} />
          </TabsContent>
          <TabsContent value="timeline">
            <TimelinePanel job={job} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function MilestonesPanel({ job }: { job: ActiveJobItem }) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const response = await fetch("/api/milestones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error ?? "Unable to update milestone")
      return json
    },
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["active-job", job.id] })
      const previous = queryClient.getQueryData<{ job: ActiveJobItem }>(["active-job", job.id])
      queryClient.setQueryData<{ job: ActiveJobItem }>(["active-job", job.id], (current) =>
        current
          ? {
              job: {
                ...current.job,
                milestones: current.job.milestones.map((milestone) =>
                  milestone.id === id ? { ...milestone, completed, completedAt: completed ? new Date().toISOString() : null } : milestone
                ),
              },
            }
          : current
      )
      return { previous }
    },
    onSuccess: () => toast.success("Milestone updated"),
    onError: (error, _payload, context) => {
      if (context?.previous) queryClient.setQueryData(["active-job", job.id], context.previous)
      toast.error("Milestone update failed", error instanceof Error ? error.message : undefined)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["active-job", job.id] }),
  })

  return (
    <Card className="border-white/10 bg-white/[0.045] backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-base text-white">Milestone tracking</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {job.milestones.map((milestone) => (
          <div key={milestone.id} className="grid gap-3 rounded-xl border border-white/10 bg-zinc-950/45 p-4 md:grid-cols-[1fr_180px_150px] md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-white">{milestone.title}</h3>
                {milestone.overdue ? (
                  <Badge variant="outline" className="border-amber-400/30 bg-amber-500/10 text-amber-200">
                    Overdue
                  </Badge>
                ) : null}
                {milestone.completed ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : null}
              </div>
              <p className="mt-1 text-sm text-zinc-500">{milestone.description ?? "No description"}</p>
            </div>
            <div className="text-sm text-zinc-400">
              <p>{milestone.dueDate ? formatDate(milestone.dueDate) : "No due date"}</p>
              <p>{currency(milestone.amount ?? 0)} / {milestone.paymentStatus}</p>
            </div>
            <Button
              variant={milestone.completed ? "secondary" : "default"}
              onClick={() => mutation.mutate({ id: milestone.id, completed: !milestone.completed })}
            >
              {milestone.completed ? "Reopen" : "Complete"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ChatPanel({ job }: { job: ActiveJobItem }) {
  const queryClient = useQueryClient()
  const [message, setMessage] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/job-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, message, fileUrl }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error ?? "Unable to send message")
      return json
    },
    onSuccess: () => {
      setMessage("")
      setFileUrl("")
      queryClient.invalidateQueries({ queryKey: ["active-job", job.id] })
    },
    onError: (error) => toast.error("Message failed", error instanceof Error ? error.message : undefined),
  })

  useEffect(() => {
    fetch(`/api/job-messages?jobId=${job.id}`, { method: "PATCH" })
      .then(() => queryClient.invalidateQueries({ queryKey: ["active-job", job.id] }))
      .catch(() => undefined)
  }, [job.id, queryClient])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!message.trim()) return
    mutation.mutate()
  }

  return (
    <Card className="border-white/10 bg-white/[0.045] backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-white">
          <MessageSquare className="h-4 w-4" />
          Live client messaging
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid max-h-[440px] gap-3 overflow-y-auto pr-1">
          {job.messages.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-zinc-950/45 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-white">{item.sender.name}</p>
                <p className="text-xs text-zinc-500">
                  {formatDateTime(item.createdAt)} / {item.readAt ? "Read" : "Unread"}
                </p>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{item.message}</p>
              {item.fileUrl ? (
                <a href={item.fileUrl} className="mt-2 inline-flex text-sm text-blue-300" target="_blank" rel="noreferrer">
                  Attachment
                </a>
              ) : null}
            </div>
          ))}
          {!job.messages.length ? <p className="rounded-xl border border-white/10 p-6 text-center text-sm text-zinc-500">No messages yet.</p> : null}
        </div>
        <form onSubmit={onSubmit} className="grid gap-3">
          <Textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Message the client" className="border-white/10 bg-zinc-950/60" />
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input value={fileUrl} onChange={(event) => setFileUrl(event.target.value)} placeholder="Optional attachment URL" className="border-white/10 bg-zinc-950/60" />
            <Button type="submit" disabled={mutation.isPending}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
          {message.trim() ? <p className="text-xs text-blue-300">Typing...</p> : null}
          <p className="text-xs text-zinc-500">Messages, attachments, timestamps, and read receipts sync from the database every 10 seconds.</p>
        </form>
      </CardContent>
    </Card>
  )
}

function DeliverablesPanel({ job }: { job: ActiveJobItem }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ title: "", fileUrl: "", fileName: "", fileType: "", revisionNotes: "" })
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/deliverables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, ...form }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error ?? "Unable to upload deliverable")
      return json
    },
    onSuccess: () => {
      setForm({ title: "", fileUrl: "", fileName: "", fileType: "", revisionNotes: "" })
      toast.success("Deliverable submitted")
      queryClient.invalidateQueries({ queryKey: ["active-job", job.id] })
    },
    onError: (error) => toast.error("Deliverable failed", error instanceof Error ? error.message : undefined),
  })

  return (
    <section className="grid gap-4 lg:grid-cols-[0.9fr_1.2fr]">
      <Card className="border-white/10 bg-white/[0.045] backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <UploadCloud className="h-4 w-4" />
            Submit deliverable
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Deliverable title" className="border-white/10 bg-zinc-950/60" />
          <Input value={form.fileUrl} onChange={(event) => setForm({ ...form, fileUrl: event.target.value })} placeholder="File URL" className="border-white/10 bg-zinc-950/60" />
          <Input value={form.fileName} onChange={(event) => setForm({ ...form, fileName: event.target.value })} placeholder="File name" className="border-white/10 bg-zinc-950/60" />
          <Input value={form.fileType} onChange={(event) => setForm({ ...form, fileType: event.target.value })} placeholder="PDF, ZIP, image, doc" className="border-white/10 bg-zinc-950/60" />
          <Textarea value={form.revisionNotes} onChange={(event) => setForm({ ...form, revisionNotes: event.target.value })} placeholder="Revision notes" className="border-white/10 bg-zinc-950/60" />
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !form.title || !form.fileUrl}>
            <FileUp className="mr-2 h-4 w-4" />
            Submit
          </Button>
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-white/[0.045] backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-white">Version history</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {job.deliverables.map((deliverable) => (
            <div key={deliverable.id} className="rounded-xl border border-white/10 bg-zinc-950/45 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium text-white">{deliverable.title}</h3>
                <Badge variant="outline" className="border-violet-400/30 bg-violet-500/10 text-violet-200">
                  v{deliverable.version} / {deliverable.approvalStatus}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-zinc-500">{deliverable.fileName ?? deliverable.fileType ?? "Attached file"}</p>
              <a href={deliverable.fileUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm text-blue-300">
                Open file
              </a>
            </div>
          ))}
          {!job.deliverables.length ? <p className="rounded-xl border border-white/10 p-6 text-center text-sm text-zinc-500">No deliverables submitted.</p> : null}
        </CardContent>
      </Card>
    </section>
  )
}

function PaymentsPanel({ job }: { job: ActiveJobItem }) {
  const released = job.milestones
    .filter((milestone) => milestone.paymentStatus === "RELEASED")
    .reduce((sum, milestone) => sum + (milestone.amount ?? 0), 0)
  const funded = job.milestones
    .filter((milestone) => milestone.paymentStatus === "FUNDED")
    .reduce((sum, milestone) => sum + (milestone.amount ?? 0), 0)
  const pending = Math.max((job.budget ?? 0) - released - funded, 0)

  return (
    <section className="grid gap-4 lg:grid-cols-[0.9fr_1.2fr]">
      <Card className="border-white/10 bg-white/[0.045] backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <CreditCard className="h-4 w-4" />
            Payment status
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <InfoRow label="Contract budget" value={currency(job.budget ?? 0)} />
          <InfoRow label="Released" value={currency(released)} />
          <InfoRow label="Funded" value={currency(funded)} />
          <InfoRow label="Pending" value={currency(pending)} />
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Payment progress</span>
              <span className="text-white">{job.paymentProgress}%</span>
            </div>
            <Progress value={job.paymentProgress} className="mt-2 h-2" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-white/[0.045] backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <FileText className="h-4 w-4" />
            Contract info
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <InfoRow label="Client" value={`${job.client.name} (${job.client.email})`} />
          <InfoRow label="Freelancer" value={`${job.freelancer.name} (${job.freelancer.email})`} />
          <InfoRow label="Proposal" value={job.proposal?.id ?? "Direct contract"} />
          <InfoRow label="Accepted" value={job.proposal?.acceptedAt ? formatDateTime(job.proposal.acceptedAt) : "Not recorded"} />
          <InfoRow label="Deadline" value={job.deadline ? formatDate(job.deadline) : "Not set"} />
          <InfoRow label="Priority" value={job.priority ?? "Normal"} />
        </CardContent>
      </Card>
    </section>
  )
}

function TimelinePanel({ job }: { job: ActiveJobItem }) {
  const events = [
    ...job.milestones.map((milestone) => ({
      id: `milestone-${milestone.id}`,
      title: milestone.completed ? `Completed ${milestone.title}` : `Milestone due: ${milestone.title}`,
      at: milestone.completedAt ?? milestone.dueDate ?? milestone.createdAt,
    })),
    ...job.messages.map((message) => ({ id: `message-${message.id}`, title: `Message from ${message.sender.name}`, at: message.createdAt })),
    ...job.deliverables.map((deliverable) => ({ id: `deliverable-${deliverable.id}`, title: `Submitted ${deliverable.title}`, at: deliverable.uploadedAt })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())

  return (
    <Card className="border-white/10 bg-white/[0.045] backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-base text-white">Activity timeline</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {events.map((event) => (
          <div key={event.id} className="flex gap-3 rounded-xl border border-white/10 bg-zinc-950/45 p-4">
            <span className="mt-1 h-2 w-2 rounded-full bg-blue-300" />
            <div>
              <p className="text-sm font-medium text-white">{event.title}</p>
              <p className="mt-1 text-xs text-zinc-500">{formatDateTime(event.at)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-zinc-950/45 px-3 py-2">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-white/10 bg-white/[0.045] backdrop-blur-xl">
      <CardContent className="p-4">
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="mt-2 truncate text-sm font-semibold text-white">{value}</p>
      </CardContent>
    </Card>
  )
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value))
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}
