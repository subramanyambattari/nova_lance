"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { resetPassword } from "@/app/actions/credentials"
import { useSearchParams } from "next/navigation"

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setErrorMsg("Missing or invalid reset token.")
      return
    }

    setIsLoading(true)
    setErrorMsg("")
    const result = await resetPassword(token, data.password)
    setIsLoading(false)

    if (result.success) {
      setIsSuccess(true)
    } else {
      setErrorMsg(result.error || "Something went wrong")
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mb-6 mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600 dark:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Password Reset Successfully</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">You can now log in with your new password.</p>
        <Button asChild className="w-full h-12 bg-blue-600 text-white text-base font-bold rounded-md hover:bg-blue-700 transition-all shadow-md">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="text-center text-red-500 dark:text-red-400 p-4 border border-red-200 dark:border-red-900 rounded-md bg-red-50 dark:bg-red-950/30">
        <p className="font-medium">Invalid or missing token. Please request a new password reset link.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/forgot-password">Request New Link</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && (
        <div className="p-3 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md">
          {errorMsg}
        </div>
      )}

      <div>
        <input 
          {...register("password")}
          type="password" 
          placeholder="New Password" 
          className={`w-full h-12 px-4 rounded-md border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-0 transition-colors ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-blue-500'}`} 
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
        )}
      </div>

      <div>
        <input 
          {...register("confirmPassword")}
          type="password" 
          placeholder="Confirm New Password" 
          className={`w-full h-12 px-4 rounded-md border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-0 transition-colors ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-blue-500'}`} 
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full h-12 mt-4 bg-blue-600 text-white text-base font-bold rounded-md hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-32 relative z-10">
        
        <div className="absolute top-8 right-8">
          <ModeToggle />
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <svg viewBox="0 0 24 24" className="size-8 text-blue-600" fill="currentColor">
                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/>
              </svg>
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">NovaLance</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Create New Password</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              Enter your new password below.
            </p>
          </div>

          <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>

        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative bg-zinc-950 overflow-hidden">
        <Image 
          src="/auth-bg-new.png" 
          alt="Majestic freelancer workspace" 
          fill 
          className="object-cover opacity-90"
          priority
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        <div className="absolute bottom-16 right-16 text-right">
          <h2 className="text-6xl font-black italic tracking-tighter text-white font-serif drop-shadow-2xl">empower your journey.</h2>
        </div>
      </div>
    </div>
  )
}
