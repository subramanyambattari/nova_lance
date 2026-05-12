import { getOptionalUser } from "@/lib/auth"
import { getProposalDashboardOrFallback } from "@/lib/proposals"
import { ProposalsPageClient } from "@/components/proposals/proposals-page-client"

export const dynamic = "force-dynamic"

export default async function DashboardProposalsPage() {
  const user = await getOptionalUser()
  const data = await getProposalDashboardOrFallback(user?.id)

  return <ProposalsPageClient initialData={data} />
}
