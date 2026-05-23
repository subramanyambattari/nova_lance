"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  ListChecks,
  Plus,
  Settings,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const clientNavItems: {
  title: string
  href: string
  icon: LucideIcon
}[] = [
  {
    title: "Overview",
    href: "/client-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Workspace",
    href: "/client-dashboard#ai-workspace",
    icon: Sparkles,
  },
  {
    title: "Post Job",
    href: "/client-dashboard#post-job",
    icon: Plus,
  },
  {
    title: "My Jobs",
    href: "/client-dashboard#my-jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "Talent Matches",
    href: "/client-dashboard#talent-matches",
    icon: Users,
  },
  {
    title: "Proposals",
    href: "/client-dashboard#proposals",
    icon: FileText,
  },
  {
    title: "Operations",
    href: "/client-dashboard#operations",
    icon: ListChecks,
  },
  {
    title: "Analytics",
    href: "/client-dashboard#analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/client-dashboard#settings",
    icon: Settings,
  },
]

export function ClientSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="Nova Lance Client">
              <Link href="/client-dashboard">
                <span className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                  <Sparkles className="size-4" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold">Nova Lance</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    Client workspace
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Client</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {clientNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/client-dashboard" &&
                      pathname === "/client-dashboard"
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
