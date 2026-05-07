import { NextRequest } from "next/server"
import { ZodError } from "zod"

import { assertJobAccess, completeMilestoneSchema, createMilestoneSchema, recalculateJobProgress } from "@/lib/active-jobs"
import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const jobId = request.nextUrl.searchParams.get("jobId")

  if (!jobId) {
    return Response.json({ error: "jobId is required." }, { status: 400 })
  }

  await assertJobAccess(user.id, jobId)
  const milestones = await prisma.milestone.findMany({
    where: { jobId },
    orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
  })

  return Response.json({ milestones })
}

export async function POST(request: NextRequest) {
  const user = await requireUser()
  const limited = rateLimit(`milestone:create:${user.id}`, 30, 60_000)

  if (!limited.ok) {
    return Response.json({ error: "Too many milestone updates." }, { status: 429 })
  }

  try {
    const body = createMilestoneSchema.parse(await request.json())
    await assertJobAccess(user.id, body.jobId)

    const milestone = await prisma.milestone.create({
      data: {
        jobId: body.jobId,
        title: body.title,
        description: body.description,
        amount: body.amount,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      },
    })
    await recalculateJobProgress(body.jobId)

    return Response.json({ milestone }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid milestone." }, { status: 400 })
    }

    return Response.json({ error: "Unable to save milestone." }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const user = await requireUser()
  const limited = rateLimit(`milestone:update:${user.id}`, 60, 60_000)

  if (!limited.ok) {
    return Response.json({ error: "Too many milestone updates." }, { status: 429 })
  }

  try {
    const body = completeMilestoneSchema.parse(await request.json())
    const milestone = await prisma.milestone.findUnique({ where: { id: body.id } })

    if (!milestone) {
      return Response.json({ error: "Milestone not found." }, { status: 404 })
    }

    await assertJobAccess(user.id, milestone.jobId)
    const updated = await prisma.milestone.update({
      where: { id: body.id },
      data: {
        completed: body.completed,
        completedAt: body.completed ? new Date() : null,
        paymentStatus: body.completed ? "RELEASED" : "PENDING",
      },
    })
    await recalculateJobProgress(milestone.jobId)

    return Response.json({ milestone: updated })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid milestone update." }, { status: 400 })
    }

    return Response.json({ error: "Unable to update milestone." }, { status: 500 })
  }
}
