"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"

export async function updateProfile(data: any) {
  const user = await requireUser()

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {
      phone: data.phone,
      location: data.location,
      timezone: data.timezone,
      languages: data.languages,
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
      languages: data.languages,
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

  // Also update User name and email if needed
  if (data.fullName || data.email) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(data.fullName && { name: data.fullName }),
        ...(data.email && { email: data.email }),
      }
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

  revalidatePath("/settings")
  return { success: true }
}
