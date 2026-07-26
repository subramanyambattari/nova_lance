"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, ExternalLink, Flag, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function JobActionsDropdown({ jobId, title }: { jobId: string, title: string }) {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer outline-none">
          <MoreVertical className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => router.push(`/jobs/${jobId}`)} className="gap-2 cursor-pointer">
          <ExternalLink className="size-4" /> View Job
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.warning(`Flagged Job: ${title}`)} className="gap-2 cursor-pointer text-amber-600 focus:text-amber-600">
          <Flag className="size-4" /> Flag Job
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.error(`Removed Job: ${title}`)} className="gap-2 cursor-pointer text-red-600 focus:text-red-600">
          <Trash2 className="size-4" /> Remove Job
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
