import { NextRequest } from "next/server"

import { requireUser } from "@/lib/auth"
import { assertConversationAccess } from "@/lib/messages"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const conversationId = request.nextUrl.searchParams.get("conversationId")
  const cursor = request.nextUrl.searchParams.get("cursor")
  const query = request.nextUrl.searchParams.get("q")?.trim()
  const filter = request.nextUrl.searchParams.get("filter")
  const take = Math.min(Number(request.nextUrl.searchParams.get("pageSize") ?? 35), 80)

  if (!conversationId) {
    return Response.json({ error: "conversationId is required." }, { status: 400 })
  }

  try {
    await assertConversationAccess(user.id, conversationId)

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        ...(query ? { content: { contains: query, mode: "insensitive" } } : {}),
        ...(filter === "files"
          ? { fileUrl: { not: null } }
          : filter === "images"
            ? { imageUrl: { not: null } }
            : {}),
      },
      include: { sender: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    })

    return Response.json({
      messages: messages.slice(0, take).reverse(),
      nextCursor: messages.length > take ? messages[take].id : null,
      currentUser: { id: user.id, name: user.name, email: user.email },
    })
  } catch {
    return Response.json({ error: "Conversation not found." }, { status: 404 })
  }
}
