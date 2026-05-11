import { NextRequest } from "next/server"
import { ZodError } from "zod"

import { requireUser } from "@/lib/auth"
import { createConversationSchema } from "@/lib/messages"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"
import { publishRealtime } from "@/lib/realtime"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const query = request.nextUrl.searchParams.get("q")?.trim()
  const archived = request.nextUrl.searchParams.get("archived") === "true"

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: user.id,
          archived,
        },
      },
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { messages: { some: { content: { contains: query, mode: "insensitive" } } } },
              {
                participants: {
                  some: {
                    user: {
                      OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } },
                      ],
                    },
                  },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              presence: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { sender: { select: { id: true, name: true, email: true } } },
      },
    },
    orderBy: [{ participants: { _count: "desc" } }, { updatedAt: "desc" }],
    take: 50,
  })

  const unreadCounts = await prisma.message.groupBy({
    by: ["conversationId"],
    where: {
      senderId: { not: user.id },
      seen: false,
      conversation: {
        participants: { some: { userId: user.id, archived } },
      },
    },
    _count: true,
  })
  const unreadMap = new Map(unreadCounts.map((item) => [item.conversationId, item._count]))

  return Response.json({
    conversations: conversations.map((conversation) => {
      const self = conversation.participants.find((participant) => participant.userId === user.id)
      return {
        ...conversation,
        pinned: self?.pinned ?? false,
        archived: self?.archived ?? false,
        unreadCount: unreadMap.get(conversation.id) ?? 0,
        latestMessage: conversation.messages[0] ?? null,
      }
    }),
    currentUser: { id: user.id, name: user.name, email: user.email },
  })
}

export async function POST(request: NextRequest) {
  const user = await requireUser()
  const limited = rateLimit(`conversation:create:${user.id}`, 20, 60_000)

  if (!limited.ok) {
    return Response.json({ error: "Too many conversation changes." }, { status: 429 })
  }

  try {
    const body = createConversationSchema.parse(await request.json())
    const participantIds = [...new Set([user.id, ...body.participantIds])]

    const users = await prisma.user.findMany({
      where: { id: { in: participantIds } },
      select: { id: true },
    })

    if (users.length !== participantIds.length) {
      return Response.json({ error: "One or more users do not exist." }, { status: 400 })
    }

    const conversation = await prisma.conversation.create({
      data: {
        title: body.title || undefined,
        projectId: body.projectId || undefined,
        participants: {
          create: participantIds.map((participantId) => ({ userId: participantId })),
        },
      },
      include: {
        participants: { include: { user: { select: { id: true, name: true, email: true, presence: true } } } },
        messages: true,
      },
    })

    await publishRealtime(participantIds, {
      type: "conversation-update",
      payload: { conversationId: conversation.id },
    })

    return Response.json({ conversation }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid conversation." }, { status: 400 })
    }

    return Response.json({ error: "Unable to create conversation." }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const user = await requireUser()
  const body = await request.json().catch(() => null)
  const conversationId = String(body?.conversationId ?? "")

  if (!conversationId) {
    return Response.json({ error: "conversationId is required." }, { status: 400 })
  }

  const participant = await prisma.conversationParticipant.findUnique({
    where: { userId_conversationId: { userId: user.id, conversationId } },
  })

  if (!participant) {
    return Response.json({ error: "Conversation not found." }, { status: 404 })
  }

  const updated = await prisma.conversationParticipant.update({
    where: { userId_conversationId: { userId: user.id, conversationId } },
    data: {
      pinned: typeof body?.pinned === "boolean" ? body.pinned : participant.pinned,
      archived: typeof body?.archived === "boolean" ? body.archived : participant.archived,
    },
  })

  return Response.json({ participant: updated })
}
