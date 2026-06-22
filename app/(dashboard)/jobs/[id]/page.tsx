import { JobDetailsPage } from "@/components/jobs/job-details-page"

export default async function JobRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <JobDetailsPage id={decodeURIComponent(id)} />
}
