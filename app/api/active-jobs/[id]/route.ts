import { NextRequest } from "next/server"
import { ZodError } from "zod"

import { getActiveJobDetail, updateJobSchema } from "@/lib/active-jobs"
import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const { id } = await params
  const job = await getActiveJobDetail(user.id, id)

  if (!job) {
    return Response.json({ error: "Active job not found." }, { status: 404 })
  }

  return Response.json({ job })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const limited = rateLimit(`active-jobs:update:${user.id}`, 40, 60_000)

  if (!limited.ok) {
    return Response.json({ error: "Too many active job updates." }, { status: 429 })
  }

  try {
    const { id } = await params
    const body = updateJobSchema.parse({ ...(await request.json()), id })
    const existing = await prisma.activeJob.findFirst({
      where: { id, OR: [{ freelancerId: user.id }, { clientId: user.id }] },
      select: { id: true },
    })

    if (!existing) {
      return Response.json({ error: "Active job not found." }, { status: 404 })
    }

    await prisma.activeJob.update({
      where: { id },
      data: {
        progress: body.progress,
        status: body.status,
        priority: body.priority,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
      },
    })

    const job = await getActiveJobDetail(user.id, id)
    return Response.json({ job })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid active job update." }, { status: 400 })
    }

    return Response.json({ error: "Unable to update active job." }, { status: 500 })
  }
}
