import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-zinc-950/5 border border-zinc-100 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-950">Welcome to NovaLance</h1>
        <p className="mb-8 text-sm text-zinc-500">Sign in to your account to continue</p>

        <form
          action={async () => {
            "use server"
            await signIn("google")
          }}
        >
          <Button
            type="submit"
            className="w-full flex h-12 items-center justify-center gap-3 rounded-lg bg-white px-4 py-2 font-medium text-zinc-900 border border-zinc-300 hover:bg-zinc-50 shadow-sm transition-colors"
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.549L20.0303 3.125C17.9503 1.19 15.2353 0 12.0003 0C7.31028 0 3.25528 2.69 1.28027 6.609L5.27028 9.704C6.21528 6.86 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.294C5.02498 13.569 4.88501 12.799 4.88501 11.999C4.88501 11.199 5.01998 10.429 5.26498 9.704L1.275 6.609C0.46 8.229 0 10.059 0 11.999C0 13.939 0.46 15.769 1.28 17.389L5.26498 14.294Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21538 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
            Continue with Google
          </Button>
        </form>

        <p className="mt-8 text-xs text-zinc-400">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
