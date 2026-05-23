"use client"

import { GeminiChatWidget } from "@/components/ai/gemini-chat-widget"
import { ModeToggle } from "@/components/mode-toggle"
import { ThemeProvider } from "@/components/theme-provider"
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
    ? "sticky top-0 z-20 flex h-12 items-center border-b border-white/10 bg-zinc-950/95 px-4 text-zinc-100 backdrop-blur"
    : "sticky top-0 z-20 flex h-12 items-center border-b bg-background/95 px-4 backdrop-blur"
  const sidebarProviderClassName = usesDarkWorkspaceShell
    ? "bg-zinc-950 text-zinc-100 [--accent:oklch(0.269_0_0)] [--accent-foreground:oklch(0.985_0_0)] [--background:oklch(0.145_0_0)] [--border:oklch(1_0_0_/_10%)] [--foreground:oklch(0.985_0_0)] [--input:oklch(1_0_0_/_15%)] [--muted:oklch(0.269_0_0)] [--muted-foreground:oklch(0.708_0_0)] [--popover:oklch(0.205_0_0)] [--popover-foreground:oklch(0.985_0_0)] [--sidebar:oklch(0.145_0_0)] [--sidebar-accent:oklch(0.205_0_0)] [--sidebar-accent-foreground:oklch(0.985_0_0)] [--sidebar-border:oklch(1_0_0_/_10%)] [--sidebar-foreground:oklch(0.985_0_0)] [--sidebar-primary:oklch(0.985_0_0)] [--sidebar-primary-foreground:oklch(0.145_0_0)]"
    : undefined

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
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
    </ThemeProvider>
  )
}
