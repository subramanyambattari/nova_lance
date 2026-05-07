export type ProposalStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "VIEWED"
  | "INTERVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN"

export type ProposalAttachmentItem = {
  id?: string
  fileName: string
  fileUrl: string
}

export type ProposalItem = {
  id: string
  coverLetter: string
  budget: number | null
  timeline: string | null
  portfolioLinks: string[]
  resumeUrl: string | null
  status: ProposalStatus
  externalJobId: string | null
  externalJobUrl: string | null
  clientMessage: string | null
  meetingUrl: string | null
  submittedAt: string | null
  viewedAt: string | null
  respondedAt: string | null
  interviewAt: string | null
  acceptedAt: string | null
  withdrawnAt: string | null
  lastClientActivityAt: string | null
  createdAt: string
  updatedAt: string
  attachments: ProposalAttachmentItem[]
  job: {
    id: string
    title: string
    company: string
    budget: number | null
    salary: string | null
    description?: string
    skills?: string[]
    location?: string
    externalUrl?: string | null
  } | null
}

export type ProposalStats = {
  submitted: number
  drafts: number
  responseRate: number
  interviewRequests: number
  accepted: number
  rejected: number
  earningsPotential: number
  interviewRate: number
  acceptanceRate: number
  averageResponseHours: number
}

export type ProposalsResponse = {
  proposals: ProposalItem[]
  stats: ProposalStats
  activity: Array<{ status: ProposalStatus; count: number }>
}
