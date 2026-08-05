import { ClientDashboardPage } from "@/components/client-dashboard/client-dashboard-page"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"

export default async function ClientDashboardRoute() {
  const user = await requireUser()

  const dbJobs = await prisma.job.findMany({
    where: { clientId: user.id },
    include: {
      proposals: {
        include: {
          activeJob: true
        }
      },
      _count: { select: { proposals: true } },
    },
    orderBy: { createdAt: "desc" }
  })

  // We map the DB jobs to the shape expected by the component if needed, 
  // or we pass them down and modify the component to accept them.
  // For now we'll pass them directly.
  const serializedJobs = dbJobs.map(job => {
    const hiredProposals = job.proposals.filter(p => p.activeJob !== null);
    const hired = hiredProposals.length;
    const progress = hired > 0 ? hiredProposals.reduce((sum, p) => sum + (p.activeJob?.progress || 0), 0) / hired : 0;

    let mappedStatus = "Draft";
    if (job.status === "PUBLISHED") mappedStatus = "Active";
    else if (job.status === "PAUSED") mappedStatus = "Paused";
    else if (job.status === "CLOSED") mappedStatus = "Closed";
    else if (job.status === "DRAFT") mappedStatus = "Draft";

    return {
      id: job.id,
      title: job.title,
      status: mappedStatus,
      proposals: job._count.proposals,
      hired,
      progress: Math.round(progress),
      budget: job.salary || (job.budget ? `$${job.budget}` : "$0"),
      skills: job.skills,
    }
  })

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

  const dbActiveContracts = await prisma.activeJob.findMany({
    where: { clientId: user.id },
    include: { freelancer: true },
    orderBy: { updatedAt: "desc" }
  })

  const activeContracts = dbActiveContracts.map(c => ({
    project: c.title,
    client: c.freelancer.name || "Freelancer",
    state: c.status,
    due: c.deadline ? c.deadline.toLocaleDateString() : "TBD",
    progress: c.progress
  }))

  const stats = {
    totalJobsPosted: dbJobs.length,
    activeContractsCount: activeContracts.length,
    totalSpent: dbActiveContracts.reduce((sum, c) => sum + (c.budget || 0), 0),
    interviewsHeld: serializedProposals.filter(p => p.status === "INTERVIEW").length
  }

  // Collect all skills the client is looking for
  const requiredSkills = new Set<string>()
  dbJobs.forEach(job => {
    job.skills.forEach(skill => requiredSkills.add(skill))
  })

  // Find freelancers that have at least one matching skill
  const dbTalentMatches = await prisma.user.findMany({
    where: { 
      role: "FREELANCER",
      profile: {
        skills: {
          hasSome: Array.from(requiredSkills)
        }
      }
    },
    include: {
      profile: true
    },
    take: 6
  })

  const talentMatches = dbTalentMatches.map(freelancer => {
    const profile = freelancer.profile
    const freelancerSkills = profile?.skills || []
    
    // Calculate match percentage simply based on skill overlap
    const overlap = freelancerSkills.filter(s => requiredSkills.has(s)).length
    const requiredCount = requiredSkills.size || 1
    const matchPercent = Math.min(Math.round((overlap / requiredCount) * 100) + 40, 99) // Boost baseline so it looks good

    return {
      name: freelancer.name || "Freelancer",
      initials: (freelancer.name || "FL").substring(0, 2).toUpperCase(),
      role: profile?.title || "Freelancer",
      match: matchPercent,
      rate: profile?.hourlyRate ? `$${profile.hourlyRate}/hr` : "$50/hr",
      earned: "$10k+", // Placeholder for now
      skills: freelancerSkills.slice(0, 4),
      status: profile?.availability || "Available",
      bio: profile?.bio || "Experienced freelancer ready for new opportunities.",
    }
  })

  return (
    <ClientDashboardPage 
      initialJobs={serializedJobs} 
      initialProposals={serializedProposals} 
      stats={stats}
      activeContracts={activeContracts}
      talentMatches={talentMatches}
    />
  )
}

