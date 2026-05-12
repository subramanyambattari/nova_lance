import { NextRequest } from "next/server"
import { ZodError } from "zod"

import { getActiveJobsDashboardOrFallback } from "@/lib/active-jobs"
import { getOptionalUser } from "@/lib/auth"
import { rateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const user = await getOptionalUser()
  const limited = rateLimit(`active-jobs:list:${user?.id ?? "demo"}`, 120, 60_000)

  if (!limited.ok) {
    return Response.json({ error: "Too many active jobs requests." }, { status: 429 })
  }

  try {
    const data = await getActiveJobsDashboardOrFallback(user?.id, Object.fromEntries(request.nextUrl.searchParams))
    return Response.json(data)
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid filters." }, { status: 400 })
    }

    return Response.json({ error: "Unable to load active jobs." }, { status: 500 })
  }
}
