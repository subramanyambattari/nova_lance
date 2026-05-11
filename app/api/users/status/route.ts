import { NextRequest } from "next/server"
import { ZodError } from "zod"

import { requireUser } from "@/lib/auth"
import { getConversationParticipantIds, typingSchema } from "@/lib/messages"
import { prisma } from "@/lib/prisma"
import { publishRealtime } from "@/lib/realtime"

export const dynamic = "force-dynamic"

export async function GET() {
  const user = await requireUser()
  const presence = await prisma.userPresence.findUnique({ where: { userId: user.id } })

  return Response.json({
    user: { id: user.id, name: user.name, email: user.email },
    presence,
  })
}

export async function POST(request: NextRequest) {
  const user = await requireUser()
  const now = new Date()

  await prisma.userPresence.upsert({
    where: { userId: user.id },
    update: { online: true, lastActiveAt: now },
    create: { userId: user.id, online: true, lastActiveAt: now },
  })

  try {
    const body = typingSchema.parse(await request.json())
    const participantIds = await getConversationParticipantIds(body.conversationId)

    if (!participantIds.includes(user.id)) {
      return Response.json({ error: "Conversation not found." }, { status: 404 })
    }

    await publishRealtime(
      participantIds.filter((participantId) => participantId !== user.id),
      {
        type: body.typing ? "typing-start" : "typing-stop",
        payload: {
          conversationId: body.conversationId,
          user: { id: user.id, name: user.name, email: user.email },
        },
      }
    )

    return Response.json({ ok: true })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid status update." }, { status: 400 })
    }

    return Response.json({ error: "Unable to update status." }, { status: 500 })
  }
}

export async function PATCH() {
  const user = await requireUser()
  const now = new Date()

  const presence = await prisma.userPresence.upsert({
    where: { userId: user.id },
    update: { online: false, lastActiveAt: now },
    create: { userId: user.id, online: false, lastActiveAt: now },
  })

  const peers = await prisma.conversationParticipant.findMany({
    where: {
      conversation: { participants: { some: { userId: user.id } } },
      userId: { not: user.id },
    },
    select: { userId: true },
    distinct: ["userId"],
  })

  await publishRealtime(
    peers.map((peer) => peer.userId),
    {
      type: "user-online",
      payload: { userId: user.id, online: false, lastActiveAt: now.toISOString() },
    }
  )

  return Response.json({ presence })
}
