import { WorkspacePage } from "@/app/_components/workspace-page"

export default function MessagesPage() {
  return (
    <WorkspacePage
      title="Messages"
      description="Review client conversations, unread threads, and messages tied to open work."
      stats={[
        { label: "Unread", value: "4", detail: "2 from active clients" },
        { label: "Follow-ups", value: "7", detail: "Due this week" },
        { label: "Avg reply", value: "2h", detail: "Last 14 days" },
      ]}
      items={[
        { title: "Nora Patel", meta: "Shared feedback on wireframes" },
        { title: "Atlas Labs", meta: "Asked for a revised timeline" },
        { title: "Blue Finch", meta: "Approved discovery notes" },
      ]}
    />
  )
}
