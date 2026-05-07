"use client"

import { CheckCircle2, Info, Loader2, X, XCircle } from "lucide-react"
import { useEffect, useState } from "react"

import { dismiss, subscribeToToasts, type ToastItem } from "@/lib/toast"
import { cn } from "@/lib/utils"

const icons = {
  success: CheckCircle2,
  error: XCircle,
  loading: Loader2,
  info: Info,
}

const styles = {
  success: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
  error: "border-rose-400/20 bg-rose-500/10 text-rose-100",
  loading: "border-blue-400/20 bg-blue-500/10 text-blue-100",
  info: "border-zinc-400/20 bg-zinc-800/90 text-zinc-100",
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => subscribeToToasts(setToasts), [])

  return (
    <div className="fixed right-4 top-16 z-[100] grid w-[calc(100vw-2rem)] max-w-sm gap-2">
      {toasts.map((item) => {
        const Icon = icons[item.type]

        return (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-3 rounded-xl border bg-zinc-950/95 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl",
              styles[item.type]
            )}
          >
            <Icon className={cn("mt-0.5 size-4 shrink-0", item.type === "loading" && "animate-spin")} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              {item.description ? <p className="mt-0.5 text-xs opacity-80">{item.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              className="rounded-md p-1 text-current/60 hover:bg-white/10 hover:text-current"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
