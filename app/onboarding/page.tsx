import { auth } from "@/auth"
import { setRole } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { Briefcase, UserPlus } from "lucide-react"

export default async function OnboardingPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }
  
  // @ts-ignore
  if (session.user.role) {
    // @ts-ignore
    redirect(session.user.role === "CLIENT" ? "/client-dashboard" : "/freelancer-dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-950">Welcome, {session.user.name?.split(" ")[0]}!</h1>
        <p className="mb-12 text-lg text-zinc-500">To get started, tell us how you want to use NovaLance.</p>

        <div className="grid gap-6 md:grid-cols-2">
          <form action={setRole}>
            <input type="hidden" name="role" value="CLIENT" />
            <button
              type="submit"
              className="group relative flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-zinc-200 bg-white p-8 text-center transition-all hover:border-violet-600 hover:shadow-xl hover:shadow-violet-600/10 focus:outline-none focus:ring-4 focus:ring-violet-600/20"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-violet-100 text-violet-600 transition-transform group-hover:scale-110">
                <UserPlus className="size-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-950">I want to hire</h2>
                <p className="mt-2 text-sm text-zinc-500">Find, hire, and work with the best professionals.</p>
              </div>
            </button>
          </form>

          <form action={setRole}>
            <input type="hidden" name="role" value="FREELANCER" />
            <button
              type="submit"
              className="group relative flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-zinc-200 bg-white p-8 text-center transition-all hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/10 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-transform group-hover:scale-110">
                <Briefcase className="size-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-950">I want to work</h2>
                <p className="mt-2 text-sm text-zinc-500">Find freelance projects and grow your business.</p>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
