"use client"

import { useCallback, useEffect, useState } from "react"

import { JobsFilters } from "@/components/jobs/jobs-filters"
import { JobsGrid } from "@/components/jobs/jobs-grid"
import { JobsHeader } from "@/components/jobs/jobs-header"
import { JobsQueryProvider } from "@/components/jobs/query-provider"
import { JobsSearch } from "@/components/jobs/jobs-search"
import { MyApplications } from "@/components/jobs/my-applications"
import { RecommendedJobs } from "@/components/jobs/recommended-jobs"
import { SavedJobs } from "@/components/jobs/saved-jobs"
import type { JobFilters } from "@/components/jobs/types"

const initialFilters: JobFilters = {
  q: "React Next.js",
  remoteOnly: true,
  experience: "all",
  type: "all",
  minBudget: 0,
  skills: "",
  posted: "any",
  verified: false,
}

function FindJobsContent() {
  const [filters, setFilters] = useState(initialFilters)
  const [search, setSearch] = useState(initialFilters.q)
  const [meta, setMeta] = useState<{ total: number; updatedAt?: string }>({ total: 0 })

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFilters((current) => ({ ...current, q: search }))
    }, 350)
    return () => window.clearTimeout(timeout)
  }, [search])

  const handleMetaChange = useCallback((nextMeta: { total: number; updatedAt?: string }) => {
    setMeta(nextMeta)
  }, [])

  return (
    <div className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute left-1/4 top-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-10 top-96 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <div className="relative z-0 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <JobsHeader total={meta.total} updatedAt={meta.updatedAt} />
        <JobsSearch value={search} onChange={setSearch} />
        <JobsFilters filters={filters} onChange={setFilters} />
        <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
          <div>
            <JobsGrid filters={filters} onMetaChange={handleMetaChange} />
          </div>
          <aside className="space-y-4">
            <RecommendedJobs />
            <SavedJobs />
            <MyApplications />
          </aside>
        </div>
      </div>
    </div>
  )
}

export function FindJobsPage() {
  return (
    <JobsQueryProvider>
      <FindJobsContent />
    </JobsQueryProvider>
  )
}
