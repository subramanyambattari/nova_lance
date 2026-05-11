import { MessagesWorkspace } from "@/components/messages/messages-workspace"
import { requireUser } from "@/lib/auth"

export default async function MessagesPage() {
  await requireUser()

  return <MessagesWorkspace />
}
