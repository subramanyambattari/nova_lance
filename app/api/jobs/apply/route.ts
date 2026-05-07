import { NextRequest } from "next/server"
import { z } from "zod"

import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"

const applySchema = z.object({
  jobId: z.string(),
  source: z.string(),
  externalId: z.string().optional(),
  externalUrl: z.string().optional(),
  coverLetter: z.string().min(80, "Cover letter must be at least 80 characters."),
  budget: z.coerce.number().min(50),
  timeline: z.string().min(2),
  portfolioLinks: z.string().optional().default(""),
  resumeUrl: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const user = await requireUser()
  const limited = rateLimit(`apply:${user.id}`, 8, 60_000)
  if (!limited.ok) {
    return Response.json(
      { error: "Proposal rate limit reached. Try again shortly." },
      { status: 429 }
    )
  }

  const body = applySchema.parse(await request.json())
  const isInternal = body.source === "internal"

  const duplicate = await prisma.proposal.findFirst({
    where: isInternal
      ? { freelancerId: user.id, jobId: body.jobId }
      : { freelancerId: user.id, externalJobId: body.externalId ?? body.jobId },
  })

  if (duplicate) {
    return Response.json(
      { error: "You already submitted a proposal for this job." },
      { status: 409 }
    )
  }

  const proposal = await prisma.proposal.create({
    data: {
      freelancerId: user.id,
      jobId: isInternal ? body.jobId : undefined,
      externalJobId: isInternal ? undefined : body.externalId ?? body.jobId,
      externalJobUrl: body.externalUrl,
      coverLetter: body.coverLetter,
      budget: body.budget,
      timeline: body.timeline,
      portfolioLinks: body.portfolioLinks
        .split(/\n|,/)
        .map((link) => link.trim())
        .filter(Boolean),
      resumeUrl: body.resumeUrl,
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  })

  return Response.json({ proposal })
}
