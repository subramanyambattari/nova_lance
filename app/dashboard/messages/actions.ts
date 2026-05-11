"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/lib/auth"
import {
  assertConversationAccess,
  attachmentSchema,
  createConversationSchema,
  getAttachmentKind,
  getConversationParticipantIds,
  seenSchema,
  sendMessageSchema,
} from "@/lib/messages"
import { prisma } from "@/lib/prisma"
import { publishRealtime } from "@/lib/realtime"

export async function sendMessage(input: unknown) {
  const user = await requireUser()
  const body = sendMessageSchema.parse(input)

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

  await prisma.conversation.update({ where: { id: body.conversationId }, data: { updatedAt: new Date() } })

  const participantIds = await getConversationParticipantIds(body.conversationId)
  await publishRealtime(participantIds, {
    type: "receive-message",
    payload: { message, conversationId: body.conversationId },
  })

  revalidatePath("/messages")
  return message
}

export async function markMessageSeen(input: unknown) {
  const user = await requireUser()
  const body = seenSchema.parse(input)
  await assertConversationAccess(user.id, body.conversationId)

  const result = await prisma.message.updateMany({
    where: { conversationId: body.conversationId, senderId: { not: user.id }, seen: false },
    data: { seen: true },
  })

  await prisma.conversationParticipant.update({
    where: { userId_conversationId: { userId: user.id, conversationId: body.conversationId } },
    data: { lastReadAt: new Date(), lastSeenAt: new Date() },
  })

  revalidatePath("/messages")
  return result.count
}

export async function createConversation(input: unknown) {
  const user = await requireUser()
  const body = createConversationSchema.parse(input)
  const participantIds = [...new Set([user.id, ...body.participantIds])]

  const conversation = await prisma.conversation.create({
    data: {
      title: body.title || undefined,
      projectId: body.projectId || undefined,
      participants: { create: participantIds.map((participantId) => ({ userId: participantId })) },
    },
  })

  await publishRealtime(participantIds, {
    type: "conversation-update",
    payload: { conversationId: conversation.id },
  })

  revalidatePath("/messages")
  return conversation
}

export async function uploadAttachment(input: unknown) {
  const value = attachmentSchema.parse(input)
  return {
    imageUrl: value.imageUrl || undefined,
    fileUrl: value.fileUrl || undefined,
    fileName: value.fileName || undefined,
    fileType: value.fileType || undefined,
    fileSize: value.fileSize,
  }
}
