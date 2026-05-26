import { ClientDashboardPage } from "@/components/client-dashboard/client-dashboard-page"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"

export default async function ClientDashboardRoute() {
  const user = await requireUser()

  const dbJobs = await prisma.job.findMany({
    where: { clientId: user.id },
    include: {
      proposals: true,
      _count: { select: { proposals: true } },
    },
    orderBy: { createdAt: "desc" }
  })

  // We map the DB jobs to the shape expected by the component if needed, 
  // or we pass them down and modify the component to accept them.
  // For now we'll pass them directly.
  const serializedJobs = dbJobs.map(job => ({
    id: job.id,
    title: job.title,
    status: "Active", // Or derived from another field
    proposals: job._count.proposals,
    hired: 0, // Mock for now or compute
    progress: 0, // Mock for now or compute
    budget: job.salary || "$0",
    skills: job.skills,
  }))

  const dbProposals = await prisma.proposal.findMany({
    where: { job: { clientId: user.id } },
    include: { freelancer: true },
    orderBy: { createdAt: "desc" }
  })

  const serializedProposals = dbProposals.map(p => ({
    id: p.id,
    name: p.freelancer.name || "Unknown",
    role: "Freelancer",
    rating: "5.0",
    bid: `$${p.budget || 0}`,
    timeline: p.timeline || "N/A",
    status: p.status === "DRAFT" ? "New" : p.status, // Map status roughly
    summary: p.coverLetter.substring(0, 100) + "...",
    risk: "Low",
    jobId: p.jobId,
  }))

  return <ClientDashboardPage initialJobs={serializedJobs} initialProposals={serializedProposals} />
}

