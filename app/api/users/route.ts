import { NextRequest } from "next/server"

import { getOptionalUser, isDatabaseUnavailableError, withTimeout } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const user = await getOptionalUser()
  if (!user) return Response.json({ users: [] })

  const query = request.nextUrl.searchParams.get("q")?.trim()

  try {
    const users = await withTimeout(
      prisma.user.findMany({
        where: {
          id: { not: user.id },
          ...(query
            ? {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { email: { contains: query, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        select: {
          id: true,
          name: true,
          email: true,
          presence: true,
        },
        orderBy: [{ name: "asc" }, { email: "asc" }],
        take: 12,
      }),
      2500,
      "Users query"
    )

    return Response.json({ users })
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      console.error("Unable to load users.", error)
    }

    return Response.json({ users: [] })
  }
}
