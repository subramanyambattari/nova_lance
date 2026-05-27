import { z } from "zod"

import type { ActiveJobGetPayload } from "@/app/generated/prisma/models/ActiveJob"
import { isDatabaseUnavailableError, withTimeout } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const jobStatuses = ["IN_PROGRESS", "REVIEW", "COMPLETED", "BLOCKED", "AT_RISK"] as const
export const paymentStatuses = ["PENDING", "FUNDED", "RELEASED", "DISPUTED"] as const
export const deliverableStatuses = ["SUBMITTED", "REVISION_REQUESTED", "APPROVED"] as const

const activeJobInclude = {
  client: { select: { id: true, name: true, email: true } },
  freelancer: { select: { id: true, name: true, email: true } },
  proposal: { select: { id: true, budget: true, timeline: true, acceptedAt: true } },
  milestones: { orderBy: [{ dueDate: "asc" as const }, { createdAt: "asc" as const }] },
  messages: {
    orderBy: { createdAt: "desc" as const },
    take: 20,
    include: { sender: { select: { id: true, name: true, email: true } } },
  },
  deliverables: { orderBy: { uploadedAt: "desc" as const } },
}

type ActiveJobRecord = ActiveJobGetPayload<{ include: typeof activeJobInclude }>

export const activeJobQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(["ALL", ...jobStatuses]).default("ALL"),
  priority: z.string().optional(),
  client: z.string().optional(),
  sort: z.enum(["updated", "deadline", "budget-high", "budget-low"]).default("updated"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
})

export const createMilestoneSchema = z.object({
  jobId: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
  amount: z.coerce.number().nonnegative().optional(),
  dueDate: z.string().optional(),
})

export const completeMilestoneSchema = z.object({
  id: z.string(),
  completed: z.boolean(),
})

export const sendMessageSchema = z.object({
  jobId: z.string(),
  message: z.string().min(1).max(4000),
  fileUrl: z.string().optional().or(z.literal("")),
})

export const uploadDeliverableSchema = z.object({
  jobId: z.string(),
  title: z.string().min(2),
  fileUrl: z.string(),
  fileName: z.string().optional(),
  fileType: z.string().optional(),
  revisionNotes: z.string().optional(),
})

export const updateJobSchema = z.object({
  id: z.string(),
  progress: z.coerce.number().int().min(0).max(100).optional(),
  status: z.enum(jobStatuses).optional(),
  priority: z.string().optional(),
  deadline: z.string().optional(),
})

export type ActiveJobsResponse = Awaited<ReturnType<typeof getActiveJobsDashboard>>
export type ActiveJobDetail = Awaited<ReturnType<typeof getActiveJobDetail>>

export async function getActiveJobsDashboard(userId: number, rawQuery: Record<string, string | string[] | undefined> = {}) {
  await withTimeout(ensureAcceptedProposalJobs(userId), 2500, "Accepted proposal sync")

  const query = activeJobQuerySchema.parse(flattenQuery(rawQuery))
  const where = buildActiveJobWhere(userId, query)
  const orderBy =
    query.sort === "deadline"
      ? [{ deadline: "asc" as const }, { updatedAt: "desc" as const }]
      : query.sort === "budget-high"
        ? [{ budget: "desc" as const }, { updatedAt: "desc" as const }]
        : query.sort === "budget-low"
          ? [{ budget: "asc" as const }, { updatedAt: "desc" as const }]
          : [{ updatedAt: "desc" as const }]

  const [jobs, total, allJobs] = await withTimeout(
    prisma.$transaction([
      prisma.activeJob.findMany({
        where,
        include: activeJobInclude,
        orderBy,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      prisma.activeJob.count({ where }),
      prisma.activeJob.findMany({
        where: { OR: [{ freelancerId: userId }, { clientId: userId }] },
        include: activeJobInclude,
        orderBy: { updatedAt: "desc" },
      }),
    ]),
    2500,
    "Active jobs dashboard query"
  )

  const serializedAll = allJobs.map(serializeActiveJob)

  return {
    jobs: jobs.map(serializeActiveJob),
    stats: calculateStats(serializedAll),
    analytics: calculateAnalytics(serializedAll),
    filters: {
      clients: Array.from(new Set(serializedAll.map((job) => job.client.name))).sort(),
      priorities: Array.from(new Set(serializedAll.map((job) => job.priority).filter(Boolean) as string[])).sort(),
    },
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      pageCount: Math.max(1, Math.ceil(total / query.pageSize)),
    },
  }
}

export async function getActiveJobsDashboardOrFallback(
  userId?: number,
  rawQuery: Record<string, string | string[] | undefined> = {}
) {
  if (!userId) return emptyActiveJobsDashboard(rawQuery)

  try {
    return await getActiveJobsDashboard(userId, rawQuery)
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      console.error("Unable to load active jobs dashboard.", error)
    }

    return emptyActiveJobsDashboard(rawQuery)
  }
}

export function emptyActiveJobsDashboard(rawQuery: Record<string, string | string[] | undefined> = {}) {
  const query = activeJobQuerySchema.parse(flattenQuery(rawQuery))

  return {
    jobs: [],
    stats: {
      inProgress: 0,
      activeMilestones: 0,
      atRisk: 0,
      deadlinesThisWeek: 0,
      totalActiveEarnings: 0,
      completed: 0,
    },
    analytics: {
      completionRate: 0,
      milestoneCompletion: 0,
      overdueTasks: 0,
      activeEarnings: 0,
      statusCounts: jobStatuses.map((status) => ({ status: status.replace("_", " "), count: 0 })),
      weeklyProductivity: Array.from({ length: 7 }).map((_, index) => {
        const day = new Date()
        day.setDate(day.getDate() - (6 - index))
        return {
          day: day.toLocaleDateString("en", { weekday: "short" }),
          completed: 0,
          messages: 0,
        }
      }),
    },
    filters: {
      clients: [],
      priorities: [],
    },
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total: 0,
      pageCount: 1,
    },
  }
}

export async function getActiveJobDetail(userId: number, id: string) {
  await withTimeout(ensureAcceptedProposalJobs(userId), 2500, "Accepted proposal sync")

  const job = await prisma.activeJob.findFirst({
    where: { id, OR: [{ freelancerId: userId }, { clientId: userId }] },
    include: {
      ...activeJobInclude,
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, email: true } } },
      },
    },
  })

  return job ? serializeActiveJob(job) : null
}

export async function ensureAcceptedProposalJobs(userId: number) {
  const proposals = await prisma.proposal.findMany({
    where: {
      freelancerId: userId,
      status: "ACCEPTED",
      activeJob: null,
      job: { clientId: { not: null } },
    },
    include: { job: true },
  })

  for (const proposal of proposals) {
    if (!proposal.job?.clientId) continue

    const budget = proposal.budget ?? proposal.job.budget ?? null
    await prisma.activeJob.create({
      data: {
        title: proposal.job.title,
        description: proposal.job.description,
        budget,
        deadline: inferDeadline(proposal.timeline),
        priority: "Normal",
        proposalId: proposal.id,
        freelancerId: proposal.freelancerId,
        clientId: proposal.job.clientId,
        paymentStatus: budget ? "FUNDED" : "PENDING",
        milestones: {
          create: buildInitialMilestones(proposal.job.title, budget, inferDeadline(proposal.timeline)),
        },
        messages: proposal.clientMessage
          ? {
              create: {
                message: proposal.clientMessage,
                senderId: proposal.job.clientId,
              },
            }
          : undefined,
      },
    })
  }
}

export async function assertJobAccess(userId: number, jobId: string) {
  const job = await prisma.activeJob.findFirst({
    where: { id: jobId, OR: [{ freelancerId: userId }, { clientId: userId }] },
    select: { id: true, freelancerId: true, clientId: true },
  })

  if (!job) {
    throw new Error("Active job not found.")
  }

  return job
}

export async function recalculateJobProgress(jobId: string) {
  const milestones = await prisma.milestone.findMany({ where: { jobId } })
  const progress = milestones.length
    ? Math.round((milestones.filter((milestone) => milestone.completed).length / milestones.length) * 100)
    : 0
  const status = progress >= 100 ? "REVIEW" : "IN_PROGRESS"

  return prisma.activeJob.update({
    where: { id: jobId },
    data: { progress, status },
  })
}

export function serializeActiveJob(job: ActiveJobRecord) {
  const milestones: Array<{
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
  }> = (job.milestones ?? []).map((milestone) => ({
    id: milestone.id,
    title: milestone.title,
    description: milestone.description,
    amount: milestone.amount,
    dueDate: milestone.dueDate?.toISOString() ?? null,
    completed: milestone.completed,
    completedAt: milestone.completedAt?.toISOString() ?? null,
    paymentStatus: milestone.paymentStatus,
    overdue: Boolean(milestone.dueDate && !milestone.completed && milestone.dueDate < new Date()),
    createdAt: milestone.createdAt.toISOString(),
    updatedAt: milestone.updatedAt.toISOString(),
  }))
  const deliverables = (job.deliverables ?? []).map((deliverable) => ({
    id: deliverable.id,
    title: deliverable.title,
    fileUrl: deliverable.fileUrl,
    fileName: deliverable.fileName,
    fileType: deliverable.fileType,
    version: deliverable.version,
    revisionNotes: deliverable.revisionNotes,
    approvalStatus: deliverable.approvalStatus,
    uploadedAt: deliverable.uploadedAt.toISOString(),
    updatedAt: deliverable.updatedAt.toISOString(),
  }))
  const messages: Array<{
    id: string
    message: string
    fileUrl: string | null
    readAt: string | null
    createdAt: string
    sender: { id: number; name: string; email: string }
  }> = (job.messages ?? []).map((message) => ({
    id: message.id,
    message: message.message,
    fileUrl: message.fileUrl,
    readAt: message.readAt?.toISOString() ?? null,
    createdAt: message.createdAt.toISOString(),
    sender: {
      id: message.sender.id,
      name: message.sender.name ?? message.sender.email,
      email: message.sender.email,
    },
  }))
  const latestMessage =
    [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ?? null
  const completedAmount = milestones
    .filter((milestone) => milestone.completed)
    .reduce((sum, milestone) => sum + (milestone.amount ?? 0), 0)

  return {
    id: job.id,
    title: job.title,
    description: job.description,
    budget: job.budget,
    progress: job.progress,
    status: job.status,
    priority: job.priority,
    deadline: job.deadline?.toISOString() ?? null,
    paymentStatus: job.paymentStatus,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    client: {
      id: job.client.id,
      name: job.client.name ?? job.client.email,
      email: job.client.email,
    },
    freelancer: {
      id: job.freelancer.id,
      name: job.freelancer.name ?? job.freelancer.email,
      email: job.freelancer.email,
    },
    proposal: job.proposal
      ? {
          id: job.proposal.id,
          budget: job.proposal.budget,
          timeline: job.proposal.timeline,
          acceptedAt: job.proposal.acceptedAt?.toISOString() ?? null,
        }
      : null,
    milestones,
    messages,
    deliverables,
    latestActivityAt: [job.updatedAt, latestMessage?.createdAt ? new Date(latestMessage.createdAt) : null]
      .filter((value): value is Date => value instanceof Date)
      .sort((a, b) => b.getTime() - a.getTime())[0]!.toISOString(),
    latestMessageAt: latestMessage?.createdAt ?? null,
    paymentProgress: job.budget ? Math.round((completedAmount / job.budget) * 100) : 0,
  }
}

function buildActiveJobWhere(userId: number, query: z.infer<typeof activeJobQuerySchema>) {
  return {
    OR: [{ freelancerId: userId }, { clientId: userId }],
    ...(query.status !== "ALL" ? { status: query.status } : {}),
    ...(query.priority ? { priority: query.priority } : {}),
    ...(query.client ? { client: { name: query.client } } : {}),
    ...(query.q
      ? {
          AND: [
            {
              OR: [
                { title: { contains: query.q, mode: "insensitive" as const } },
                { description: { contains: query.q, mode: "insensitive" as const } },
                { client: { name: { contains: query.q, mode: "insensitive" as const } } },
              ],
            },
          ],
        }
      : {}),
  }
}

function calculateStats(jobs: ReturnType<typeof serializeActiveJob>[]) {
  const now = new Date()
  const weekEnd = new Date(now)
  weekEnd.setDate(now.getDate() + 7)

  return {
    inProgress: jobs.filter((job) => job.status === "IN_PROGRESS").length,
    activeMilestones: jobs.reduce((sum, job) => sum + job.milestones.filter((milestone) => !milestone.completed).length, 0),
    atRisk: jobs.filter((job) => job.status === "AT_RISK" || job.milestones.some((milestone) => milestone.overdue)).length,
    deadlinesThisWeek: jobs.filter((job) => {
      if (!job.deadline) return false
      const deadline = new Date(job.deadline)
      return deadline >= now && deadline <= weekEnd
    }).length,
    totalActiveEarnings: jobs
      .filter((job) => job.status !== "COMPLETED")
      .reduce((sum, job) => sum + (job.budget ?? 0), 0),
    completed: jobs.filter((job) => job.status === "COMPLETED").length,
  }
}

function calculateAnalytics(jobs: ReturnType<typeof serializeActiveJob>[]) {
  const totalMilestones = jobs.reduce((sum, job) => sum + job.milestones.length, 0)
  const completedMilestones = jobs.reduce(
    (sum, job) => sum + job.milestones.filter((milestone) => milestone.completed).length,
    0
  )
  const statusCounts = jobStatuses.map((status) => ({
    status: status.replace("_", " "),
    count: jobs.filter((job) => job.status === status).length,
  }))

  return {
    completionRate: jobs.length ? Math.round(jobs.reduce((sum, job) => sum + job.progress, 0) / jobs.length) : 0,
    milestoneCompletion: totalMilestones ? Math.round((completedMilestones / totalMilestones) * 100) : 0,
    overdueTasks: jobs.reduce((sum, job) => sum + job.milestones.filter((milestone) => milestone.overdue).length, 0),
    activeEarnings: jobs.reduce((sum, job) => sum + (job.budget ?? 0), 0),
    statusCounts,
    weeklyProductivity: Array.from({ length: 7 }).map((_, index) => {
      const day = new Date()
      day.setDate(day.getDate() - (6 - index))
      const key = day.toISOString().slice(0, 10)
      return {
        day: day.toLocaleDateString("en", { weekday: "short" }),
        completed: jobs.reduce(
          (sum, job) => sum + job.milestones.filter((milestone) => milestone.completedAt?.startsWith(key)).length,
          0
        ),
        messages: jobs.reduce((sum, job) => sum + job.messages.filter((message) => message.createdAt.startsWith(key)).length, 0),
      }
    }),
  }
}

function buildInitialMilestones(title: string, budget: number | null, deadline: Date | null) {
  const amount = budget ? Math.round((budget / 3) * 100) / 100 : undefined
  const firstDue = deadline ? new Date(deadline) : new Date()
  firstDue.setDate(firstDue.getDate() - 14)
  const secondDue = deadline ? new Date(deadline) : new Date()
  secondDue.setDate(secondDue.getDate() - 7)

  return [
    { title: `${title} kickoff`, description: "Confirm scope, access, and delivery plan.", amount, dueDate: firstDue },
    { title: "Primary delivery", description: "Submit the core project deliverable for review.", amount, dueDate: secondDue },
    { title: "Final handoff", description: "Resolve feedback and complete final delivery.", amount, dueDate: deadline ?? undefined },
  ]
}

function inferDeadline(timeline?: string | null) {
  if (!timeline) return null

  const lower = timeline.toLowerCase()
  const match = lower.match(/(\d+)/)
  const amount = match ? Number(match[1]) : 14
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + (lower.includes("month") ? amount * 30 : lower.includes("week") ? amount * 7 : amount))
  return deadline
}

function flattenQuery(rawQuery: Record<string, string | string[] | undefined>) {
  return Object.fromEntries(
    Object.entries(rawQuery).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
  )
}
