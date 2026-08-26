"use client"

import { GeminiChatWidget } from "@/components/ai/gemini-chat-widget"
import { ModeToggle } from "@/components/mode-toggle"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { ClientSidebar } from "@/components/ui/client-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isClientDashboard = pathname.startsWith("/client-dashboard")
  
  const shellBarClassName =
    "sticky top-0 z-20 flex h-12 items-center border-b border-zinc-200 bg-background/95 px-4 text-foreground backdrop-blur dark:border-white/10 dark:bg-zinc-950/95 dark:text-zinc-100"
  const sidebarProviderClassName = cn(
    "bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100 w-full",
    pathname.includes("/messages") ? "h-screen overflow-hidden" : "min-h-screen"
  )
  return (
    <TooltipProvider>
      {isClientDashboard ? (
        <SidebarProvider className={sidebarProviderClassName}>
          <ClientSidebar />
          <main className={cn("flex min-w-0 flex-1 flex-col", pathname.includes("/messages") ? "h-screen overflow-hidden" : "pb-4")}>
            <div className={shellBarClassName}>
              <SidebarTrigger />
              <div className="ml-auto">
                <ModeToggle />
              </div>
            </div>
            {children}
          </main>
        </SidebarProvider>
      ) : (
        <SidebarProvider className={sidebarProviderClassName}>
          <AppSidebar />
          <main className={cn("flex min-w-0 flex-1 flex-col", pathname.includes("/messages") ? "h-screen overflow-hidden" : "pb-4")}>
            <div className={shellBarClassName}>
              <SidebarTrigger />
              <div className="ml-auto">
                <ModeToggle />
              </div>
            </div>
            {children}
          </main>
        </SidebarProvider>
      )}
      <GeminiChatWidget />
      <Toaster />
    </TooltipProvider>
  )
}
