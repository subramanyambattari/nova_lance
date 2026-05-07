import { NextRequest } from "next/server"

import { requireUser } from "@/lib/auth"
import { getUnifiedJobs, jobSearchSchema } from "@/lib/jobs"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await requireUser()
  const { id } = await context.params
  const decodedId = decodeURIComponent(id)

  if (!decodedId.startsWith("external:")) {
    const job = await prisma.job.findUnique({
      where: { id: decodedId },
      include: {
        client: true,
        _count: { select: { proposals: true } },
      },
    })
    if (!job) return Response.json({ error: "Job not found." }, { status: 404 })

    return Response.json({
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        description: job.description,
        budget: job.budget,
        salary: job.salary ?? (job.budget ? `$${job.budget.toLocaleString()} fixed` : "Budget not listed"),
        skills: job.skills,
        type: job.type,
        experience: job.experience,
        location: job.location,
        remote: job.remote,
        verifiedClient: job.verifiedClient,
        source: "internal",
        postedAt: job.postedAt.toISOString(),
        proposalCount: job._count.proposals,
        client: {
          name: job.client?.name ?? "Nova Lance client",
          email: job.client?.email,
        },
      },
    })
  }

  const data = await getUnifiedJobs(
    jobSearchSchema.parse({ q: decodedId.split(":").slice(-1)[0], limit: 30 }),
    user.id
  )
  const job = data.jobs.find((item) => item.id === decodedId)
  if (!job) return Response.json({ error: "Job not found." }, { status: 404 })

  return Response.json({
    job: {
      ...job,
      proposalCount: null,
      client: { name: job.company, email: null },
    },
  })
}
