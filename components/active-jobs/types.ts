export type JobStatus = "IN_PROGRESS" | "REVIEW" | "COMPLETED" | "BLOCKED" | "AT_RISK"

export interface ActiveJobMilestone {
  id: string
  title: string
  description: string | null
  amount: number | null
  dueDate: string | null
  completed: boolean
  completedAt: string | null
  paymentStatus: string
  overdue: boolean
  createdAt: string
  updatedAt: string
}

export interface ActiveJobMessage {
  id: string
  message: string
  fileUrl: string | null
  readAt: string | null
  createdAt: string
  sender: { id: number; name: string; email: string }
}

export interface ActiveJobDeliverable {
  id: string
  title: string
  fileUrl: string
  fileName: string | null
  fileType: string | null
  version: number
  revisionNotes: string | null
  approvalStatus: string
  uploadedAt: string
  updatedAt: string
}

export interface ActiveJobItem {
  id: string
  title: string
  description: string
  budget: number | null
  progress: number
  status: JobStatus
  priority: string | null
  deadline: string | null
  paymentStatus: string
  createdAt: string
  updatedAt: string
  client: { id: number; name: string; email: string }
  freelancer: { id: number; name: string; email: string }
  proposal: { id: string; budget: number | null; timeline: string | null; acceptedAt: string | null } | null
  milestones: ActiveJobMilestone[]
  messages: ActiveJobMessage[]
  deliverables: ActiveJobDeliverable[]
  latestActivityAt: string
  latestMessageAt: string | null
  paymentProgress: number
}

export interface ActiveJobsResponse {
  jobs: ActiveJobItem[]
  stats: {
    inProgress: number
    activeMilestones: number
    atRisk: number
    deadlinesThisWeek: number
    totalActiveEarnings: number
    completed: number
  }
  analytics: {
    completionRate: number
    milestoneCompletion: number
    overdueTasks: number
    activeEarnings: number
    statusCounts: { status: string; count: number }[]
    weeklyProductivity: { day: string; completed: number; messages: number }[]
  }
  filters: {
    clients: string[]
    priorities: string[]
  }
  pagination: {
    page: number
    pageSize: number
    total: number
    pageCount: number
  }
}
