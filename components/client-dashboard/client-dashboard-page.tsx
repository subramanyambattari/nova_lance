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
} from "lucide-react"
import { useMemo, useState, useTransition, useEffect } from "react"
import { usePathname } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { AIWorkspace } from "./ai-workspace"
import { TalentMatches } from "./talent-matches"
import { toast } from "@/lib/toast"

import { duplicateJob, updateJobStatus, updateProposalStatus } from "@/app/actions/client"

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
}: {
  initialJobs?: any[]
  initialProposals?: any[]
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
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
          <DashboardHeader />

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsContent value="overview" className="space-y-8">
              <DashboardOverview jobsState={jobsState} />
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
                    <Button onClick={() => handleTabChange("post")}>
                      <Plus className="size-4" />
                      New job
                    </Button>
                  }
                />
                <div className="grid gap-3 lg:grid-cols-2">
                  {jobsState.map((job) => (
                    <div
                      key={job.title}
                      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <StatusBadge status={job.status} />
                          <h3 className="mt-3 font-semibold">{job.title}</h3>
                          <p className="mt-1 text-sm text-zinc-500">
                            {job.proposals} applicants, {job.hired} hires, {job.budget}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <ProgressBar value={job.progress} className="flex-1" />
                        <span className="text-sm text-zinc-500">{job.progress}%</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.success(`Editing job: ${job.title}`)}
                        >
                          <Edit3 className="size-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
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
                          <Copy className="size-4" />
                          Duplicate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
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
                          <Pause className="size-4" />
                          Pause
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
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
                          <RefreshCw className="size-4" />
                          Reopen
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="talent" className="space-y-8">
              <TalentMatches />
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
                <div className="space-y-3">
                  {filteredProposals.map((proposal) => (
                    <div
                      key={proposal.name}
                      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                    >
                      <div className="grid gap-4 lg:grid-cols-[1fr_160px_160px_170px] lg:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{proposal.name}</h3>
                            <StatusBadge status={proposal.status} />
                            <Badge variant="outline" className="rounded-md">
                              Risk: {proposal.risk}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-zinc-500">{proposal.role}</p>
                          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                            {proposal.summary}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Rating</p>
                          <p className="font-semibold">{proposal.rating}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Budget</p>
                          <p className="font-semibold">{proposal.bid}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Timeline</p>
                          <p className="font-semibold">{proposal.timeline}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          disabled={isPending}
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
                          <CheckCircle2 className="size-4" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          onClick={() => {
                            startTransition(async () => {
                              // @ts-ignore
                              if (proposal.id) await updateProposalStatus(proposal.id, "REJECTED")
                              setProposalsState((prev) => prev.filter((p) => p.name !== proposal.name))
                              toast.success(`Rejected proposal from ${proposal.name}.`)
                            })
                          }}
                        >
                          <XCircle className="size-4" />
                          Reject
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
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
                          <Star className="size-4" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.success(`Opened notes for ${proposal.name}.`)}
                        >
                          <FileText className="size-4" />
                          Notes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toast.success(`AI Summary for ${proposal.name}: ${proposal.summary}`)
                          }
                        >
                          <Sparkles className="size-4" />
                          AI summary
                        </Button>
                      </div>
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
                        className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                      >
                        <feature.icon className="size-4 text-zinc-500" />
                        <span className="text-sm">{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHeader eyebrow="Meetings" title="Interviews and notes" />
                  <div className="space-y-3">
                    {meetingFeatures.map((feature) => (
                      <div
                        key={feature.label}
                        className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                      >
                        <feature.icon className="size-4 text-zinc-500" />
                        <span className="text-sm">{feature.label}</span>
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
                        className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                      >
                        <feature.icon className="size-4 text-zinc-500" />
                        <span className="text-sm">{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <div>
                  <SectionHeader eyebrow="Payments" title="Payment center" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {paymentFeatures.map((feature) => (
                      <div
                        key={feature.label}
                        className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                      >
                        <feature.icon className="size-5 text-zinc-500" />
                        <p className="mt-3 text-sm text-zinc-500">{feature.label}</p>
                        <p className="mt-1 font-semibold">{feature.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHeader eyebrow="Reviews" title="Reputation management" />
                  <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        ["Freelancer ratings", "4.9 avg given"],
                        ["Public reviews", "18 published"],
                        ["Private feedback", "6 internal notes"],
                        ["Performance scoring", "92 team score"],
                        ["Skill endorsements", "31 endorsed skills"],
                        ["Client reputation", "Excellent"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-md border border-zinc-200 p-3 dark:border-white/10">
                          <p className="text-xs text-zinc-500">{label}</p>
                          <p className="mt-1 font-medium">{value}</p>
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
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {analytics.map(([label, value, progress]) => (
                    <div
                      key={label as string}
                      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                    >
                      <p className="text-sm text-zinc-500">{label}</p>
                      <p className="mt-2 text-2xl font-semibold">{value}</p>
                      <ProgressBar value={progress as number} className="mt-4" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div>
                  <SectionHeader eyebrow="Monthly activity" title="Activity report" />
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["Jobs posted", "7"],
                      ["Interviews held", "19"],
                      ["Contracts started", "8"],
                      ["Milestones approved", "24"],
                      ["Avg. hire time", "3.8 days"],
                      ["Proposal conversion", "38%"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                      >
                        <p className="text-sm text-zinc-500">{label}</p>
                        <p className="mt-2 text-xl font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHeader eyebrow="Growth" title="AI growth suggestions" />
                  <div className="space-y-3">
                    {[
                      "Use skill tests for AI engineering applicants to improve shortlist quality.",
                      "Increase brand refresh budget by 10% to attract senior identity designers.",
                      "Move high-performing freelancers into a saved talent pool for repeat work.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                      >
                        <Zap className="mt-0.5 size-4 shrink-0 text-amber-500" />
                        <p>{item}</p>
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
                        <input type="checkbox" defaultChecked className="size-4 accent-zinc-950" />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionHeader eyebrow="Access" title="Account settings" />
                  <div className="space-y-2">
                    {settings.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 text-left text-sm shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                      >
                        <Settings className="size-4 text-zinc-500" />
                        {item}
                      </button>
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
