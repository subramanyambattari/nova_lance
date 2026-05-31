"use client"

import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Bell,
  Bot,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Copy,
  CreditCard,
  Download,
  Edit3,
  FileCheck2,
  FileText,
  Gauge,
  History,
  Inbox,
  Layers3,
  LineChart,
  Lock,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Pause,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Upload,
  Users,
  Wand2,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { useMemo, useState, useTransition, useEffect } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type ProposalStatus = "New" | "Shortlisted" | "Interview" | "Saved"

type Proposal = {
  name: string
  role: string
  rating: string
  bid: string
  timeline: string
  status: ProposalStatus
  summary: string
  risk: "Low" | "Medium" | "High"
}

type Talent = {
  name: string
  title: string
  match: number
  availability: string
  rate: string
  rank: string
  skills: string[]
  portfolio: string
}

type Job = {
  id?: string
  title: string
  status: "Active" | "Draft" | "Paused" | "Closed"
  proposals: number
  hired: number
  progress: number
  budget: string
}

type AiTool = {
  title: string
  text: string
  icon: LucideIcon
}

type IconFeature = {
  label: string
  text?: string
  value?: string
  icon: LucideIcon
}

const overviewStats = [
  {
    label: "Active jobs",
    value: "12",
    trend: "+3 this month",
    icon: BriefcaseBusiness,
    tone: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  },
  {
    label: "Pending proposals",
    value: "48",
    trend: "16 need review",
    icon: FileText,
    tone: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  },
  {
    label: "Hiring success",
    value: "91%",
    trend: "+8% vs last quarter",
    icon: Target,
    tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  {
    label: "Spend this month",
    value: "$24.8k",
    trend: "$8.2k pending",
    icon: CircleDollarSign,
    tone: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  },
]

const aiTools: AiTool[] = [
  { title: "Job description generator", text: "Turn a short brief into a scoped posting.", icon: Wand2 },
  { title: "Budget estimator", text: "Estimate hourly, fixed, and milestone ranges.", icon: Gauge },
  { title: "Freelancer recommendations", text: "Rank talent by fit, availability, and risk.", icon: Users },
  { title: "Proposal analyzer", text: "Summarize strengths, gaps, price, and timeline.", icon: FileCheck2 },
  { title: "Interview questions", text: "Generate role-specific screening questions.", icon: MessageSquare },
  { title: "Meeting summaries", text: "Capture decisions, blockers, and next steps.", icon: Bot },
  { title: "Milestone creation", text: "Break scope into payable delivery checkpoints.", icon: Layers3 },
  { title: "Risk detection", text: "Flag vague scope, low signal proposals, and delays.", icon: AlertTriangle },
]

const jobs: Job[] = [
  {
    title: "Marketplace checkout redesign",
    status: "Active",
    proposals: 18,
    hired: 2,
    progress: 68,
    budget: "$8k-$12k",
  },
  {
    title: "AI support chatbot MVP",
    status: "Draft",
    proposals: 0,
    hired: 0,
    progress: 35,
    budget: "$5k-$7k",
  },
  {
    title: "Brand system refresh",
    status: "Paused",
    proposals: 31,
    hired: 1,
    progress: 44,
    budget: "$3k-$5k",
  },
  {
    title: "Mobile app QA sprint",
    status: "Closed",
    proposals: 22,
    hired: 3,
    progress: 100,
    budget: "$2k-$4k",
  },
]

const talents: Talent[] = [
  {
    name: "Ava Johnson",
    title: "Senior product designer",
    match: 96,
    availability: "Available this week",
    rate: "$72/hr",
    rank: "Top 1%",
    skills: ["Figma", "Design systems", "SaaS UX"],
    portfolio: "Fintech dashboards, checkout flows, growth experiments",
  },
  {
    name: "Marco Silva",
    title: "Full-stack AI engineer",
    match: 92,
    availability: "Starts May 27",
    rate: "$88/hr",
    rank: "Top 3%",
    skills: ["Next.js", "LangChain", "Postgres"],
    portfolio: "AI copilots, support automation, analytics platforms",
  },
  {
    name: "Nia Patel",
    title: "Technical project manager",
    match: 89,
    availability: "Part-time",
    rate: "$54/hr",
    rank: "Rising talent",
    skills: ["Agile", "Milestones", "QA"],
    portfolio: "Remote team delivery, sprint planning, client reporting",
  },
]

const proposals: Proposal[] = [
  {
    name: "Marco Silva",
    role: "AI engineer",
    rating: "4.98",
    bid: "$6,800",
    timeline: "4 weeks",
    status: "Shortlisted",
    summary: "Strong architecture plan, clear API assumptions, and realistic delivery milestones.",
    risk: "Low",
  },
  {
    name: "Priya Chen",
    role: "UX researcher",
    rating: "4.91",
    bid: "$3,200",
    timeline: "2 weeks",
    status: "New",
    summary: "Great discovery process, but needs a sharper deliverables list before approval.",
    risk: "Medium",
  },
  {
    name: "David Kim",
    role: "Frontend lead",
    rating: "4.86",
    bid: "$7,400",
    timeline: "5 weeks",
    status: "Interview",
    summary: "Excellent dashboard portfolio and communication, with a higher budget ask.",
    risk: "Low",
  },
  {
    name: "Elena Rossi",
    role: "Brand designer",
    rating: "4.77",
    bid: "$1,900",
    timeline: "9 days",
    status: "Saved",
    summary: "Fast timeline and polished visuals; proposal is light on handoff details.",
    risk: "Medium",
  },
]

const activity = [
  "Ava Johnson viewed Marketplace checkout redesign",
  "Nova flagged 3 high-fit proposals for AI support chatbot MVP",
  "Marco Silva replied to your interview invite",
  "Milestone 2 invoice approved for Mobile app QA sprint",
]

const deadlines = [
  ["May 24", "Approve checkout prototype milestone"],
  ["May 26", "Interview AI engineer finalists"],
  ["May 29", "Release QA sprint payment"],
  ["Jun 02", "Brand refresh handoff review"],
]

const analytics = [
  ["Proposal conversion", "38%", 38],
  ["Average response time", "1h 12m", 72],
  ["Project completion", "94%", 94],
  ["Budget accuracy", "87%", 87],
]

const notifications = [
  { label: "Proposal alerts", icon: Inbox },
  { label: "Payment reminders", icon: CreditCard },
  { label: "Deadline notifications", icon: Clock3 },
  { label: "Meeting reminders", icon: CalendarClock },
  { label: "AI recommendations", icon: Sparkles },
  { label: "Freelancer activity", icon: Activity },
]

const settings = [
  "Account settings",
  "Security settings",
  "Notification preferences",
  "Theme customization",
  "Privacy controls",
  "Team access management",
]

const trustSafetyFeatures: IconFeature[] = [
  {
    label: "Scam detection",
    text: "No payment or off-platform warning patterns found.",
    icon: ShieldCheck,
  },
  {
    label: "Fake proposal detection",
    text: "2 proposals look generic and need manual review.",
    icon: AlertTriangle,
  },
  {
    label: "Secure payments",
    text: "All active contracts are protected by milestone funding.",
    icon: Lock,
  },
  {
    label: "User verification",
    text: "7 shortlisted freelancers are identity verified.",
    icon: BadgeCheck,
  },
]

const messageFeatures: IconFeature[] = [
  { label: "Real-time chat", icon: MessageSquare },
  { label: "File sharing", icon: Upload },
  { label: "Voice messages", icon: Mic },
  { label: "AI quick replies", icon: Sparkles },
  { label: "Chat search", icon: Search },
  { label: "Conversation pinning", icon: Star },
  { label: "Read tracking", icon: CheckCircle2 },
  { label: "Typing indicators", icon: MoreHorizontal },
]

const meetingFeatures: IconFeature[] = [
  { label: "Schedule interviews", icon: CalendarClock },
  { label: "Meeting reminders", icon: Bell },
  { label: "Availability calendar", icon: Clock3 },
  { label: "Meeting notes", icon: FileText },
  { label: "Video call integration", icon: Users },
  { label: "AI-generated summaries", icon: Bot },
  { label: "Reschedule management", icon: RefreshCw },
]

const contractFeatures: IconFeature[] = [
  { label: "Contract creation", icon: FileCheck2 },
  { label: "Milestone tracking", icon: Layers3 },
  { label: "Deliverable management", icon: ClipboardCheck },
  { label: "NDA management", icon: Lock },
  { label: "Contract status tracking", icon: Activity },
  { label: "Approval workflow", icon: CheckCircle2 },
  { label: "Revision requests", icon: RefreshCw },
]

const paymentFeatures: IconFeature[] = [
  { label: "Milestone payments", value: "$8,200 pending", icon: Banknote },
  { label: "Transaction history", value: "42 records", icon: History },
  { label: "Invoice management", value: "6 open", icon: FileText },
  { label: "Payment status", value: "92% on time", icon: CreditCard },
  { label: "Refund requests", value: "1 in review", icon: RefreshCw },
  { label: "Spending breakdown", value: "$24.8k this month", icon: LineChart },
]

const initialSkills = ["Next.js", "AI chatbot", "Postgres", "UX writing"]

const initialJobDraft = {
  title: "AI customer support chatbot for SaaS platform",
  budget: "$5,000-$8,000",
  timeline: "4 weeks",
  priority: "High",
  experience: "Expert",
}

const jobFieldOptions: {
  label: string
  key: keyof typeof initialJobDraft
  options: string[]
}[] = [
  { label: "Budget range", key: "budget", options: ["$1,000-$3,000", "$5,000-$8,000", "$8,000-$12,000"] },
  { label: "Timeline", key: "timeline", options: ["2 weeks", "4 weeks", "8 weeks"] },
  { label: "Priority level", key: "priority", options: ["Low", "Medium", "High", "Urgent"] },
  { label: "Experience", key: "experience", options: ["Entry", "Intermediate", "Expert"] },
]

function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10", className)}>
      <div
        className="h-full rounded-full bg-zinc-950 dark:bg-white"
        style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
      />
    </div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase text-zinc-500">{eyebrow}</p> : null}
        <h2 className="mt-1 text-xl font-semibold tracking-normal text-zinc-950 dark:text-white">{title}</h2>
      </div>
      {action}
    </div>
  )
}

function StatusBadge({ status }: { status: Job["status"] | ProposalStatus }) {
  const styles: Record<string, string> = {
    Active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
    Draft: "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300",
    Paused: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
    Closed: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300",
    New: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300",
    Shortlisted:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300",
    Interview:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300",
    Saved: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
  }

  return (
    <Badge variant="outline" className={cn("rounded-md", styles[status])}>
      {status}
    </Badge>
  )
}

import { createJob } from "@/app/actions/client"
import { generateJobDescription, analyzeProposals } from "@/app/actions/ai"
import { toast } from "@/lib/toast"
// useTransition moved to top

export function ClientDashboardPage({ 
  initialJobs = [], 
  initialProposals = [] 
}: { 
  initialJobs?: any[], 
  initialProposals?: any[] 
}) {
  const [isPending, startTransition] = useTransition()
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)

  const [activeTab, setActiveTab] = useState("overview")
  const [jobsState, setJobsState] = useState<Job[]>(initialJobs && initialJobs.length > 0 ? initialJobs : jobs)
  const [proposalsState, setProposalsState] = useState<Proposal[]>(initialProposals && initialProposals.length > 0 ? initialProposals : proposals)

  const [skills, setSkills] = useState(initialSkills)
  const [skillDraft, setSkillDraft] = useState("")
  const [proposalFilter, setProposalFilter] = useState<"All" | ProposalStatus>("All")
  const [proposalSort, setProposalSort] = useState("Match")
  const [attachments, setAttachments] = useState<string[]>([])
  const [jobDraft, setJobDraft] = useState(initialJobDraft)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      const hashToTabMap: Record<string, string> = {
        "overview": "overview",
        "ai-workspace": "ai",
        "post-job": "post",
        "my-jobs": "jobs",
        "talent-matches": "talent",
        "proposals": "proposals",
        "operations": "operations",
        "analytics": "analytics",
        "settings": "settings",
      }
      if (hashToTabMap[hash]) {
        setActiveTab(hashToTabMap[hash])
      }
    }

    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const tabToHashMap: Record<string, string> = {
      "overview": "overview",
      "ai": "ai-workspace",
      "post": "post-job",
      "jobs": "my-jobs",
      "talent": "talent-matches",
      "proposals": "proposals",
      "operations": "operations",
      "analytics": "analytics",
      "settings": "settings",
    }
    if (tabToHashMap[value]) {
      window.history.pushState(null, "", `#${tabToHashMap[value]}`)
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
  }, [proposalFilter, proposalSort])

  function addSkill() {
    const nextSkill = skillDraft.trim()
    if (!nextSkill || skills.includes(nextSkill)) return
    setSkills((items) => [...items, nextSkill])
    setSkillDraft("")
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="grid gap-5 border-b border-zinc-200 pb-6 dark:border-white/10 lg:grid-cols-[1fr_360px]">
          <div className="flex min-w-0 flex-col justify-end">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                Client workspace
              </Badge>
              <Badge
                variant="outline"
                className="rounded-md border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
              >
                Verified business
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">
              Hire, manage, and pay talent with Nova AI.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
              A complete client command center for posting jobs, reviewing proposals, managing contracts,
              tracking spend, and getting real-time AI hiring guidance.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button>
                <Plus className="size-4" />
                Post job
              </Button>
              <Button variant="outline">
                <Sparkles className="size-4" />
                Ask Nova
              </Button>
              <Button variant="outline">
                <Download className="size-4" />
                Monthly report
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                <Sparkles className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold">Nova best action</p>
                <p className="text-sm text-zinc-500">Review 3 shortlisted AI engineers before May 26.</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              {[
                ["Fit", "94%"],
                ["Risk", "Low"],
                ["Savings", "$1.2k"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-zinc-200 p-3 dark:border-white/10">
                  <p className="text-xs text-zinc-500">{label}</p>
                  <p className="mt-1 font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {overviewStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                </div>
                <span className={cn("grid size-9 place-items-center rounded-md", stat.tone)}>
                  <stat.icon className="size-5" />
                </span>
              </div>
              <p className="mt-3 text-sm text-zinc-500">{stat.trend}</p>
            </div>
          ))}
        </section>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <div className="overflow-x-auto pb-1">
            <TabsList className="h-auto min-w-max justify-start rounded-lg border-zinc-200 bg-white p-1 text-zinc-600 dark:border-white/10 dark:bg-white/[0.04]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ai">AI Workspace</TabsTrigger>
              <TabsTrigger value="post">Post Job</TabsTrigger>
              <TabsTrigger value="jobs">My Jobs</TabsTrigger>
              <TabsTrigger value="talent">Talent Matches</TabsTrigger>
              <TabsTrigger value="proposals">Proposals</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
              <div>
                <SectionHeader eyebrow="Project health" title="Progress overview" />
                <div className="space-y-3">
                  {jobsState.length > 0 ? jobsState.map((job) => (
                    <div key={job.id} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{job.title}</h3>
                            <StatusBadge status={job.status} />
                          </div>
                          <p className="mt-1 text-sm text-zinc-500">
                            {job.proposals} proposals, {job.hired} hired, {job.budget}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <ArrowUpRight className="size-4" />
                          Open
                        </Button>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <ProgressBar value={job.progress} className="flex-1" />
                        <span className="w-10 text-right text-sm text-zinc-500">{job.progress}%</span>
                      </div>
                    </div>
                  )) : <p className="text-sm text-zinc-500">No active jobs found. Post a job to get started!</p>}
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <SectionHeader eyebrow="Activity" title="Recent freelancer activity" />
                  <div className="space-y-2">
                    {activity.map((item) => (
                      <div key={item} className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                        <span className="mt-0.5 size-2 rounded-full bg-emerald-500" />
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <SectionHeader eyebrow="Deadlines" title="Upcoming deadlines" />
                  <div className="space-y-2">
                    {deadlines.map(([date, item]) => (
                      <div key={item} className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="w-16 shrink-0 rounded-md bg-zinc-100 px-2 py-1 text-center text-xs font-semibold dark:bg-white/10">
                          {date}
                        </div>
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </section>

            <section>
              <SectionHeader eyebrow="AI insights" title="Business recommendations" />
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["Shortlist faster", "Your best hires happen within 36 hours of receiving 10 qualified proposals."],
                  ["Adjust budget", "The chatbot MVP is priced 12% below similar expert-level projects."],
                  ["Reduce risk", "Require repo access, deployment checklist, and acceptance tests in milestone 1."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                    <Sparkles className="size-5 text-blue-600 dark:text-blue-300" />
                    <h3 className="mt-3 font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="ai" className="space-y-8">
            <section>
              <SectionHeader
                eyebrow="Nova AI"
                title="AI workspace"
                action={
                  <Button>
                    <Sparkles className="size-4" />
                    Run hiring scan
                  </Button>
                }
              />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {aiTools.map((tool) => (
                  <button
                    key={tool.title}
                    type="button"
                    className="rounded-lg border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:border-zinc-400 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/30"
                  >
                    <span className="grid size-9 place-items-center rounded-md bg-zinc-100 text-zinc-950 dark:bg-white/10 dark:text-white">
                      <tool.icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-semibold">{tool.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">{tool.text}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <SectionHeader eyebrow="Assistant" title="Nova command center" />
                <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex gap-3">
                    <span className="grid size-10 place-items-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                      <Bot className="size-5" />
                    </span>
                    <div>
                      <p className="font-semibold">What should I do next?</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-500">
                        Nova recommends comparing Marco, David, and Ava, then creating two technical milestones
                        before sending interview invites.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Explain proposals", "Suggest budgets", "Summarize meetings", "Generate job content"].map(
                      (prompt) => (
                        <Button 
                          key={prompt} 
                          variant="outline" 
                          size="sm"
                          disabled={isAiLoading}
                          onClick={async () => {
                            if (prompt === "Generate job content") {
                              setIsAiLoading(true)
                              const res = await generateJobDescription("Create a job post for an AI engineer.")
                              if (res.success) setAiResponse(res.text)
                              setIsAiLoading(false)
                            } else if (prompt === "Explain proposals") {
                              setIsAiLoading(true)
                              const res = await analyzeProposals("Analyze recent proposals.")
                              if (res.success) setAiResponse(res.text)
                              setIsAiLoading(false)
                            } else {
                              setAiResponse(`Feature '${prompt}' is coming soon!`)
                            }
                          }}
                        >
                          {prompt}
                        </Button>
                      )
                    )}
                  </div>
                  {aiResponse && (
                    <div className="mt-4 rounded-md bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-blue-600 dark:text-blue-400">Nova AI Response:</strong>
                        <Button variant="ghost" size="sm" onClick={() => setAiResponse(null)}>Clear</Button>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {isAiLoading ? "Thinking..." : aiResponse}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <SectionHeader eyebrow="Risk" title="Trust and safety scan" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {trustSafetyFeatures.map((feature) => (
                    <div key={feature.label} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                      <feature.icon className="size-5 text-emerald-600 dark:text-emerald-300" />
                      <h3 className="mt-3 font-semibold">{feature.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">{feature.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="post" className="space-y-8">
            <section className="grid gap-6 xl:grid-cols-[1fr_390px]">
              <div>
                <SectionHeader eyebrow="Smart job creation" title="Post a job" />
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium">Job title</span>
                    <input
                      value={jobDraft.title}
                      onChange={(event) => setJobDraft((draft) => ({ ...draft, title: event.target.value }))}
                      className="mt-2 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-950/20 dark:border-white/10 dark:bg-white/[0.04]"
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {jobFieldOptions.map((field) => (
                      <label key={field.key} className="block">
                        <span className="text-sm font-medium">{field.label}</span>
                        <select
                          value={jobDraft[field.key]}
                          onChange={(event) =>
                            setJobDraft((draft) => ({
                              ...draft,
                              [field.key]: event.target.value,
                            }))
                          }
                          className="mt-2 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-950/20 dark:border-white/10 dark:bg-zinc-900"
                        >
                          {field.options.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>

                  <div>
                    <span className="text-sm font-medium">Skill tags</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm dark:border-white/10 dark:bg-white/[0.04]"
                          onClick={() => setSkills((items) => items.filter((item) => item !== skill))}
                        >
                          {skill}
                          <XCircle className="size-3.5" />
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <input
                        value={skillDraft}
                        onChange={(event) => setSkillDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault()
                            addSkill()
                          }
                        }}
                        placeholder="Add a skill"
                        className="h-9 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-950/20 dark:border-white/10 dark:bg-white/[0.04]"
                      />
                      <Button type="button" variant="outline" onClick={addSkill}>
                        <Plus className="size-4" />
                        Add
                      </Button>
                    </div>
                  </div>

                  <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white p-4 text-center text-sm text-zinc-500 dark:border-white/15 dark:bg-white/[0.04]">
                    <Upload className="mb-2 size-5" />
                    Upload briefs, brand files, specs, or screenshots
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(event) =>
                        setAttachments(Array.from(event.target.files ?? []).map((file) => file.name))
                      }
                    />
                  </label>
                  {attachments.length ? (
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((name) => (
                        <Badge key={name} variant="outline" className="rounded-md">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <aside>
                <SectionHeader eyebrow="Preview" title="AI-generated details" />
                <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <h3 className="text-lg font-semibold">{jobDraft.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    We need an experienced freelancer to build a production-ready AI chatbot with secure
                    authentication, analytics, admin controls, and documented deployment.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    {[
                      ["Budget", jobDraft.budget],
                      ["Timeline", jobDraft.timeline],
                      ["Priority", jobDraft.priority],
                      ["Experience", jobDraft.experience],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-md border border-zinc-200 p-3 dark:border-white/10">
                        <p className="text-xs text-zinc-500">{label}</p>
                        <p className="mt-1 font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                      <Button variant="outline">Save as draft</Button>
                      <Button 
                        disabled={isPending}
                        onClick={() => {
                          startTransition(async () => {
                            await createJob({
                              title: jobDraft.title,
                              budget: jobDraft.budget,
                              timeline: jobDraft.timeline,
                              priority: jobDraft.priority,
                              experience: jobDraft.experience,
                              skills: skills
                            })
                            setJobsState(prev => [{
                              title: jobDraft.title,
                              status: "Active",
                              proposals: 0,
                              hired: 0,
                              progress: 0,
                              budget: jobDraft.budget
                            }, ...prev])
                            toast.success("Job posted successfully!")
                            setJobDraft(initialJobDraft)
                            setSkills(initialSkills)
                            handleTabChange("jobs")
                          })
                        }}
                      >
                        {isPending ? "Posting..." : "Post job"}
                        <ArrowUpRight className="size-4" />
                      </Button>
                    </div>
                </div>
              </aside>
            </section>
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
                  <div key={job.title} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
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
                      <Button variant="outline" size="sm" onClick={() => toast.success(`Editing job: ${job.title}`)}>
                        <Edit3 className="size-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        const duplicate: Job = { ...job, title: `${job.title} (Copy)`, status: "Draft", proposals: 0, hired: 0, progress: 0 }
                        setJobsState(prev => [duplicate, ...prev])
                        toast.success(`Duplicated job: ${job.title}`)
                      }}>
                        <Copy className="size-4" />
                        Duplicate
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setJobsState(prev => prev.map(j => j.title === job.title ? { ...j, status: "Paused" } : j))
                        toast.success(`Paused job: ${job.title}`)
                      }}>
                        <Pause className="size-4" />
                        Pause
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setJobsState(prev => prev.map(j => j.title === job.title ? { ...j, status: "Active" } : j))
                        toast.success(`Reopened job: ${job.title}`)
                      }}>
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
            <section>
              <SectionHeader eyebrow="Smart hiring system" title="AI-recommended talent matches" />
              <div className="grid gap-3 xl:grid-cols-3">
                {talents.map((talent) => (
                  <div key={talent.name} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{talent.name}</h3>
                        <p className="text-sm text-zinc-500">{talent.title}</p>
                      </div>
                      <div className="rounded-md bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        {talent.match}%
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {talent.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="rounded-md">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-zinc-500">{talent.portfolio}</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-zinc-500">Rate</p>
                        <p className="font-medium">{talent.rate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Rank</p>
                        <p className="font-medium">{talent.rank}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Status</p>
                        <p className="font-medium">{talent.availability}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button className="flex-1" onClick={() => toast.success(`Invited ${talent.name} to apply.`)}>
                        <Send className="size-4" />
                        Invite
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => toast.success(`Shortlisted ${talent.name}.`)}>
                        <Star className="size-4" />
                        Shortlist
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
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
                  <div key={proposal.name} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
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
                      <Button size="sm" onClick={() => {
                        setProposalsState(prev => prev.map(p => p.name === proposal.name ? { ...p, status: "Interview" } : p))
                        toast.success(`Accepted proposal from ${proposal.name}. Moved to Interview.`)
                      }}>
                        <CheckCircle2 className="size-4" />
                        Accept
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setProposalsState(prev => prev.filter(p => p.name !== proposal.name))
                        toast.success(`Rejected proposal from ${proposal.name}.`)
                      }}>
                        <XCircle className="size-4" />
                        Reject
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setProposalsState(prev => prev.map(p => p.name === proposal.name ? { ...p, status: "Saved" } : p))
                        toast.success(`Saved proposal from ${proposal.name}.`)
                      }}>
                        <Star className="size-4" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toast.success(`Opened notes for ${proposal.name}.`)}>
                        <FileText className="size-4" />
                        Notes
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toast.success(`AI Summary for ${proposal.name}: ${proposal.summary}`)}>
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
                    <div key={feature.label} className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
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
                    <div key={feature.label} className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
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
                    <div key={feature.label} className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
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
                    <div key={feature.label} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
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
                  <div key={label as string} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
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
                    <div key={label} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
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
                    <div key={item} className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
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
                    <label key={item.label} className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
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
    </div>
  )
}
