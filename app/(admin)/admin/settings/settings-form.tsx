"use client"

import { useState, useTransition } from "react"
import { Save, Globe, Percent, Shield, Bell } from "lucide-react"
import { updatePlatformSettings } from "@/app/actions/settings"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [activeTab, setActiveTab] = useState("general")
  
  // General
  const [platformName, setPlatformName] = useState(initialSettings?.platformName || "Nova Lance")
  const [supportEmail, setSupportEmail] = useState(initialSettings?.supportEmail || "support@novalance.dev")
  const [maintenanceMode, setMaintenanceMode] = useState(initialSettings?.maintenanceMode || false)
  const [allowNewSignups, setAllowNewSignups] = useState(initialSettings?.allowNewSignups || false)
  
  // Fees
  const [platformFeePercent, setPlatformFeePercent] = useState(initialSettings?.platformFeePercent || 10.0)
  const [minimumWithdrawal, setMinimumWithdrawal] = useState(initialSettings?.minimumWithdrawal || 50.0)
  
  // Security
  const [require2FA, setRequire2FA] = useState(initialSettings?.require2FA || false)
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(initialSettings?.sessionTimeoutMinutes || 60)
  
  // Notifications
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(initialSettings?.emailAlertsEnabled ?? true)
  const [systemAnnouncements, setSystemAnnouncements] = useState(initialSettings?.systemAnnouncements ?? true)

  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    startTransition(async () => {
      try {
        const result = await updatePlatformSettings({
          platformName,
          supportEmail,
          maintenanceMode,
          allowNewSignups,
          platformFeePercent: parseFloat(platformFeePercent as string),
          minimumWithdrawal: parseFloat(minimumWithdrawal as string),
          require2FA,
          sessionTimeoutMinutes: parseInt(sessionTimeoutMinutes as string, 10),
          emailAlertsEnabled,
          systemAnnouncements
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

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "fees", label: "Fees & Payments", icon: Percent },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Sidebar Navigation */}
      <div className="col-span-1 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors text-left",
              activeTab === tab.id 
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" 
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            )}
          >
            <tab.icon className="size-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main Form Content */}
      <div className="col-span-1 md:col-span-2 space-y-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            {tabs.find(t => t.id === activeTab)?.label} Settings
          </h2>
          
          <div className="space-y-4">
            {/* General Settings */}
            {activeTab === "general" && (
              <>
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
                    <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-zinc-200 dark:border-zinc-800">
                  <div>
                    <div className="font-medium">Allow New Signups</div>
                    <div className="text-sm text-zinc-500">Allow new users to register on the platform.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={allowNewSignups} onChange={(e) => setAllowNewSignups(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </>
            )}

            {/* Fees & Payments Settings */}
            {activeTab === "fees" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Platform Fee Percentage (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={platformFeePercent}
                    onChange={(e) => setPlatformFeePercent(e.target.value as any)}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-xs text-zinc-500">Percentage fee taken from completed milestones.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Minimum Withdrawal Amount ($)</label>
                  <input 
                    type="number" 
                    step="1"
                    value={minimumWithdrawal}
                    onChange={(e) => setMinimumWithdrawal(e.target.value as any)}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-xs text-zinc-500">The minimum amount a freelancer must have in available balance to withdraw.</p>
                </div>
              </>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">Enforce Two-Factor Authentication</div>
                    <div className="text-sm text-zinc-500">Require all users to enable 2FA for their accounts.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={require2FA} onChange={(e) => setRequire2FA(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 mt-4 pt-4">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Session Timeout (Minutes)</label>
                  <input 
                    type="number" 
                    step="5"
                    value={sessionTimeoutMinutes}
                    onChange={(e) => setSessionTimeoutMinutes(e.target.value as any)}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-xs text-zinc-500">Number of minutes of inactivity before automatically logging out a user.</p>
                </div>
              </>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">Global Email Alerts</div>
                    <div className="text-sm text-zinc-500">Enable or disable all outbound platform emails.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={emailAlertsEnabled} onChange={(e) => setEmailAlertsEnabled(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-zinc-200 dark:border-zinc-800">
                  <div>
                    <div className="font-medium">System Announcements</div>
                    <div className="text-sm text-zinc-500">Show global broadcast banners to all logged-in users.</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={systemAnnouncements} onChange={(e) => setSystemAnnouncements(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </>
            )}

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
      </div>
    </div>
  )
}
