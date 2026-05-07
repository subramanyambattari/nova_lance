import { NextRequest } from "next/server"
import { z, ZodError } from "zod"

import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const deleteSchema = z.object({ id: z.string() })

export async function DELETE(request: NextRequest) {
  const user = await requireUser()

  try {
    const body = deleteSchema.parse(await request.json())
    const proposal = await prisma.proposal.findFirst({
      where: { id: body.id, freelancerId: user.id },
    })

    if (!proposal) {
      return Response.json({ error: "Proposal not found." }, { status: 404 })
    }

    if (!["DRAFT", "WITHDRAWN"].includes(proposal.status)) {
      return Response.json({ error: "Submitted proposals must be withdrawn before deletion." }, { status: 409 })
    }

    await prisma.proposal.delete({ where: { id: proposal.id } })

    return Response.json({ ok: true })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: "Invalid proposal id." }, { status: 400 })
    }

    return Response.json({ error: "Unable to delete proposal." }, { status: 500 })
  }
}

export { DELETE as POST }
