import { getDemoUser, getOptionalUser, isDatabaseUnavailableError, withTimeout } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createRealtimeStream, publishRealtime } from "@/lib/realtime"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const user = (await getOptionalUser()) ?? getDemoUser()

  if (user.id !== 0) {
    try {
      await withTimeout(
        prisma.userPresence.upsert({
          where: { userId: user.id },
          update: { online: true, lastActiveAt: new Date() },
          create: { userId: user.id, online: true },
        }),
        2500,
        "Presence update"
      )

      const peerIds = await withTimeout(
        prisma.conversationParticipant.findMany({
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
        }),
        2500,
        "Realtime peers query"
      )

      await publishRealtime(
        peerIds.map((participant) => participant.userId),
        {
          type: "user-online",
          payload: { userId: user.id, online: true, lastActiveAt: new Date().toISOString() },
        }
      )
    } catch (error) {
      if (!isDatabaseUnavailableError(error)) {
        console.error("Unable to initialize realtime presence.", error)
      }
    }
  }

  return new Response(createRealtimeStream(user.id), {
    headers: {
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "content-type": "text/event-stream; charset=utf-8",
      "x-accel-buffering": "no",
    },
  })
}
