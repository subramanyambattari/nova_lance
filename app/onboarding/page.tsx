"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"
import { checkUsernameAvailability, generateUsernameSuggestions, completeOnboarding } from "@/app/actions/onboarding"

const CATEGORIES = [
  "Websites, IT & Software",
  "Writing & Content",
  "Design, Media & Architecture",
  "Data Entry & Admin",
  "Engineering & Science",
  "Sales & Marketing",
  "Business, Accounting, Human Resources & Legal",
  "Product Sourcing & Manufacturing",
  "Mobile Phones & Computing",
  "Translation & Languages",
  "Trades & Services",
  "Freight, Shipping & Transportation",
  "Telecommunications",
  "Education",
  "Health & Medicine",
  "Artificial Intelligence",
  "Jobs for Anyone"
];

const MOCK_SKILLS: Record<string, { name: string; count: number }[]> = {
  "Websites, IT & Software": [
    { name: "PHP", count: 821 },
    { name: "HTML", count: 652 },
    { name: "Web Development", count: 607 },
    { name: "SEO", count: 494 },
    { name: "Digital Marketing", count: 475 },
    { name: "JavaScript", count: 1204 },
    { name: "React.js", count: 950 },
    { name: "Node.js", count: 700 },
    { name: "Next.js", count: 400 },
    { name: "TypeScript", count: 580 },
  ],
  "Writing & Content": [
    { name: "Article Writing", count: 1520 },
    { name: "Copywriting", count: 1100 },
    { name: "Content Writing", count: 980 },
    { name: "Ghostwriting", count: 750 },
    { name: "Blog Writing", count: 600 },
  ],
  "Design, Media & Architecture": [
    { name: "Graphic Design", count: 2100 },
    { name: "Logo Design", count: 1800 },
    { name: "Photoshop", count: 1500 },
    { name: "Illustrator", count: 1200 },
    { name: "UI/UX Design", count: 900 },
  ],
  "Artificial Intelligence": [
    { name: "Machine Learning", count: 400 },
    { name: "Python", count: 1200 },
    { name: "Generative AI", count: 300 },
    { name: "OpenAI", count: 250 },
    { name: "Deep Learning", count: 200 },
  ],
  // Fallback for others
  "default": [
    { name: "Data Entry", count: 500 },
    { name: "Excel", count: 450 },
    { name: "Virtual Assistant", count: 300 },
    { name: "Customer Support", count: 250 },
    { name: "Research", count: 200 },
  ]
};

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const [step, setStep] = useState(1)
  
  // Step 1 State
  const [agreed, setAgreed] = useState(false)
  
  // Step 2 State
  const [username, setUsername] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  
  const [role, setRole] = useState<"CLIENT" | "FREELANCER" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 4 State
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillSearchQuery, setSkillSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("Websites, IT & Software")

  useEffect(() => {
    if (session?.user?.name && step === 2 && suggestions.length === 0) {
      generateUsernameSuggestions(session.user.name).then(res => {
        setSuggestions(res.suggestions)
      })
    }
  }, [session, step])

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (status === "unauthenticated") {
    // Should be handled by middleware/layout, but just in case
    window.location.href = "/login"
    return null
  }

  const handleNextStep1 = () => {
    if (agreed) setStep(2)
  }

  const handleNextStep2 = async () => {
    if (!username || username.length < 3) {
      setUsernameError("Username must be at least 3 characters")
      return
    }

    setIsCheckingUsername(true)
    setUsernameError("")
    const res = await checkUsernameAvailability(username)
    setIsCheckingUsername(false)

    if (res.available) {
      setStep(3)
    } else {
      setUsernameError(res.error || "Username is not available")
    }
  }

  const handleComplete = async (selectedRole: "CLIENT" | "FREELANCER") => {
    setRole(selectedRole)
    
    if (selectedRole === "FREELANCER") {
      setStep(4)
      return
    }

    setIsSubmitting(true)
    const res = await completeOnboarding({ username, role: selectedRole })
    
    if (res.success) {
      window.location.href = "/"
    } else {
      setIsSubmitting(false)
      alert(res.error || "Something went wrong")
    }
  }

  const handleFinalComplete = async () => {
    if (!role) return
    setIsSubmitting(true)
    
    const res = await completeOnboarding({ 
      username, 
      role,
      skills: selectedSkills 
    })
    
    if (res.success) {
      window.location.href = "/"
    } else {
      setIsSubmitting(false)
      alert(res.error || "Something went wrong")
    }
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className={`w-full ${step === 4 ? '' : 'lg:w-1/2'} flex flex-col justify-center px-8 sm:px-16 xl:px-32 relative z-10 transition-all duration-500`}>
        
        <div className="absolute top-8 right-8">
          <ModeToggle />
        </div>

        <div className={`mx-auto w-full ${step === 4 ? 'max-w-5xl mt-24' : 'max-w-md'}`}>
          
          <div className="mb-10 text-center">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)} 
                className={`absolute left-8 sm:left-16 xl:left-32 top-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back
              </button>
            )}
            
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <svg viewBox="0 0 24 24" className="size-8 text-blue-600" fill="currentColor">
                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/>
              </svg>
              <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">NovaLance</span>
            </Link>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
                <div className="w-16 h-16 bg-blue-600 text-white rounded-md mx-auto flex items-center justify-center text-2xl font-bold mb-6">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
                <h2 className="text-xl font-semibold">Welcome {session?.user?.name}!</h2>
                <p className="text-zinc-500 mt-2">Create an account as:</p>
                <div className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm font-medium flex items-center justify-between">
                  {session?.user?.email}
                  <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2">
                <input 
                  type="checkbox" 
                  id="agree" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600"
                />
                <label htmlFor="agree" className="text-sm text-zinc-600 dark:text-zinc-400 leading-tight">
                  I agree to the NovaLance <Link href="#" className="text-blue-600 hover:underline">User Agreement</Link> and <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              <Button 
                onClick={handleNextStep1}
                disabled={!agreed}
                className="w-full h-12 bg-blue-600 text-white text-base font-bold rounded-md hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
              >
                Join NovaLance
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Choose a username</h1>
                <p className="text-sm text-zinc-500">Please note that a username cannot be changed once chosen.</p>
              </div>

              <div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setUsernameError(""); }}
                  className={`w-full h-12 px-4 rounded-md border ${usernameError ? 'border-red-500 focus:ring-red-500' : 'border-zinc-300 dark:border-zinc-700 focus:ring-blue-600'} bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white transition-colors`}
                  placeholder="Enter username"
                />
                {usernameError && <p className="text-red-500 text-sm mt-2">{usernameError}</p>}
                
                {suggestions.length > 0 && (
                  <div className="mt-3 text-sm text-zinc-500">
                    Suggestions:{" "}
                    {suggestions.map((s, i) => (
                      <span key={s}>
                        <button onClick={() => { setUsername(s); setUsernameError(""); }} className="text-blue-600 hover:underline">{s}</button>
                        {i < suggestions.length - 1 ? " / " : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={handleNextStep2}
                disabled={!username || isCheckingUsername}
                className="w-full h-12 bg-blue-600 text-white text-base font-bold rounded-md hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
              >
                {isCheckingUsername ? "Checking..." : "Next"}
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Select account type</h1>
                <p className="text-sm text-zinc-500">Don't worry, this can be changed later.</p>
              </div>

              <div className="grid gap-4">
                <button 
                  onClick={() => handleComplete("FREELANCER")}
                  disabled={isSubmitting}
                  className="flex items-center p-6 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group text-left disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <div className="w-12 h-12 flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Earn money freelancing</h3>
                    <p className="text-zinc-500 text-sm mt-1">Find jobs, submit proposals, and build your career.</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleComplete("CLIENT")}
                  disabled={isSubmitting}
                  className="flex items-center p-6 border-2 border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-600 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group text-left disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <div className="w-12 h-12 flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Hire a freelancer</h3>
                    <p className="text-zinc-500 text-sm mt-1">Post jobs, review proposals, and hire talent.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="w-full flex flex-col items-center">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Tell us your top skills</h1>
                <p className="text-sm text-zinc-500">This helps us recommend jobs for you.</p>
              </div>

              <div className="w-full max-w-2xl relative mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text"
                  placeholder="Search a skill"
                  value={skillSearchQuery}
                  onChange={(e) => setSkillSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              <div className="flex items-center w-full max-w-4xl mb-6">
                <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800"></div>
                <div className="px-4 text-xs font-bold text-zinc-400">OR</div>
                <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>

              <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px]">
                {/* Categories Column */}
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden flex flex-col bg-white dark:bg-zinc-950">
                  <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-bold bg-zinc-50 dark:bg-zinc-900">
                    Select a category
                  </div>
                  <div className="overflow-y-auto flex-1 p-2 space-y-1">
                    {CATEGORIES.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full flex items-center justify-between p-3 text-sm rounded-md transition-colors ${
                          selectedCategory === category 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        <span className="truncate pr-2 text-left">{category}</span>
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills Column */}
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden flex flex-col bg-white dark:bg-zinc-950">
                  <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-bold bg-zinc-50 dark:bg-zinc-900 truncate">
                    {selectedCategory}
                  </div>
                  <div className="overflow-y-auto flex-1 p-2 space-y-1">
                    {(MOCK_SKILLS[selectedCategory] || MOCK_SKILLS["default"]).filter(skill => skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase())).map(skill => (
                      <div
                        key={skill.name}
                        className="w-full flex items-center justify-between p-3 text-sm rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      >
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {skill.name} <span className="text-zinc-400">({skill.count} jobs)</span>
                        </span>
                        {selectedSkills.includes(skill.name) ? (
                          <button 
                            onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill.name))}
                            className="text-green-500 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              if (selectedSkills.length < 20) {
                                setSelectedSkills([...selectedSkills, skill.name])
                              }
                            }}
                            className="text-blue-600 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Skills Column */}
                <div className="flex flex-col bg-white dark:bg-zinc-950 pt-4">
                  <div className="font-bold text-zinc-900 dark:text-white mb-2">
                    {selectedSkills.length} out of 20 skills selected
                  </div>
                  <p className="text-sm text-zinc-500 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                    {selectedSkills.length === 0 
                      ? "Select at least one skill to help us recommend customized jobs for you." 
                      : "Great! These skills will help us find the best jobs for you."}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 content-start overflow-y-auto flex-1">
                    {selectedSkills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-sm">
                        {skill}
                        <button 
                          onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                          className="text-zinc-400 hover:text-red-500 focus:outline-none"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full max-w-5xl flex justify-end mt-8">
                <Button 
                  onClick={handleFinalComplete}
                  disabled={selectedSkills.length === 0 || isSubmitting}
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-md transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Next"}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className={`hidden lg:block ${step === 4 ? 'w-0 opacity-0 hidden' : 'lg:w-1/2'} relative bg-zinc-950 overflow-hidden transition-all duration-500`}>
        <Image 
          src="/auth-bg-new.png" 
          alt="Majestic freelancer workspace" 
          fill 
          className="object-cover opacity-90"
          priority
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        <div className="absolute bottom-16 right-16 text-right">
          <h2 className="text-6xl font-black italic tracking-tighter text-white font-serif drop-shadow-2xl">make it real.</h2>
        </div>
      </div>
    </div>
  )
}
