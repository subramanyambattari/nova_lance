import { prisma } from "@/lib/prisma"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { UsersToolbar } from "./toolbar"
import { UserActionsDropdown } from "./actions-dropdown"

import { requireUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await requireUser()
  if (user.role !== "ADMIN" && user.email !== "b.subburoyal@gmail.com") redirect("/")

  const searchParams = await props.searchParams
  const q = (searchParams.q as string) || ""
  const roleFilter = (searchParams.role as string) || "ALL"

  const users = await prisma.user.findMany({
    where: {
      AND: [
        roleFilter !== "ALL" ? { role: roleFilter as any } : {},
        q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
          ]
        } : {}
      ]
    },
    orderBy: { id: 'desc' },
    select: { id: true, name: true, email: true, role: true, emailVerified: true, image: true }
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-zinc-500 mt-1">Manage platform users, roles, and account status.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <UsersToolbar />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center text-zinc-500 font-bold">
                        {user.image ? (
                          <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                        ) : (
                          user.name?.charAt(0) || user.email?.charAt(0) || "?"
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{user.name || 'Unknown'}</div>
                        <div className="text-zinc-500 text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300">
                      {user.role || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="size-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                        <ShieldAlert className="size-3" /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    -
                  </td>
                  <td className="px-6 py-4 text-right">
                    <UserActionsDropdown userId={user.id} name={user.name} />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
