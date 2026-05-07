import { requireUser } from "@/lib/auth"
import { getProposalDashboard } from "@/lib/proposals"
import { ProposalsPageClient } from "@/components/proposals/proposals-page-client"

export const dynamic = "force-dynamic"

export default async function DashboardProposalsPage() {
  const user = await requireUser()
  const data = await getProposalDashboard(user.id)

  return <ProposalsPageClient initialData={data} />
}
