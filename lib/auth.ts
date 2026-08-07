import { prisma } from "@/lib/prisma"

export type CurrentUser = Awaited<ReturnType<typeof requireUser>>

import { auth } from "@/auth"

export async function requireUser() {
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized: Please log in to continue.")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  
  if (!user) {
    throw new Error("User not found.")
  }

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
