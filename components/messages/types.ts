export type UserSummary = {
  id: number
  name: string | null
  email: string
  presence?: {
    online: boolean
    lastActiveAt: string | Date
  } | null
}

export type MessageItem = {
  id: string
  content: string | null
  imageUrl: string | null
  fileUrl: string | null
  fileName: string | null
  fileType: string | null
  fileSize: number | null
  attachmentKind: "IMAGE" | "PDF" | "ZIP" | "DOC" | "FILE" | null
  seen: boolean
  createdAt: string
  senderId: number
  conversationId: string
  sender: UserSummary
}

export type ConversationItem = {
  id: string
  title: string | null
  projectId: string | null
  createdAt: string
  updatedAt: string
  pinned: boolean
  archived: boolean
  unreadCount: number
  latestMessage: MessageItem | null
  participants: Array<{
    id: string
    userId: number
    conversationId: string
    pinned: boolean
    archived: boolean
    lastReadAt: string | null
    lastSeenAt: string | null
    user: UserSummary
  }>
}
