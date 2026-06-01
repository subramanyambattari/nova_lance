"use client"

import { motion } from "framer-motion"
import {
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  Eye,
  Globe2,
  KeyRound,
  Laptop,
  LockKeyhole,
  Mail,
  MessageSquare,
  RotateCcw,
  Save,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRound,
  WalletCards,
} from "lucide-react"
import type { ElementType } from "react"
import { useMemo, useState, useTransition, useEffect } from "react"
import { updateSettings } from "@/app/actions/user"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type SettingsState = {
  displayName: string
  email: string
  timezone: string
  language: string
  workspaceName: string
  defaultRate: string
  bio: string
  emailNotifications: boolean
  inAppNotifications: boolean
  marketingDigest: boolean
  proposalAlerts: boolean
  messageAlerts: boolean
  paymentAlerts: boolean
  twoFactor: boolean
  loginAlerts: boolean
  publicProfile: boolean
  dataSharing: boolean
  autoSaveDrafts: boolean
  weeklySummary: boolean
}

const defaultSettings: SettingsState = {
  displayName: "Subbu",
  email: "subbu@novalance.dev",
  timezone: "Asia/Kolkata",
  language: "English",
  workspaceName: "Nova Lance Studio",
  defaultRate: "85",
  bio: "Product-minded freelancer focused on high-impact web apps, dashboards, and launch systems.",
  emailNotifications: true,
  inAppNotifications: true,
  marketingDigest: false,
  proposalAlerts: true,
  messageAlerts: true,
  paymentAlerts: true,
  twoFactor: false,
  loginAlerts: true,
  publicProfile: true,
  dataSharing: false,
  autoSaveDrafts: true,
  weeklySummary: true,
}

const sessions = [
  { device: "Windows desktop", location: "Bengaluru, India", lastSeen: "Active now", icon: Laptop },
  { device: "iPhone 15", location: "Bengaluru, India", lastSeen: "2 hours ago", icon: Smartphone },
]

const integrations = [
  { name: "Google Calendar", detail: "Sync interviews and deadlines", status: "Connected" },
  { name: "GitHub", detail: "Attach repos to proposals", status: "Connected" },
  { name: "Slack", detail: "Send client message alerts", status: "Available" },
]

const complianceItems = [
  { label: "Profile completion", value: 86 },
  { label: "Security readiness", value: 72 },
  { label: "Billing setup", value: 94 },
]

function SettingToggle({
  checked,
  description,
  icon: Icon,
  label,
  onChange,
}: {
  checked: boolean
  description: string
  icon: ElementType
  label: string
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-white/[0.03] p-4">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-200">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{label}</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  )
}

export function SettingsPage({ initialData }: { initialData?: any }) {
  const [isPending, startTransition] = useTransition()
  
  const [settings, setSettings] = useState<SettingsState>(
    initialData ? { ...defaultSettings, ...initialData } : defaultSettings
  )
  const [savedSettings, setSavedSettings] = useState<SettingsState>(
    initialData ? { ...defaultSettings, ...initialData } : defaultSettings
  )
  const [toast, setToast] = useState<string | null>(null)

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [savedSettings, settings]
  )

  function update<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  function saveChanges() {
    startTransition(async () => {
      const res = await updateSettings(settings)
      if (res.success) {
        setSavedSettings(settings)
        showToast("Settings saved to database.")
      }
    })
  }

  function resetChanges() {
    setSettings(savedSettings)
    showToast("Unsaved changes discarded.")
  }

  return (
    <div className="min-h-screen overflow-hidden bg-transparent text-zinc-900 dark:text-zinc-100">
      <div className="relative z-0 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.035] p-5 shadow-sm dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl sm:p-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="text-sm font-medium text-sky-600 dark:text-sky-300">Workspace controls</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-zinc-900 dark:text-white sm:text-4xl">
              Settings
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
              Manage account preferences, notification rules, security, privacy, and workspace defaults.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetChanges}
              disabled={!isDirty}
              className="rounded-xl border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-200"
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
            <Button
              type="button"
              onClick={saveChanges}
              disabled={!isDirty || isPending}
              className="rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-sky-100"
            >
              <Save className="size-4" />
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </motion.header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Security", value: settings.twoFactor ? "Strong" : "Action needed", detail: settings.twoFactor ? "2FA enabled" : "2FA recommended", icon: ShieldCheck, tone: "text-emerald-600 dark:text-emerald-300" },
            { label: "Notifications", value: settings.emailNotifications ? "On" : "Limited", detail: "Messages, proposals, and payouts", icon: Bell, tone: "text-sky-600 dark:text-sky-300" },
            { label: "Workspace", value: settings.workspaceName, detail: `$${settings.defaultRate}/hr default rate`, icon: BriefcaseBusiness, tone: "text-amber-600 dark:text-amber-300" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 * index }}
            >
              <Card className="h-full rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
                <CardContent className="p-5">
                  <item.icon className={`size-5 ${item.tone}`} />
                  <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">{item.label}</p>
                  <p className="mt-2 truncate text-2xl font-semibold text-zinc-900 dark:text-white">{item.value}</p>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{item.detail}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <Tabs defaultValue="account" className="grid gap-4">
          <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Account preferences</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="displayName">Display name</Label>
                    <Input
                      id="displayName"
                      value={settings.displayName}
                      onChange={(event) => update("displayName", event.target.value)}
                      className="h-10 border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(event) => update("email", event.target.value)}
                      className="h-10 border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      id="timezone"
                      value={settings.timezone}
                      onChange={(event) => update("timezone", event.target.value)}
                    >
                      <option>Asia/Kolkata</option>
                      <option>America/New_York</option>
                      <option>Europe/London</option>
                      <option>Australia/Sydney</option>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      id="language"
                      value={settings.language}
                      onChange={(event) => update("language", event.target.value)}
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </Select>
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="bio">Profile summary</Label>
                    <Textarea
                      id="bio"
                      value={settings.bio}
                      onChange={(event) => update("bio", event.target.value)}
                      className="border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Account health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {complianceItems.map((item) => (
                     <div key={item.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">{item.label}</span>
                        <span className="text-zinc-850 dark:text-zinc-100">{item.value}%</span>
                      </div>
                      <Progress className="mt-2" value={item.value} />
                    </div>
                  ))}
                  <Separator className="bg-zinc-200 dark:bg-white/10" />
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-800 dark:text-emerald-200">
                      <Check className="size-4" />
                      Profile visible to matched clients
                    </div>
                    <p className="mt-2 text-xs leading-5 text-emerald-700/80 dark:text-emerald-100/70">
                      Your core profile, billing, and payout details are ready for active work.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="notifications">
            <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Delivery channels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SettingToggle
                    checked={settings.emailNotifications}
                    description="Receive important account and project updates by email."
                    icon={Mail}
                    label="Email notifications"
                    onChange={(value) => update("emailNotifications", value)}
                  />
                  <SettingToggle
                    checked={settings.inAppNotifications}
                    description="Show alerts inside Nova Lance while you work."
                    icon={Bell}
                    label="In-app notifications"
                    onChange={(value) => update("inAppNotifications", value)}
                  />
                  <SettingToggle
                    checked={settings.marketingDigest}
                    description="Get occasional product updates and marketplace tips."
                    icon={Sparkles}
                    label="Product digest"
                    onChange={(value) => update("marketingDigest", value)}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Notification rules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SettingToggle
                    checked={settings.proposalAlerts}
                    description="Notify when clients view, shortlist, or respond to proposals."
                    icon={BriefcaseBusiness}
                    label="Proposal activity"
                    onChange={(value) => update("proposalAlerts", value)}
                  />
                  <SettingToggle
                    checked={settings.messageAlerts}
                    description="Notify immediately for new client messages and attachments."
                    icon={MessageSquare}
                    label="Client messages"
                    onChange={(value) => update("messageAlerts", value)}
                  />
                  <SettingToggle
                    checked={settings.paymentAlerts}
                    description="Notify when milestones clear, payouts start, or invoices change."
                    icon={WalletCards}
                    label="Payments and payouts"
                    onChange={(value) => update("paymentAlerts", value)}
                  />
                  <SettingToggle
                    checked={settings.weeklySummary}
                    description="Send a weekly digest of earnings, response times, and open work."
                    icon={Clock3}
                    label="Weekly summary"
                    onChange={(value) => update("weeklySummary", value)}
                  />
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="security">
            <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Security controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-white/[0.03] p-4">
                    <div className="flex items-center gap-3">
                      <KeyRound className="size-4 text-sky-600 dark:text-sky-300" />
                      <div>
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Password</p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Last updated 43 days ago</p>
                      </div>
                    </div>
                    <Button type="button" variant="outline" className="rounded-xl border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-200">
                      Update
                    </Button>
                  </div>
                  <SettingToggle
                    checked={settings.twoFactor}
                    description="Require an authenticator code when signing in."
                    icon={ShieldCheck}
                    label="Two-factor authentication"
                    onChange={(value) => update("twoFactor", value)}
                  />
                  <SettingToggle
                    checked={settings.loginAlerts}
                    description="Email when a new device or location accesses your account."
                    icon={LockKeyhole}
                    label="Login alerts"
                    onChange={(value) => update("loginAlerts", value)}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
                <CardHeader className="flex-row items-center justify-between gap-3">
                  <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Active sessions</CardTitle>
                  <Badge variant="outline" className="border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                    2 devices
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.device} className="flex items-center justify-between gap-4 rounded-xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-white/[0.03] p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-200">
                          <session.icon className="size-5" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{session.device}</p>
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            {session.location} - {session.lastSeen}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-zinc-400 dark:text-zinc-500" />
                    </div>
                  ))}
                  <Button type="button" variant="destructive" className="w-full rounded-xl">
                    Sign out other sessions
                  </Button>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="workspace">
            <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Workspace defaults</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="workspaceName">Workspace name</Label>
                    <Input
                      id="workspaceName"
                      value={settings.workspaceName}
                      onChange={(event) => update("workspaceName", event.target.value)}
                      className="h-10 border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="defaultRate">Default hourly rate</Label>
                    <Input
                      id="defaultRate"
                      type="number"
                      value={settings.defaultRate}
                      onChange={(event) => update("defaultRate", event.target.value)}
                      className="h-10 border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="visibility">Profile visibility</Label>
                    <Select
                      id="visibility"
                      value={settings.publicProfile ? "Public" : "Private"}
                      onChange={(event) => update("publicProfile", event.target.value === "Public")}
                    >
                      <option>Public</option>
                      <option>Private</option>
                    </Select>
                  </div>
                  <div className="space-y-3 sm:col-span-2">
                    <SettingToggle
                      checked={settings.autoSaveDrafts}
                      description="Keep proposal and profile edits saved locally while you work."
                      icon={Save}
                      label="Autosave drafts"
                      onChange={(value) => update("autoSaveDrafts", value)}
                    />
                    <SettingToggle
                      checked={settings.dataSharing}
                      description="Share anonymized marketplace activity to improve recommendations."
                      icon={Globe2}
                      label="Recommendation data sharing"
                      onChange={(value) => update("dataSharing", value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Connected services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {integrations.map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between gap-4 rounded-xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-white/[0.03] p-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{integration.name}</p>
                        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{integration.detail}</p>
                      </div>
                      <Badge
                        variant={integration.status === "Connected" ? "success" : "outline"}
                        className={integration.status === "Available" ? "border-zinc-200 bg-zinc-100 text-zinc-650 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300" : undefined}
                      >
                        {integration.status}
                      </Badge>
                    </div>
                  ))}
                  <Separator className="bg-zinc-200 dark:bg-white/10" />
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Profile", icon: UserRound },
                      { label: "Privacy", icon: Eye },
                      { label: "Billing", icon: CreditCard },
                    ].map((item) => (
                      <Button
                        key={item.label}
                        type="button"
                        variant="outline"
                        className="h-20 flex-col rounded-xl border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-200"
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-4 z-20 rounded-2xl border border-zinc-200 bg-white/95 dark:border-white/10 dark:bg-zinc-950/85 p-3 shadow-lg dark:shadow-2xl dark:shadow-black/40 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                {isDirty ? "Unsaved settings changes" : "Settings are up to date"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Changes stay local until a backend settings API is connected.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetChanges}
                disabled={!isDirty}
                className="rounded-xl border-zinc-200 bg-white hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-200"
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
              <Button
                type="button"
                onClick={saveChanges}
                disabled={!isDirty || isPending}
                className="rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-sky-100"
              >
                <Save className="size-4" />
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/95 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 shadow-lg dark:shadow-2xl dark:shadow-black/40 backdrop-blur-xl"
        >
          <Check className="size-4 text-emerald-600 dark:text-emerald-300" />
          {toast}
        </motion.div>
      ) : null}
    </div>
  )
}
