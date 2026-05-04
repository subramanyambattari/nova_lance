import { WorkspacePage } from "@/app/_components/workspace-page"

export default function SettingsPage() {
  return (
    <WorkspacePage
      title="Settings"
      description="Control account preferences, notifications, billing details, and workspace defaults."
      stats={[
        { label: "Notifications", value: "On", detail: "Email and in-app" },
        { label: "Security", value: "Good", detail: "2FA recommended" },
        { label: "Billing", value: "Active", detail: "Primary payout set" },
      ]}
      items={[
        { title: "Account preferences", meta: "Name, timezone, language" },
        { title: "Notification rules", meta: "Messages, proposals, payments" },
        { title: "Payout details", meta: "Bank and tax information" },
      ]}
    />
  )
}
