"use server"

// Global fallback for when NeonDB is asleep or Prisma client is stale
const globalAny = global as any;
if (!globalAny.mockPlatformSettings) {
  globalAny.mockPlatformSettings = {
    platformName: "Nova Lance",
    supportEmail: "support@novalance.dev",
    maintenanceMode: false,
    allowNewSignups: true
  }
}
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPlatformSettings() {
  try {
    // Prevent TypeError if Prisma client is not updated yet
    if (!prisma.platformSettings) {
      console.warn("Prisma client not updated yet. Using in-memory fallback.")
      return globalAny.mockPlatformSettings
    }

    let settings = await prisma.platformSettings.findUnique({
      where: { id: 1 }
    })

    // If no settings exist yet, create the default one
    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: {
          id: 1,
          platformName: "Nova Lance",
          supportEmail: "support@novalance.dev",
          maintenanceMode: false,
          allowNewSignups: true
        }
      })
    }
    return settings
  } catch (error) {
    // DB is asleep, use memory fallback
    console.warn("Failed to fetch settings (DB might be asleep). Using in-memory fallback.")
    return globalAny.mockPlatformSettings
  }
}

export async function updatePlatformSettings(data: {
  platformName?: string
  supportEmail?: string
  maintenanceMode?: boolean
  allowNewSignups?: boolean
}) {
  try {
    if (!prisma.platformSettings) {
      throw new Error("Stale Prisma Client")
    }

    const settings = await prisma.platformSettings.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        platformName: data.platformName || "Nova Lance",
        supportEmail: data.supportEmail || "support@novalance.dev",
        maintenanceMode: data.maintenanceMode ?? false,
        allowNewSignups: data.allowNewSignups ?? true
      }
    })

    // Update fallback memory just in case
    globalAny.mockPlatformSettings = { ...globalAny.mockPlatformSettings, ...settings }
    revalidatePath("/", "layout")
    return { success: true, settings }

  } catch (error) {
    console.warn("Saving to in-memory fallback because DB is offline or client is stale.")
    
    globalAny.mockPlatformSettings = {
      ...globalAny.mockPlatformSettings,
      ...data
    }

    revalidatePath("/", "layout")
    return { success: true, settings: globalAny.mockPlatformSettings }
  }
}
