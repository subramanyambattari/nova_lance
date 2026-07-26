import { Wrench } from "lucide-react"

export function MaintenanceScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 text-center">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
        <Wrench className="size-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
        We'll be right back
      </h1>
      <p className="text-zinc-500 max-w-md mx-auto text-lg mb-8">
        Nova Lance is currently undergoing scheduled maintenance to bring you an even better experience. Thank you for your patience!
      </p>
      
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl max-w-sm text-sm text-amber-800 dark:text-amber-300">
        <span className="font-semibold">Are you an admin?</span><br />
        You can bypass this screen by navigating directly to the login page and signing in.
      </div>

      <div className="mt-8 flex gap-4">
        <a href="/login" className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-white transition-colors">
          Admin Login
        </a>
      </div>
    </div>
  )
}
