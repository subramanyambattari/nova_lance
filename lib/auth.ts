import { prisma } from "@/lib/prisma"

const demoUser = {
  id: 0,
  email: "subbu@novalance.dev",
  name: "Subbu Roy",
}

export type CurrentUser = Awaited<ReturnType<typeof requireUser>>

export async function requireUser() {
  const email = "subbu@novalance.dev"

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: "Subbu Roy" },
    create: { email, name: "Subbu Roy" },
  })

  return user
}

export async function getOptionalUser(timeoutMs = 2500) {
  try {
    return await withTimeout(requireUser(), timeoutMs)
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      console.error("Unable to load current user.", error)
    }

    return null
  }
}

export function getDemoUser() {
  return demoUser
}

export function isDatabaseUnavailableError(error: unknown) {
  if (!(error instanceof Error)) return false
  const message = error.message.toLowerCase()

  return (
    message.includes("etimedout") ||
    message.includes("econnrefused") ||
    message.includes("enotfound") ||
    message.includes("connection terminated") ||
    message.includes("timed out")
  )
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label = "Database request") {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`${label} timed out after ${timeoutMs}ms`))
      }, timeoutMs)
      if (typeof timer === "object" && "unref" in timer) {
        timer.unref()
      }
    }),
  ])
}
