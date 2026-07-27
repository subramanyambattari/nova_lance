"use client"

import { Search, Sparkles } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/lib/toast"

export function JobsSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-blue-500/10 opacity-0 blur-md transition-opacity group-focus-within:opacity-100 dark:from-blue-500/20 dark:via-violet-500/20 dark:to-blue-500/20" />
      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search for Next.js Developer, React Remote Jobs, UI/UX Designer..."
        className="relative h-14 rounded-2xl border-zinc-200/80 bg-white/80 dark:border-white/10 dark:bg-zinc-950/40 pl-12 pr-32 text-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-sm backdrop-blur-sm transition-all focus-visible:border-blue-400 focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:focus-visible:border-blue-500/50"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <Button 
          variant="secondary" 
          size="sm" 
          className="h-10 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 font-semibold shadow-sm transition-all"
          onClick={() => toast.success("AI search optimizer activated.")}
        >
          <Sparkles className="size-4 mr-1.5" />
          AI Search
        </Button>
      </div>
    </div>
  )
}
