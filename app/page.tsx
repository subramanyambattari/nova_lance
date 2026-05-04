import { WorkspacePage } from "@/app/_components/workspace-page";

export default function Home() {
  return (
    <WorkspacePage
      title="Overview"
      description="Track your freelance pipeline, recent activity, and the work that needs attention today."
      stats={[
        { label: "Open proposals", value: "8", detail: "3 awaiting replies" },
        { label: "Active jobs", value: "5", detail: "2 milestones due soon" },
        { label: "This month", value: "$12.4k", detail: "Projected earnings" },
      ]}
      items={[
        { title: "Mobile app onboarding audit", meta: "Proposal sent today" },
        { title: "SaaS landing page redesign", meta: "Milestone due Friday" },
        { title: "Analytics dashboard build", meta: "Contract in progress" },
      ]}
    />
  );
}
