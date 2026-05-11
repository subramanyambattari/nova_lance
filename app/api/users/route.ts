import { NextRequest } from "next/server"

import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const query = request.nextUrl.searchParams.get("q")?.trim()

  const users = await prisma.user.findMany({
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
  })

  return Response.json({ users })
}
