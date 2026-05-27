"use client"

import { AnimatePresence, motion } from "framer-motion"
import { FileUp, ImagePlus, Link2, Loader2, Send, Smile } from "lucide-react"
import { useRef, useState, useEffect } from "react"

import { FilePreview } from "@/components/messages/file-preview"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"

type AttachmentDraft = {
  imageUrl?: string
  fileUrl?: string
  fileName?: string
  fileType?: string
  fileSize?: number
  previewUrl?: string
}

async function uploadFile(file: File) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (cloudName && uploadPreset) {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", uploadPreset)
      formData.append("folder", "nova-lance/messages")

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = (await response.json()) as { secure_url: string }
        return data.secure_url
      }
    } catch (e) {
      console.warn("Cloudinary upload failed, trying local upload fallback...", e)
    }
  }

  // Local fallback upload to our custom upload API route
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(errorData.error ?? "Failed to upload file.")
  }

  const data = (await response.json()) as { url: string }
  return data.url
}

export function MessageInput({
  disabled,
  onSend,
  onTyping,
}: {
  disabled?: boolean
  onSend: (input: { content?: string } & AttachmentDraft) => Promise<void>
  onTyping: (typing: boolean) => void
}) {
  const [content, setContent] = useState("")
  const [attachment, setAttachment] = useState<AttachmentDraft | null>(null)
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const popularEmojis = ["😀", "😂", "🥰", "👍", "🔥", "✨", "🎉", "🚀", "💡", "🙌", "👏", "💻", "💼", "✔️", "❌"]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setEmojiOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function updateTyping(value: string) {
    setContent(value)
    if (!value.trim()) {
      onTyping(false)
      return
    }

    onTyping(true)
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => onTyping(false), 1200)
  }

  async function handleFile(file?: File) {
    if (!file) return
    setUploading(true)

    try {
      const url = await uploadFile(file)
      const isImage = file.type.startsWith("image/")
      setAttachment({
        imageUrl: isImage ? url : undefined,
        fileUrl: isImage ? undefined : url,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      })
      toast.success("Attachment uploaded", file.name)
    } catch (error) {
      toast.error("Upload failed", error instanceof Error ? error.message : "Unable to upload file.")
    } finally {
      setUploading(false)
    }
  }

  function attachFromUrl() {
    const url = window.prompt("Paste a secure file or image URL")
    if (!url) return

    try {
      const parsed = new URL(url)
      const name = parsed.pathname.split("/").pop() || "Attachment"
      const isImage = /\.(png|jpg|jpeg|gif|webp|avif)$/i.test(parsed.pathname)
      setAttachment({
        imageUrl: isImage ? parsed.toString() : undefined,
        fileUrl: isImage ? undefined : parsed.toString(),
        fileName: name,
      })
    } catch {
      toast.error("Invalid URL", "Use a full https:// URL.")
    }
  }

  async function submit() {
    if (disabled || sending || uploading || (!content.trim() && !attachment)) return

    setSending(true)
    try {
      await onSend({ content: content.trim() || undefined, ...(attachment ?? {}) })
      setContent("")
      setAttachment(null)
      onTyping(false)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="relative border-t border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-zinc-950/90 p-3 backdrop-blur-xl">
      {attachment ? (
        <div className="mb-3 max-w-lg">
          <FilePreview
            url={attachment.fileUrl ?? attachment.imageUrl}
            image={attachment.previewUrl ?? attachment.imageUrl}
            name={attachment.fileName}
            size={attachment.fileSize}
            onRemove={() => setAttachment(null)}
          />
        </div>
      ) : null}

      <div className="flex items-end gap-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/90 p-2">
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.zip,.doc,.docx,.txt"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 text-zinc-400 hover:text-zinc-100"
          onClick={() => fileRef.current?.click()}
          disabled={disabled || uploading}
          title="Upload file"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <FileUp className="size-4" />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 text-zinc-400 hover:text-zinc-100"
          onClick={() => fileRef.current?.click()}
          disabled={disabled || uploading}
          title="Upload image"
        >
          <ImagePlus className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 text-zinc-400 hover:text-zinc-100"
          onClick={attachFromUrl}
          disabled={disabled}
          title="Attach URL"
        >
          <Link2 className="size-4" />
        </Button>
        
        <div ref={emojiRef} className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 text-zinc-400 hover:text-zinc-100"
            onClick={() => setEmojiOpen(!emojiOpen)}
            disabled={disabled}
            title="Add emoji"
          >
            <Smile className="size-4" />
          </Button>

          <AnimatePresence>
            {emojiOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-12 left-0 z-50 grid grid-cols-5 gap-1 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950/95 p-2 shadow-2xl backdrop-blur-xl min-w-[200px]"
              >
                {popularEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="grid size-8 place-items-center rounded-lg text-base transition-all hover:bg-white/10 active:scale-95"
                    onClick={() => {
                      setContent((value) => `${value}${emoji}`)
                      setEmojiOpen(false)
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <Textarea
          value={content}
          onChange={(event) => updateTyping(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              void submit()
            }
          }}
          placeholder={disabled ? "Select a conversation" : "Message Nova Lance"}
          className="max-h-36 min-h-10 flex-1 resize-none border-0 bg-transparent px-1 py-2 text-sm text-zinc-900 dark:text-zinc-100 shadow-none placeholder:text-zinc-500 focus-visible:ring-0"
          disabled={disabled}
        />
        <motion.div whileTap={{ scale: 0.94 }}>
          <Button
            type="button"
            size="icon"
            className={cn("size-10 shrink-0 bg-blue-600 text-white hover:bg-blue-500")}
            disabled={disabled || sending || uploading || (!content.trim() && !attachment)}
            onClick={() => void submit()}
            title="Send"
          >
            {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
