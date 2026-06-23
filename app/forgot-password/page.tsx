"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { requestPasswordReset } from "@/app/actions/credentials"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true)
    const result = await requestPasswordReset(data.email)
    setIsLoading(false)

    if (result.success) {
      setIsSubmitted(true)
    } else {
      alert(result.error || "Something went wrong")
    }
  }

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
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Reset Password</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              {isSubmitted 
                ? "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder." 
                : "Enter your email address and we will send you a link to reset your password."}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input 
                  {...register("email")}
                  type="email" 
                  placeholder="Email" 
                  className={`w-full h-12 px-4 rounded-md border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-0 transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-blue-500'}`} 
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-12 mt-4 bg-blue-600 text-white text-base font-bold rounded-md hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? "Sending Link..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <Button asChild className="w-full h-12 mt-4 bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-white text-base font-bold rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all">
              <Link href="/login">Return to Login</Link>
            </Button>
          )}

          <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400 font-medium">
            Remember your password? <Link href="/login" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:underline transition-all">Log in</Link>
          </p>
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
