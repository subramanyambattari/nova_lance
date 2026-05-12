import { ActiveJobsClient } from "@/components/active-jobs/active-jobs-client"
import { getActiveJobsDashboardOrFallback } from "@/lib/active-jobs"
import { getOptionalUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function ActiveJobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const user = await getOptionalUser()
  const data = await getActiveJobsDashboardOrFallback(user?.id, await searchParams)

  return <ActiveJobsClient initialData={data} />
}
