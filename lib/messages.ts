import { z } from "zod"

import { prisma } from "@/lib/prisma"

export const messageContentSchema = z
  .string()
  .trim()
  .max(4000, "Messages must be 4,000 characters or less.")
  .optional()

export const attachmentSchema = z.object({
  imageUrl: z.string().url().optional().or(z.literal("")),
  fileUrl: z.string().url().optional().or(z.literal("")),
  fileName: z.string().max(180).optional().or(z.literal("")),
  fileType: z.string().max(120).optional().or(z.literal("")),
  fileSize: z.number().int().min(0).max(50 * 1024 * 1024).optional(),
})

export const sendMessageSchema = attachmentSchema
  .extend({
    conversationId: z.string().cuid(),
    content: messageContentSchema,
  })
  .refine((value) => Boolean(value.content || value.imageUrl || value.fileUrl), {
    message: "Write a message or attach a file.",
  })

export const createConversationSchema = z.object({
  participantIds: z.array(z.number().int().positive()).min(1).max(20),
  title: z.string().trim().max(120).optional(),
  projectId: z.string().trim().max(120).optional(),
})

export const seenSchema = z.object({
  conversationId: z.string().cuid(),
})

export const typingSchema = z.object({
  conversationId: z.string().cuid(),
  typing: z.boolean(),
})

export async function assertConversationAccess(userId: number, conversationId: string) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      userId_conversationId: {
        userId,
        conversationId,
      },
    },
  })

  if (!participant) {
    throw new Error("Conversation not found.")
  }

  return participant
}

export function getAttachmentKind(fileType?: string | null, fileName?: string | null) {
  const type = fileType?.toLowerCase() ?? ""
  const name = fileName?.toLowerCase() ?? ""

  if (type.startsWith("image/")) return "IMAGE" as const
  if (type.includes("pdf") || name.endsWith(".pdf")) return "PDF" as const
  if (type.includes("zip") || name.endsWith(".zip")) return "ZIP" as const
  if (
    type.includes("word") ||
    type.includes("document") ||
    name.endsWith(".doc") ||
    name.endsWith(".docx")
  ) {
    return "DOC" as const
  }

  return "FILE" as const
}

export async function getConversationParticipantIds(conversationId: string) {
  const participants = await prisma.conversationParticipant.findMany({
    where: { conversationId },
    select: { userId: true },
  })

  return participants.map((participant) => participant.userId)
}
