import { Save, Shield, Percent, Globe, Bell } from "lucide-react"
import { getPlatformSettings } from "@/app/actions/settings"
import { SettingsForm } from "./settings-form"

import { requireUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminSettingsPage() {
  const user = await requireUser()
  if (user.role !== "ADMIN" && user.email !== "b.subburoyal@gmail.com") redirect("/")

  const settings = await getPlatformSettings()
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-zinc-500 mt-1">Configure global platform rules, fees, and security.</p>
      </div>

      <div className="mt-6">
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  )
}
