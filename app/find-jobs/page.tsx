import { WorkspacePage } from "@/app/_components/workspace-page"

export default function FindJobsPage() {
  return (
    <WorkspacePage
      title="Find Jobs"
      description="Discover matched opportunities and decide which roles are worth a proposal."
      stats={[
        { label: "Strong matches", value: "24", detail: "Updated today" },
        { label: "Saved searches", value: "6", detail: "3 high-intent feeds" },
        { label: "Avg budget", value: "$4.8k", detail: "For matched jobs" },
      ]}
      items={[
        { title: "B2B marketplace product designer", meta: "$6k fixed price" },
        { title: "React dashboard performance pass", meta: "$80/hr hourly" },
        { title: "AI workflow landing page", meta: "$3.5k fixed price" },
      ]}
    />
  )
}
