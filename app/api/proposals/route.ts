import { getOptionalUser } from "@/lib/auth"
import { getProposalDashboardOrFallback } from "@/lib/proposals"

export const dynamic = "force-dynamic"

export async function GET() {
  const user = await getOptionalUser()
  const data = await getProposalDashboardOrFallback(user?.id)

  return Response.json(data, {
    headers: {
      "Cache-Control": "private, max-age=15, stale-while-revalidate=45",
    },
  })
}
