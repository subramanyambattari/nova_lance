import { WorkspacePage } from "@/app/_components/workspace-page"

export default function ProposalsPage() {
  return (
    <WorkspacePage
      title="Proposals"
      description="Manage drafts, submitted proposals, and client responses from one place."
      stats={[
        { label: "Submitted", value: "8", detail: "This month" },
        { label: "Drafts", value: "3", detail: "Ready for review" },
        { label: "Response rate", value: "41%", detail: "Last 30 days" },
      ]}
      items={[
        { title: "CRM migration planning", meta: "Awaiting response" },
        { title: "Portfolio site rebuild", meta: "Draft proposal" },
        { title: "Design system cleanup", meta: "Interview requested" },
      ]}
    />
  )
}
