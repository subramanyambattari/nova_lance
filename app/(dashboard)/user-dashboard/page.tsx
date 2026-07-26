import { OverviewPage } from "@/components/overview/overview-page"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"

export default async function Home() {
  const user = await requireUser()

  // 1. Fetch Proposals (for pipeline)
  const proposals = await prisma.proposal.findMany({
    where: { freelancerId: user.id },
    include: { job: true },
  })

  // 2. Fetch Active Jobs (for active delivery)
  const activeJobs = await prisma.activeJob.findMany({
    where: { freelancerId: user.id },
    include: { client: true },
    orderBy: { updatedAt: "desc" }
  })

  // 3. Fetch Milestones (for earnings)
  const milestones = await prisma.milestone.findMany({
    where: {
      job: { freelancerId: user.id },
      completed: true,
      paymentStatus: "RELEASED"
    }
  })

  // Calculate Pipeline
  const pipeline = [
    { stage: "Leads", count: 18, value: 54000 }, // Mock leads for now
    { stage: "Proposals", count: proposals.filter(p => p.status === "SUBMITTED" || p.status === "VIEWED").length, value: proposals.reduce((sum, p) => sum + (p.budget || 0), 0) },
    { stage: "Interviews", count: proposals.filter(p => p.status === "INTERVIEW").length, value: proposals.filter(p => p.status === "INTERVIEW").reduce((sum, p) => sum + (p.budget || 0), 0) },
    { stage: "Won", count: proposals.filter(p => p.status === "ACCEPTED").length, value: proposals.filter(p => p.status === "ACCEPTED").reduce((sum, p) => sum + (p.budget || 0), 0) },
  ]

  // Calculate Available Balance
  const availableBalance = milestones.reduce((sum, m) => sum + (m.amount || 0), 0)

  // Map Active Work
  const activeWork = activeJobs.map(job => ({
    project: job.title,
    client: job.client.name || "Client",
    state: job.status,
    due: job.deadline ? job.deadline.toLocaleDateString() : "TBD",
    progress: job.progress
  }))

  const stats = {
    pipeline,
    availableBalance,
    activeWorkCount: activeWork.length,
    activeWork,
  }

  return <OverviewPage stats={stats} />
}
