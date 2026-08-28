"use server"

import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const postJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(30, "Description must be at least 30 characters"),
  budget: z.number().optional().nullable(),
  skills: z.array(z.string()).default([]),
})

export async function postJob(data: z.infer<typeof postJobSchema>) {
  try {
    const user = await requireUser()
    const isSuperAdmin = user?.email === "b.subburoyal@gmail.com"
    
    if (!user || (user.role !== "CLIENT" && !isSuperAdmin)) {
      return { success: false, error: "Unauthorized: Only clients can post jobs." }
    }

    const parsed = postJobSchema.parse(data)

    const job = await prisma.job.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        budget: parsed.budget,
        skills: parsed.skills,
        company: user.name || "Nova Client",
        type: "Contract",
        experience: "Intermediate",
        location: "Remote",
        remote: true,
        source: "internal",
        verifiedClient: true,
        clientId: user.id,
      },
    })

    revalidatePath("/client-dashboard")
    revalidatePath("/dashboard/find-work")
    
    return { success: true, jobId: job.id }
  } catch (error: any) {
    console.error("postJob Error:", error);
    return { success: false, error: error.message || "Failed to post job due to a server error." }
  }
}
