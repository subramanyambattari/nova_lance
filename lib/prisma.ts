import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/app/generated/prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

function databaseUrl() {
  const value = process.env.DATABASE_URL
  if (!value) return value

  try {
    const url = new URL(value)
    const sslMode = url.searchParams.get("sslmode")

    if (sslMode === "prefer" || sslMode === "require" || sslMode === "verify-ca") {
      url.searchParams.set("sslmode", "verify-full")
    }

    return url.toString()
  } catch {
    return value
  }
}

const adapter = new PrismaPg({
  connectionString: databaseUrl(),
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
