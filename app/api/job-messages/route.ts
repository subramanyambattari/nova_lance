import { NextRequest } from "next/server"
import { ZodError } from "zod"

import { assertJobAccess, sendMessageSchema } from "@/lib/active-jobs"
import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const jobId = request.nextUrl.searchParams.get("jobId")
  const cursor = request.nextUrl.searchParams.get("cursor")
  const take = Math.min(Number(request.nextUrl.searchParams.get("pageSize") ?? 40), 100)

  if (!jobId) {
    return Response.json({ error: "jobId is required." }, { status: 400 })
  }

  await assertJobAccess(user.id, jobId)
  const messages = await prisma.jobMessage.findMany({
    where: { jobId },
    include: { sender: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })

  const nextCursor = messages.length > take ? messages[take].id : null
  return Response.json({ messages: messages.slice(0, take).reverse(), nextCursor })
}

export async function POST(request: NextRequest) {
  const user = await requireUser()
  const limited = rateLimit(`job-message:create:${user.id}`, 80, 60_000)

  if (!limited.ok) {
    return Response.json({ error: "Too many messages." }, { status: 429 })
  }

  try {
    const body = sendMessageSchema.parse(await request.json())
    await assertJobAccess(user.id, body.jobId)

    const message = await prisma.jobMessage.create({
      data: {
        jobId: body.jobId,
        senderId: user.id,
        message: body.message,
        fileUrl: body.fileUrl || undefined,
      },
      include: { sender: { select: { id: true, name: true, email: true } } },
    })

    await prisma.activeJob.update({ where: { id: body.jobId }, data: { updatedAt: new Date() } })
    return Response.json({ message }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid message." }, { status: 400 })
    }

    return Response.json({ error: "Unable to send message." }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const user = await requireUser()
  const jobId = request.nextUrl.searchParams.get("jobId")
  const limited = rateLimit(`job-message:read:${user.id}`, 120, 60_000)

  if (!limited.ok) {
    return Response.json({ error: "Too many read receipt updates." }, { status: 429 })
  }

  if (!jobId) {
    return Response.json({ error: "jobId is required." }, { status: 400 })
  }

  try {
    await assertJobAccess(user.id, jobId)
    const result = await prisma.jobMessage.updateMany({
      where: {
        jobId,
        senderId: { not: user.id },
        readAt: null,
      },
      data: { readAt: new Date() },
    })

    return Response.json({ updated: result.count })
  } catch {
    return Response.json({ error: "Unable to update read receipts." }, { status: 500 })
  }
}
