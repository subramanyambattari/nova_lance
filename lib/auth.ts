import { prisma } from "@/lib/prisma"

export async function requireUser() {
  const email = "subbu@novalance.dev"

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: "Subbu Roy" },
    create: { email, name: "Subbu Roy" },
  })

  return user
}
