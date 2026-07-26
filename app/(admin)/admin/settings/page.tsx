import { Save, Shield, Percent, Globe, Bell } from "lucide-react"
import { getPlatformSettings } from "@/app/actions/settings"
import { SettingsForm } from "./settings-form"

export default async function AdminSettingsPage() {
  const settings = await getPlatformSettings()
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-zinc-500 mt-1">Configure global platform rules, fees, and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Navigation/Sections (Mock) */}
        <div className="col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium text-sm transition-colors text-left">
            <Globe className="size-4" /> General
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-medium text-sm transition-colors text-left">
            <Percent className="size-4" /> Fees & Payments
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-medium text-sm transition-colors text-left">
            <Shield className="size-4" /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-medium text-sm transition-colors text-left">
            <Bell className="size-4" /> Notifications
          </button>
        </div>

        {/* Right Column - Forms */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <SettingsForm initialSettings={settings} />
        </div>
      </div>
    </div>
  )
}
