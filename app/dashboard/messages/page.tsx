import { redirect } from "next/navigation"

export default async function DashboardMessagesPage() {
  redirect("/messages")
}
