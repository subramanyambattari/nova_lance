import { type LucideIcon } from "lucide-react"

export type ProposalStatus = "New" | "Shortlisted" | "Interview" | "Saved"

export type Proposal = {
  name: string
  role: string
  rating: string
  bid: string
  timeline: string
  status: ProposalStatus
  summary: string
  risk: "Low" | "Medium" | "High"
}

export type Talent = {
  name: string
  title: string
  match: number
  availability: string
  rate: string
  rank: string
  skills: string[]
  portfolio: string
}

export type Job = {
  id?: string
  title: string
  status: "Active" | "Draft" | "Paused" | "Closed"
  proposals: number
  hired: number
  progress: number
  budget: string
}

export type AiTool = {
  title: string
  text: string
  icon: LucideIcon
}

export type IconFeature = {
  label: string
  text?: string
  value?: string
  icon: LucideIcon
}
