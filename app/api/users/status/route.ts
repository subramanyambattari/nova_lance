import { NextRequest } from "next/server"
import { ZodError } from "zod"

import { getDemoUser, getOptionalUser, isDatabaseUnavailableError, requireUser, withTimeout } from "@/lib/auth"
import { getConversationParticipantIds, typingSchema } from "@/lib/messages"
import { prisma } from "@/lib/prisma"
import { publishRealtime } from "@/lib/realtime"

export const dynamic = "force-dynamic"

export async function GET() {
  const user = (await getOptionalUser()) ?? getDemoUser()
  if (user.id === 0) {
    return Response.json({
      user,
      presence: { online: false, lastActiveAt: new Date().toISOString() },
    })
  }

  const presence = await withTimeout(
    prisma.userPresence.findUnique({ where: { userId: user.id } }),
    2500,
    "Presence query"
  ).catch((error) => {
    if (!isDatabaseUnavailableError(error)) {
      console.error("Unable to load user presence.", error)
    }
    return null
  })

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
  const user = await getOptionalUser()
  if (!user) return Response.json({ presence: null })

  const now = new Date()

  try {
    const presence = await withTimeout(
      prisma.userPresence.upsert({
        where: { userId: user.id },
        update: { online: false, lastActiveAt: now },
        create: { userId: user.id, online: false, lastActiveAt: now },
      }),
      2500,
      "Presence update"
    )

    const peers = await withTimeout(
      prisma.conversationParticipant.findMany({
        where: {
          conversation: { participants: { some: { userId: user.id } } },
          userId: { not: user.id },
        },
        select: { userId: true },
        distinct: ["userId"],
      }),
      2500,
      "Presence peers query"
    )

    await publishRealtime(
      peers.map((peer) => peer.userId),
      {
        type: "user-online",
        payload: { userId: user.id, online: false, lastActiveAt: now.toISOString() },
      }
    )

    return Response.json({ presence })
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      console.error("Unable to update user presence.", error)
    }

    return Response.json({ presence: null })
  }
}
