import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  BriefcaseBusiness,
  CalendarDays,
  CircleHelp,
  FileText,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react"
import Link from "next/link"

const mainNav = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: BriefcaseBusiness,
    badge: "12",
  },
  {
    title: "Messages",
    href: "/messages",
    icon: Inbox,
    badge: "4",
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
  },
]

const workspaceNav = [
  {
    title: "Proposals",
    href: "/proposals",
  },
  {
    title: "Contracts",
    href: "/contracts",
  },
  {
    title: "Invoices",
    href: "/invoices",
  },
]

const utilityNav = [
  {
    title: "Find Work",
    href: "/search",
    icon: Search,
  },
  {
    title: "Docs",
    href: "/docs",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="Nova Lance">
              <Link href="/">
                <span className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                  <Sparkles className="size-4" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold">Nova Lance</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    Freelancer workspace
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge ? (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Overview">
                  <Link href="/workspace">
                    <Home />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {workspaceNav.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={item.href}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
              {utilityNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Create project">
              <Link href="/projects/new">
                <Plus />
                <span>Create project</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Help">
              <Link href="/help">
                <CircleHelp />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sign out">
              <Link href="/sign-out">
                <LogOut />
                <span>Sign out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
