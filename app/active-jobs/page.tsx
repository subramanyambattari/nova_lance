import { WorkspacePage } from "@/app/_components/workspace-page"

export default function ActiveJobsPage() {
  return (
    <WorkspacePage
      title="Active Jobs"
      description="Keep current contracts, milestones, and delivery dates under control."
      stats={[
        { label: "In progress", value: "5", detail: "Across 4 clients" },
        { label: "Milestones", value: "11", detail: "2 due this week" },
        { label: "At risk", value: "1", detail: "Needs client input" },
      ]}
      items={[
        { title: "Checkout redesign", meta: "Milestone review pending" },
        { title: "Admin reporting module", meta: "Build phase" },
        { title: "Marketing automation setup", meta: "Client feedback needed" },
      ]}
    />
  )
}
