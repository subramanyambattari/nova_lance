import { SettingsPage } from "@/components/settings/settings-page"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"

export default async function SettingsRoute() {
  const user = await requireUser()
  const [dbSettings, dbProfile] = await Promise.all([
    prisma.userSettings.findUnique({ where: { userId: user.id } }),
    prisma.userProfile.findUnique({ where: { userId: user.id } })
  ])

  // We can pass the user email and name directly
  const initialData = dbSettings ? {
    displayName: dbSettings.displayName || user.name || "",
    email: user.email || "",
    timezone: dbProfile?.timezone || "Asia/Kolkata",
    language: dbProfile?.languages || "English",
    workspaceName: dbSettings.workspaceName || "",
    defaultRate: dbProfile?.hourlyRate?.toString() || "85",
    bio: dbProfile?.bio || "",
    emailNotifications: dbSettings.emailNotifications,
    inAppNotifications: dbSettings.inAppNotifications,
    marketingDigest: dbSettings.marketingDigest,
    proposalAlerts: dbSettings.proposalAlerts,
    messageAlerts: dbSettings.messageAlerts,
    paymentAlerts: dbSettings.paymentAlerts,
    twoFactor: dbSettings.twoFactor,
    loginAlerts: dbSettings.loginAlerts,
    publicProfile: dbSettings.publicProfile,
    dataSharing: dbSettings.dataSharing,
    autoSaveDrafts: dbSettings.autoSaveDrafts,
    weeklySummary: dbSettings.weeklySummary,
  } : null

  return <SettingsPage initialData={initialData} />
}
