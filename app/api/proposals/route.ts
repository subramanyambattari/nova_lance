import { requireUser } from "@/lib/auth"
import { getProposalDashboard } from "@/lib/proposals"

export const dynamic = "force-dynamic"

export async function GET() {
  const user = await requireUser()
  const data = await getProposalDashboard(user.id)

  return Response.json(data, {
    headers: {
      "Cache-Control": "private, max-age=15, stale-while-revalidate=45",
    },
  })
}
