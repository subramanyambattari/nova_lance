import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createRealtimeStream, publishRealtime } from "@/lib/realtime"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const user = await requireUser()

  await prisma.userPresence.upsert({
    where: { userId: user.id },
    update: { online: true, lastActiveAt: new Date() },
    create: { userId: user.id, online: true },
  })

  const peerIds = await prisma.conversationParticipant.findMany({
    where: {
      conversation: {
        participants: {
          some: { userId: user.id },
        },
      },
      userId: { not: user.id },
    },
    select: { userId: true },
    distinct: ["userId"],
  })

  await publishRealtime(
    peerIds.map((participant) => participant.userId),
    {
      type: "user-online",
      payload: { userId: user.id, online: true, lastActiveAt: new Date().toISOString() },
    }
  )

  return new Response(createRealtimeStream(user.id), {
    headers: {
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "content-type": "text/event-stream; charset=utf-8",
      "x-accel-buffering": "no",
    },
  })
}
