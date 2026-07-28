"use client"

import { ArrowLeft, Bell, CheckCheck, Filter, Search } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { MessageBubble } from "@/components/messages/message-bubble"
import { MessageInput } from "@/components/messages/message-input"
import { OnlineStatus } from "@/components/messages/online-status"
import { TypingIndicator } from "@/components/messages/typing-indicator"
import type { ConversationItem, MessageItem, UserSummary } from "@/components/messages/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function conversationTitle(conversation: ConversationItem, currentUserId: number) {
  if (conversation.title) return conversation.title
  return (
    conversation.participants
      .filter((participant) => participant.userId !== currentUserId)
      .map((participant) => participant.user.name ?? participant.user.email)
      .join(", ") || "Conversation"
  )
}

function peers(conversation: ConversationItem, currentUserId: number) {
  return conversation.participants
    .filter((participant) => participant.userId !== currentUserId)
    .map((participant) => participant.user)
}

async function getMessages(conversationId: string, query: string, filter: string) {
  const params = new URLSearchParams({ conversationId })
  if (query) params.set("q", query)
  if (filter !== "all") params.set("filter", filter)

  const response = await fetch(`/api/messages?${params.toString()}`)
  if (!response.ok) throw new Error("Unable to load messages.")
  return (await response.json()) as { messages: MessageItem[]; nextCursor: string | null }
}

export function ChatWindow({
  conversation,
  currentUserId,
  liveMessages,
  typingUser,
  mobileOpen,
  onBack,
  onSend,
  onTyping,
  onSeen,
}: {
  conversation?: ConversationItem
  currentUserId: number
  liveMessages: MessageItem[]
  typingUser?: UserSummary
  mobileOpen?: boolean
  onBack: () => void
  onSend: (input: Parameters<typeof MessageInput>[0]["onSend"] extends (arg: infer A) => Promise<void> ? A : never) => Promise<void>
  onTyping: (typing: boolean) => void
  onSeen: () => void
}) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const bottomRef = useRef<HTMLDivElement>(null)
  const conversationId = conversation?.id

  const { data, isLoading } = useQuery({
    queryKey: ["messages", conversationId, query, filter],
    queryFn: () => getMessages(conversationId!, query, filter),
    enabled: Boolean(conversationId),
  })

  const messages = useMemo(() => {
    const byId = new Map<string, MessageItem>()
    for (const message of data?.messages ?? []) byId.set(message.id, message)
    for (const message of liveMessages) {
      if (message.conversationId === conversationId) byId.set(message.id, message)
    }
    return Array.from(byId.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
  }, [conversationId, data?.messages, liveMessages])

  const peerList = conversation ? peers(conversation, currentUserId) : []
  const primaryPeer = peerList[0]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length, conversationId])

  useEffect(() => {
    if (!conversationId) return
    onSeen()
  }, [conversationId, messages.length, onSeen])

  if (!conversation) {
    return (
      <section className="hidden h-full min-h-0 flex-col bg-white dark:bg-zinc-950 lg:flex">
        <div className="grid h-full place-items-center p-6 text-center">
          <div>
            <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900">
              <Bell className="size-6 text-blue-300" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">Select a conversation</h2>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Messages, typing updates, read receipts, and notifications will sync here in real time.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className={cn(
        "h-full w-full bg-white dark:bg-zinc-950",
        mobileOpen ? "fixed inset-0 z-40 flex flex-col lg:static" : "hidden lg:flex lg:flex-col"
      )}
    >
      <header className="flex-none flex h-16 items-center gap-3 border-b border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 px-4 backdrop-blur-xl">
        <Button type="button" variant="ghost" size="icon" className="size-9 lg:hidden" onClick={onBack}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <OnlineStatus online={primaryPeer?.presence?.online} />
            <h2 className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
              {conversationTitle(conversation, currentUserId)}
            </h2>
          </div>
          <p className="truncate text-xs text-zinc-500">
            {peerList.length} participant{peerList.length === 1 ? "" : "s"}
            {primaryPeer?.presence?.online ? " · Online" : ""}
          </p>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search messages"
              className="h-9 w-52 border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-zinc-900/80 pl-8 text-xs text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2 text-zinc-600 dark:text-zinc-300"
            onClick={() => setFilter((value) => (value === "all" ? "files" : value === "files" ? "images" : "all"))}
          >
            <Filter className="size-4" />
            {filter}
          </Button>
        </div>
      </header>

      <div className="relative flex-1 min-h-0 w-full overflow-y-auto px-4 py-5">
        {isLoading ? (
          <div className="text-sm text-zinc-500">Loading messages...</div>
        ) : messages.length ? (
          <div className="space-y-3">
            {messages.map((message, index) => {
              const previous = messages[index - 1]
              const grouped =
                previous?.senderId === message.senderId &&
                new Date(message.createdAt).getTime() - new Date(previous.createdAt).getTime() < 4 * 60_000

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  mine={message.senderId === currentUserId}
                  grouped={grouped}
                />
              )
            })}
            {typingUser ? <TypingIndicator label={`${typingUser.name ?? typingUser.email} is typing`} /> : null}
            <div ref={bottomRef} />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
            <div>
              <CheckCheck className="mx-auto size-8 text-blue-300" />
              <p className="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-200">No messages yet</p>
              <p className="mt-1 text-xs text-zinc-500">Start the project discussion below.</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-none">
        <MessageInput disabled={!conversationId} onSend={onSend} onTyping={onTyping} />
      </div>
    </section>
  )
}
