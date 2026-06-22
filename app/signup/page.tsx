import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen bg-white text-zinc-900">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-32 relative z-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <svg viewBox="0 0 24 24" className="size-8 text-blue-600" fill="currentColor">
                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/>
              </svg>
              <span className="text-2xl font-bold tracking-tight text-zinc-900">NovaLance</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Sign up</h1>
          </div>

          <div className="space-y-4">
            <form
              action={async () => {
                "use server"
                await signIn("google")
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="w-full h-12 flex items-center justify-center gap-3 rounded-md border-2 border-zinc-200 bg-white font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
              >
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.549L20.0303 3.125C17.9503 1.19 15.2353 0 12.0003 0C7.31028 0 3.25528 2.69 1.28027 6.609L5.27028 9.704C6.21528 6.86 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                  <path d="M5.26498 14.294C5.02498 13.569 4.88501 12.799 4.88501 11.999C4.88501 11.199 5.01998 10.429 5.26498 9.704L1.275 6.609C0.46 8.229 0 10.059 0 11.999C0 13.939 0.46 15.769 1.28 17.389L5.26498 14.294Z" fill="#FBBC05" />
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21538 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                </svg>
                Continue with Google
              </Button>
            </form>

            <form
              action={async () => {
                "use server"
                await signIn("github")
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="w-full h-12 flex items-center justify-center gap-3 rounded-md border-2 border-zinc-200 bg-white font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
              >
                <svg viewBox="0 0 24 24" className="size-5 text-[#181717]" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                Continue with GitHub
              </Button>
            </form>
          </div>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="px-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">OR</span>
            <div className="flex-grow border-t border-zinc-200"></div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="First Name" 
                className="w-1/2 h-12 px-4 rounded-md border-2 border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-0 transition-colors" 
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                className="w-1/2 h-12 px-4 rounded-md border-2 border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-0 transition-colors" 
              />
            </div>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full h-12 px-4 rounded-md border-2 border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-0 transition-colors" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full h-12 px-4 rounded-md border-2 border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-0 transition-colors" 
            />
            
            <div className="flex items-start text-sm pt-2">
              <label className="flex items-start gap-2 text-zinc-600 font-medium cursor-pointer">
                <input type="checkbox" className="mt-1 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 w-4 h-4" /> 
                <span>I agree to the NovaLance <Link href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-all">User Agreement</Link> and <Link href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-all">Privacy Policy</Link>.</span>
              </label>
            </div>

            <Button className="w-full h-12 mt-2 bg-blue-600 text-white text-base font-bold rounded-md hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
              Join NovaLance
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-600 font-medium">
            Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline transition-all">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right Column - Image graphic */}
      <div className="hidden lg:block lg:w-1/2 relative bg-zinc-950 overflow-hidden">
        <Image 
          src="/auth-bg.png" 
          alt="Majestic colorful hummingbird" 
          fill 
          className="object-cover opacity-90"
          priority
        />
        
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        <div className="absolute bottom-16 right-16 text-right">
          <h2 className="text-7xl font-black italic tracking-tighter text-white font-serif drop-shadow-2xl">make it real.</h2>
        </div>
      </div>
    </div>
  )
}
