import { NextRequest } from "next/server"
import { z, ZodError } from "zod"

import { ensureAcceptedProposalJobs } from "@/lib/active-jobs"
import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { proposalStatusSchema, serializeProposal } from "@/lib/proposals"

const withdrawSchema = z.object({
  id: z.string(),
  status: z.literal("WITHDRAWN"),
})

export async function PATCH(request: NextRequest) {
  const user = await requireUser()

  try {
    const rawBody = await request.json()
    const body =
      rawBody.status === "WITHDRAWN"
        ? withdrawSchema.parse(rawBody)
        : proposalStatusSchema.parse(rawBody)

    const existing = await prisma.proposal.findFirst({
      where: { id: body.id, freelancerId: user.id },
    })

    if (!existing) {
      return Response.json({ error: "Proposal not found." }, { status: 404 })
    }

    const now = new Date()
    const proposal = await prisma.proposal.update({
      where: { id: body.id },
      data: {
        status: body.status,
        clientMessage: "clientMessage" in body ? body.clientMessage : existing.clientMessage,
        meetingUrl: "meetingUrl" in body && body.meetingUrl ? body.meetingUrl : existing.meetingUrl,
        viewedAt: body.status === "VIEWED" && !existing.viewedAt ? now : existing.viewedAt,
        respondedAt:
          ["INTERVIEW", "ACCEPTED", "REJECTED"].includes(body.status) && !existing.respondedAt
            ? now
            : existing.respondedAt,
        interviewAt:
          body.status === "INTERVIEW" && "interviewAt" in body && body.interviewAt
            ? new Date(body.interviewAt)
            : existing.interviewAt,
        acceptedAt: body.status === "ACCEPTED" && !existing.acceptedAt ? now : existing.acceptedAt,
        withdrawnAt: body.status === "WITHDRAWN" ? now : existing.withdrawnAt,
        lastClientActivityAt: body.status !== "WITHDRAWN" ? now : existing.lastClientActivityAt,
      },
      include: { attachments: true, job: true },
    })

    if (proposal.status === "ACCEPTED") {
      await ensureAcceptedProposalJobs(user.id)
    }

    return Response.json({ proposal: serializeProposal(proposal) })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid status update." }, { status: 400 })
    }

    return Response.json({ error: "Unable to update proposal status." }, { status: 500 })
  }
}

export { PATCH as POST }
