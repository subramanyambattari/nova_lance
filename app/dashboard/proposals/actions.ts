"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getProposalDashboard, proposalMutationSchema, proposalStatusSchema, serializeProposal } from "@/lib/proposals"

export async function fetchProposals() {
  const user = await requireUser()
  return getProposalDashboard(user.id)
}

export async function createProposal(input: unknown) {
  const user = await requireUser()
  const body = proposalMutationSchema.parse(input)
  const proposal = await prisma.proposal.create({
    data: {
      freelancerId: user.id,
      jobId: body.jobId,
      externalJobId: body.externalJobId,
      externalJobUrl: body.externalJobUrl || undefined,
      coverLetter: body.coverLetter.trim(),
      budget: body.budget,
      timeline: body.timeline,
      portfolioLinks: body.portfolioLinks,
      resumeUrl: body.resumeUrl || undefined,
      status: body.submit ? "SUBMITTED" : "DRAFT",
      submittedAt: body.submit ? new Date() : null,
      attachments: { create: body.attachments },
    },
    include: { attachments: true, job: true },
  })

  revalidateProposalPaths(proposal.id)
  return serializeProposal(proposal)
}

export async function saveDraft(input: unknown) {
  return createProposal({ ...(input as Record<string, unknown>), submit: false })
}

export async function deleteProposal(id: string) {
  const user = await requireUser()
  const proposal = await prisma.proposal.findFirst({
    where: { id, freelancerId: user.id },
  })

  if (!proposal) {
    throw new Error("Proposal not found.")
  }

  await prisma.proposal.delete({ where: { id } })
  revalidateProposalPaths(id)
  return { ok: true }
}

export async function updateProposalStatus(input: unknown) {
  const user = await requireUser()
  const body = proposalStatusSchema.parse(input)
  const existing = await prisma.proposal.findFirst({
    where: { id: body.id, freelancerId: user.id },
  })

  if (!existing) {
    throw new Error("Proposal not found.")
  }

  const now = new Date()
  const proposal = await prisma.proposal.update({
    where: { id: body.id },
    data: {
      status: body.status,
      clientMessage: body.clientMessage,
      meetingUrl: body.meetingUrl || existing.meetingUrl,
      viewedAt: body.status === "VIEWED" && !existing.viewedAt ? now : existing.viewedAt,
      respondedAt:
        ["INTERVIEW", "ACCEPTED", "REJECTED"].includes(body.status) && !existing.respondedAt
          ? now
          : existing.respondedAt,
      interviewAt: body.status === "INTERVIEW" && body.interviewAt ? new Date(body.interviewAt) : existing.interviewAt,
      acceptedAt: body.status === "ACCEPTED" && !existing.acceptedAt ? now : existing.acceptedAt,
      withdrawnAt: body.status === "WITHDRAWN" ? now : existing.withdrawnAt,
      lastClientActivityAt: body.status !== "WITHDRAWN" ? now : existing.lastClientActivityAt,
    },
    include: { attachments: true, job: true },
  })

  revalidateProposalPaths(proposal.id)
  return serializeProposal(proposal)
}

function revalidateProposalPaths(id: string) {
  revalidatePath("/proposals")
  revalidatePath("/dashboard/proposals")
  revalidatePath(`/dashboard/proposals/${id}`)
}
