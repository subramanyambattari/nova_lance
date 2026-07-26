import { prisma } from "@/lib/prisma"
import { Users, Briefcase, DollarSign, Activity } from "lucide-react"

export default async function AdminDashboardPage() {
  // Fetch high-level statistics
  const totalUsers = await prisma.user.count()
  const totalClients = await prisma.user.count({ where: { role: "CLIENT" } })
  const totalFreelancers = await prisma.user.count({ where: { role: "FREELANCER" } })
  const totalJobs = await prisma.job.count()
  const activeJobs = await prisma.activeJob.count()
  
  // Calculate some mock financial data based on active jobs (e.g. 10% fee)
  const totalJobBudgets = await prisma.activeJob.aggregate({
    _sum: { budget: true }
  })
  
  const estimatedRevenue = (totalJobBudgets._sum.budget || 0) * 0.10

  // Fetch recent users
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { id: 'desc' },
    select: { id: true, name: true, email: true, role: true, image: true }
  })

  // Fetch recent jobs
  const recentJobs = await prisma.job.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, company: true, budget: true, createdAt: true }
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-zinc-500 mt-2">Welcome to the Nova Lance admin portal. Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">Total Users</p>
              <h3 className="text-3xl font-bold mt-1">{totalUsers}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
              <Users className="size-5" />
            </div>
          </div>
          <div className="text-xs text-zinc-500 flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <span>{totalClients} Clients</span>
            <span>{totalFreelancers} Freelancers</span>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">Total Posted Jobs</p>
              <h3 className="text-3xl font-bold mt-1">{totalJobs}</h3>
            </div>
            <div className="p-3 bg-violet-50 dark:bg-violet-500/10 rounded-xl text-violet-600 dark:text-violet-400">
              <Briefcase className="size-5" />
            </div>
          </div>
          <div className="text-xs text-zinc-500 flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <span className="text-emerald-500 font-medium">+12% from last week</span>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">Active Contracts</p>
              <h3 className="text-3xl font-bold mt-1">{activeJobs}</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Activity className="size-5" />
            </div>
          </div>
          <div className="text-xs text-zinc-500 flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <span className="text-emerald-500 font-medium">+5% from last week</span>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500">Est. Platform Revenue</p>
              <h3 className="text-3xl font-bold mt-1">${estimatedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
              <DollarSign className="size-5" />
            </div>
          </div>
          <div className="text-xs text-zinc-500 flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <span>Based on 10% fee of active contracts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6">
           <h3 className="font-bold text-lg mb-6">Recent Users</h3>
           {/* Placeholder for list of recent users */}
           <div className="flex flex-col gap-4">
             {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold overflow-hidden">
                      {user.image ? (
                        <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0) || user.email?.charAt(0) || "U"
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user.name || 'Anonymous'}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {user.role || 'PENDING'}
                  </div>
                </div>
             ))}
             {recentUsers.length === 0 && (
               <p className="text-sm text-zinc-500">No users found.</p>
             )}
           </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6">
           <h3 className="font-bold text-lg mb-6">Recent Jobs</h3>
           {/* Placeholder for list of recent jobs */}
           <div className="flex flex-col gap-4">
             {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold">
                      <Briefcase className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm truncate max-w-[200px]">{job.title}</p>
                      <p className="text-xs text-zinc-500">{job.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${job.budget}</p>
                    <p className="text-xs text-zinc-500">{new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
             ))}
             {recentJobs.length === 0 && (
               <p className="text-sm text-zinc-500">No jobs posted yet.</p>
             )}
           </div>
        </div>
      </div>

    </div>
  )
}
