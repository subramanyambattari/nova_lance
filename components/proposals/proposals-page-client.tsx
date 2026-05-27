"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { JobsQueryProvider } from "@/components/jobs/query-provider"
import { CreateProposalDialog } from "@/components/proposals/create-proposal-dialog"
import { InterviewPanel } from "@/components/proposals/interview-panel"
import { ProposalAnalytics } from "@/components/proposals/proposal-analytics"
import { ProposalFilters, type ProposalFilterState } from "@/components/proposals/proposal-filters"
import { ProposalsHeader } from "@/components/proposals/proposals-header"
import { ProposalsStats } from "@/components/proposals/proposals-stats"
import { ProposalsTable } from "@/components/proposals/proposals-table"
import { toast } from "@/lib/toast"
import type { ProposalItem, ProposalStats, ProposalStatus, ProposalsResponse } from "@/components/proposals/types"

const initialFilters: ProposalFilterState = {
  search: "",
  status: "ALL",
  sort: "newest",
  budget: "all",
  client: "all",
}

export function ProposalsPageClient({ initialData }: { initialData: ProposalsResponse }) {
  return (
    <JobsQueryProvider>
      <Suspense fallback={<ProposalsLoading />}>
        <ProposalsWorkspace initialData={initialData} />
      </Suspense>
    </JobsQueryProvider>
  )
}

function ProposalsWorkspace({ initialData }: { initialData: ProposalsResponse }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<ProposalFilterState>(() => ({
    search: searchParams.get("q") ?? initialFilters.search,
    status: (searchParams.get("status") as ProposalFilterState["status"]) ?? initialFilters.status,
    sort: (searchParams.get("sort") as ProposalFilterState["sort"]) ?? initialFilters.sort,
    budget: (searchParams.get("budget") as ProposalFilterState["budget"]) ?? initialFilters.budget,
    client: searchParams.get("client") ?? initialFilters.client,
  }))
  const debouncedSearch = useDebouncedValue(filters.search, 250)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProposal, setEditingProposal] = useState<ProposalItem | null>(null)

  const { data = initialData } = useQuery({
    queryKey: ["proposals"],
    queryFn: async () => {
      const response = await fetch("/api/proposals")
      if (!response.ok) throw new Error("Failed to load proposals")
      return (await response.json()) as ProposalsResponse
    },
    initialData,
    refetchInterval: 15_000,
  })

  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const loadingToast = toast.loading(payload.submit ? "Submitting proposal..." : "Saving draft...")
      const isUpdate = Boolean(payload.id)
      try {
        const response = await fetch(isUpdate ? "/api/proposals/update" : "/api/proposals/create", {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const json = await response.json()
        if (!response.ok) throw new Error(json.error ?? "Unable to save proposal")
        return { ...json, submitted: Boolean(payload.submit), loadingToast }
      } catch (error) {
        toast.dismiss(loadingToast)
        throw error
      }
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["proposals"] })
      const previous = queryClient.getQueryData<ProposalsResponse>(["proposals"])

      const optimisticProposal = makeOptimisticProposal(payload)
      queryClient.setQueryData<ProposalsResponse>(["proposals"], (current) =>
        optimisticProposal && current
          ? buildDashboard([
              optimisticProposal,
              ...current.proposals.filter((proposal) => proposal.id !== optimisticProposal.id),
            ])
          : current
      )

      return { previous }
    },
    onSuccess: (result) => {
      toast.dismiss(result.loadingToast)
      toast.success(result.submitted ? "Proposal submitted successfully" : "Draft saved")
      queryClient.setQueryData<ProposalsResponse>(["proposals"], (current) =>
        current
          ? buildDashboard([
              result.proposal,
              ...current.proposals.filter((proposal) => proposal.id !== result.proposal.id && !proposal.id.startsWith("optimistic-")),
            ])
          : current
      )
      setDialogOpen(false)
      setEditingProposal(null)
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
    },
    onError: (error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["proposals"], context.previous)
      }
      toast.error("Failed to save proposal", error instanceof Error ? error.message : undefined)
    },
  })

  const statusMutation = useMutation({
    mutationFn: async (payload: { id: string; status: string }) => {
      await queryClient.cancelQueries({ queryKey: ["proposals"] })
      queryClient.setQueryData<ProposalsResponse>(["proposals"], (current) =>
        current
          ? {
              ...current,
              proposals: current.proposals.map((proposal) =>
                proposal.id === payload.id ? { ...proposal, status: payload.status as ProposalItem["status"] } : proposal
              ),
            }
          : current
      )

      const response = await fetch("/api/proposals/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error ?? "Unable to update status")
      return json
    },
    onSuccess: () => toast.success("Proposal status updated"),
    onError: (error) => toast.error("Failed to update status", error instanceof Error ? error.message : undefined),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["proposals"] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (proposal: ProposalItem) => {
      queryClient.setQueryData<ProposalsResponse>(["proposals"], (current) =>
        current
          ? {
              ...current,
              proposals: current.proposals.filter((item) => item.id !== proposal.id),
            }
          : current
      )

      const response = await fetch("/api/proposals/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: proposal.id }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error ?? "Unable to delete proposal")
      return json
    },
    onSuccess: () => toast.success("Proposal deleted"),
    onError: (error) => toast.error("Failed to delete proposal", error instanceof Error ? error.message : undefined),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["proposals"] }),
  })

  const duplicateMutation = useMutation({
    mutationFn: async (proposal: ProposalItem) => {
      const response = await fetch("/api/proposals/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coverLetter: `${proposal.coverLetter}\n\nDuplicated draft for revision.`,
          budget: proposal.budget,
          timeline: proposal.timeline,
          portfolioLinks: proposal.portfolioLinks,
          resumeUrl: proposal.resumeUrl ?? undefined,
          externalJobId: proposal.externalJobId ?? undefined,
          externalJobUrl: proposal.externalJobUrl ?? undefined,
          attachments: proposal.attachments.map(({ fileName, fileUrl }) => ({ fileName, fileUrl })),
          submit: false,
        }),
      })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error ?? "Unable to duplicate proposal")
      return json
    },
    onSuccess: () => {
      toast.success("Draft duplicated")
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
    },
    onError: (error) => toast.error("Failed to duplicate proposal", error instanceof Error ? error.message : undefined),
  })

  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set("q", debouncedSearch)
    if (filters.status !== "ALL") params.set("status", filters.status)
    if (filters.sort !== "newest") params.set("sort", filters.sort)
    if (filters.budget !== "all") params.set("budget", filters.budget)
    if (filters.client !== "all") params.set("client", filters.client)

    router.replace(params.size ? `${pathname}?${params.toString()}` : pathname, { scroll: false })
  }, [debouncedSearch, filters.budget, filters.client, filters.sort, filters.status, pathname, router])

  const clients = useMemo(
    () =>
      Array.from(
        new Set(data.proposals.map((proposal) => proposal.job?.company ?? "External client"))
      ).sort(),
    [data.proposals]
  )

  const filtered = useMemo(() => {
    const search = debouncedSearch.toLowerCase()
    const result = data.proposals.filter((proposal) => {
      const text = [
        proposal.coverLetter,
        proposal.job?.title,
        proposal.job?.company,
        proposal.status,
        proposal.timeline,
        ...(proposal.job?.skills ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      const budget = proposal.budget ?? proposal.job?.budget ?? 0
      const budgetMatch =
        filters.budget === "all" ||
        (filters.budget === "under-1k" && budget < 1000) ||
        (filters.budget === "1k-5k" && budget >= 1000 && budget <= 5000) ||
        (filters.budget === "over-5k" && budget > 5000)

      return (
        (!search || text.includes(search)) &&
        (filters.status === "ALL" || proposal.status === filters.status) &&
        (filters.client === "all" || (proposal.job?.company ?? "External client") === filters.client) &&
        budgetMatch
      )
    })

    return result.sort((a, b) => {
      if (filters.sort === "budget-high") return (b.budget ?? 0) - (a.budget ?? 0)
      if (filters.sort === "budget-low") return (a.budget ?? 0) - (b.budget ?? 0)
      if (filters.sort === "oldest") return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [data.proposals, debouncedSearch, filters.budget, filters.client, filters.sort, filters.status])

  const liveUpdates = data.proposals.filter((proposal) =>
    ["VIEWED", "INTERVIEW", "ACCEPTED", "REJECTED"].includes(proposal.status)
  ).length

  return (
    <div className="min-h-screen overflow-hidden bg-transparent text-zinc-900 dark:text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/4 top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-10 top-80 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <div className="relative z-0 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <ProposalsHeader
          liveUpdates={liveUpdates}
          onCreate={() => {
            setEditingProposal(null)
            setDialogOpen(true)
          }}
        />
        <ProposalsStats stats={data.stats} />
        <ProposalFilters value={filters} clients={clients} onChange={setFilters} />
        <section className="grid gap-4 xl:grid-cols-[1.55fr_0.75fr]">
          <ProposalsTable
            proposals={filtered}
            onEdit={(proposal) => {
              setEditingProposal(proposal)
              setDialogOpen(true)
            }}
            onDuplicate={(proposal) => duplicateMutation.mutate(proposal)}
            onWithdraw={(proposal) => statusMutation.mutate({ id: proposal.id, status: "WITHDRAWN" })}
            onDelete={(proposal) => deleteMutation.mutate(proposal)}
          />
          <InterviewPanel proposals={data.proposals} />
        </section>
        <ProposalAnalytics stats={data.stats} activity={data.activity} />
      </div>

      <CreateProposalDialog
        open={dialogOpen}
        proposal={editingProposal}
        loading={saveMutation.isPending}
        onOpenChange={setDialogOpen}
        onSubmit={(payload) => saveMutation.mutate(payload)}
      />
    </div>
  )
}

function useDebouncedValue(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [delay, value])

  return debounced
}

function makeOptimisticProposal(payload: Record<string, unknown>): ProposalItem | null {
  const now = new Date().toISOString()
  const id = typeof payload.id === "string" ? payload.id : `optimistic-${Date.now()}`
  const submit = Boolean(payload.submit)

  return {
    id,
    coverLetter: typeof payload.coverLetter === "string" ? payload.coverLetter : "",
    budget: typeof payload.budget === "number" ? payload.budget : null,
    timeline: typeof payload.timeline === "string" ? payload.timeline : null,
    portfolioLinks: Array.isArray(payload.portfolioLinks) ? payload.portfolioLinks.filter((link): link is string => typeof link === "string") : [],
    resumeUrl: typeof payload.resumeUrl === "string" ? payload.resumeUrl : null,
    status: submit ? "SUBMITTED" : "DRAFT",
    externalJobId: typeof payload.externalJobId === "string" ? payload.externalJobId : null,
    externalJobUrl: typeof payload.externalJobUrl === "string" ? payload.externalJobUrl : null,
    clientMessage: null,
    meetingUrl: null,
    submittedAt: submit ? now : null,
    viewedAt: null,
    respondedAt: null,
    interviewAt: null,
    acceptedAt: null,
    withdrawnAt: null,
    lastClientActivityAt: null,
    createdAt: now,
    updatedAt: now,
    attachments: Array.isArray(payload.attachments)
      ? payload.attachments.filter(
          (attachment): attachment is { fileName: string; fileUrl: string } =>
            Boolean(attachment) &&
            typeof attachment === "object" &&
            "fileName" in attachment &&
            "fileUrl" in attachment
        )
      : [],
    job: null,
  }
}

function buildDashboard(proposals: ProposalItem[]): ProposalsResponse {
  const stats = calculateStats(proposals)
  const statuses: ProposalStatus[] = ["DRAFT", "SUBMITTED", "VIEWED", "INTERVIEW", "ACCEPTED", "REJECTED", "WITHDRAWN"]

  return {
    proposals: [...proposals].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    stats,
    activity: statuses.map((status) => ({
      status,
      count: proposals.filter((proposal) => proposal.status === status).length,
    })),
  }
}

function calculateStats(proposals: ProposalItem[]): ProposalStats {
  const submitted = proposals.filter((proposal) => proposal.status !== "DRAFT")
  const responded = submitted.filter((proposal) => ["VIEWED", "INTERVIEW", "ACCEPTED", "REJECTED"].includes(proposal.status))
  const interviews = proposals.filter((proposal) => proposal.status === "INTERVIEW")
  const accepted = proposals.filter((proposal) => proposal.status === "ACCEPTED")
  const rejected = proposals.filter((proposal) => proposal.status === "REJECTED")
  const responseTimes = proposals
    .filter((proposal) => proposal.submittedAt && proposal.respondedAt)
    .map((proposal) => new Date(proposal.respondedAt!).getTime() - new Date(proposal.submittedAt!).getTime())

  return {
    submitted: submitted.length,
    drafts: proposals.filter((proposal) => proposal.status === "DRAFT").length,
    responseRate: percent(responded.length, submitted.length),
    interviewRequests: interviews.length,
    accepted: accepted.length,
    rejected: rejected.length,
    earningsPotential: submitted.reduce((sum, proposal) => sum + (proposal.budget ?? proposal.job?.budget ?? 0), 0),
    interviewRate: percent(interviews.length, submitted.length),
    acceptanceRate: percent(accepted.length, submitted.length),
    averageResponseHours: responseTimes.length
      ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length / 36_000) / 100
      : 0,
  }
}

function percent(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0
}

function ProposalsLoading() {
  return (
    <div className="min-h-screen bg-transparent p-6 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto grid w-full max-w-7xl gap-4">
        <div className="h-40 rounded-2xl border border-white/10 bg-white/[0.04]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-32 rounded-2xl border border-white/10 bg-white/[0.04]" />
          ))}
        </div>
        <div className="h-96 rounded-2xl border border-white/10 bg-white/[0.04]" />
      </div>
    </div>
  )
}
