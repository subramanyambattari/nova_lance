import { NextRequest } from "next/server"
import { ZodError } from "zod"

import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { proposalMutationSchema, serializeProposal } from "@/lib/proposals"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const user = await requireUser()
  const limited = rateLimit(`proposal:create:${user.id}`, 10, 60_000)

  if (!limited.ok) {
    return Response.json({ error: "Too many proposal changes. Try again shortly." }, { status: 429 })
  }

  try {
    const body = proposalMutationSchema.parse(await request.json())
    const status = body.submit ? "SUBMITTED" : "DRAFT"
    const submittedAt = body.submit ? new Date() : null
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

    if (jobId) {
      const duplicate = await prisma.proposal.findFirst({
        where: {
          freelancerId: user.id,
          jobId,
          status: { not: "WITHDRAWN" },
        },
      })

      if (duplicate) {
        return Response.json({ error: "You already have a proposal for this job." }, { status: 409 })
      }
    }

    const proposal = await prisma.proposal.create({
      data: {
        freelancerId: user.id,
        jobId,
        externalJobId,
        externalJobUrl: body.externalJobUrl || undefined,
        coverLetter: body.coverLetter.trim(),
        budget: body.budget,
        timeline: body.timeline,
        portfolioLinks: body.portfolioLinks,
        resumeUrl: body.resumeUrl || undefined,
        status,
        submittedAt,
        attachments: {
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

    return Response.json({ error: "Unable to create proposal." }, { status: 500 })
  }
}
