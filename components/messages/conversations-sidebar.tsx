"use client"

import { Archive, Pin, Search } from "lucide-react"

import { OnlineStatus } from "@/components/messages/online-status"
import { TypingIndicator } from "@/components/messages/typing-indicator"
import type { ConversationItem, UserSummary } from "@/components/messages/types"
import { UnreadBadge } from "@/components/messages/unread-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function labelFor(conversation: ConversationItem, currentUserId: number) {
  if (conversation.title) return conversation.title
  const peers = conversation.participants
    .filter((participant) => participant.userId !== currentUserId)
    .map((participant) => participant.user.name ?? participant.user.email)

  return peers.join(", ") || "Conversation"
}

function peerFor(conversation: ConversationItem, currentUserId: number): UserSummary | undefined {
  return conversation.participants.find((participant) => participant.userId !== currentUserId)?.user
}

function formatPreview(conversation: ConversationItem) {
  const message = conversation.latestMessage
  if (!message) return "No messages yet"
  if (message.content) return message.content
  if (message.imageUrl) return "Shared an image"
  if (message.fileUrl) return message.fileName ? `Shared ${message.fileName}` : "Shared a file"
  return "New activity"
}

function relativeTime(value?: string | Date | null) {
  if (!value) return "Offline"
  const diff = Date.now() - new Date(value).getTime()
  if (diff < 60_000) return "Now"
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)}m`
  if (diff < 86_400_000) return `${Math.round(diff / 3_600_000)}h`
  return `${Math.round(diff / 86_400_000)}d`
}

export function ConversationsSidebar({
  conversations,
  currentUserId,
  activeId,
  query,
  archived,
  typing,
  onQueryChange,
  onArchivedChange,
  onSelect,
  onTogglePinned,
  onToggleArchived,
}: {
  conversations: ConversationItem[]
  currentUserId: number
  activeId?: string
  query: string
  archived: boolean
  typing: Record<string, UserSummary | undefined>
  onQueryChange: (value: string) => void
  onArchivedChange: (value: boolean) => void
  onSelect: (conversation: ConversationItem) => void
  onTogglePinned: (conversation: ConversationItem) => void
  onToggleArchived: (conversation: ConversationItem) => void
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-white/10 bg-zinc-950/95">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-white">Messages</h1>
            <p className="text-xs text-zinc-500">Live project conversations</p>
          </div>
          <Button
            type="button"
            variant={archived ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            onClick={() => onArchivedChange(!archived)}
            title="Archived chats"
          >
            <Archive className="size-4" />
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search conversations"
            className="h-10 border-white/10 bg-zinc-900/80 pl-9 text-zinc-100 placeholder:text-zinc-500"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {conversations.length ? (
          conversations.map((conversation) => {
            const peer = peerFor(conversation, currentUserId)
            const isActive = activeId === conversation.id
            const typingUser = typing[conversation.id]

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelect(conversation)}
                className={cn(
                  "group mb-1 grid w-full grid-cols-[1fr_auto] gap-2 rounded-lg p-3 text-left transition",
                  isActive ? "bg-blue-500/15 ring-1 ring-blue-400/30" : "hover:bg-white/[0.055]"
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <OnlineStatus online={peer?.presence?.online} />
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {labelFor(conversation, currentUserId)}
                    </p>
                    {conversation.pinned ? <Pin className="size-3 shrink-0 text-blue-300" /> : null}
                  </div>
                  <div className="mt-1 min-h-4">
                    {typingUser ? (
                      <TypingIndicator label={`${typingUser.name ?? typingUser.email} is typing`} />
                    ) : (
                      <p className="truncate text-xs text-zinc-500">{formatPreview(conversation)}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[11px] text-zinc-500">{relativeTime(conversation.updatedAt)}</span>
                  <UnreadBadge count={conversation.unreadCount} />
                  <div className="hidden gap-1 group-hover:flex">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation()
                        onTogglePinned(conversation)
                      }}
                      className="rounded-md p-1 text-zinc-500 hover:bg-white/10 hover:text-zinc-100"
                    >
                      <Pin className="size-3" />
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(event) => {
                        event.stopPropagation()
                        onToggleArchived(conversation)
                      }}
                      className="rounded-md p-1 text-zinc-500 hover:bg-white/10 hover:text-zinc-100"
                    >
                      <Archive className="size-3" />
                    </span>
                  </div>
                </div>
              </button>
            )
          })
        ) : (
          <div className="p-6 text-center text-sm text-zinc-500">No conversations found.</div>
        )}
      </div>
    </aside>
  )
}
