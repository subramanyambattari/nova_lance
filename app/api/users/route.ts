import { NextRequest } from "next/server"

import { getOptionalUser, isDatabaseUnavailableError, withTimeout } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const user = await getOptionalUser()
  if (!user) return Response.json({ users: [] })

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")?.trim()
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "12", 10)))
  const skip = (page - 1) * limit

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
        skip,
        take: limit,
      }),
      2500,
      "Users query"
    )

    return Response.json({ users, page, limit })
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      console.error("Unable to load users.", error)
    }

    return Response.json({ users: [], page: 1, limit: 12 })
  }
}
