"use client"

import { Download, FileArchive, FileText, ImageIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const icons = {
  IMAGE: ImageIcon,
  PDF: FileText,
  ZIP: FileArchive,
  DOC: FileText,
  FILE: FileText,
}

export function FilePreview({
  url,
  name,
  kind = "FILE",
  image,
  size,
  onRemove,
}: {
  url?: string | null
  name?: string | null
  kind?: keyof typeof icons | null
  image?: string | null
  size?: number | null
  onRemove?: () => void
}) {
  const Icon = icons[kind ?? "FILE"] ?? FileText
  const sizeLabel = size ? `${Math.max(1, Math.round(size / 1024))} KB` : null

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/80">
      {image ? (
        <img src={image} alt={name ?? "Attachment"} className="max-h-56 w-full object-cover" />
      ) : null}
      <div className="flex items-center gap-3 p-3">
        <div className={cn("grid size-9 place-items-center rounded-lg", image ? "bg-blue-500/15" : "bg-zinc-800")}>
          <Icon className="size-4 text-blue-200" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-100">{name ?? "Attachment"}</p>
          {sizeLabel ? <p className="text-xs text-zinc-500">{sizeLabel}</p> : null}
        </div>
        {url ? (
          <Button asChild size="icon" variant="ghost" className="size-8 text-zinc-300">
            <a href={url} download target="_blank" rel="noreferrer" aria-label="Download attachment">
              <Download className="size-4" />
            </a>
          </Button>
        ) : null}
        {onRemove ? (
          <Button type="button" size="icon" variant="ghost" className="size-8 text-zinc-300" onClick={onRemove}>
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
