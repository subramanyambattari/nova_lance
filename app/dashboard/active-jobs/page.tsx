import { requireUser } from "@/lib/auth"
import { getActiveJobsDashboard } from "@/lib/active-jobs"
import { ActiveJobsClient } from "@/components/active-jobs/active-jobs-client"

export const dynamic = "force-dynamic"

export default async function DashboardActiveJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const user = await requireUser()
  const data = await getActiveJobsDashboard(user.id, await searchParams)

  return <ActiveJobsClient initialData={data} />
}
