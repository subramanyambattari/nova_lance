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
      remote: true,
      verifiedClient: true,
    },
  })

  revalidatePath("/client-dashboard")
  return { success: true, jobId: newJob.id }
}

export async function updateProposalStatus(proposalId: string, status: string) {
  const user = await requireUser()
  
  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: { status: status as ProposalStatus },
  })
  
  revalidatePath("/client-dashboard")
  return { success: true, proposal }
}

export async function updateJobStatus(jobId: string, status: string) {
  const user = await requireUser()
  revalidatePath("/client-dashboard")
  return { success: true }
}

export async function duplicateJob(jobId: string) {
  const user = await requireUser()
  
  const originalJob = await prisma.job.findUnique({
    where: { id: jobId }
  })

  if (!originalJob) {
    throw new Error("Job not found")
  }
  
  const newJob = await prisma.job.create({
    data: {
      title: `${originalJob.title} (Copy)`,
      description: originalJob.description,
      company: originalJob.company,
      salary: originalJob.salary,
      skills: originalJob.skills,
      type: originalJob.type,
      experience: originalJob.experience,
      clientId: user.id,
    },
  })
  
  revalidatePath("/client-dashboard")
  return { success: true, jobId: newJob.id }
}

export async function deleteJob(jobId: string) {
  const user = await requireUser()
  
  await prisma.job.delete({
    where: { id: jobId }
  })
  
  revalidatePath("/client-dashboard")
  return { success: true }
}
