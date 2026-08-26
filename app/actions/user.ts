"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"

export async function updateProfile(data: any) {
  const user = await requireUser()

  const languagesArray = data.languages 
    ? data.languages.split(",").map((s: string) => s.trim()).filter(Boolean)
    : []

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {
      phone: data.phone,
      location: data.location,
      timezone: data.timezone,
      languages: languagesArray,
      title: data.title,
      bio: data.bio,
      experienceLevel: data.experienceLevel,
      hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate.toString()) : null,
      availability: data.availability,
      portfolioWebsite: data.portfolioWebsite,
      github: data.github,
      linkedin: data.linkedin,
      preferredJobType: data.preferredJobType,
      budgetRange: data.budgetRange,
      weeklyAvailability: data.weeklyAvailability,
      remoteOnly: data.remoteOnly,
      openToContract: data.openToContract,
    },
    create: {
      userId: user.id,
      phone: data.phone,
      location: data.location,
      timezone: data.timezone,
      languages: languagesArray,
      title: data.title,
      bio: data.bio,
      experienceLevel: data.experienceLevel,
      hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate.toString()) : null,
      availability: data.availability,
      portfolioWebsite: data.portfolioWebsite,
      github: data.github,
      linkedin: data.linkedin,
      preferredJobType: data.preferredJobType,
      budgetRange: data.budgetRange,
      weeklyAvailability: data.weeklyAvailability,
      remoteOnly: data.remoteOnly,
      openToContract: data.openToContract,
    }
  })

  // Also update User name, email, and username if needed
  if (data.fullName || data.email || data.username) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(data.fullName && { name: data.fullName }),
        ...(data.email && { email: data.email }),
        ...(data.username && { username: data.username }),
      }
    })
  }

  if (typeof data.twoFactor === "boolean") {
    await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: { twoFactor: data.twoFactor },
      create: { userId: user.id, twoFactor: data.twoFactor },
    })
  }

  revalidatePath("/profile")
  return { success: true }
}

export async function updateSettings(data: any) {
  const user = await requireUser()

  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: {
      displayName: data.displayName,
      workspaceName: data.workspaceName,
      emailNotifications: data.emailNotifications,
      inAppNotifications: data.inAppNotifications,
      marketingDigest: data.marketingDigest,
      proposalAlerts: data.proposalAlerts,
      messageAlerts: data.messageAlerts,
      paymentAlerts: data.paymentAlerts,
      twoFactor: data.twoFactor,
      loginAlerts: data.loginAlerts,
      publicProfile: data.publicProfile,
      dataSharing: data.dataSharing,
      autoSaveDrafts: data.autoSaveDrafts,
      weeklySummary: data.weeklySummary,
    },
    create: {
      userId: user.id,
      displayName: data.displayName,
      workspaceName: data.workspaceName,
      emailNotifications: data.emailNotifications,
      inAppNotifications: data.inAppNotifications,
      marketingDigest: data.marketingDigest,
      proposalAlerts: data.proposalAlerts,
      messageAlerts: data.messageAlerts,
      paymentAlerts: data.paymentAlerts,
      twoFactor: data.twoFactor,
      loginAlerts: data.loginAlerts,
      publicProfile: data.publicProfile,
      dataSharing: data.dataSharing,
      autoSaveDrafts: data.autoSaveDrafts,
      weeklySummary: data.weeklySummary,
    }
  })

  if (data.email) {
    await prisma.user.update({
      where: { id: user.id },
      data: { email: data.email }
    })
  }

  const settingsLanguagesArray = data.language 
    ? data.language.split(",").map((s: string) => s.trim()).filter(Boolean)
    : undefined

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {
      ...(data.timezone && { timezone: data.timezone }),
      ...(settingsLanguagesArray && { languages: settingsLanguagesArray }),
      ...(data.bio && { bio: data.bio }),
      ...(data.defaultRate && { hourlyRate: parseFloat(data.defaultRate) }),
    },
    create: {
      userId: user.id,
      ...(data.timezone && { timezone: data.timezone }),
      ...(settingsLanguagesArray && { languages: settingsLanguagesArray }),
      ...(data.bio && { bio: data.bio }),
      ...(data.defaultRate && { hourlyRate: parseFloat(data.defaultRate) }),
    }
  })

  revalidatePath("/settings")
  return { success: true }
}

export async function updateProfileImage(imageUrl: string) {
  const user = await requireUser()

  await prisma.user.update({
    where: { id: user.id },
    data: { image: imageUrl },
  })

  revalidatePath("/profile")
  revalidatePath("/")
  return { success: true }
}
