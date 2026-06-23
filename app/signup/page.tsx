"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { registerUser } from "@/app/actions/credentials"

const signupSchema = z.object({
  firstName: z.string().min(2, "First Name must be at least 2 characters"),
  lastName: z.string().min(2, "Last Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  agreeTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    const result = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    })
    
    if (result.success && result.requireOtp) {
      window.location.href = `/verify-email?email=${encodeURIComponent(data.email)}`
    } else {
      setIsLoading(false)
      alert(result.error || "Something went wrong during registration")
    }
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-32 relative z-10">
        
        {/* Dark Mode Toggle */}
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
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Sign up</h1>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              onClick={() => signIn("google")}
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-3 rounded-md border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36 16.6053 6.549L20.0303 3.125C17.9503 1.19 15.2353 0 12.0003 0C7.31028 0 3.25528 2.69 1.28027 6.609L5.27028 9.704C6.21528 6.86 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                <path d="M5.26498 14.294C5.02498 13.569 4.88501 12.799 4.88501 11.999C4.88501 11.199 5.01998 10.429 5.26498 9.704L1.275 6.609C0.46 8.229 0 10.059 0 11.999C0 13.939 0.46 15.769 1.28 17.389L5.26498 14.294Z" fill="#FBBC05" />
                <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21538 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
              </svg>
              Continue with Google
            </Button>

            <Button
              type="button"
              onClick={() => signIn("github")}
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-3 rounded-md border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <svg viewBox="0 0 24 24" className="size-5 text-[#181717] dark:text-white" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              Continue with GitHub
            </Button>
          </div>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            <span className="px-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">OR</span>
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <input 
                  {...register("firstName")}
                  type="text" 
                  placeholder="First Name" 
                  className={`w-full h-12 px-4 rounded-md border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-0 transition-colors ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-blue-500'}`} 
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstName.message}</p>
                )}
              </div>
              <div className="w-1/2">
                <input 
                  {...register("lastName")}
                  type="text" 
                  placeholder="Last Name" 
                  className={`w-full h-12 px-4 rounded-md border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-0 transition-colors ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-blue-500'}`} 
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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

            <div>
              <input 
                {...register("password")}
                type="password" 
                placeholder="Password" 
                className={`w-full h-12 px-4 rounded-md border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-0 transition-colors ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-blue-500'}`} 
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex flex-col text-sm pt-2">
              <label className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400 font-medium cursor-pointer">
                <input {...register("agreeTerms")} type="checkbox" className="mt-1 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-blue-600 focus:ring-blue-500 w-4 h-4" /> 
                <span>I agree to the NovaLance <Link href="#" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:underline transition-all">User Agreement</Link> and <Link href="#" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:underline transition-all">Privacy Policy</Link>.</span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.agreeTerms.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 mt-2 bg-blue-600 text-white text-base font-bold rounded-md hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? "Signing up..." : "Join NovaLance"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400 font-medium">
            Already have an account? <Link href="/login" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:underline transition-all">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right Column - Generated Image graphic */}
      <div className="hidden lg:block lg:w-1/2 relative bg-zinc-950 overflow-hidden">
        <Image 
          src="/auth-bg-new.png" 
          alt="Majestic freelancer workspace" 
          fill 
          className="object-cover opacity-90"
          priority
        />
        
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        <div className="absolute bottom-16 right-16 text-right">
          <h2 className="text-6xl font-black italic tracking-tighter text-white font-serif drop-shadow-2xl">empower your journey.</h2>
        </div>
      </div>
    </div>
  )
}
