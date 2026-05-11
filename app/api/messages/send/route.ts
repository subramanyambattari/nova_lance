import { NextRequest } from "next/server"
import { ZodError } from "zod"

import { requireUser } from "@/lib/auth"
import {
  assertConversationAccess,
  getAttachmentKind,
  getConversationParticipantIds,
  sendMessageSchema,
} from "@/lib/messages"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"
import { publishRealtime } from "@/lib/realtime"

export async function POST(request: NextRequest) {
  const user = await requireUser()
  const limited = rateLimit(`message:send:${user.id}`, 80, 60_000)

  if (!limited.ok) {
    return Response.json({ error: "Too many messages." }, { status: 429 })
  }

  try {
    const body = sendMessageSchema.parse(await request.json())
    await assertConversationAccess(user.id, body.conversationId)

    const message = await prisma.message.create({
      data: {
        conversationId: body.conversationId,
        senderId: user.id,
        content: body.content || undefined,
        imageUrl: body.imageUrl || undefined,
        fileUrl: body.fileUrl || undefined,
        fileName: body.fileName || undefined,
        fileType: body.fileType || undefined,
        fileSize: body.fileSize,
        attachmentKind: body.imageUrl || body.fileUrl ? getAttachmentKind(body.fileType, body.fileName) : undefined,
      },
      include: { sender: { select: { id: true, name: true, email: true } } },
    })

    await prisma.conversation.update({
      where: { id: body.conversationId },
      data: { updatedAt: new Date() },
    })

    const participantIds = await getConversationParticipantIds(body.conversationId)
    const recipients = participantIds.filter((participantId) => participantId !== user.id)

    if (recipients.length) {
      await prisma.notification.createMany({
        data: recipients.map((recipientId) => ({
          userId: recipientId,
          conversationId: body.conversationId,
          messageId: message.id,
          type: message.attachmentKind ? "FILE" : "MESSAGE",
          title: user.name ?? user.email,
          body: message.content ?? message.fileName ?? "Sent an attachment",
        })),
      })
    }

    await publishRealtime(participantIds, {
      type: "receive-message",
      payload: { message, conversationId: body.conversationId },
    })
    await publishRealtime(participantIds, {
      type: "conversation-update",
      payload: { conversationId: body.conversationId },
    })
    await publishRealtime(recipients, {
      type: "notification",
      payload: {
        conversationId: body.conversationId,
        title: user.name ?? user.email,
        body: message.content ?? message.fileName ?? "Sent an attachment",
      },
    })

    return Response.json({ message }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid message." }, { status: 400 })
    }

    return Response.json({ error: "Unable to send message." }, { status: 500 })
  }
}
