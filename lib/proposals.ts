import { z } from "zod"

import { prisma } from "@/lib/prisma"

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function optionalUrl(message: string) {
  return z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || isValidUrl(value), message)
}

export const proposalStatuses = [
  "DRAFT",
  "SUBMITTED",
  "VIEWED",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
] as const

export const proposalMutationSchema = z.object({
  id: z.string().optional(),
  jobId: z.string().optional(),
  externalJobId: z.string().optional(),
  externalJobUrl: optionalUrl("Enter a valid external job URL."),
  coverLetter: z.string().optional().default(""),
  budget: z.coerce.number().min(1).optional().nullable(),
  timeline: z.string().optional().nullable(),
  portfolioLinks: z
    .array(z.string().trim().refine((value) => isValidUrl(value), "Enter valid portfolio URLs."))
    .optional()
    .default([]),
  resumeUrl: optionalUrl("Enter a valid resume URL."),
  attachments: z
    .array(
      z.object({
        fileName: z.string().min(1),
        fileUrl: z.string().trim().refine((value) => isValidUrl(value), "Enter a valid attachment URL."),
      })
    )
    .optional()
    .default([]),
  submit: z.boolean().optional().default(false),
}).superRefine((value, context) => {
  const coverLetterLength = value.coverLetter.trim().length

  if (value.submit && coverLetterLength < 80) {
    context.addIssue({
      code: "custom",
      path: ["coverLetter"],
      message: "Submitted proposals need at least 80 characters.",
    })
  }

  if (!value.submit && coverLetterLength < 20) {
    context.addIssue({
      code: "custom",
      path: ["coverLetter"],
      message: "Drafts need at least 20 characters.",
    })
  }
})

export const proposalStatusSchema = z.object({
  id: z.string(),
  status: z.enum(proposalStatuses),
  clientMessage: z.string().optional(),
  meetingUrl: z.string().url().optional().or(z.literal("")),
  interviewAt: z.string().datetime().optional(),
})

export function serializeProposal(proposal: ProposalWithRelations) {
  return {
    ...proposal,
    createdAt: proposal.createdAt.toISOString(),
    updatedAt: proposal.updatedAt.toISOString(),
    submittedAt: proposal.submittedAt?.toISOString() ?? null,
    viewedAt: proposal.viewedAt?.toISOString() ?? null,
    respondedAt: proposal.respondedAt?.toISOString() ?? null,
    interviewAt: proposal.interviewAt?.toISOString() ?? null,
    acceptedAt: proposal.acceptedAt?.toISOString() ?? null,
    withdrawnAt: proposal.withdrawnAt?.toISOString() ?? null,
    lastClientActivityAt: proposal.lastClientActivityAt?.toISOString() ?? null,
  }
}

export async function getProposalDashboard(freelancerId: number) {
  const proposals = await prisma.proposal.findMany({
    where: { freelancerId },
    orderBy: { updatedAt: "desc" },
    include: {
      attachments: true,
      job: true,
    },
  })

  const submittedSet = proposals.filter((proposal) => proposal.status !== "DRAFT")
  const respondedSet = submittedSet.filter((proposal) =>
    ["VIEWED", "INTERVIEW", "ACCEPTED", "REJECTED"].includes(proposal.status)
  )
  const interviewSet = proposals.filter((proposal) => proposal.status === "INTERVIEW")
  const acceptedSet = proposals.filter((proposal) => proposal.status === "ACCEPTED")
  const rejectedSet = proposals.filter((proposal) => proposal.status === "REJECTED")
  const responseTimes = proposals
    .filter((proposal) => proposal.submittedAt && proposal.respondedAt)
    .map((proposal) => proposal.respondedAt!.getTime() - proposal.submittedAt!.getTime())

  const stats = {
    submitted: submittedSet.length,
    drafts: proposals.filter((proposal) => proposal.status === "DRAFT").length,
    responseRate: percent(respondedSet.length, submittedSet.length),
    interviewRequests: interviewSet.length,
    accepted: acceptedSet.length,
    rejected: rejectedSet.length,
    earningsPotential: submittedSet.reduce((sum, proposal) => sum + (proposal.budget ?? proposal.job?.budget ?? 0), 0),
    interviewRate: percent(interviewSet.length, submittedSet.length),
    acceptanceRate: percent(acceptedSet.length, submittedSet.length),
    averageResponseHours: responseTimes.length
      ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length / 36_000) / 100
      : 0,
  }

  const activity = proposalStatuses.map((status) => ({
    status,
    count: proposals.filter((proposal) => proposal.status === status).length,
  }))

  return {
    proposals: proposals.map(serializeProposal),
    stats,
    activity,
  }
}

function percent(value: number, total: number) {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

type ProposalWithRelations = Awaited<
  ReturnType<typeof prisma.proposal.findMany>
>[number] & {
  attachments: Array<{ id: string; fileName: string; fileUrl: string; proposalId: string }>
  job: Awaited<ReturnType<typeof prisma.job.findFirst>>
}
