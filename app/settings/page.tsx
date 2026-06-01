import { SettingsPage } from "@/components/settings/settings-page"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"

export default async function SettingsRoute() {
  const user = await requireUser()
  const dbSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id }
  })

  // We can pass the user email and name directly
  const initialData = dbSettings ? {
    displayName: dbSettings.displayName || user.name || "",
    email: user.email || "",
    timezone: "Asia/Kolkata", // You could store this in settings or profile
    language: "English",
    workspaceName: dbSettings.workspaceName || "",
    defaultRate: "85", // Or from profile
    bio: "", // Or from profile
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
