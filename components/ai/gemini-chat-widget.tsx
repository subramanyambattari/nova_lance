"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  Bell,
  Bot,
  Check,
  ChevronDown,
  Loader2,
  Maximize2,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Paperclip,
  RotateCcw,
  Search,
  Send,
  SlidersHorizontal,
  Smile,
  Sparkles,
  ThumbsUp,
  X,
} from "lucide-react"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ChatMessage = {
  id: string
  role: "user" | "model"
  content: string
  createdAt: Date
}

type ConversationTab = "Chats" | "Requests" | "Archived"

type Conversation = {
  id: string
  tab: ConversationTab
  name: string
  handle: string
  subtitle: string
  date: string
  badge: string
  unread?: boolean
  ai?: boolean
  messages: ChatMessage[]
}

type SpeechRecognitionResultLike = {
  0?: {
    transcript?: string
  }
}

type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>
}

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: (() => void) | null
}

const tabs: ConversationTab[] = ["Chats", "Requests", "Archived"]

const initialConversations: Conversation[] = [
  {
    id: "nova",
    tab: "Chats",
    name: "Nova AI",
    handle: "@Nova",
    subtitle: "Freelancer assistant",
    date: "Now",
    badge: "AI",
    ai: true,
    unread: true,
    messages: [
      {
        id: "nova-welcome",
        role: "model",
        content:
          "Hi Subramanyam, I am Nova. I can help draft client replies, improve proposals, plan milestones, or answer questions while you work.",
        createdAt: new Date(),
      },
    ],
  },
  {
    id: "sabrina",
    tab: "Chats",
    name: "Sabrina M.",
    handle: "@FLSabrina",
    subtitle: "Freelancer staff",
    date: "May 5",
    badge: "3 h",
    messages: [
      {
        id: "sabrina-hello",
        role: "model",
        content:
          "Hello Subramanyam! I am Sabrina. Building credibility is your key to accessing exclusive projects and attracting premium clients. Want help shaping your verified profile pitch?",
        createdAt: new Date(),
      },
    ],
  },
  {
    id: "proposal-request",
    tab: "Requests",
    name: "Maya R.",
    handle: "@MayaStudio",
    subtitle: "Brand strategy lead",
    date: "Today",
    badge: "New",
    unread: true,
    messages: [
      {
        id: "request-message",
        role: "model",
        content:
          "Hi Subramanyam, I saw your dashboard work. Could you share availability for a SaaS analytics redesign this week?",
        createdAt: new Date(),
      },
    ],
  },
  {
    id: "archived-client",
    tab: "Archived",
    name: "Ethan K.",
    handle: "@Northstar",
    subtitle: "Past client",
    date: "Apr 28",
    badge: "Done",
    messages: [
      {
        id: "archived-message",
        role: "model",
        content:
          "Thanks again for the mobile app audit. We archived this thread, but you can restore it anytime.",
        createdAt: new Date(),
      },
    ],
  },
]

function timeLabel(date: Date) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date)
}

function previewFor(conversation: Conversation) {
  const text = conversation.messages.at(-1)?.content ?? "No messages yet."
  return text.length > 42 ? `${text.slice(0, 42)}...` : text
}

function speakerLabel(conversation: Conversation) {
  return `${conversation.name} ${conversation.handle}`
}

export function GeminiChatWidget() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<"chat" | "inbox">("chat")
  const [activeTab, setActiveTab] = useState<ConversationTab>("Chats")
  const [activeId, setActiveId] = useState("nova")
  const [query, setQuery] = useState("")
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [attachmentName, setAttachmentName] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ?? conversations[0]

  const filteredConversations = useMemo(() => {
    const search = query.trim().toLowerCase()

    return conversations.filter((conversation) => {
      if (conversation.tab !== activeTab) return false
      if (unreadOnly && !conversation.unread) return false
      if (!search) return true

      return [conversation.name, conversation.handle, conversation.subtitle, previewFor(conversation)]
        .join(" ")
        .toLowerCase()
        .includes(search)
    })
  }, [activeTab, conversations, query, unreadOnly])

  const unreadCount = conversations.filter((conversation) => conversation.unread).length

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [activeConversation?.messages, sending, open])

  function updateConversationMessages(
    conversationId: string,
    updater: (messages: ChatMessage[]) => ChatMessage[]
  ) {
    setConversations((items) =>
      items.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, messages: updater(conversation.messages), unread: false }
          : conversation
      )
    )
  }

  function selectConversation(conversation: Conversation) {
    setActiveId(conversation.id)
    setMobilePanel("chat")
    setMoreOpen(false)
    setConversations((items) =>
      items.map((item) => (item.id === conversation.id ? { ...item, unread: false } : item))
    )
  }

  function moveConversation(conversationId: string, tab: ConversationTab) {
    setConversations((items) =>
      items.map((conversation) => (conversation.id === conversationId ? { ...conversation, tab } : conversation))
    )
    setActiveTab(tab)
    setActiveId(conversationId)
    setMobilePanel("chat")
  }

  function clearActiveConversation() {
    updateConversationMessages(activeConversation.id, () => [
      {
        id: crypto.randomUUID(),
        role: "model",
        content: `${activeConversation.name} is ready for a fresh conversation.`,
        createdAt: new Date(),
      },
    ])
    setMoreOpen(false)
  }

  function startVoiceInput() {
    const browserWindow = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognitionLike
      webkitSpeechRecognition?: new () => SpeechRecognitionLike
    }
    const SpeechRecognition = browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setDraft((value) => `${value}${value ? " " : ""}Voice input is not supported in this browser.`)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim()
      if (transcript) {
        setDraft((value) => `${value}${value ? " " : ""}${transcript}`)
      }
    }
    recognition.onerror = () => {
      setDraft((value) => `${value}${value ? " " : ""}Voice input failed.`)
    }
    recognition.start()
  }

  async function submitMessage(event?: FormEvent<HTMLFormElement>, quickMessage?: string) {
    event?.preventDefault()

    const typedContent = quickMessage ?? draft.trim()
    if ((!typedContent && !attachmentName) || sending) return

    const content = attachmentName
      ? `${typedContent || "Please review this attachment."}\n\nAttachment: ${attachmentName}`
      : typedContent
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date(),
    }
    const conversationId = activeConversation.id
    const nextMessages = [...activeConversation.messages, userMessage]

    updateConversationMessages(conversationId, () => nextMessages)
    setDraft("")
    setAttachmentName("")
    setSending(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            role: message.role,
            content:
              activeConversation.id === "nova"
                ? message.content
                : `${speakerLabel(activeConversation)} thread: ${message.content}`,
          })),
        }),
      })

      const data = (await response.json()) as { reply?: string; error?: string }
      const reply = data.reply

      if (!response.ok || !reply) {
        throw new Error(data.error ?? "Nova could not reply.")
      }

      updateConversationMessages(conversationId, (items) => [
        ...items,
        {
          id: crypto.randomUUID(),
          role: "model",
          content: reply,
          createdAt: new Date(),
        },
      ])
    } catch (error) {
      updateConversationMessages(conversationId, (items) => [
        ...items,
        {
          id: crypto.randomUUID(),
          role: "model",
          content: error instanceof Error ? error.message : "Something went wrong. Please try again.",
          createdAt: new Date(),
        },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "grid overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xl shadow-black/25 md:grid-cols-[minmax(320px,420px)_minmax(300px,440px)]",
              expanded
                ? "h-[calc(100vh-2rem)] w-[calc(100vw-2rem)]"
                : "h-[min(calc(100vh-5rem),620px)] w-[min(calc(100vw-2rem),860px)]"
            )}
          >
            <section
              className={cn(
                "min-h-0 flex-col border-r border-zinc-200 bg-white",
                mobilePanel === "chat" ? "flex" : "hidden md:flex"
              )}
            >
              <div className="flex h-[60px] shrink-0 items-center gap-3 bg-violet-600 px-4 text-white">
                <div className="grid size-9 place-items-center rounded-md bg-white/15">
                  {activeConversation.ai ? <Sparkles className="size-5" /> : <Bot className="size-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {activeConversation.name} {activeConversation.handle}
                  </p>
                  <p className="truncate text-xs text-violet-100">{activeConversation.subtitle}</p>
                </div>
                <div className="relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-white hover:bg-white/15"
                    title="More"
                    onClick={() => setMoreOpen((value) => !value)}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                  {moreOpen ? (
                    <div className="absolute right-0 top-9 w-44 rounded-md border border-zinc-200 bg-white p-1 text-sm text-zinc-900 shadow-xl">
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-zinc-100"
                        onClick={clearActiveConversation}
                      >
                        <RotateCcw className="size-4" />
                        Clear chat
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-zinc-100"
                        onClick={() =>
                          moveConversation(
                            activeConversation.id,
                            activeConversation.tab === "Archived" ? "Chats" : "Archived"
                          )
                        }
                      >
                        <Check className="size-4" />
                        {activeConversation.tab === "Archived" ? "Restore chat" : "Archive chat"}
                      </button>
                    </div>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-white hover:bg-white/15"
                  title={expanded ? "Exit expanded view" : "Expand"}
                  onClick={() => setExpanded((value) => !value)}
                >
                  <Maximize2 className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-white hover:bg-white/15"
                  title="Close chat"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-5">
                <div className="space-y-4">
                  {activeConversation.messages.map((message) => {
                    const mine = message.role === "user"

                    return (
                      <div key={message.id} className={cn("flex", mine && "justify-end")}>
                        <div
                          className={cn(
                            "max-w-[82%] rounded-lg px-3.5 py-2.5 text-sm leading-6 shadow-sm",
                            mine
                              ? "rounded-br-sm bg-blue-600 text-white"
                              : "rounded-bl-sm bg-zinc-100 text-zinc-950"
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                          <p className={cn("mt-2 text-right text-[11px]", mine ? "text-blue-100" : "text-zinc-600")}>
                            {timeLabel(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  {sending ? (
                    <div className="flex">
                      <div className="inline-flex items-center gap-2 rounded-lg rounded-bl-sm bg-zinc-100 px-3.5 py-2.5 text-sm text-zinc-700">
                        <Loader2 className="size-4 animate-spin" />
                        Nova is typing
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <form onSubmit={(event) => void submitMessage(event)} className="shrink-0 border-t border-blue-500 bg-white p-3">
                {attachmentName ? (
                  <div className="mb-2 flex items-center justify-between gap-3 rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-900">
                    <span className="min-w-0 truncate">{attachmentName}</span>
                    <button type="button" className="font-medium" onClick={() => setAttachmentName("")}>
                      Remove
                    </button>
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(event) => setAttachmentName(event.target.files?.[0]?.name ?? "")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-zinc-600"
                    title="Attach"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="size-5" />
                  </Button>
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Type a message"
                    className="h-10 min-w-0 flex-1 bg-transparent text-sm text-zinc-950 outline-none placeholder:text-zinc-400"
                  />
                  <Button type="button" variant="ghost" size="icon" className="text-zinc-700" title="Voice" onClick={startVoiceInput}>
                    <Mic className="size-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-zinc-700"
                    title="Add friendly tone"
                    onClick={() => setDraft((value) => `${value}${value ? " " : ""}Please make this friendly and concise.`)}
                  >
                    <Smile className="size-5" />
                  </Button>
                  <Button
                    type={draft.trim() || attachmentName ? "submit" : "button"}
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:text-blue-700"
                    title={draft.trim() || attachmentName ? "Send" : "Quick thanks"}
                    disabled={sending}
                    onClick={
                      draft.trim() || attachmentName ? undefined : () => void submitMessage(undefined, "Thanks, this helps.")
                    }
                  >
                    {sending ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : draft.trim() || attachmentName ? (
                      <Send className="size-5" />
                    ) : (
                      <ThumbsUp className="size-5" />
                    )}
                  </Button>
                </div>
              </form>
            </section>

            <aside
              className={cn(
                "min-h-0 flex-col bg-white text-zinc-950",
                mobilePanel === "inbox" ? "flex" : "hidden md:flex"
              )}
            >
              <div className="flex h-[60px] shrink-0 items-center gap-3 bg-zinc-950 px-5 text-white">
                <h2 className="text-lg font-semibold">Messages</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className={cn("ml-auto text-white hover:bg-white/10", unreadCount && "text-blue-200")}
                  title="Unread messages"
                  onClick={() => setUnreadOnly((value) => !value)}
                >
                  <Bell className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-white hover:bg-white/10"
                  title="Collapse"
                  onClick={() => setOpen(false)}
                >
                  <ChevronDown className="size-5" />
                </Button>
              </div>

              <div className="shrink-0 space-y-4 p-5">
                <label className="flex h-14 items-center gap-3 rounded-full border border-zinc-300 px-4 text-zinc-500">
                  <Search className="size-6 text-zinc-900" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search"
                    className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500"
                  />
                  <button
                    type="button"
                    className={cn("grid size-8 place-items-center rounded-full", unreadOnly && "bg-blue-100 text-blue-700")}
                    title={unreadOnly ? "Show all messages" : "Show unread only"}
                    onClick={() => setUnreadOnly((value) => !value)}
                  >
                    <SlidersHorizontal className="size-5" />
                  </button>
                </label>

                <div className="flex gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={cn(
                        "h-9 rounded-full border border-zinc-300 px-4 text-sm transition-colors hover:bg-zinc-100",
                        activeTab === tab && "bg-blue-100 font-semibold text-zinc-950"
                      )}
                      onClick={() => {
                        setActiveTab(tab)
                        setMobilePanel("inbox")
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
                {filteredConversations.length ? (
                  <div className="space-y-2">
                    {filteredConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-3 py-3 text-left hover:bg-blue-100",
                          activeId === conversation.id ? "bg-blue-200" : "bg-white"
                        )}
                        onClick={() => selectConversation(conversation)}
                      >
                        <div className="relative grid size-12 shrink-0 place-items-center rounded-md bg-white text-blue-600 shadow-sm ring-1 ring-zinc-100">
                          {conversation.ai ? <Sparkles className="size-7" /> : <Bot className="size-7" />}
                          <span className="absolute -bottom-1 -right-1 rounded-full bg-white px-1.5 py-0.5 text-[11px] text-zinc-700 shadow-sm">
                            {conversation.badge}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-center gap-1">
                            <p className="truncate text-sm font-semibold">{conversation.name}</p>
                            <p className="truncate text-sm">{conversation.handle}</p>
                          </div>
                          <p className="truncate text-sm text-zinc-800">{previewFor(conversation)}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <span className="text-sm text-zinc-800">{conversation.date}</span>
                          {conversation.unread ? <span className="size-2 rounded-full bg-blue-600" /> : null}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid h-36 place-items-center rounded-md border border-dashed border-zinc-300 text-sm text-zinc-500">
                    No messages found.
                  </div>
                )}
              </div>

              {activeTab === "Requests" && filteredConversations.length ? (
                <div className="flex gap-2 border-t border-zinc-200 p-3">
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => moveConversation(filteredConversations[0].id, "Chats")}
                  >
                    Accept
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => moveConversation(filteredConversations[0].id, "Archived")}
                  >
                    Archive
                  </Button>
                </div>
              ) : null}

              {activeTab === "Archived" && filteredConversations.length ? (
                <div className="border-t border-zinc-200 p-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => moveConversation(filteredConversations[0].id, "Chats")}
                  >
                    Restore selected chat
                  </Button>
                </div>
              ) : null}
            </aside>

            <div className="absolute bottom-3 left-3 flex gap-2 md:hidden">
              <Button
                type="button"
                size="sm"
                variant={mobilePanel === "chat" ? "default" : "secondary"}
                onClick={() => setMobilePanel("chat")}
              >
                Chat
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mobilePanel === "inbox" ? "default" : "secondary"}
                onClick={() => setMobilePanel("inbox")}
              >
                Inbox
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
            <Button
              type="button"
              className="h-14 rounded-full bg-violet-600 px-5 text-white shadow-xl shadow-violet-950/25 hover:bg-violet-500"
              onClick={() => {
                setOpen(true)
                setMobilePanel("chat")
              }}
            >
              <MessageCircle className="size-5" />
              Ask Nova
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
