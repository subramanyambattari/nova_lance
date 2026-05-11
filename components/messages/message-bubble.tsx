"use client"

import { Check, CheckCheck } from "lucide-react"
import { motion } from "framer-motion"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { FilePreview } from "@/components/messages/file-preview"
import type { MessageItem } from "@/components/messages/types"

function initials(name?: string | null, email?: string) {
  const value = name || email || "U"
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value))
}

export function MessageBubble({
  message,
  mine,
  grouped,
}: {
  message: MessageItem
  mine: boolean
  grouped?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", mine && "justify-end", grouped && "mt-1")}
    >
      {!mine && !grouped ? (
        <Avatar className="mt-1 size-8 border border-white/10">
          <AvatarFallback className="bg-zinc-800 text-xs text-zinc-200">
            {initials(message.sender.name, message.sender.email)}
          </AvatarFallback>
        </Avatar>
      ) : !mine ? (
        <div className="w-8" />
      ) : null}

      <div className={cn("max-w-[82%] sm:max-w-[68%]", mine && "items-end")}>
        {!grouped ? (
          <div className={cn("mb-1 flex items-center gap-2 text-xs text-zinc-500", mine && "justify-end")}>
            <span>{mine ? "You" : message.sender.name ?? message.sender.email}</span>
            <span>{formatTime(message.createdAt)}</span>
          </div>
        ) : null}
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm leading-6 shadow-lg",
            mine
              ? "rounded-br-md bg-blue-600 text-white shadow-blue-950/30"
              : "rounded-bl-md border border-white/10 bg-zinc-900/90 text-zinc-100 shadow-black/20"
          )}
        >
          {message.content ? <p className="whitespace-pre-wrap break-words">{message.content}</p> : null}
          {message.imageUrl || message.fileUrl ? (
            <div className={cn(message.content && "mt-3")}>
              <FilePreview
                url={message.fileUrl ?? message.imageUrl}
                image={message.imageUrl}
                name={message.fileName}
                kind={message.attachmentKind}
                size={message.fileSize}
              />
            </div>
          ) : null}
        </div>
        {mine ? (
          <div className="mt-1 flex justify-end text-[11px] text-zinc-500">
            {message.seen ? (
              <span className="inline-flex items-center gap-1 text-blue-300">
                <CheckCheck className="size-3" /> Seen
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Check className="size-3" /> Sent
              </span>
            )}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
