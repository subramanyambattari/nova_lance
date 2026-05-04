import { WorkspacePage } from "@/app/_components/workspace-page"

export default function ProfilePage() {
  return (
    <WorkspacePage
      title="Profile"
      description="Maintain the profile details clients use to evaluate your skills, availability, and work history."
      stats={[
        { label: "Profile score", value: "96%", detail: "Strong client signal" },
        { label: "Portfolio items", value: "12", detail: "4 featured" },
        { label: "Availability", value: "20h", detail: "Per week" },
      ]}
      items={[
        { title: "Senior Product Designer", meta: "Primary headline" },
        { title: "B2B SaaS case study", meta: "Featured portfolio" },
        { title: "React and Next.js", meta: "Highlighted skills" },
      ]}
    />
  )
}
