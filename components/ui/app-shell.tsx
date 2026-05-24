"use client"

import { GeminiChatWidget } from "@/components/ai/gemini-chat-widget"
import { ModeToggle } from "@/components/mode-toggle"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { ClientSidebar } from "@/components/ui/client-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isClientDashboard = pathname.startsWith("/client-dashboard")
  const usesDarkWorkspaceShell =
    !isClientDashboard && (pathname === "/" || pathname.startsWith("/dashboard"))
  const shellBarClassName = usesDarkWorkspaceShell
    ? "sticky top-0 z-20 flex h-12 items-center border-b border-zinc-200 bg-background/95 px-4 text-foreground backdrop-blur dark:border-white/10 dark:bg-zinc-950/95 dark:text-zinc-100"
    : "sticky top-0 z-20 flex h-12 items-center border-b bg-background/95 px-4 backdrop-blur"
  const sidebarProviderClassName = usesDarkWorkspaceShell
    ? "bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100"
    : undefined

  return (
    <TooltipProvider>
      {isClientDashboard ? (
        <SidebarProvider>
          <ClientSidebar />
          <main className="flex min-w-0 flex-1 flex-col">
            <div className="sticky top-0 z-20 flex h-12 items-center border-b bg-background/95 px-4 backdrop-blur">
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
          <main className="flex min-w-0 flex-1 flex-col">
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
