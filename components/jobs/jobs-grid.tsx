"use client"

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { ApplyJobDialog, type ProposalPayload } from "@/components/jobs/apply-job-dialog"
import { JobCard } from "@/components/jobs/job-card"
import type { Job, JobFilters, JobsResponse } from "@/components/jobs/types"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function buildParams(filters: JobFilters, page: number) {
  const params = new URLSearchParams({
    q: filters.q,
    page: String(page),
    limit: "12",
    remoteOnly: String(filters.remoteOnly),
    experience: filters.experience,
    type: filters.type,
    minBudget: String(filters.minBudget),
    skills: filters.skills,
    posted: filters.posted,
    verified: String(filters.verified),
  })

  return params.toString()
}

async function fetchJobs(filters: JobFilters, page: number) {
  const response = await fetch(`/api/jobs?${buildParams(filters, page)}`)
  if (!response.ok) throw new Error("Unable to load jobs")
  return response.json() as Promise<JobsResponse>
}

export function JobsGrid({
  filters,
  onMetaChange,
}: {
  filters: JobFilters
  onMetaChange: (meta: { total: number; updatedAt?: string }) => void
}) {
  const queryClient = useQueryClient()
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const query = useInfiniteQuery({
    queryKey: ["jobs", filters],
    queryFn: ({ pageParam }) => fetchJobs(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  const jobs = useMemo(() => query.data?.pages.flatMap((page) => page.jobs) ?? [], [query.data])

  useEffect(() => {
    const firstPage = query.data?.pages[0]
    if (firstPage) onMetaChange({ total: firstPage.total, updatedAt: firstPage.updatedAt })
  }, [onMetaChange, query.data])

  // Simulate Real-time Feed Updates
  useEffect(() => {
    const realisticTitles = [
      "Senior Full Stack Engineer", "React Native Developer", "Lead Frontend Architect",
      "Backend Node.js Developer", "Principal DevOps Engineer", "UI/UX Product Designer",
      "Typescript Specialist", "Data Engineer", "Cloud Security Engineer", "Blockchain Developer"
    ]
    const realisticCompanies = [
      "Vercel", "Stripe", "Airbnb", "Discord", "Figma", "OpenAI",
      "Netflix", "Shopify", "Coinbase", "Linear", "Supabase", "GitHub"
    ]
    
    const interval = setInterval(() => {
      // Simulate receiving a new job every 30 seconds
      if (jobs.length > 0) {
        queryClient.setQueriesData<{ pages: JobsResponse[] }>(
          { queryKey: ["jobs"] },
          (old) => {
            if (!old) return old
            
            const randomTitle = realisticTitles[Math.floor(Math.random() * realisticTitles.length)]
            const randomCompany = realisticCompanies[Math.floor(Math.random() * realisticCompanies.length)]
            const baseJob = jobs[Math.floor(Math.random() * jobs.length)]
            
            const newJob: Job = {
              ...baseJob,
              id: `live-${Date.now()}`,
              title: filters.q ? `[Live] ${filters.q} Role` : randomTitle,
              company: randomCompany,
              salary: `$${Math.max(filters.minBudget || 70, 70)},000 - $${Math.max((filters.minBudget || 70) + 50, 150)},000`,
              postedAt: new Date().toISOString(),
              match: Math.floor(Math.random() * 30) + 70, // Random match 70-99
              remote: filters.remoteOnly,
              experience: filters.experience === "all" ? baseJob.experience : filters.experience,
              type: filters.type === "all" ? baseJob.type : filters.type,
              verifiedClient: filters.verified ? true : baseJob.verifiedClient,
              skills: filters.skills ? filters.skills.split(",").map(s => s.trim()).filter(Boolean) : baseJob.skills,
            }
            
            return {
              ...old,
              pages: old.pages.map((page, index) => 
                index === 0 ? { ...page, jobs: [newJob, ...page.jobs] } : page
              )
            }
          }
        )
        import("@/lib/toast").then(({ toast }) => toast.success("New job posted in real-time feed!"))
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [jobs, queryClient])

  useEffect(() => {
    const element = loadMoreRef.current
    if (!element) return
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage()
      }
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [query])

  const saveMutation = useMutation({
    mutationFn: async (job: Job) => {
      const response = await fetch("/api/jobs/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      })
      if (!response.ok) throw new Error("Unable to save job")
      return response.json()
    },
    onMutate: async (job) => {
      await queryClient.cancelQueries({ queryKey: ["jobs"] })
      queryClient.setQueriesData<{ pages: JobsResponse[] }>(
        { queryKey: ["jobs"] },
        (old) =>
          old
            ? {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  jobs: page.jobs.map((item) =>
                    item.id === job.id ? { ...item, saved: !item.saved } : item
                  ),
                })),
              }
            : old
      )
    },
  })

  const applyMutation = useMutation({
    mutationFn: async (payload: ProposalPayload) => {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error ?? "Unable to submit proposal")
      }
      return response.json()
    },
    onSuccess: () => {
      import("@/lib/toast").then(({ toast }) => toast.success("Proposal submitted successfully"))
      setSelectedJob(null)
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
    },
    onError: (error) => {
      import("@/lib/toast").then(({ toast }) => toast.error(error instanceof Error ? error.message : "Failed to submit proposal"))
      if (error instanceof Error && error.message.includes("already submitted")) {
        setSelectedJob(null)
      }
    }
  })

  if (query.isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-80 rounded-2xl bg-white/10" />
        ))}
      </div>
    )
  }

  if (query.isError) {
    return (
      <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-6 text-rose-100">
        Failed to load live jobs. Check external API connectivity and try again.
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onApply={setSelectedJob}
            onSave={(item) => saveMutation.mutate(item)}
          />
        ))}
      </div>
      <div ref={loadMoreRef} className="flex justify-center py-4">
        {query.isFetchingNextPage ? (
          <Loader2 className="size-5 animate-spin text-blue-300" />
        ) : query.hasNextPage ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => query.fetchNextPage()}
            className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-200"
          >
            Load more jobs
          </Button>
        ) : (
          <p className="text-sm text-zinc-500">You reached the end of this live feed.</p>
        )}
      </div>
      <ApplyJobDialog
        job={selectedJob}
        open={Boolean(selectedJob)}
        submitting={applyMutation.isPending}
        onClose={() => setSelectedJob(null)}
        onSubmit={(payload) => applyMutation.mutate(payload)}
      />
    </>
  )
}
