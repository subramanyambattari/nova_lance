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

export async function completeOnboarding(data: { 
  username: string; 
  role: "CLIENT" | "FREELANCER"; 
  skills?: string[];
  firstName?: string;
  lastName?: string;
  title?: string;
  bio?: string;
  languages?: string[];
  dateOfBirth?: string;
  imageUrl?: string;
  experiences?: { title: string; company: string; startDate: string; endDate?: string; currentlyWorking: boolean }[];
  referenceEmails?: string[];
}) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const { available } = await checkUsernameAvailability(data.username)
    if (!available) {
      return { success: false, error: "Username is already taken" }
    }

    const name = data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        username: data.username,
        role: data.role,
        ...(name ? { name } : {}),
        ...(data.imageUrl ? { image: data.imageUrl } : {})
      },
    })

    const dobDate = data.dateOfBirth ? new Date(data.dateOfBirth) : null;

    if (data.role === "FREELANCER") {
      await prisma.userProfile.upsert({
        where: { userId: updatedUser.id },
        update: {
          skills: data.skills || [],
          firstName: data.firstName,
          lastName: data.lastName,
          title: data.title,
          bio: data.bio,
          languages: data.languages || [],
          dateOfBirth: dobDate,
          ...(data.experiences && data.experiences.length > 0 ? {
            experiences: {
              create: data.experiences.map(exp => ({
                title: exp.title,
                company: exp.company,
                startDate: new Date(exp.startDate),
                endDate: exp.endDate ? new Date(exp.endDate) : null,
                currentlyWorking: exp.currentlyWorking
              }))
            }
          } : {}),
          referenceEmails: data.referenceEmails || []
        },
        create: {
          userId: updatedUser.id,
          skills: data.skills || [],
          firstName: data.firstName,
          lastName: data.lastName,
          title: data.title,
          bio: data.bio,
          languages: data.languages || [],
          dateOfBirth: dobDate,
          ...(data.experiences && data.experiences.length > 0 ? {
            experiences: {
              create: data.experiences.map(exp => ({
                title: exp.title,
                company: exp.company,
                startDate: new Date(exp.startDate),
                endDate: exp.endDate ? new Date(exp.endDate) : null,
                currentlyWorking: exp.currentlyWorking
              }))
            }
          } : {}),
          referenceEmails: data.referenceEmails || []
        }
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Onboarding error:", error)
    return { success: false, error: "Something went wrong saving your profile" }
  }
}
