import Link from "next/link"
import { Sparkles, Users, Briefcase, Settings, LayoutDashboard, LogOut } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { AdminLogoutButton } from "./admin-logout-button"

import { requireUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  if (user.role !== "ADMIN" && user.email !== "b.subburoyal@gmail.com") {
    redirect("/")
  }
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Sparkles className="size-4" />
            </span>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Nova Admin
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <LayoutDashboard className="size-5 text-zinc-500" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <Users className="size-5 text-zinc-500" />
            <span className="font-medium text-sm">Users</span>
          </Link>
          <Link href="/admin/jobs" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <Briefcase className="size-5 text-zinc-500" />
            <span className="font-medium text-sm">Jobs</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <Settings className="size-5 text-zinc-500" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
        </div>
        
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
           <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-30">
          <div className="md:hidden">
            {/* Mobile menu button would go here */}
            <span className="font-bold">Nova Admin</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <ModeToggle />
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
