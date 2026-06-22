"use server"

import { revalidatePath } from "next/cache"

import {
  assertJobAccess,
  completeMilestoneSchema,
  createMilestoneSchema,
  recalculateJobProgress,
  sendMessageSchema,
  updateJobSchema,
  uploadDeliverableSchema,
} from "@/lib/active-jobs"
import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function updateJobProgress(input: unknown) {
  const user = await requireUser()
  const body = updateJobSchema.required({ id: true, progress: true }).parse(input)
  await assertJobAccess(user.id, body.id)

  const job = await prisma.activeJob.update({
    where: { id: body.id },
    data: { progress: body.progress },
  })

  revalidateJobPaths(body.id)
  return job
}

export async function updateJobStatus(input: unknown) {
  const user = await requireUser()
  const body = updateJobSchema.required({ id: true, status: true }).parse(input)
  await assertJobAccess(user.id, body.id)

  const job = await prisma.activeJob.update({
    where: { id: body.id },
    data: { status: body.status },
  })

  revalidateJobPaths(body.id)
  return job
}

export async function createMilestone(input: unknown) {
  const user = await requireUser()
  const body = createMilestoneSchema.parse(input)
  await assertJobAccess(user.id, body.jobId)

  const milestone = await prisma.milestone.create({
    data: {
      jobId: body.jobId,
      title: body.title,
      description: body.description,
      amount: body.amount,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    },
  })
  await recalculateJobProgress(body.jobId)

  revalidateJobPaths(body.jobId)
  return milestone
}

export async function completeMilestone(input: unknown) {
  const user = await requireUser()
  const body = completeMilestoneSchema.parse(input)
  const milestone = await prisma.milestone.findUnique({ where: { id: body.id } })

  if (!milestone) {
    throw new Error("Milestone not found.")
  }

  await assertJobAccess(user.id, milestone.jobId)
  const updated = await prisma.milestone.update({
    where: { id: body.id },
    data: {
      completed: body.completed,
      completedAt: body.completed ? new Date() : null,
      paymentStatus: body.completed ? "RELEASED" : "PENDING",
    },
  })
  await recalculateJobProgress(milestone.jobId)

  revalidateJobPaths(milestone.jobId)
  return updated
}

export async function sendMessage(input: unknown) {
  const user = await requireUser()
  const body = sendMessageSchema.parse(input)
  await assertJobAccess(user.id, body.jobId)

  const message = await prisma.jobMessage.create({
    data: {
      jobId: body.jobId,
      senderId: user.id,
      message: body.message,
      fileUrl: body.fileUrl || undefined,
    },
  })

  revalidateJobPaths(body.jobId)
  return message
}

export async function uploadDeliverable(input: unknown) {
  const user = await requireUser()
  const body = uploadDeliverableSchema.parse(input)
  await assertJobAccess(user.id, body.jobId)

  const latest = await prisma.deliverable.findFirst({
    where: { jobId: body.jobId, title: body.title },
    orderBy: { version: "desc" },
  })
  const deliverable = await prisma.deliverable.create({
    data: {
      jobId: body.jobId,
      title: body.title,
      fileUrl: body.fileUrl,
      fileName: body.fileName,
      fileType: body.fileType,
      revisionNotes: body.revisionNotes,
      version: latest ? latest.version + 1 : 1,
    },
  })

  await prisma.activeJob.update({ where: { id: body.jobId }, data: { status: "REVIEW" } })
  revalidateJobPaths(body.jobId)
  return deliverable
}

function revalidateJobPaths(id: string) {
  revalidatePath("/active-jobs")
  revalidatePath("/dashboard/active-jobs")
  revalidatePath(`/dashboard/active-jobs/${id}`)
}
