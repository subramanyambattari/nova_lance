import { NextRequest } from "next/server"
import { z, ZodError } from "zod"

import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { proposalMutationSchema, serializeProposal } from "@/lib/proposals"
import { rateLimit } from "@/lib/rate-limit"

export async function PATCH(request: NextRequest) {
  const user = await requireUser()
  const limited = rateLimit(`proposal:update:${user.id}`, 20, 60_000)

  if (!limited.ok) {
    return Response.json({ error: "Too many proposal updates. Try again shortly." }, { status: 429 })
  }

  try {
    const body = proposalMutationSchema.extend({ id: z.string() }).parse(await request.json())
    const existing = await prisma.proposal.findFirst({
      where: { id: body.id, freelancerId: user.id },
    })

    if (!existing) {
      return Response.json({ error: "Proposal not found." }, { status: 404 })
    }

    if (!["DRAFT", "SUBMITTED", "VIEWED"].includes(existing.status)) {
      return Response.json({ error: "Only draft, submitted, or viewed proposals can be edited." }, { status: 409 })
    }

    let jobId = body.jobId || undefined
    let externalJobId = body.externalJobId || undefined

    if (jobId) {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { id: true },
      })

      if (!job) {
        externalJobId = externalJobId || jobId
        jobId = undefined
      }
    }

    const nextStatus = body.submit ? "SUBMITTED" : existing.status === "DRAFT" ? "DRAFT" : existing.status

    const proposal = await prisma.proposal.update({
      where: { id: body.id },
      data: {
        jobId: jobId || null,
        externalJobId: externalJobId || null,
        externalJobUrl: body.externalJobUrl || null,
        coverLetter: body.coverLetter.trim(),
        budget: body.budget,
        timeline: body.timeline,
        portfolioLinks: body.portfolioLinks,
        resumeUrl: body.resumeUrl || null,
        status: nextStatus,
        submittedAt: body.submit && !existing.submittedAt ? new Date() : existing.submittedAt,
        attachments: {
          deleteMany: {},
          create: body.attachments,
        },
      },
      include: { attachments: true, job: true },
    })

    return Response.json({ proposal: serializeProposal(proposal) })
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0]
      const field = issue?.path.join(".")
      const message = [field, issue?.message].filter(Boolean).join(": ")

      return Response.json({ error: message || "Invalid proposal." }, { status: 400 })
    }

    return Response.json({ error: "Unable to update proposal." }, { status: 500 })
  }
}

export { PATCH as POST }
