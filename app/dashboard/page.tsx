import { WorkspacePage } from "@/app/_components/workspace-page"

export default function DashboardPage() {
  return (
    <WorkspacePage
      title="Dashboard"
      description="A focused view of workload, client momentum, and the next actions across your workspace."
      stats={[
        { label: "Tasks due", value: "14", detail: "6 scheduled this week" },
        { label: "Client replies", value: "9", detail: "4 need follow-up" },
        { label: "Completion rate", value: "92%", detail: "Across active jobs" },
      ]}
      items={[
        { title: "Review contract terms", meta: "Fintech UX sprint" },
        { title: "Send weekly update", meta: "Brand system rollout" },
        { title: "Prepare kickoff notes", meta: "Marketplace research" },
      ]}
    />
  )
}
