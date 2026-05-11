import { NextRequest } from "next/server"
import { ZodError } from "zod"

import { requireUser } from "@/lib/auth"
import { assertConversationAccess, getConversationParticipantIds, seenSchema } from "@/lib/messages"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"
import { publishRealtime } from "@/lib/realtime"

export async function POST(request: NextRequest) {
  const user = await requireUser()
  const limited = rateLimit(`message:seen:${user.id}`, 120, 60_000)

  if (!limited.ok) {
    return Response.json({ error: "Too many read receipt updates." }, { status: 429 })
  }

  try {
    const body = seenSchema.parse(await request.json())
    await assertConversationAccess(user.id, body.conversationId)

    const now = new Date()
    const result = await prisma.message.updateMany({
      where: {
        conversationId: body.conversationId,
        senderId: { not: user.id },
        seen: false,
      },
      data: { seen: true },
    })

    await prisma.conversationParticipant.update({
      where: { userId_conversationId: { userId: user.id, conversationId: body.conversationId } },
      data: { lastReadAt: now, lastSeenAt: now },
    })

    const participantIds = await getConversationParticipantIds(body.conversationId)
    await publishRealtime(participantIds, {
      type: "mark-seen",
      payload: {
        conversationId: body.conversationId,
        userId: user.id,
        seenAt: now.toISOString(),
        updated: result.count,
      },
    })

    return Response.json({ updated: result.count })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid read receipt." }, { status: 400 })
    }

    return Response.json({ error: "Unable to update read receipts." }, { status: 500 })
  }
}
