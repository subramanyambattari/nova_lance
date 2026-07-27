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

  // 4. Fetch Saved Jobs (for leads)
  const savedJobs = await prisma.savedJob.findMany({
    where: { userId: user.id }
  })

  // 5. Fetch Messages (for client activity)
  const messages = await prisma.jobMessage.findMany({
    where: { job: { freelancerId: user.id }, senderId: { not: user.id } },
    include: { sender: true },
    orderBy: { createdAt: "desc" },
    take: 3
  })

  // 6. Fetch Unread Messages Count
  const unreadMessagesCount = await prisma.jobMessage.count({
    where: { job: { freelancerId: user.id }, senderId: { not: user.id }, readAt: null }
  })

  // Calculate Pipeline
  const pipeline = [
    { stage: "Leads", count: savedJobs.length, value: savedJobs.length * 1200 }, // Rough estimate for lead value
    { stage: "Proposals", count: proposals.filter(p => p.status === "SUBMITTED" || p.status === "VIEWED").length, value: proposals.filter(p => p.status === "SUBMITTED" || p.status === "VIEWED").reduce((sum, p) => sum + (p.budget || 0), 0) },
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
    due: job.deadline ? new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD",
    progress: job.progress
  }))

  // Calculate Priority Actions
  const priorityActions = []
  
  // High priority: Unread messages
  if (unreadMessagesCount > 0) {
    priorityActions.push({
      title: "Review unread messages",
      meta: `You have ${unreadMessagesCount} unread message(s) from clients.`,
      route: "/messages",
      cta: "View messages",
      badge: "High",
      tone: "border-rose-300/20 bg-rose-400/10 text-rose-200"
    })
  }

  // Ready: Cleared funds
  if (availableBalance > 0) {
    priorityActions.push({
      title: "Withdraw cleared funds",
      meta: `$${availableBalance.toLocaleString()} is available to withdraw to your bank.`,
      route: "/earnings",
      cta: "Go to earnings",
      badge: "Ready",
      tone: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
    })
  }

  // Action needed: Jobs ending soon
  const urgentJobs = activeJobs.filter(j => j.deadline && (new Date(j.deadline).getTime() - Date.now()) < 3 * 24 * 60 * 60 * 1000)
  if (urgentJobs.length > 0) {
    priorityActions.push({
      title: "Upcoming deadlines",
      meta: `${urgentJobs.length} active job(s) are due within the next 3 days.`,
      route: "/active-jobs",
      cta: "View jobs",
      badge: "Today",
      tone: "border-amber-300/20 bg-amber-400/10 text-amber-200"
    })
  }
  
  // If no priority actions, add a generic one
  if (priorityActions.length === 0) {
    priorityActions.push({
      title: "Find new opportunities",
      meta: "Your action queue is clear. Browse the marketplace for new roles.",
      route: "/find-jobs",
      cta: "Find Jobs",
      badge: "Tip",
      tone: "border-sky-300/20 bg-sky-400/10 text-sky-200"
    })
  }

  // Calculate Client Activity Messages
  const clientActivity = messages.map(m => {
    const timeDiff = Math.floor((Date.now() - new Date(m.createdAt).getTime()) / 60000)
    const timeStr = timeDiff < 60 ? `${timeDiff}m` : timeDiff < 1440 ? `${Math.floor(timeDiff / 60)}h` : `${Math.floor(timeDiff / 1440)}d`
    return {
      name: m.sender.name || "Client",
      initials: (m.sender.name || "C").substring(0, 2).toUpperCase(),
      message: m.message.substring(0, 50) + (m.message.length > 50 ? "..." : ""),
      time: timeStr
    }
  })

  // Calculate Earnings Trend (Last 6 Months)
  const earningsTrend = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const monthStr = d.toLocaleDateString("en-US", { month: "short" })
    
    // Find milestones paid in this month
    const monthMilestones = milestones.filter(m => m.completedAt && new Date(m.completedAt).getMonth() === d.getMonth() && new Date(m.completedAt).getFullYear() === d.getFullYear())
    
    // Find active jobs created in this month (budget as booked)
    const monthBooked = activeJobs.filter(j => new Date(j.createdAt).getMonth() === d.getMonth() && new Date(j.createdAt).getFullYear() === d.getFullYear()).reduce((sum, j) => sum + (j.budget || 0), 0)
    
    earningsTrend.push({
      month: monthStr,
      booked: monthBooked,
      paid: monthMilestones.reduce((sum, m) => sum + (m.amount || 0), 0)
    })
  }

  // Calculate Next Deadline
  const allDeadlines = activeJobs.filter(j => j.deadline).map(j => ({ date: new Date(j.deadline!), project: j.title }))
  allDeadlines.sort((a, b) => a.date.getTime() - b.date.getTime())
  const nextDeadline = allDeadlines.length > 0 ? {
    value: allDeadlines[0].date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    detail: allDeadlines[0].project
  } : { value: "None", detail: "No upcoming deadlines" }

  // Calculate Proposal Responses (Interviews + Accepted)
  const waitingProposals = proposals.filter(p => p.status === "INTERVIEW" || p.status === "VIEWED").length

  // Calculate Health
  const totalCompleted = activeJobs.filter(j => j.status === "COMPLETED").length
  const totalJobs = activeJobs.length || 1
  const healthScore = Math.min(100, Math.round((totalCompleted / totalJobs) * 50 + 50)) // Base 50% health

  const stats = {
    userName: user.name || "Freelancer",
    pipeline,
    availableBalance,
    activeWorkCount: activeWork.length,
    activeWork,
    priorityActions: priorityActions.slice(0, 3),
    clientActivity,
    unreadMessagesCount,
    earningsTrend,
    nextDeadline,
    waitingProposals,
    healthScore
  }

  return <OverviewPage stats={stats} />
}
