import { ProfileSettingsPage } from "@/components/profile/profile-settings-page"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/auth"
import { defaultProfileValues } from "@/components/profile/profile-schema"

export default async function ProfilePage() {
  const user = await requireUser()
  const [dbProfile, dbSettings] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId: user.id } }),
    prisma.userSettings.findUnique({ where: { userId: user.id } })
  ])

  const initialData = dbProfile ? {
    fullName: user.name || defaultProfileValues.fullName,
    username: user.username || defaultProfileValues.username,
    email: user.email || defaultProfileValues.email,
    phone: dbProfile.phone || defaultProfileValues.phone,
    location: dbProfile.location || defaultProfileValues.location,
    timezone: dbProfile.timezone || defaultProfileValues.timezone,
    languages: dbProfile.languages || defaultProfileValues.languages,
    title: dbProfile.title || defaultProfileValues.title,
    bio: dbProfile.bio || defaultProfileValues.bio,
    experienceLevel: dbProfile.experienceLevel || defaultProfileValues.experienceLevel,
    hourlyRate: dbProfile.hourlyRate || defaultProfileValues.hourlyRate,
    availability: dbProfile.availability || defaultProfileValues.availability,
    portfolioWebsite: dbProfile.portfolioWebsite || defaultProfileValues.portfolioWebsite,
    github: dbProfile.github || defaultProfileValues.github,
    linkedin: dbProfile.linkedin || defaultProfileValues.linkedin,
    preferredJobType: dbProfile.preferredJobType || defaultProfileValues.preferredJobType,
    budgetRange: dbProfile.budgetRange || defaultProfileValues.budgetRange,
    weeklyAvailability: dbProfile.weeklyAvailability || defaultProfileValues.weeklyAvailability,
    remoteOnly: dbProfile.remoteOnly,
    openToContract: dbProfile.openToContract,
    twoFactor: dbSettings?.twoFactor ?? defaultProfileValues.twoFactor,
  } : defaultProfileValues

  return <ProfileSettingsPage initialData={initialData} />
}
