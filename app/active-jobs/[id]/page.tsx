import { notFound } from "next/navigation"

import { ActiveJobDetailClient } from "@/components/active-jobs/active-job-detail-client"
import { getActiveJobDetail } from "@/lib/active-jobs"
import { requireUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function ActiveJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const { id } = await params
  const job = await getActiveJobDetail(user.id, id)

  if (!job) {
    notFound()
  }

  return <ActiveJobDetailClient initialJob={job} />
}
