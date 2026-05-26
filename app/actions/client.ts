"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"
import type { ProposalStatus } from "@/app/generated/prisma/client"

export async function createJob(data: {
  title: string
  budget: string
  timeline: string
  priority: string
  experience: string
  skills: string[]
}) {
  const user = await requireUser()

  // Parse budget string back to a rough float just to store something if we want, 
  // or store it as string in a different field. Our schema has `budget Float?` and `salary String?`.
  // The UI gives "$5,000-$8,000". Let's store it in `salary` or parse it.
  
  const newJob = await prisma.job.create({
    data: {
      title: data.title,
      description: `Job for ${data.title} with priority ${data.priority} and timeline ${data.timeline}.`,
      company: user.name ?? "Client Company",
      salary: data.budget,
      skills: data.skills,
      type: "Contract",
      experience: data.experience,
      clientId: user.id,
      // Status field does not exist on Job model
    },
  })

  revalidatePath("/client-dashboard")
  return { success: true, jobId: newJob.id }
}

export async function updateProposalStatus(proposalId: string, status: string) {
  const user = await requireUser()
  // Ensure the user owns the job this proposal is for
  
  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: { status: status as ProposalStatus },
  })
  
  revalidatePath("/client-dashboard")
  return { success: true, proposal }
}
