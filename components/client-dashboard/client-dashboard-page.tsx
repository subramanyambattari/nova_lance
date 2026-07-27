"use client"

import {
  Copy,
  Edit3,
  FileText,
  MoreHorizontal,
  Pause,
  Plus,
  RefreshCw,
  Settings,
  Sparkles,
  Star,
  Zap,
  CheckCircle2,
  XCircle,
  Trash2,
  MessageCircle,
  ChevronDown,
  TrendingUp,
  BarChart3,
  Users,
  Briefcase,
  CheckCircle,
  Activity,
  Clock,
} from "lucide-react"
import { useMemo, useState, useTransition, useEffect } from "react"
import { usePathname } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { AIWorkspace } from "./ai-workspace"
import { TalentMatches } from "./talent-matches"
import { toast } from "@/lib/toast"

import { duplicateJob, updateJobStatus, updateProposalStatus, deleteJob } from "@/app/actions/client"

import { DashboardHeader } from "./dashboard-header"
import { DashboardOverview } from "./dashboard-overview"
import { PostJobTab } from "./post-job-tab"
import { ProgressBar, SectionHeader, StatusBadge } from "./ui-components"

import {
  jobs as defaultJobs,
  proposals as defaultProposals,
  initialSkills,
  initialJobDraft,
  messageFeatures,
  meetingFeatures,
  contractFeatures,
  paymentFeatures,
  analytics,
  notifications,
  settings,
} from "./data"

import type { Job, Proposal, ProposalStatus } from "./types"

export function ClientDashboardPage({
  initialJobs = [],
  initialProposals = [],
  stats,
  activeContracts = [],
  talentMatches = [],
}: {
  initialJobs?: any[]
  initialProposals?: any[]
  stats?: any
  activeContracts?: any[]
  talentMatches?: any[]
}) {
  const [isPending, startTransition] = useTransition()

  const [activeTab, setActiveTab] = useState("overview")
  const [jobsState, setJobsState] = useState<Job[]>(
    initialJobs && initialJobs.length > 0 ? initialJobs : defaultJobs
  )
  const [proposalsState, setProposalsState] = useState<Proposal[]>(
    initialProposals && initialProposals.length > 0 ? initialProposals : defaultProposals
  )

  const [skills, setSkills] = useState(initialSkills)
  const [skillDraft, setSkillDraft] = useState("")
  const [proposalFilter, setProposalFilter] = useState<"All" | ProposalStatus>("All")
  const [proposalSort, setProposalSort] = useState("Match")
  const [attachments, setAttachments] = useState<string[]>([])
  const [jobDraft, setJobDraft] = useState(initialJobDraft)
  const [expandedStates, setExpandedStates] = useState<Record<string, "notes" | "ai" | null>>({})
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>(() =>
    notifications.reduce((acc, curr) => ({ ...acc, [curr.label]: true }), {})
  )
  const [activeSetting, setActiveSetting] = useState<string | null>(null)

  const pathname = usePathname()

  useEffect(() => {
    const pathParts = pathname.split("/")
    const lastPart = pathParts[pathParts.length - 1]
    const tabToPathMap: Record<string, string> = {
      "client-dashboard": "overview",
      "ai-workspace": "ai",
      "post-job": "post",
      "my-jobs": "jobs",
      "talent-matches": "talent",
      proposals: "proposals",
      operations: "operations",
      analytics: "analytics",
      settings: "settings",
    }
    if (tabToPathMap[lastPart]) {
      setActiveTab(tabToPathMap[lastPart])
    }
  }, [pathname])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const tabToHashMap: Record<string, string> = {
      overview: "/client-dashboard",
      ai: "/client-dashboard/ai-workspace",
      post: "/client-dashboard/post-job",
      jobs: "/client-dashboard/my-jobs",
      talent: "/client-dashboard/talent-matches",
      proposals: "/client-dashboard/proposals",
      operations: "/client-dashboard/operations",
      analytics: "/client-dashboard/analytics",
      settings: "/client-dashboard/settings",
    }
    if (tabToHashMap[value]) {
      window.history.pushState(null, "", tabToHashMap[value])
    }
  }

  const filteredProposals = useMemo(() => {
    const visible =
      proposalFilter === "All"
        ? proposalsState
        : proposalsState.filter((proposal) => proposal.status === proposalFilter)

    return [...visible].sort((first, second) => {
      if (proposalSort === "Budget") {
        return Number(first.bid.replace(/\D/g, "")) - Number(second.bid.replace(/\D/g, ""))
      }
      if (proposalSort === "Rating") {
        return Number(second.rating) - Number(first.rating)
      }
      return first.risk.localeCompare(second.risk)
    })
  }, [proposalFilter, proposalSort, proposalsState])

  function addSkill() {
    const nextSkill = skillDraft.trim()
    if (!nextSkill || skills.includes(nextSkill)) return
    setSkills((items) => [...items, nextSkill])
    setSkillDraft("")
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100 flex">
      <main className="flex-1 overflow-auto">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 pb-28 sm:px-6 lg:px-8">
          <DashboardHeader onTabChange={handleTabChange} />

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsContent value="overview" className="space-y-8">
              <DashboardOverview jobsState={jobsState} stats={stats} activeContracts={activeContracts} />
            </TabsContent>

            <TabsContent value="ai" className="space-y-8">
              <AIWorkspace />
            </TabsContent>

            <TabsContent value="post" className="space-y-8">
              <PostJobTab
                jobDraft={jobDraft}
                setJobDraft={setJobDraft}
                skills={skills}
                setSkills={setSkills}
                skillDraft={skillDraft}
                setSkillDraft={setSkillDraft}
                attachments={attachments}
                setAttachments={setAttachments}
                addSkill={addSkill}
                setJobsState={setJobsState}
                handleTabChange={handleTabChange}
              />
            </TabsContent>

            <TabsContent value="jobs" className="space-y-8">
              <section>
                <SectionHeader
                  eyebrow="Job management"
                  title="My jobs"
                  action={
                    <Button onClick={() => handleTabChange("post")} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all">
                      <Plus className="size-4 mr-1.5" />
                      New job
                    </Button>
                  }
                />
                <div className="grid gap-5 lg:grid-cols-2">
                  {jobsState.map((job, i) => (
                    <div
                      key={job.id ? String(job.id) : `${job.title}-${i}`}
                      className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:border-violet-300 dark:border-white/10 dark:bg-zinc-900/40 dark:hover:border-violet-500/50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-transparent to-violet-500/0 transition-all group-hover:from-violet-500/5 group-hover:to-indigo-500/5" />
                      <div className="relative z-10 flex items-start justify-between gap-3">
                        <div>
                          <StatusBadge status={job.status} />
                          <h3 className="mt-4 font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">{job.title}</h3>
                          <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1.5"><Users className="size-3.5" /> {job.proposals} applicants</span>
                            <span className="text-zinc-300 dark:text-zinc-700">•</span>
                            <span className="flex items-center gap-1.5"><CheckCircle className="size-3.5" /> {job.hired} hires</span>
                            <span className="text-zinc-300 dark:text-zinc-700">•</span>
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{job.budget}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon-sm" className="rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/50 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </div>
                      <div className="relative z-10 mt-6 flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-zinc-100 dark:border-white/5">
                        <ProgressBar value={job.progress} className="flex-1 h-2 rounded-full" />
                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 min-w-[32px] text-right">{job.progress}%</span>
                      </div>
                      <div className="relative z-10 mt-6 flex flex-wrap gap-2.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-zinc-200/80 hover:bg-violet-50 hover:text-violet-700 dark:border-white/10 dark:hover:bg-violet-900/30 dark:hover:text-violet-300 transition-colors shadow-sm"
                          onClick={() => toast.success(`Editing job: ${job.title}`)}
                        >
                          <Edit3 className="size-3.5 mr-1.5" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          className="rounded-lg border-zinc-200/80 hover:bg-violet-50 hover:text-violet-700 dark:border-white/10 dark:hover:bg-violet-900/30 dark:hover:text-violet-300 transition-colors shadow-sm"
                          onClick={() => {
                            startTransition(async () => {
                              if (job.id) {
                                const res = await duplicateJob(job.id)
                                if (res.success) {
                                  const duplicate: Job = {
                                    ...job,
                                    id: res.jobId,
                                    title: `${job.title} (Copy)`,
                                    status: "Draft",
                                    proposals: 0,
                                    hired: 0,
                                    progress: 0,
                                  }
                                  setJobsState((prev) => [duplicate, ...prev])
                                  toast.success(`Duplicated job: ${job.title}`)
                                }
                              } else {
                                toast.error("Can't duplicate initial static job")
                              }
                            })
                          }}
                        >
                          <Copy className="size-3.5 mr-1.5" />
                          Duplicate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          className="rounded-lg border-zinc-200/80 hover:bg-amber-50 hover:text-amber-700 dark:border-white/10 dark:hover:bg-amber-950/50 dark:hover:text-amber-400 transition-colors shadow-sm"
                          onClick={() => {
                            startTransition(async () => {
                              if (job.id) {
                                await updateJobStatus(job.id, "Paused")
                              }
                              setJobsState((prev) =>
                                prev.map((j) => (j.title === job.title ? { ...j, status: "Paused" } : j))
                              )
                              toast.success(`Paused job: ${job.title}`)
                            })
                          }}
                        >
                          <Pause className="size-3.5 mr-1.5" />
                          Pause
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          className="rounded-lg border-zinc-200/80 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/10 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400 transition-colors shadow-sm"
                          onClick={() => {
                            startTransition(async () => {
                              if (job.id) {
                                await updateJobStatus(job.id, "Active")
                              }
                              setJobsState((prev) =>
                                prev.map((j) => (j.title === job.title ? { ...j, status: "Active" } : j))
                              )
                              toast.success(`Reopened job: ${job.title}`)
                            })
                          }}
                        >
                          <RefreshCw className="size-3.5 mr-1.5" />
                          Reopen
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          className="rounded-lg border-zinc-200/80 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 dark:border-white/10 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:border-red-900/50 transition-colors shadow-sm"
                          onClick={() => {
                            startTransition(async () => {
                              if (job.id) {
                                await deleteJob(job.id)
                              }
                              setJobsState((prev) => prev.filter((j) => j !== job))
                              toast.success(`Deleted job: ${job.title}`)
                            })
                          }}
                        >
                          <Trash2 className="size-3.5 mr-1.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="talent" className="space-y-8">
              <TalentMatches matches={talentMatches} />
            </TabsContent>

            <TabsContent value="proposals" className="space-y-8">
              <section>
                <SectionHeader
                  eyebrow="Applicant pipeline"
                  title="Proposals"
                  action={
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={proposalFilter}
                        onChange={(event) => setProposalFilter(event.target.value as "All" | ProposalStatus)}
                        className="h-8 rounded-lg border border-zinc-200 bg-white px-2 text-sm dark:border-white/10 dark:bg-zinc-900"
                      >
                        {["All", "New", "Shortlisted", "Interview", "Saved"].map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                      <select
                        value={proposalSort}
                        onChange={(event) => setProposalSort(event.target.value)}
                        className="h-8 rounded-lg border border-zinc-200 bg-white px-2 text-sm dark:border-white/10 dark:bg-zinc-900"
                      >
                        {["Match", "Budget", "Rating"].map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  }
                />
                <div className="space-y-4">
                  {filteredProposals.map((proposal) => (
                    <div
                      key={proposal.name}
                      className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-violet-300 dark:border-white/10 dark:bg-zinc-900/40 dark:hover:border-violet-500/50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-transparent to-violet-500/0 transition-all group-hover:from-violet-500/5 group-hover:to-indigo-500/5" />
                      
                      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_160px_160px_170px] lg:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 text-lg font-bold text-zinc-600 shadow-sm dark:from-zinc-800 dark:to-zinc-900 dark:text-white">
                              {proposal.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                 <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">{proposal.name}</h3>
                                 <StatusBadge status={proposal.status} />
                                 <Badge variant="outline" className="rounded-md border-amber-200 bg-amber-50/50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 ml-1">
                                   Risk: {proposal.risk}
                                 </Badge>
                               </div>
                               <p className="mt-0.5 text-sm font-medium text-zinc-500">{proposal.role}</p>
                            </div>
                          </div>
                          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                            {proposal.summary}
                          </p>
                        </div>
                        <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-white/5 dark:bg-zinc-950/50 text-center">
                          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Rating</p>
                          <p className="font-bold text-zinc-900 dark:text-white flex items-center justify-center gap-1"><Star className="size-3.5 text-amber-500 fill-amber-500" /> {proposal.rating}</p>
                        </div>
                        <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-white/5 dark:bg-zinc-950/50 text-center">
                          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Budget</p>
                          <p className="font-bold text-zinc-900 dark:text-white">{proposal.bid}</p>
                        </div>
                        <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-white/5 dark:bg-zinc-950/50 text-center">
                          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Timeline</p>
                          <p className="font-bold text-zinc-900 dark:text-white">{proposal.timeline}</p>
                        </div>
                      </div>
                      <div className="relative z-10 mt-6 flex flex-wrap gap-2.5 pt-4 border-t border-zinc-200/60 dark:border-white/10">
                        {proposal.status !== "Interview" && (
                          <>
                            <Button
                              size="sm"
                              disabled={isPending}
                              className="rounded-lg h-9 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 transition-all font-medium"
                              onClick={() => {
                                startTransition(async () => {
                                  // @ts-ignore
                                  if (proposal.id) await updateProposalStatus(proposal.id, "INTERVIEW")
                                  setProposalsState((prev) =>
                                    prev.map((p) =>
                                      p.name === proposal.name ? { ...p, status: "Interview" } : p
                                    )
                                  )
                                  toast.success(
                                    `Accepted proposal from ${proposal.name}. Moved to Interview.`
                                  )
                                })
                              }}
                            >
                              <CheckCircle2 className="size-4 mr-1.5" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isPending}
                              className="rounded-lg h-9 border-zinc-200/80 hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:border-white/10 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors shadow-sm font-medium"
                              onClick={() => {
                                startTransition(async () => {
                                  // @ts-ignore
                                  if (proposal.id) await updateProposalStatus(proposal.id, "REJECTED")
                                  setProposalsState((prev) => prev.filter((p) => p.name !== proposal.name))
                                  toast.success(`Rejected proposal from ${proposal.name}.`)
                                })
                              }}
                            >
                              <XCircle className="size-4 mr-1.5" />
                              Reject
                            </Button>
                          </>
                        )}
                        {proposal.status === "Interview" && (
                          <Button
                            size="sm"
                            className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg h-9 shadow-sm shadow-violet-500/20 font-medium"
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('open-chat-widget'))
                              toast.success(`Opening messages for ${proposal.name}...`)
                            }}
                          >
                            <MessageCircle className="size-4 mr-1.5" />
                            Message
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          className="rounded-lg h-9 border-zinc-200/80 hover:bg-zinc-50 shadow-sm dark:border-white/10 dark:hover:bg-zinc-800 font-medium"
                          onClick={() => {
                            startTransition(async () => {
                              // @ts-ignore
                              if (proposal.id) await updateProposalStatus(proposal.id, "SAVED")
                              setProposalsState((prev) =>
                                prev.map((p) => (p.name === proposal.name ? { ...p, status: "Saved" } : p))
                              )
                              toast.success(`Saved proposal from ${proposal.name}.`)
                            })
                          }}
                        >
                          <Star className="size-4 mr-1.5" />
                          Save
                        </Button>
                        <Button
                          variant={expandedStates[proposal.name] === "notes" ? "default" : "outline"}
                          size="sm"
                          className={`rounded-lg h-9 font-medium shadow-sm transition-all ${expandedStates[proposal.name] === "notes" ? "bg-zinc-800 text-white hover:bg-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 border-transparent" : "border-zinc-200/80 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-zinc-800"}`}
                          onClick={() => setExpandedStates(prev => ({
                            ...prev,
                            [proposal.name]: prev[proposal.name] === "notes" ? null : "notes"
                          }))}
                        >
                          <FileText className="size-4 mr-1.5" />
                          Notes
                        </Button>
                        <Button
                          variant={expandedStates[proposal.name] === "ai" ? "default" : "outline"}
                          size="sm"
                          className={`rounded-lg h-9 font-medium shadow-sm transition-all ${expandedStates[proposal.name] === "ai" ? "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20 border-transparent" : "border-zinc-200/80 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 dark:border-white/10 dark:hover:bg-violet-900/30 dark:hover:text-violet-400"}`}
                          onClick={() => setExpandedStates(prev => ({
                            ...prev,
                            [proposal.name]: prev[proposal.name] === "ai" ? null : "ai"
                          }))}
                        >
                          <Sparkles className="size-4 mr-1.5" />
                          AI summary
                        </Button>
                      </div>
                      
                      {expandedStates[proposal.name] === "notes" && (
                        <div className="relative z-10 mt-4 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/80 p-5 dark:bg-zinc-900/50 shadow-inner animate-in slide-in-from-top-2 fade-in duration-200">
                          <h4 className="mb-3 text-sm font-bold text-zinc-900 dark:text-zinc-100">Private Notes</h4>
                          <textarea
                            placeholder="Add your notes about this candidate here..."
                            className="h-28 w-full rounded-xl border border-zinc-200/80 bg-white p-4 text-sm focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-zinc-950 dark:focus:border-violet-400 shadow-sm transition-all"
                          ></textarea>
                          <div className="mt-4 flex justify-end">
                            <Button size="sm" className="rounded-lg font-medium" onClick={() => toast.success("Notes saved")}>Save Notes</Button>
                          </div>
                        </div>
                      )}
                      
                      {expandedStates[proposal.name] === "ai" && (
                        <div className="relative z-10 mt-4 rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/80 to-white p-5 dark:border-violet-900/30 dark:from-violet-950/40 dark:to-zinc-900/40 shadow-inner animate-in slide-in-from-top-2 fade-in duration-200">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="rounded-md bg-violet-100 p-1.5 dark:bg-violet-900/40">
                              <Sparkles className="size-4 text-violet-600 dark:text-violet-400" />
                            </div>
                            <h4 className="text-sm font-bold text-violet-900 dark:text-violet-200">AI Deep Dive</h4>
                          </div>
                          <p className="text-sm leading-relaxed text-violet-950/80 dark:text-violet-200/80 font-medium">
                            {proposal.summary}
                            <br /><br />
                            <strong>Match Analysis:</strong> This candidate perfectly matches your budget constraints and has a verified rating of {proposal.rating}/5.0. Their estimated risk profile is <strong>{proposal.risk}</strong>, making them an excellent candidate to interview.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="operations" className="space-y-8">
              <section className="grid gap-6 xl:grid-cols-3">
                <div>
                  <SectionHeader eyebrow="Messages" title="Communication" />
                  <div className="space-y-3">
                    {messageFeatures.map((feature) => (
                      <div
                        key={feature.label}
                        className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-zinc-200/60 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-violet-300 dark:border-white/10 dark:bg-zinc-900/40 dark:hover:border-violet-500/50"
                      >
                        <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600 transition-colors group-hover:bg-violet-100 group-hover:text-violet-700 dark:bg-violet-900/20 dark:text-violet-400 dark:group-hover:bg-violet-900/40 dark:group-hover:text-violet-300">
                          <feature.icon className="size-5" />
                        </div>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHeader eyebrow="Meetings" title="Interviews & notes" />
                  <div className="space-y-3">
                    {meetingFeatures.map((feature) => (
                      <div
                        key={feature.label}
                        className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-zinc-200/60 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-blue-300 dark:border-white/10 dark:bg-zinc-900/40 dark:hover:border-blue-500/50"
                      >
                        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 transition-colors group-hover:bg-blue-100 group-hover:text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300">
                          <feature.icon className="size-5" />
                        </div>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHeader eyebrow="Contracts" title="Delivery control" />
                  <div className="space-y-3">
                    {contractFeatures.map((feature) => (
                      <div
                        key={feature.label}
                        className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-zinc-200/60 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-emerald-300 dark:border-white/10 dark:bg-zinc-900/40 dark:hover:border-emerald-500/50"
                      >
                        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:group-hover:bg-emerald-900/40 dark:group-hover:text-emerald-300">
                          <feature.icon className="size-5" />
                        </div>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <div>
                  <SectionHeader eyebrow="Payments" title="Payment center" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {paymentFeatures.map((feature) => (
                      <div
                        key={feature.label}
                        className="group relative overflow-hidden rounded-2xl border border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-white p-5 shadow-sm transition-all hover:shadow-md dark:border-amber-900/30 dark:from-amber-950/20 dark:to-zinc-900/40 cursor-pointer"
                      >
                        <div className="absolute -right-4 -top-4 size-20 rounded-full bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all" />
                        <div className="rounded-xl bg-amber-100 w-fit p-2.5 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 group-hover:scale-110 transition-transform relative z-10">
                          <feature.icon className="size-5" />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400 relative z-10">{feature.label}</p>
                        <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100 relative z-10">{feature.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHeader eyebrow="Reviews" title="Reputation management" />
                  <div className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/40">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        ["Freelancer ratings", "4.9 avg given", "text-amber-600 dark:text-amber-400"],
                        ["Public reviews", "18 published", "text-blue-600 dark:text-blue-400"],
                        ["Private feedback", "6 internal notes", "text-violet-600 dark:text-violet-400"],
                        ["Performance scoring", "92 team score", "text-emerald-600 dark:text-emerald-400"],
                        ["Skill endorsements", "31 endorsed skills", "text-indigo-600 dark:text-indigo-400"],
                        ["Client reputation", "Excellent", "text-pink-600 dark:text-pink-400"],
                      ].map(([label, value, color]) => (
                        <div key={label} className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 transition-all hover:bg-white hover:shadow-sm dark:border-white/5 dark:bg-zinc-950/50 dark:hover:bg-zinc-900">
                          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
                          <p className={`font-bold ${color}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-8">
              <section>
                <SectionHeader eyebrow="Reports" title="Hiring and spending analytics" />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {analytics.map(([label, value, progress]) => (
                    <div
                      key={label as string}
                      className="relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-white/10 dark:bg-zinc-900/40"
                    >
                       <div className="flex items-start justify-between">
                         <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
                         <div className="rounded-xl bg-violet-50 p-2 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
                           <BarChart3 className="size-4" />
                         </div>
                       </div>
                       <div className="mt-3 flex items-baseline gap-2">
                         <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{value}</p>
                         <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                           <TrendingUp className="mr-1 size-3" /> +12%
                         </span>
                       </div>
                       <ProgressBar value={progress as number} className="mt-5 h-1.5 rounded-full" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-8 lg:grid-cols-[1fr_380px]">
                <div>
                  <SectionHeader eyebrow="Monthly activity" title="Activity report" />
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[
                      { label: "Jobs posted", value: "7", icon: Briefcase, color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" },
                      { label: "Interviews held", value: "19", icon: Users, color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20" },
                      { label: "Contracts started", value: "8", icon: FileText, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" },
                      { label: "Milestones approved", value: "24", icon: CheckCircle, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20" },
                      { label: "Avg. hire time", value: "3.8 days", icon: Clock, color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20" },
                      { label: "Proposal conversion", value: "38%", icon: Activity, color: "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20" },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div
                        key={label}
                        className="group flex items-center gap-4 rounded-2xl border border-zinc-200/60 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-all cursor-default"
                      >
                        <div className={cn("grid size-12 place-items-center rounded-xl transition-transform group-hover:scale-110", color)}>
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
                          <p className="text-xl font-bold mt-0.5">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHeader eyebrow="Growth" title="AI growth suggestions" />
                  <div className="space-y-4">
                    {[
                      { text: "Use skill tests for AI engineering applicants to improve shortlist quality.", impact: "High impact" },
                      { text: "Increase brand refresh budget by 10% to attract senior identity designers.", impact: "Medium impact" },
                      { text: "Move high-performing freelancers into a saved talent pool for repeat work.", impact: "High impact" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="group relative overflow-hidden rounded-2xl border border-violet-200/50 bg-gradient-to-br from-violet-50/80 to-white p-5 shadow-sm transition-all hover:shadow-md hover:border-violet-300 dark:border-violet-900/30 dark:from-violet-950/30 dark:to-zinc-900/40"
                      >
                        <div className="absolute top-0 right-0 h-full w-1.5 bg-gradient-to-b from-violet-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="flex gap-4">
                          <div className="mt-1 shrink-0 rounded-full bg-violet-100 p-2 dark:bg-violet-900/40">
                            <Sparkles className="size-4 text-violet-600 dark:text-violet-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-relaxed text-zinc-900 dark:text-zinc-100">{item.text}</p>
                            <div className="mt-4 flex items-center justify-between">
                              <span className="inline-flex items-center rounded-md bg-white/60 dark:bg-zinc-950/50 px-2 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-800/50">
                                {item.impact}
                              </span>
                              <Button size="sm" variant="ghost" onClick={() => toast.success("Suggestion applied.")} className="h-7 text-xs font-semibold text-violet-600 hover:text-violet-700 hover:bg-violet-100/50 dark:text-violet-400 dark:hover:bg-violet-900/30">
                                Apply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
              <section className="grid gap-6 xl:grid-cols-3">
                <div>
                  <SectionHeader eyebrow="Profile" title="Company profile" />
                  <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <span className="grid size-12 place-items-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                        NL
                      </span>
                      <div>
                        <p className="font-semibold">Nova Labs</p>
                        <p className="text-sm text-zinc-500">Product and AI operations</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      {[
                        ["Verification", "Approved"],
                        ["Team members", "8"],
                        ["Hiring history", "54 projects"],
                        ["Reputation", "96/100"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-md border border-zinc-200 p-3 dark:border-white/10">
                          <p className="text-xs text-zinc-500">{label}</p>
                          <p className="mt-1 font-medium">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <SectionHeader eyebrow="Notifications" title="Alert preferences" />
                  <div className="space-y-2">
                    {notifications.map((item) => (
                      <label
                        key={item.label}
                        className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                      >
                        <item.icon className="size-4 text-zinc-500" />
                        <span className="flex-1 text-sm">{item.label}</span>
                        <input
                          type="checkbox"
                          checked={notificationPrefs[item.label] ?? true}
                          onChange={(e) => {
                            setNotificationPrefs((prev) => ({ ...prev, [item.label]: e.target.checked }))
                            toast.success(`${item.label} ${e.target.checked ? "enabled" : "disabled"}.`)
                          }}
                          className="size-4 accent-violet-600 rounded cursor-pointer transition-all"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHeader eyebrow="Access" title="Account settings" />
                  <div className="space-y-2">
                    {settings.map((item) => (
                      <div key={item}>
                        <button
                          type="button"
                          onClick={() => setActiveSetting(prev => prev === item ? null : item)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg border bg-white p-3 text-left text-sm shadow-sm transition-all dark:bg-zinc-950/50",
                            activeSetting === item ? "border-violet-500 ring-1 ring-violet-500/50 dark:border-violet-500" : "border-zinc-200 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/[0.08]"
                          )}
                        >
                          <Settings className="size-4 text-zinc-500" />
                          <span className="flex-1">{item}</span>
                          <ChevronDown className={cn("size-4 text-zinc-400 transition-transform", activeSetting === item ? "rotate-180 text-violet-500" : "")} />
                        </button>
                        {activeSetting === item && (
                          <div className="mt-2 mb-4 rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-4 dark:border-white/5 dark:bg-zinc-900/50 shadow-inner">
                            {item === "Theme customization" ? (
                              <div className="flex flex-wrap gap-2">
                                <Button size="sm" variant="outline" className="border-zinc-200 dark:border-white/10" onClick={() => toast.success("Set to Light Mode")}>Light Mode</Button>
                                <Button size="sm" variant="outline" className="border-zinc-200 dark:border-white/10" onClick={() => toast.success("Set to Dark Mode")}>Dark Mode</Button>
                                <Button size="sm" variant="outline" className="border-zinc-200 dark:border-white/10" onClick={() => toast.success("Set to System Default")}>System Default</Button>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Manage your {item.toLowerCase()} here.</p>
                                <div className="flex justify-end gap-2">
                                  <Button size="sm" variant="ghost" onClick={() => setActiveSetting(null)}>Cancel</Button>
                                  <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white" onClick={() => { toast.success(`${item} updated successfully`); setActiveSetting(null) }}>Save changes</Button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
