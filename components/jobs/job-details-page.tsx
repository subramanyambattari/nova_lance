"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Clock3, ExternalLink, MapPin, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { ApplyJobDialog, type ProposalPayload } from "@/components/jobs/apply-job-dialog"
import { JobsQueryProvider } from "@/components/jobs/query-provider"
import type { Job } from "@/components/jobs/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type JobDetail = Job & {
  proposalCount?: number | null
  client?: { name: string; email?: string | null }
}

function plainText(value: string) {
  return value.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim()
}

async function fetchJob(id: string) {
  const response = await fetch(`/api/jobs/${encodeURIComponent(id)}`)
  if (!response.ok) throw new Error("Job not found")
  const data = await response.json()
  return data.job as JobDetail
}

function DetailsContent({ id }: { id: string }) {
  const [applyOpen, setApplyOpen] = useState(false)
  const query = useQuery({ queryKey: ["job", id], queryFn: () => fetchJob(id) })
  const applyMutation = useMutation({
    mutationFn: async (payload: ProposalPayload) => {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error("Unable to apply")
      return response.json()
    },
    onSuccess: () => setApplyOpen(false),
  })

  if (query.isLoading) {
    return <Skeleton className="h-[620px] rounded-2xl bg-white/10" />
  }

  if (query.isError || !query.data) {
    return (
      <Card className="rounded-2xl border-rose-400/20 bg-rose-400/10 p-6 text-rose-100">
        This job could not be loaded.
      </Card>
    )
  }

  const job = query.data

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
          <CardHeader>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="premium">{job.match ?? 90}% match</Badge>
              {job.remote ? <Badge variant="success">Remote</Badge> : null}
              {job.verifiedClient ? (
                <Badge variant="outline" className="gap-1 border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                  <ShieldCheck className="size-3" />
                  Verified client
                </Badge>
              ) : null}
            </div>
            <CardTitle className="text-3xl text-zinc-950 dark:text-white">{job.title}</CardTitle>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{job.company}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 text-sm text-zinc-500 dark:text-zinc-400 sm:grid-cols-2">
              <span className="flex items-center gap-2"><BriefcaseBusiness className="size-4 text-blue-500 dark:text-blue-300" />{job.salary}</span>
              <span className="flex items-center gap-2"><MapPin className="size-4 text-violet-500 dark:text-violet-300" />{job.location}</span>
              <span className="flex items-center gap-2"><Clock3 className="size-4 text-emerald-500 dark:text-emerald-300" />{new Date(job.postedAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><ExternalLink className="size-4 text-zinc-500" />{job.source}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Full description</h2>
              <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950/55 p-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {plainText(job.description)}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Requirements</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.map((skill) => <Badge key={skill} variant="secondary" className="bg-zinc-100 text-zinc-800 dark:bg-white/5 dark:text-zinc-300">{skill}</Badge>)}
              </div>
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
            <CardContent className="p-5">
              <Button onClick={() => setApplyOpen(true)} className="w-full rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-blue-100">
                Apply Now
              </Button>
              {job.externalUrl ? (
                <Button asChild variant="outline" className="mt-2 w-full rounded-xl border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200">
                  <a href={job.externalUrl} target="_blank" rel="noreferrer">Open external listing</a>
                </Button>
              ) : null}
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-base text-zinc-950 dark:text-zinc-100">Client info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <p>{job.client?.name ?? job.company}</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500 dark:text-emerald-300" />Payment verified</p>
              <p>{job.proposalCount ?? "External"} proposals tracked</p>
              <p>Attachments: none</p>
            </CardContent>
          </Card>
        </aside>
      </div>
      <ApplyJobDialog
        job={job}
        open={applyOpen}
        submitting={applyMutation.isPending}
        onClose={() => setApplyOpen(false)}
        onSubmit={(payload) => applyMutation.mutate(payload)}
      />
    </>
  )
}

export function JobDetailsPage({ id }: { id: string }) {
  return (
    <JobsQueryProvider>
      <div className="min-h-screen overflow-hidden bg-transparent text-zinc-900 dark:text-zinc-100">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <Button asChild variant="outline" className="w-fit rounded-xl border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200">
            <Link href="/find-jobs"><ArrowLeft className="size-4" />Back to jobs</Link>
          </Button>
          <DetailsContent id={id} />
        </div>
      </div>
    </JobsQueryProvider>
  )
}
