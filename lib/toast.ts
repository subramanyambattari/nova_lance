"use client"

export type ToastType = "success" | "error" | "loading" | "info"

export type ToastItem = {
  id: string
  type: ToastType
  title: string
  description?: string
}

type Listener = (items: ToastItem[]) => void

let items: ToastItem[] = []
const listeners = new Set<Listener>()

function emit() {
  for (const listener of listeners) {
    listener(items)
  }
}

function push(type: ToastType, title: string, description?: string) {
  const id = crypto.randomUUID()
  items = [...items, { id, type, title, description }]
  emit()

  if (type !== "loading") {
    window.setTimeout(() => dismiss(id), 3600)
  }

  return id
}

export function subscribeToToasts(listener: Listener) {
  listeners.add(listener)
  listener(items)

  return () => {
    listeners.delete(listener)
  }
}

export function dismiss(id: string) {
  items = items.filter((item) => item.id !== id)
  emit()
}

export const toast = {
  success: (title: string, description?: string) => push("success", title, description),
  error: (title: string, description?: string) => push("error", title, description),
  loading: (title: string, description?: string) => push("loading", title, description),
  info: (title: string, description?: string) => push("info", title, description),
  dismiss,
}
