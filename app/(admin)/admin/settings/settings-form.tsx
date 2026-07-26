"use client"

import { useState, useTransition } from "react"
import { Save } from "lucide-react"
import { updatePlatformSettings } from "@/app/actions/settings"
import { toast } from "sonner"

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [platformName, setPlatformName] = useState(initialSettings.platformName)
  const [supportEmail, setSupportEmail] = useState(initialSettings.supportEmail)
  const [maintenanceMode, setMaintenanceMode] = useState(initialSettings.maintenanceMode)
  const [allowNewSignups, setAllowNewSignups] = useState(initialSettings.allowNewSignups)
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    startTransition(async () => {
      try {
        const result = await updatePlatformSettings({
          platformName,
          supportEmail,
          maintenanceMode,
          allowNewSignups
        })
        if (result.success) {
          toast.success("Settings saved successfully!")
          if (maintenanceMode) {
             toast.warning("Maintenance Mode is now ENABLED. Non-admins cannot access the platform.", { duration: 5000 })
          }
        }
      } catch (error) {
        toast.error("Failed to save settings.")
      }
    })
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">General Settings</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Platform Name</label>
          <input 
            type="text" 
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Support Email</label>
          <input 
            type="email" 
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-zinc-200 dark:border-zinc-800 mt-4">
          <div>
            <div className="font-medium">Maintenance Mode</div>
            <div className="text-sm text-zinc-500">Temporarily disable access to the platform for all non-admins.</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="font-medium">Allow New Signups</div>
            <div className="text-sm text-zinc-500">Allow new users to register on the platform.</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={allowNewSignups}
              onChange={(e) => setAllowNewSignups(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium text-sm transition-colors cursor-pointer"
        >
          <Save className="size-4" /> {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
