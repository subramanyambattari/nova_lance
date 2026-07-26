"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition } from "react"

export function UsersToolbar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  const handleRoleChange = (role: string) => {
    const params = new URLSearchParams(searchParams)
    if (role && role !== "ALL") {
      params.set('role', role)
    } else {
      params.delete('role')
    }
    
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          defaultValue={searchParams.get('q')?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <div className="flex items-center gap-2">
        <select 
          defaultValue={searchParams.get('role')?.toString() || "ALL"}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="py-2 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="ALL">All Roles</option>
          <option value="CLIENT">Clients</option>
          <option value="FREELANCER">Freelancers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>
    </div>
  )
}
