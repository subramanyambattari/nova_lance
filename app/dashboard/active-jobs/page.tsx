import { getOptionalUser } from "@/lib/auth"
import { getActiveJobsDashboardOrFallback } from "@/lib/active-jobs"
import { ActiveJobsClient } from "@/components/active-jobs/active-jobs-client"

export const dynamic = "force-dynamic"

export default async function DashboardActiveJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const user = await getOptionalUser()
  const data = await getActiveJobsDashboardOrFallback(user?.id, await searchParams)

  return <ActiveJobsClient initialData={data} />
}
