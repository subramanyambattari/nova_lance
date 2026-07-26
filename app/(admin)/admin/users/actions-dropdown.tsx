"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, ShieldAlert, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function UserActionsDropdown({ userId, name }: { userId: number, name: string | null }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer outline-none">
          <MoreVertical className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => toast.info(`Viewing profile for: ${name || 'User'}`)} className="gap-2 cursor-pointer">
          <Eye className="size-4" /> View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.warning(`Suspended: ${name || 'User'}`)} className="gap-2 cursor-pointer text-amber-600 focus:text-amber-600">
          <ShieldAlert className="size-4" /> Suspend User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.error(`Deleted: ${name || 'User'}`)} className="gap-2 cursor-pointer text-red-600 focus:text-red-600">
          <Trash2 className="size-4" /> Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
