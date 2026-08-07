import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUnifiedJobs } from "@/lib/jobs"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // 1. Try exact ID match first
    const job = await prisma.job.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        budget: true,
      }
    })

    if (job) {
      return NextResponse.json(job)
    }

    // 2. Fallback to API search if not found
    const searchParams = {
      q: id,
      page: 1,
      limit: 1,
      remoteOnly: false,
      experience: "all",
      type: "all",
      minBudget: 0,
      skills: "",
      posted: "any",
      verified: false,
    }
    
    const { jobs } = await getUnifiedJobs(searchParams)
    
    if (jobs && jobs.length > 0) {
      const topMatch = jobs[0]
      return NextResponse.json({
        id: topMatch.id,
        title: topMatch.title,
        budget: topMatch.budget || (topMatch.salary ? parseInt(topMatch.salary.replace(/\D/g, '')) || 0 : 0)
      })
    }

    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch job", details: error.message, stack: error.stack }, { status: 500 })
  }
}
