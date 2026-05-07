import { NextRequest } from "next/server"

import { requireUser } from "@/lib/auth"
import { getUnifiedJobs, jobSearchSchema } from "@/lib/jobs"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const params = jobSearchSchema.parse(
    Object.fromEntries(request.nextUrl.searchParams.entries())
  )

  const data = await getUnifiedJobs(params, user.id)

  return Response.json(data, {
    headers: {
      "Cache-Control": "private, max-age=30, stale-while-revalidate=120",
    },
  })
}
