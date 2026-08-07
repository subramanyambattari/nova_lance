"use server"

import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const defaultSettings = {
  platformName: "Nova Lance",
  supportEmail: "support@novalance.dev",
  maintenanceMode: false,
  allowNewSignups: true,
  platformFeePercent: 10.0,
  minimumWithdrawal: 50.0,
  require2FA: false,
  sessionTimeoutMinutes: 60,
  emailAlertsEnabled: true,
  systemAnnouncements: true,
}

export async function getPlatformSettings() {
  try {
    let settings = await prisma.platformSettings.findUnique({
      where: { id: 1 }
    })

    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: {
          id: 1,
          ...defaultSettings
        }
      })
    }
    return settings
  } catch (error) {
    console.error("Failed to fetch settings from DB. Returning defaults.", error)
    return { id: 1, ...defaultSettings }
  }
}

export async function updatePlatformSettings(data: {
  platformName?: string
  supportEmail?: string
  maintenanceMode?: boolean
  allowNewSignups?: boolean
  platformFeePercent?: number
  minimumWithdrawal?: number
  require2FA?: boolean
  sessionTimeoutMinutes?: number
  emailAlertsEnabled?: boolean
  systemAnnouncements?: boolean
}) {
  try {
    const user = await requireUser()
    if (user.role !== "ADMIN") {
      throw new Error("Unauthorized")
    }
    const settings = await prisma.platformSettings.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        platformName: data.platformName ?? defaultSettings.platformName,
        supportEmail: data.supportEmail ?? defaultSettings.supportEmail,
        maintenanceMode: data.maintenanceMode ?? defaultSettings.maintenanceMode,
        allowNewSignups: data.allowNewSignups ?? defaultSettings.allowNewSignups,
        platformFeePercent: data.platformFeePercent ?? defaultSettings.platformFeePercent,
        minimumWithdrawal: data.minimumWithdrawal ?? defaultSettings.minimumWithdrawal,
        require2FA: data.require2FA ?? defaultSettings.require2FA,
        sessionTimeoutMinutes: data.sessionTimeoutMinutes ?? defaultSettings.sessionTimeoutMinutes,
        emailAlertsEnabled: data.emailAlertsEnabled ?? defaultSettings.emailAlertsEnabled,
        systemAnnouncements: data.systemAnnouncements ?? defaultSettings.systemAnnouncements,
      }
    })

    revalidatePath("/", "layout")
    return { success: true, settings }

  } catch (error: any) {
    console.error("Failed to update platform settings:", error)
    return { success: false, error: "Failed to update platform settings" }
  }
}
