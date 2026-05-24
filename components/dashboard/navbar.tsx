"use client"

import { Bell, ChevronDown, Search, Sparkles } from "lucide-react"
import Link from "next/link"

import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export function DashboardNavbar() {
  return (
    <div className="sticky top-12 z-10 border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="relative min-w-0 flex-1 md:max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
            aria-label="Search jobs, clients, and work"
            placeholder="Search jobs, clients, and work..."
            className="h-10 rounded-xl border-zinc-200 bg-white pl-9 text-sm text-zinc-950 placeholder:text-zinc-500 shadow-inner shadow-zinc-200/60 focus-visible:ring-blue-500/30 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:shadow-black/20"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label="Notifications"
          className="relative hidden rounded-xl border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08] sm:inline-flex"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.9)]" />
        </Button>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 gap-2 rounded-xl border-zinc-200 bg-white px-2 text-zinc-950 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:hover:bg-white/[0.08]"
            >
              <Avatar className="size-7 border border-white/10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-xs text-white">
                  S
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">Subbu</span>
              <ChevronDown className="hidden size-4 text-zinc-500 md:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-zinc-200 bg-white text-zinc-950 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/95 dark:text-zinc-100"
          >
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/nova-pro">
                <Sparkles className="mr-2 size-4 text-blue-300" />
                Nova Pro
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
