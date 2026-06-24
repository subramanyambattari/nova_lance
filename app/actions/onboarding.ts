"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function checkUsernameAvailability(username: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })
    
    return { available: !existingUser }
  } catch (error) {
    console.error("Username check error:", error)
    return { available: false, error: "Failed to check username" }
  }
}

export async function generateUsernameSuggestions(baseName: string) {
  const base = baseName.toLowerCase().replace(/[^a-z0-9]/g, "")
  const suggestions = [
    `${base}${Math.floor(Math.random() * 100)}`,
    `${base}_${Math.floor(Math.random() * 100)}`,
    `${base}pro`,
  ]
  
  return { suggestions }
}

export async function completeOnboarding(data: { username: string; role: "CLIENT" | "FREELANCER"; skills?: string[] }) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const { available } = await checkUsernameAvailability(data.username)
    if (!available) {
      return { success: false, error: "Username is already taken" }
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username: data.username,
        role: data.role,
      },
    })

    if (data.skills && data.skills.length > 0) {
      await prisma.userProfile.upsert({
        where: { userId: updatedUser.id },
        update: { skills: data.skills },
        create: {
          userId: updatedUser.id,
          skills: data.skills,
        }
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Onboarding error:", error)
    return { success: false, error: "Something went wrong saving your profile" }
  }
}
