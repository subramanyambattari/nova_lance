"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export function JobsSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search Next.js Developer, React Remote Jobs, UI/UX Designer..."
        className="h-12 rounded-2xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.045] pl-10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-450 dark:placeholder:text-zinc-500 shadow-sm dark:shadow-2xl dark:shadow-black/10 focus-visible:ring-blue-500/30"
      />
    </div>
  )
}
