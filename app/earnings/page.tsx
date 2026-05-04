import { WorkspacePage } from "@/app/_components/workspace-page"

export default function EarningsPage() {
  return (
    <WorkspacePage
      title="Earnings"
      description="Monitor paid, pending, and projected income across your freelance work."
      stats={[
        { label: "Available", value: "$8.2k", detail: "Ready to withdraw" },
        { label: "Pending", value: "$4.1k", detail: "In client review" },
        { label: "Projected", value: "$12.4k", detail: "This month" },
      ]}
      items={[
        { title: "Product strategy sprint", meta: "$2,400 paid" },
        { title: "Landing page implementation", meta: "$1,800 pending" },
        { title: "Analytics dashboard", meta: "$4,000 projected" },
      ]}
    />
  )
}
