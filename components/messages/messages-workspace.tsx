"use client"

import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Bell, FileText, Info, MessageSquarePlus, Users } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

import { ChatWindow } from "@/components/messages/chat-window"
import { ConversationsSidebar } from "@/components/messages/conversations-sidebar"
import type { ConversationItem, MessageItem, UserSummary } from "@/components/messages/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import { useWebSocket } from "@/components/websocket-provider"

type ConversationsResponse = {
  conversations: ConversationItem[]
  currentUser: UserSummary
}

type NotificationItem = {
  id: string
  title: string
  body: string | null
  readAt: string | null
  createdAt: string
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15_000,
      refetchOnWindowFocus: true,
    },
  },
})

async function fetchConversations(query: string, archived: boolean) {
  const params = new URLSearchParams()
  if (query) params.set("q", query)
  if (archived) params.set("archived", "true")

  const response = await fetch(`/api/conversations?${params.toString()}`)
  if (!response.ok) throw new Error("Unable to load conversations.")
  return (await response.json()) as ConversationsResponse
}

async function fetchNotifications() {
  const response = await fetch("/api/notifications")
  if (!response.ok) throw new Error("Unable to load notifications.")
  return (await response.json()) as { notifications: NotificationItem[]; unread: number }
}

async function fetchUsers(query: string) {
  const params = new URLSearchParams()
  if (query) params.set("q", query)

  const response = await fetch(`/api/users?${params.toString()}`)
  if (!response.ok) throw new Error("Unable to search users.")
  return (await response.json()) as { users: UserSummary[] }
}

function WorkspaceInner() {
  const [query, setQuery] = useState("")
  const [archived, setArchived] = useState(false)
  const [activeId, setActiveId] = useState<string>()
  const [mobileChatOpen, setMobileChatOpen] = useState(false)
  const [liveMessages, setLiveMessages] = useState<MessageItem[]>([])
  const [typing, setTyping] = useState<Record<string, UserSummary | undefined>>({})
  const [userQuery, setUserQuery] = useState("")
  
  // Custom dialog state for deleting conversations without browser alert
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  
  const client = useQueryClient()

  const conversationsQuery = useQuery({
    queryKey: ["conversations", query, archived],
    queryFn: () => fetchConversations(query, archived),
    placeholderData: (prev: any) => prev,
  })
  const notificationsQuery = useQuery({ queryKey: ["notifications"], queryFn: fetchNotifications })
  const usersQuery = useQuery({
    queryKey: ["users", userQuery],
    queryFn: () => fetchUsers(userQuery),
    enabled: true,
  })

  const activeConversationId = activeId ?? (conversationsQuery.data?.conversations?.[0]?.id)
  
  const filesQuery = useQuery({
    queryKey: ["messages-files", activeConversationId],
    queryFn: async () => {
      if (!activeConversationId) return []
      const res = await fetch(`/api/messages?conversationId=${activeConversationId}&filter=files`)
      if (!res.ok) return []
      const data = await res.json()
      return (data.messages || []) as MessageItem[]
    },
    enabled: Boolean(activeConversationId)
  })

  const currentUser = conversationsQuery.data?.currentUser
  const conversations = useMemo(() => conversationsQuery.data?.conversations ?? [], [conversationsQuery.data?.conversations])
  const activeConversation = conversations.find((conversation) => conversation.id === activeId) ?? conversations[0]

  useEffect(() => {
    const handleMessage = (e: Event) => {
      const payload = (e as CustomEvent).detail;
      setLiveMessages((items) => {
        if (items.some((item) => item.id === payload.message.id)) return items
        return [...items, payload.message]
      })
      void client.invalidateQueries({ queryKey: ["conversations"] })
      void client.invalidateQueries({ queryKey: ["messages", payload.conversationId] })
    };

    const handleTyping = (e: Event) => {
      const payload = (e as CustomEvent).detail;
      setTyping((value) => ({ ...value, [payload.conversationId]: payload.user }))
      window.setTimeout(() => {
        setTyping((value) => ({ ...value, [payload.conversationId]: undefined }))
      }, 2200)
    };

    window.addEventListener("ws-chat-message", handleMessage);
    window.addEventListener("ws-typing", handleTyping);

    return () => {
      window.removeEventListener("ws-chat-message", handleMessage);
      window.removeEventListener("ws-typing", handleTyping);
      void fetch("/api/users/status", { method: "PATCH" })
    }
  }, [client])

  const sendMutation = useMutation({
    mutationFn: async (input: {
      content?: string
      imageUrl?: string
      fileUrl?: string
      fileName?: string
      fileType?: string
      fileSize?: number
    }) => {
      if (!activeConversation) throw new Error("Select a conversation.")
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...input, conversationId: activeConversation.id }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? "Unable to send message.")
      return data.message as MessageItem
    },
    onSuccess: (message) => {
      setLiveMessages((items) => {
        if (items.some((item) => item.id === message.id)) return items
        return [...items, message]
      })
      void client.invalidateQueries({ queryKey: ["conversations"] })
      void client.invalidateQueries({ queryKey: ["messages", activeConversation?.id] })
    },
    onError: (error) => {
      toast.error("Message not sent", error instanceof Error ? error.message : "Try again.")
    },
  })

  const toggleMutation = useMutation({
    mutationFn: async (input: { conversationId: string; pinned?: boolean; archived?: boolean }) => {
      const response = await fetch("/api/conversations", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!response.ok) throw new Error("Unable to update conversation.")
    },
    onSuccess: () => void client.invalidateQueries({ queryKey: ["conversations"] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await fetch(`/api/conversations?conversationId=${conversationId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Unable to delete conversation.")
    },
    onSuccess: (_, conversationId) => {
      client.invalidateQueries({ queryKey: ["conversations"] })
      if (activeId === conversationId) {
        setActiveId(undefined)
      }
    },
  })

  const createConversationMutation = useMutation({
    mutationFn: async (participantId: number) => {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ participantIds: [participantId] }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? "Unable to start conversation.")
      return data.conversation as ConversationItem
    },
    onSuccess: (conversation) => {
      setActiveId(conversation.id)
      setUserQuery("")
      void client.invalidateQueries({ queryKey: ["conversations"] })
    },
    onError: (error) => {
      toast.error("Conversation not started", error instanceof Error ? error.message : "Try again.")
    },
  })

  const markSeen = useCallback(() => {
    if (!activeConversation) return
    void fetch("/api/messages/seen", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ conversationId: activeConversation.id }),
    }).then(() => {
      void client.invalidateQueries({ queryKey: ["conversations"] })
    })
  }, [activeConversation, client])

  const { sendMessage } = useWebSocket();

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!activeConversation) return
      sendMessage("typing", { conversationId: activeConversation.id, isTyping });
      void fetch("/api/users/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId: activeConversation.id, typing: isTyping }),
      })
    },
    [activeConversation, sendMessage]
  )

  const activePeers = useMemo(() => {
    if (!activeConversation || !currentUser) return []
    return activeConversation.participants
      .filter((participant) => participant.userId !== currentUser.id)
      .map((participant) => participant.user)
  }, [activeConversation, currentUser])

  if (!currentUser) {
    return (
      <div className="grid min-h-[calc(100vh-3rem)] place-items-center bg-zinc-950 p-6 text-center text-zinc-400">
        <div>
          <p className="text-sm">
            {conversationsQuery.isError ? "Unable to load messages." : "Loading workspace..."}
          </p>
          {conversationsQuery.isError ? (
            <Button
              type="button"
              variant="secondary"
              className="mt-4 border-white/10 bg-white/5"
              onClick={() => void conversationsQuery.refetch()}
            >
              Retry
            </Button>
          ) : null}
        </div>
      </div>
    )
  }
  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="grid flex-1 min-h-0 lg:grid-cols-[360px_minmax(0,1fr)_300px]">
        <div className={cn("min-h-0 flex flex-col", mobileChatOpen && "hidden lg:block lg:flex lg:flex-col")}>
          <ConversationsSidebar
            conversations={conversations}
            currentUserId={currentUser.id}
            activeId={activeConversation?.id}
            query={query}
            archived={archived}
            typing={typing}
            onQueryChange={setQuery}
            onArchivedChange={setArchived}
            onSelect={(conversation) => {
              setActiveId(conversation.id)
              setMobileChatOpen(true)
            }}
            onTogglePinned={(conversation) =>
              toggleMutation.mutate({ conversationId: conversation.id, pinned: !conversation.pinned })
            }
            onToggleArchived={(conversation) => {
              setConversationToDelete(conversation.id)
            }}
          />
        </div>

        <ChatWindow
          conversation={activeConversation}
          currentUserId={currentUser.id}
          liveMessages={liveMessages}
          typingUser={activeConversation ? typing[activeConversation.id] : undefined}
          mobileOpen={mobileChatOpen}
          onBack={() => setMobileChatOpen(false)}
          onSend={async (input) => {
            await sendMutation.mutateAsync(input)
          }}
          onTyping={sendTyping}
          onSeen={markSeen}
        />

        <aside className="hidden min-h-0 border-l border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 lg:flex lg:flex-col">
          <div className="border-b border-zinc-200 dark:border-white/10 p-4">
            <div className="flex items-center gap-2">
              <Info className="size-4 text-blue-300" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Conversation</h2>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              {activePeers.length ? activePeers.map((peer) => peer.name ?? peer.email).join(", ") : "No active chat selected"}
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-28">
            <div className="rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-zinc-900/70 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                <Users className="size-4 text-blue-300" />
                Participants
              </div>
            <div className="mt-3 space-y-3">
                {[currentUser, ...activePeers].map((user) => (
                  <div key={user.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-zinc-700 dark:text-zinc-300">{user.name ?? user.email}</span>
                    <Badge variant="secondary" className="shrink-0 border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-[10px] text-zinc-800 dark:text-zinc-300">
                      {user.id === currentUser.id ? "You" : user.presence?.online ? "Online" : "Away"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-zinc-900/70 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                <MessageSquarePlus className="size-4 text-blue-300" />
                Start chat
              </div>
              <Input
                value={userQuery}
                onChange={(event) => setUserQuery(event.target.value)}
                placeholder="Search users by name or email"
                className="mt-3 h-9 border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950/80 text-xs text-zinc-900 dark:text-zinc-100"
              />
              <div className="mt-3 max-h-[240px] overflow-y-auto space-y-2 pr-1">
                {(usersQuery.data?.users ?? []).map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className="flex w-full items-center justify-between gap-3 rounded-md bg-zinc-200/50 dark:bg-zinc-950/70 p-2 text-left text-xs text-zinc-750 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-white/10"
                    onClick={() => createConversationMutation.mutate(user.id)}
                  >
                    <span className="min-w-0 truncate">{user.name ?? user.email}</span>
                    <Badge variant="secondary" className="shrink-0 bg-zinc-200 dark:bg-white/5 text-[10px]">
                      Chat
                    </Badge>
                  </button>
                ))}
                {userQuery.trim().length > 0 && !usersQuery.isLoading && !usersQuery.data?.users.length ? (
                  <p className="text-xs text-zinc-500">No users found.</p>
                ) : null}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-zinc-900/70 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                <Bell className="size-4 text-blue-300" />
                Notifications
                {notificationsQuery.data?.unread ? <Badge className="ml-auto bg-blue-600">{notificationsQuery.data.unread}</Badge> : null}
              </div>
              <div className="mt-3 space-y-2">
                {(notificationsQuery.data?.notifications ?? []).slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-md bg-zinc-200/50 dark:bg-zinc-950/70 p-2">
                    <p className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-200">{item.title}</p>
                    {item.body ? <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{item.body}</p> : null}
                  </div>
                ))}
                {!notificationsQuery.data?.notifications.length ? (
                  <p className="text-xs text-zinc-500">No notifications yet.</p>
                ) : null}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-zinc-900/70 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                <FileText className="size-4 text-blue-300" />
                Shared files
              </div>
              <div className="mt-3 space-y-2">
                {filesQuery.data?.slice(0, 5).map((msg) => (
                  <a key={msg.id} href={msg.fileUrl!} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-md bg-zinc-200/50 dark:bg-zinc-950/70 p-2 hover:bg-zinc-200 dark:hover:bg-white/10 text-xs text-zinc-700 dark:text-zinc-300">
                    <FileText className="size-3.5 shrink-0" />
                    <span className="truncate">{msg.fileName || "Attachment"}</span>
                  </a>
                ))}
                {!filesQuery.data?.length ? (
                  <p className="text-xs text-zinc-500">No files shared in this conversation.</p>
                ) : null}
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-200 dark:border-white/10 p-4">
            <Button
              type="button"
              variant="secondary"
              className="w-full border-zinc-200 dark:border-white/10 bg-zinc-150 dark:bg-white/5 text-zinc-800 dark:text-zinc-100"
              onClick={() => void fetch("/api/notifications", { method: "PATCH" }).then(() => client.invalidateQueries({ queryKey: ["notifications"] }))}
            >
              Mark notifications read
            </Button>
          </div>
        </aside>
      </div>

      {conversationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Delete conversation?</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              This action cannot be undone. This will permanently delete your chat history.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setConversationToDelete(null)}
                className="rounded-xl border-zinc-200 dark:border-white/10"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  deleteMutation.mutate(conversationToDelete)
                  setConversationToDelete(null)
                }}
                className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete forever"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function MessagesWorkspace() {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkspaceInner />
    </QueryClientProvider>
  )
}
