import { NextRequest } from "next/server"
import { z } from "zod"

import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"

const saveJobSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  company: z.string().min(1),
  source: z.string().min(1),
  externalId: z.string().optional(),
  externalUrl: z.string().optional(),
  saved: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  const user = await requireUser()
  const limited = rateLimit(`save:${user.id}`, 40)
  if (!limited.ok) {
    return Response.json({ error: "Too many save requests." }, { status: 429 })
  }

  const body = saveJobSchema.parse(await request.json())
  const isInternal = body.source === "internal"
  const existing = await prisma.savedJob.findFirst({
    where: isInternal
      ? { userId: user.id, jobId: body.id }
      : { userId: user.id, externalJobId: body.externalId ?? body.id },
  })

  if (existing) {
    await prisma.savedJob.delete({ where: { id: existing.id } })
    return Response.json({ saved: false })
  }

  await prisma.savedJob.create({
    data: {
      userId: user.id,
      jobId: isInternal ? body.id : undefined,
      externalJobId: isInternal ? undefined : body.externalId ?? body.id,
      externalJobUrl: body.externalUrl,
      title: body.title,
      company: body.company,
      source: body.source,
    },
  })

  return Response.json({ saved: true })
}
