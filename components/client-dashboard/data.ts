import {
  Activity,
  AlertTriangle,
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
  CreditCard,
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
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Upload,
  Users,
  Wand2,
} from "lucide-react"

import type { AiTool, IconFeature, Job, Proposal, Talent } from "./types"

export const overviewStats = [
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

export const aiTools: AiTool[] = [
  { title: "Job description generator", text: "Turn a short brief into a scoped posting.", icon: Wand2 },
  { title: "Budget estimator", text: "Estimate hourly, fixed, and milestone ranges.", icon: Gauge },
  { title: "Freelancer recommendations", text: "Rank talent by fit, availability, and risk.", icon: Users },
  { title: "Proposal analyzer", text: "Summarize strengths, gaps, price, and timeline.", icon: FileCheck2 },
  { title: "Interview questions", text: "Generate role-specific screening questions.", icon: MessageSquare },
  { title: "Meeting summaries", text: "Capture decisions, blockers, and next steps.", icon: Bot },
  { title: "Milestone creation", text: "Break scope into payable delivery checkpoints.", icon: Layers3 },
  { title: "Risk detection", text: "Flag vague scope, low signal proposals, and delays.", icon: AlertTriangle },
]

export const jobs: Job[] = [
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

export const talents: Talent[] = [
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

export const proposals: Proposal[] = [
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

export const activity = [
  "Ava Johnson viewed Marketplace checkout redesign",
  "Nova flagged 3 high-fit proposals for AI support chatbot MVP",
  "Marco Silva replied to your interview invite",
  "Milestone 2 invoice approved for Mobile app QA sprint",
]

export const deadlines = [
  ["May 24", "Approve checkout prototype milestone"],
  ["May 26", "Interview AI engineer finalists"],
  ["May 29", "Release QA sprint payment"],
  ["Jun 02", "Brand refresh handoff review"],
]

export const analytics = [
  ["Proposal conversion", "38%", 38],
  ["Average response time", "1h 12m", 72],
  ["Project completion", "94%", 94],
  ["Budget accuracy", "87%", 87],
]

export const notifications = [
  { label: "Proposal alerts", icon: Inbox },
  { label: "Payment reminders", icon: CreditCard },
  { label: "Deadline notifications", icon: Clock3 },
  { label: "Meeting reminders", icon: CalendarClock },
  { label: "AI recommendations", icon: Sparkles },
  { label: "Freelancer activity", icon: Activity },
]

export const settings = [
  "Account settings",
  "Security settings",
  "Notification preferences",
  "Theme customization",
  "Privacy controls",
  "Team access management",
]

export const trustSafetyFeatures: IconFeature[] = [
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

export const messageFeatures: IconFeature[] = [
  { label: "Real-time chat", icon: MessageSquare },
  { label: "File sharing", icon: Upload },
  { label: "Voice messages", icon: Mic },
  { label: "AI quick replies", icon: Sparkles },
  { label: "Chat search", icon: Search },
  { label: "Conversation pinning", icon: Star },
  { label: "Read tracking", icon: CheckCircle2 },
  { label: "Typing indicators", icon: MoreHorizontal },
]

export const meetingFeatures: IconFeature[] = [
  { label: "Schedule interviews", icon: CalendarClock },
  { label: "Meeting reminders", icon: Bell },
  { label: "Availability calendar", icon: Clock3 },
  { label: "Meeting notes", icon: FileText },
  { label: "Video call integration", icon: Users },
  { label: "AI-generated summaries", icon: Bot },
  { label: "Reschedule management", icon: RefreshCw },
]

export const contractFeatures: IconFeature[] = [
  { label: "Contract creation", icon: FileCheck2 },
  { label: "Milestone tracking", icon: Layers3 },
  { label: "Deliverable management", icon: ClipboardCheck },
  { label: "NDA management", icon: Lock },
  { label: "Contract status tracking", icon: Activity },
  { label: "Approval workflow", icon: CheckCircle2 },
  { label: "Revision requests", icon: RefreshCw },
]

export const paymentFeatures: IconFeature[] = [
  { label: "Milestone payments", value: "$8,200 pending", icon: Banknote },
  { label: "Transaction history", value: "42 records", icon: History },
  { label: "Invoice management", value: "6 open", icon: FileText },
  { label: "Payment status", value: "92% on time", icon: CreditCard },
  { label: "Refund requests", value: "1 in review", icon: RefreshCw },
  { label: "Spending breakdown", value: "$24.8k this month", icon: LineChart },
]

export const initialSkills = ["Next.js", "AI chatbot", "Postgres", "UX writing"]

export const initialJobDraft = {
  title: "AI customer support chatbot for SaaS platform",
  budget: "$5,000-$8,000",
  timeline: "4 weeks",
  priority: "High",
  experience: "Expert",
}

export const jobFieldOptions: {
  label: string
  key: keyof typeof initialJobDraft
  options: string[]
}[] = [
  { label: "Budget range", key: "budget", options: ["$1,000-$3,000", "$5,000-$8,000", "$8,000-$12,000"] },
  { label: "Timeline", key: "timeline", options: ["2 weeks", "4 weeks", "8 weeks"] },
  { label: "Priority level", key: "priority", options: ["Low", "Medium", "High", "Urgent"] },
  { label: "Experience", key: "experience", options: ["Entry", "Intermediate", "Expert"] },
]
