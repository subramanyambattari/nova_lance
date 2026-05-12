import { getOptionalUser, isDatabaseUnavailableError, requireUser, withTimeout } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  const user = await getOptionalUser()
  if (!user) return Response.json({ notifications: [], unread: 0 })

  try {
    const [notifications, unread] = await withTimeout(
      Promise.all([
        prisma.notification.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 30,
        }),
        prisma.notification.count({ where: { userId: user.id, readAt: null } }),
      ]),
      2500,
      "Notifications query"
    )

    return Response.json({ notifications, unread })
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      console.error("Unable to load notifications.", error)
    }

    return Response.json({ notifications: [], unread: 0 })
  }
}

export async function PATCH() {
  const user = await requireUser()

  const result = await prisma.notification.updateMany({
    where: { userId: user.id, readAt: null },
    data: { readAt: new Date() },
  })

  return Response.json({ updated: result.count })
}
