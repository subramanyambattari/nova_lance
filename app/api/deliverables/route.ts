import { NextRequest } from "next/server"
import { ZodError } from "zod"

import { assertJobAccess, uploadDeliverableSchema } from "@/lib/active-jobs"
import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  const user = await requireUser()
  const jobId = request.nextUrl.searchParams.get("jobId")

  if (!jobId) {
    return Response.json({ error: "jobId is required." }, { status: 400 })
  }

  await assertJobAccess(user.id, jobId)
  const deliverables = await prisma.deliverable.findMany({
    where: { jobId },
    orderBy: { uploadedAt: "desc" },
  })

  return Response.json({ deliverables })
}

export async function POST(request: NextRequest) {
  const user = await requireUser()
  const limited = rateLimit(`deliverable:create:${user.id}`, 30, 60_000)

  if (!limited.ok) {
    return Response.json({ error: "Too many deliverable uploads." }, { status: 429 })
  }

  try {
    const body = uploadDeliverableSchema.parse(await request.json())
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
    
    // Broadcast real-time update
    try {
      const protocol = request.headers.get("x-forwarded-proto") || "http";
      const host = request.headers.get("host") || "localhost:3000";
      await fetch(`${protocol}://${host}/api/internal/ws-broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: {
            type: "ws-deliverable-upload",
            jobId: body.jobId,
            deliverable,
          },
        }),
      });
    } catch (e) {
      console.error("Failed to broadcast deliverable update", e);
    }

    return Response.json({ deliverable }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid deliverable." }, { status: 400 })
    }

    return Response.json({ error: "Unable to upload deliverable." }, { status: 500 })
  }
}
