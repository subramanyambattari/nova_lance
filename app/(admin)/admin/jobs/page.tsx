import { prisma } from "@/lib/prisma"
import { Building2 } from "lucide-react"
import { JobsToolbar } from "./toolbar"
import { JobActionsDropdown } from "./actions-dropdown"

import { requireUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminJobsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await requireUser()
  if (user.role !== "ADMIN" && user.email !== "b.subburoyal@gmail.com") redirect("/")

  const searchParams = await props.searchParams
  const q = (searchParams.q as string) || ""
  const typeFilter = (searchParams.type as string) || "ALL"

  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        typeFilter !== "ALL" ? { type: { contains: typeFilter, mode: 'insensitive' } } : {},
        q ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { company: { contains: q, mode: 'insensitive' } },
          ]
        } : {}
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: {
      client: {
        select: { name: true, image: true, email: true }
      },
      _count: {
        select: { proposals: true }
      }
    }
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Moderation</h1>
          <p className="text-zinc-500 mt-1">Review posted jobs, budgets, and client details.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <JobsToolbar />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-medium">Job Details</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Budget</th>
                <th className="px-6 py-4 font-medium">Proposals</th>
                <th className="px-6 py-4 font-medium">Posted</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100 mb-1 max-w-[300px] truncate" title={job.title}>
                      {job.title}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Building2 className="size-3" />
                      {job.company} • {job.type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {job.client ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden text-[10px] flex items-center justify-center font-bold text-zinc-500">
                          {job.client.image ? (
                            <img src={job.client.image} alt={job.client.name || ''} className="w-full h-full object-cover" />
                          ) : (
                            job.client.name?.charAt(0) || "C"
                          )}
                        </div>
                        <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]">
                          {job.client.name || job.client.email}
                        </span>
                      </div>
                    ) : (
                      <span className="text-zinc-500 italic">Unknown</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {job.budget ? `$${job.budget.toLocaleString()}` : <span className="text-zinc-500 font-normal">Not specified</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {job._count.proposals}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <JobActionsDropdown jobId={job.id} title={job.title} />
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    No jobs found.
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
