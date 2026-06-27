"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"
import { checkUsernameAvailability, generateUsernameSuggestions, completeOnboarding } from "@/app/actions/onboarding"
import { generateCloudinarySignature } from "@/app/actions/upload"

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

const COMMON_LANGUAGES = [
  "English", "Hindi", "Spanish", "French", "Bengali", "Russian", "Portuguese", 
  "Indonesian", "Urdu", "Japanese", "German", "Deutsch", "Čeština", "Español", 
  "Bahasa Indonesia", "Italian", "Turkish", "Korean", "Vietnamese", "Tamil", "Marathi", "Telugu"
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
  const router = useRouter()
  const params = useParams()
  
  const getStepNumber = (str: string | string[] | null | undefined) => {
    switch (str) {
      case "welcome": return 1;
      case "username": return 2;
      case "role": return 3;
      case "skills": return 4;
      case "profile-details": return 5;
      case "profile-bio": return 6;
      case "languages": return 7;
      case "experience": return 8;
      case "references": return 9;
      default: return 1;
    }
  }

  const getStepString = (num: number) => {
    switch (num) {
      case 1: return "welcome";
      case 2: return "username";
      case 3: return "role";
      case 4: return "skills";
      case 5: return "profile-details";
      case 6: return "profile-bio";
      case 7: return "languages";
      case 8: return "experience";
      case 9: return "references";
      default: return "welcome";
    }
  }

  const [step, _setStep] = useState(1)

  const setStep = (newStep: number) => {
    if (newStep === step) return;
    _setStep(newStep)
    // Shallow route update to prevent Next.js from fetching a new RSC payload, which causes a 1-second delay
    window.history.pushState(null, '', `/onboarding/${getStepString(newStep)}`);
  }
  
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

  // Step 5 State
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [step5Attempted, setStep5Attempted] = useState(false)

  // Step 6 State
  const [title, setTitle] = useState("")
  const [bio, setBio] = useState("")
  const [bioError, setBioError] = useState("")

  // Step 7 State
  const [languages, setLanguages] = useState<string[]>([])
  const [languageInput, setLanguageInput] = useState("")
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState("")

  // Step 8 State
  const [experiences, setExperiences] = useState<{ title: string; company: string; startDate: string; endDate?: string; currentlyWorking: boolean }[]>([
    { title: "", company: "", startDate: "", endDate: "", currentlyWorking: false }
  ])
  const [experienceErrors, setExperienceErrors] = useState<{ title?: string; company?: string; startDate?: string; endDate?: string }[]>([])

  // Step 9 State
  const [referenceEmailsList, setReferenceEmailsList] = useState<string[]>([])
  const [currentEmailInput, setCurrentEmailInput] = useState("")
  const [referenceMessage, setReferenceMessage] = useState("")

  // Profile Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploadingImage(true)
      const { timestamp, signature, apiKey, cloudName } = await generateCloudinarySignature()
      
      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", apiKey || "")
      formData.append("timestamp", timestamp.toString())
      formData.append("signature", signature)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.secure_url) {
        setProfileImage(data.secure_url)
      } else {
        alert("Image upload failed: " + (data.error?.message || "Unknown error"))
      }
    } catch (error) {
      console.error(error)
      alert("Error uploading image")
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Handle URL changes (back/forward button)
  useEffect(() => {
    if (params?.step) {
      _setStep(getStepNumber(params.step));
    }
  }, [params?.step]);

  // Hydrate from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("onboarding_state");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.agreed) setAgreed(parsed.agreed);
          if (parsed.username) setUsername(parsed.username);
          if (parsed.role) setRole(parsed.role);
          if (parsed.selectedSkills) setSelectedSkills(parsed.selectedSkills);
          if (parsed.firstName) setFirstName(parsed.firstName);
          if (parsed.lastName) setLastName(parsed.lastName);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.bio) setBio(parsed.bio);
          if (parsed.languages) setLanguages(parsed.languages);
          if (parsed.dateOfBirth) setDateOfBirth(parsed.dateOfBirth);
          if (parsed.experiences) setExperiences(parsed.experiences);
          if (parsed.referenceEmailsList) setReferenceEmailsList(parsed.referenceEmailsList);
          if (parsed.referenceMessage) setReferenceMessage(parsed.referenceMessage);
          if (parsed.profileImage) setProfileImage(parsed.profileImage);
        } catch (e) {}
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const state = {
        agreed, username, role, selectedSkills, firstName, lastName, title, bio, languages, dateOfBirth, experiences, referenceEmailsList, referenceMessage, profileImage
      };
      localStorage.setItem("onboarding_state", JSON.stringify(state));
    }
  }, [agreed, username, role, selectedSkills, firstName, lastName, title, bio, languages, dateOfBirth, experiences, referenceEmailsList, referenceMessage, profileImage]);

  useEffect(() => {
    if (session?.user?.name && step === 2 && suggestions.length === 0) {
      generateUsernameSuggestions(session.user.name).then(res => {
        setSuggestions(res.suggestions)
      })
    }
  }, [session, step, suggestions.length])

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (status === "unauthenticated") {
    window.location.href = "/login"
    return null
  }

  const handleNextStep1 = () => { if (agreed) setStep(2) }
  const handleNextStep2 = async () => {
    if (!username || username.length < 3) {
      setUsernameError("Username must be at least 3 characters")
      return
    }
    setIsCheckingUsername(true)
    setUsernameError("")
    const res = await checkUsernameAvailability(username)
    setIsCheckingUsername(false)
    if (res.available) setStep(3)
    else setUsernameError(res.error || "Username is not available")
  }

  const handleComplete = async (selectedRole: "CLIENT" | "FREELANCER") => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setRole(selectedRole)
    if (selectedRole === "FREELANCER") {
      setStep(4)
      setTimeout(() => setIsSubmitting(false), 500); // Re-enable for subsequent actions
      return
    }
    const res = await completeOnboarding({ username, role: selectedRole })
    if (res.success) window.location.href = "/"
    else { setIsSubmitting(false); alert(res.error || "Something went wrong") }
  }

  const handleValidateExperienceAndNext = async () => {
    if (!role) return

    // Step 8 Validation
    let hasErrors = false;
    const newErrors = experiences.map(exp => {
      const err: { title?: string; company?: string; startDate?: string; endDate?: string } = {};
      if (!exp.title) { err.title = "Please enter your title name."; hasErrors = true; }
      if (!exp.company) { err.company = "Please enter your company name."; hasErrors = true; }
      if (!exp.startDate) { err.startDate = "Please enter a start date."; hasErrors = true; }
      if (!exp.currentlyWorking && !exp.endDate) { err.endDate = "Please enter an end date."; hasErrors = true; }
      return err;
    });

    if (hasErrors) {
      setExperienceErrors(newErrors);
      return;
    }

    setStep(9);
  }

  const handleSkipExperienceAndNext = () => {
    setExperiences([]);
    setStep(9);
  }

  const handleFinalComplete = async () => {
    if (!role) return

    setIsSubmitting(true)
    
    const res = await completeOnboarding({ 
      username, 
      role,
      skills: selectedSkills,
      firstName,
      lastName,
      title,
      bio,
      languages,
      dateOfBirth,
      imageUrl: profileImage || undefined,
      experiences,
      referenceEmails: referenceEmailsList,
      referenceMessage
    })
    
    if (res.success) {
      localStorage.removeItem("onboarding_state");
      window.location.href = "/";
    }
    else { setIsSubmitting(false); alert(res.error || "Something went wrong") }
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
                  onClick={() => setStep(5)}
                  disabled={selectedSkills.length === 0}
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-md transition-all shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="w-full flex flex-col items-center">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Profile details</h1>
              </div>

              <div className="w-full max-w-xl text-left bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-2">Profile photo</h2>
                <p className="text-sm text-zinc-500 mb-6">Uploading a quality photo to your profile will help you make the right impression and build trust with potential clients.</p>
                
                <div className="flex justify-center mb-10">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-40 h-40 cursor-pointer group`}
                  >
                    <div className={`w-full h-full border-2 ${isUploadingImage ? 'opacity-50' : ''} border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/80 transition-colors overflow-hidden`}>
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-12 h-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      )}
                      {isUploadingImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="text-white text-sm font-medium">Uploading...</span>
                        </div>
                      )}
                    </div>
                    <button type="button" className="absolute -bottom-4 -right-4 w-10 h-10 bg-white dark:bg-zinc-800 border shadow rounded-full flex items-center justify-center text-blue-600 hover:text-blue-700 z-10">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-2">What is your name?</h2>
                <p className="text-sm text-zinc-500 mb-6">Please use your real name as this will be required for identity verification.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`w-full h-12 px-4 rounded-md border ${step5Attempted && firstName === "" ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"} bg-white dark:bg-zinc-950 focus:ring-blue-600 focus:border-blue-600`}
                    />
                    {step5Attempted && firstName === "" && <p className="text-red-500 text-xs mt-1">First name is required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`w-full h-12 px-4 rounded-md border ${step5Attempted && lastName === "" ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"} bg-white dark:bg-zinc-950 focus:ring-blue-600 focus:border-blue-600`}
                    />
                    {step5Attempted && lastName === "" && <p className="text-red-500 text-xs mt-1">Last name is required</p>}
                  </div>
                </div>
              </div>

              <div className="w-full max-w-xl flex justify-between mt-8">
                <Button onClick={() => setStep(4)} variant="outline" className="px-8 py-2 rounded-md font-medium text-lg">Back</Button>
                <Button 
                  onClick={() => {
                    setStep5Attempted(true);
                    if (firstName !== "" && lastName !== "" && !isUploadingImage) {
                      setStep(6);
                    }
                  }} 
                  disabled={isUploadingImage} 
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-md transition-all shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="w-full flex flex-col items-center">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Profile details</h1>
              </div>

              <div className="w-full max-w-xl text-left bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-2">Tell us a bit about yourself</h2>
                <p className="text-sm text-zinc-500 mb-6">Fill out your profile for clients to better understand your services.</p>
                
                <h2 className="text-lg font-bold mb-2">What do you do?</h2>
                <p className="text-sm text-zinc-500 mb-2">Write a one line description about yourself.</p>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer | AI Enthusiast"
                  className="w-full h-12 px-4 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-blue-600 focus:border-blue-600 mb-6"
                />

                <h2 className="text-lg font-bold mb-2">Describe yourself</h2>
                <textarea 
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                    if (e.target.value.length >= 100) setBioError("");
                  }}
                  rows={6}
                  className={`w-full p-4 rounded-md border ${bio.length > 0 && bio.length < 100 ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'} bg-white dark:bg-zinc-950 focus:ring-blue-600 focus:border-blue-600 resize-none`}
                  placeholder="Tell clients about your experience, skills and what makes you a great candidate..."
                />
                <div className="flex justify-between items-center mt-2">
                  {bio.length > 0 && bio.length < 100 ? (
                    <span className="text-red-500 text-sm">Please enter at least 100 characters.</span>
                  ) : (
                    <span></span>
                  )}
                  <span className="text-zinc-400 text-sm">{bio.length} characters</span>
                </div>
              </div>

              <div className="w-full max-w-xl flex justify-between mt-8">
                <Button onClick={() => setStep(5)} variant="outline" className="px-8 py-2 rounded-md font-medium text-lg">Back</Button>
                <Button onClick={() => setStep(7)} disabled={!title || bio.length < 100} className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-md transition-all shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">Next</Button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="w-full flex flex-col items-center">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Profile details</h1>
              </div>

              <div className="w-full max-w-xl text-left bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-600">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-2">What languages do you speak?</h2>
                <p className="text-sm text-zinc-500 mb-4">We will use this to help match you with clients who are fluent in these languages.</p>
                
                <div className="relative mb-8">
                  <div className={`w-full min-h-[48px] px-2 py-1.5 rounded-md border ${showLangDropdown ? 'border-blue-600 ring-1 ring-blue-600' : 'border-zinc-300 dark:border-zinc-700'} bg-white dark:bg-zinc-950 flex flex-wrap gap-2 items-center cursor-text transition-all`} onClick={() => document.getElementById('langInput')?.focus()}>
                    {languages.map(lang => (
                      <span key={lang} className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-sm">
                        {lang}
                        <button onClick={(e) => { e.stopPropagation(); setLanguages(languages.filter(l => l !== lang)) }} className="text-zinc-500 hover:text-red-500">&times;</button>
                      </span>
                    ))}
                    <input 
                      id="langInput"
                      type="text" 
                      value={languageInput}
                      onChange={(e) => {
                        setLanguageInput(e.target.value);
                        setShowLangDropdown(true);
                      }}
                      onFocus={() => setShowLangDropdown(true)}
                      onBlur={() => setTimeout(() => setShowLangDropdown(false), 200)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && languageInput) {
                          e.preventDefault();
                          if (!languages.includes(languageInput)) {
                            setLanguages([...languages, languageInput]);
                          }
                          setLanguageInput("");
                          setShowLangDropdown(false);
                        } else if (e.key === 'Backspace' && !languageInput && languages.length > 0) {
                          setLanguages(languages.slice(0, -1));
                        }
                      }}
                      placeholder={languages.length === 0 ? "e.g. English, Hindi, Deutsch" : ""}
                      className="flex-1 bg-transparent border-none outline-none focus:ring-0 min-w-[120px] h-8"
                    />
                  </div>
                  
                  {showLangDropdown && languageInput && (
                    <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg max-h-48 overflow-auto">
                      {COMMON_LANGUAGES.filter(l => l.toLowerCase().includes(languageInput.toLowerCase()) && !languages.includes(l)).length > 0 ? (
                        COMMON_LANGUAGES.filter(l => l.toLowerCase().includes(languageInput.toLowerCase()) && !languages.includes(l)).map(lang => (
                            <li 
                            key={lang}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              if (!languages.includes(lang)) {
                                setLanguages([...languages, lang]);
                              }
                              setLanguageInput("");
                              setShowLangDropdown(false);
                            }}
                            className="px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors"
                          >
                            {lang}
                          </li>
                        ))
                      ) : (
                        <li 
                          onMouseDown={(e) => {
                            e.preventDefault();
                            if (!languages.includes(languageInput)) {
                              setLanguages([...languages, languageInput]);
                            }
                            setLanguageInput("");
                            setShowLangDropdown(false);
                          }}
                          className="px-4 py-2 hover:bg-blue-600 hover:text-white cursor-pointer transition-colors"
                        >
                          Add &quot;{languageInput}&quot;
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <h2 className="text-xl font-bold mb-2">When were you born?</h2>
                <p className="text-sm text-zinc-500 mb-4">You need to be at least 16 years old to use NovaLance. This information will be used for verification and will be kept confidential.</p>
                
                <input 
                  type="date" 
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full max-w-xs h-12 px-4 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-blue-600 focus:border-blue-600"
                />
              </div>

              <div className="w-full max-w-xl flex justify-between mt-8">
                <Button onClick={() => setStep(6)} variant="outline" className="px-8 py-2 rounded-md font-medium text-lg">Back</Button>
                <Button onClick={() => setStep(8)} disabled={languages.length === 0 || !dateOfBirth} className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-md transition-all shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">Next</Button>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="w-full flex flex-col items-center">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Add experience</h1>
                <p className="text-sm text-zinc-500">You can change and add more experience later in your profile page.</p>
              </div>

              <div className="w-full max-w-3xl text-left bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Add your experience</h2>
                
                {experiences.map((exp, index) => (
                  <div key={index} className="mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800 last:border-0 last:mb-0 last:pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input 
                          type="text" 
                          value={exp.title}
                          onChange={(e) => {
                            const newExp = [...experiences];
                            newExp[index].title = e.target.value;
                            setExperiences(newExp);
                            if (experienceErrors[index]?.title) {
                              const newErrors = [...experienceErrors];
                              newErrors[index] = { ...newErrors[index], title: undefined };
                              setExperienceErrors(newErrors);
                            }
                          }}
                          placeholder="Enter your position or title"
                          className={`w-full h-12 px-4 rounded-md border ${experienceErrors[index]?.title ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-300 dark:border-zinc-700'} bg-white dark:bg-zinc-950 focus:ring-blue-600 focus:border-blue-600`}
                        />
                        {experienceErrors[index]?.title && <p className="text-red-500 text-sm mt-1">{experienceErrors[index].title}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Company</label>
                        <input 
                          type="text" 
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...experiences];
                            newExp[index].company = e.target.value;
                            setExperiences(newExp);
                            if (experienceErrors[index]?.company) {
                              const newErrors = [...experienceErrors];
                              newErrors[index] = { ...newErrors[index], company: undefined };
                              setExperienceErrors(newErrors);
                            }
                          }}
                          placeholder="Enter company name"
                          className={`w-full h-12 px-4 rounded-md border ${experienceErrors[index]?.company ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-300 dark:border-zinc-700'} bg-white dark:bg-zinc-950 focus:ring-blue-600 focus:border-blue-600`}
                        />
                        {experienceErrors[index]?.company && <p className="text-red-500 text-sm mt-1">{experienceErrors[index].company}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Start date</label>
                        <input 
                          type="date" 
                          value={exp.startDate}
                          onChange={(e) => {
                            const newExp = [...experiences];
                            newExp[index].startDate = e.target.value;
                            setExperiences(newExp);
                            if (experienceErrors[index]?.startDate) {
                              const newErrors = [...experienceErrors];
                              newErrors[index] = { ...newErrors[index], startDate: undefined };
                              setExperienceErrors(newErrors);
                            }
                          }}
                          className={`w-full h-12 px-4 rounded-md border ${experienceErrors[index]?.startDate ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-300 dark:border-zinc-700'} bg-white dark:bg-zinc-950 focus:ring-blue-600 focus:border-blue-600 text-zinc-500`}
                        />
                        {experienceErrors[index]?.startDate && <p className="text-red-500 text-sm mt-1">{experienceErrors[index].startDate}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-zinc-500">End date</label>
                        <input 
                          type="date" 
                          value={exp.endDate || ""}
                          disabled={exp.currentlyWorking}
                          onChange={(e) => {
                            const newExp = [...experiences];
                            newExp[index].endDate = e.target.value;
                            setExperiences(newExp);
                            if (experienceErrors[index]?.endDate) {
                              const newErrors = [...experienceErrors];
                              newErrors[index] = { ...newErrors[index], endDate: undefined };
                              setExperienceErrors(newErrors);
                            }
                          }}
                          className={`w-full h-12 px-4 rounded-md border ${experienceErrors[index]?.endDate ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-300 dark:border-zinc-700'} bg-white dark:bg-zinc-950 focus:ring-blue-600 focus:border-blue-600 text-zinc-500 disabled:opacity-50`}
                        />
                        {experienceErrors[index]?.endDate && <p className="text-red-500 text-sm mt-1">{experienceErrors[index].endDate}</p>}
                      </div>
                    </div>
                    
                    <label className="flex items-center gap-2 cursor-pointer w-max">
                      <input 
                        type="checkbox" 
                        checked={exp.currentlyWorking}
                        onChange={(e) => {
                          const newExp = [...experiences];
                          newExp[index].currentlyWorking = e.target.checked;
                          if (e.target.checked) {
                            newExp[index].endDate = "";
                            if (experienceErrors[index]?.endDate) {
                              const newErrors = [...experienceErrors];
                              newErrors[index] = { ...newErrors[index], endDate: undefined };
                              setExperienceErrors(newErrors);
                            }
                          }
                          setExperiences(newExp);
                        }}
                        className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-600"
                      />
                      <span className="text-sm">I'm currently working in this role</span>
                    </label>

                    {experiences.length > 1 && (
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => setExperiences(experiences.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                          Remove Role
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <button 
                  onClick={() => setExperiences([...experiences, { title: "", company: "", startDate: "", endDate: "", currentlyWorking: false }])}
                  className="flex items-center gap-2 font-semibold hover:underline mt-2 text-zinc-900 dark:text-zinc-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add another role
                </button>
              </div>

              <div className="w-full max-w-3xl flex justify-between mt-8 items-center">
                <Button onClick={() => setStep(7)} variant="outline" className="px-8 py-2 rounded-md font-medium text-lg border-zinc-300">Back</Button>
                <div className="flex items-center gap-6">
                  <button 
                    onClick={handleSkipExperienceAndNext}
                    className="text-blue-600 hover:underline font-semibold text-lg"
                  >
                    Skip
                  </button>
                  <Button 
                    onClick={handleValidateExperienceAndNext} 
                    className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-md transition-all shadow-md"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="w-full flex flex-col items-center">
              <div className="w-full max-w-3xl text-left">
                <h1 className="text-2xl font-bold mb-2">Request a reference</h1>
                <p className="text-sm text-zinc-500 mb-8 max-w-2xl">
                  Invite your past employers to write a message about working with you. References will be displayed on your profile to build trust with potential clients.
                </p>

                <div className="relative w-full min-h-[3rem] px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600 mb-8 flex flex-wrap gap-2 items-center transition-all">
                  {referenceEmailsList.map((email, i) => (
                    <span key={i} className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-sm px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700">
                      <svg className="w-3.5 h-3.5 text-zinc-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                      {email}
                      <button onClick={() => setReferenceEmailsList(referenceEmailsList.filter((_, idx) => idx !== i))} className="ml-1 text-zinc-400 hover:text-red-500 transition-colors focus:outline-none">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                  <div className="flex-1 min-w-[180px] relative">
                    <input 
                      type="email" 
                      value={currentEmailInput}
                      onChange={(e) => setCurrentEmailInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
                          e.preventDefault();
                          const val = currentEmailInput.trim().replace(/,/g, '');
                          if (val && !referenceEmailsList.includes(val)) {
                            setReferenceEmailsList([...referenceEmailsList, val]);
                            setCurrentEmailInput("");
                          }
                        } else if (e.key === 'Backspace' && currentEmailInput === '' && referenceEmailsList.length > 0) {
                          setReferenceEmailsList(referenceEmailsList.slice(0, -1));
                        }
                      }}
                      placeholder={referenceEmailsList.length === 0 ? "Enter email addresses" : ""}
                      className="w-full bg-transparent outline-none border-none focus:ring-0 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm h-8"
                    />
                  </div>
                  
                  {currentEmailInput.trim() !== "" && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <button
                        onClick={() => {
                          const val = currentEmailInput.trim().replace(/,/g, '');
                          if (val && !referenceEmailsList.includes(val)) {
                            setReferenceEmailsList([...referenceEmailsList, val]);
                            setCurrentEmailInput("");
                          }
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center"
                      >
                        Adding '{currentEmailInput}'
                      </button>
                    </div>
                  )}
                </div>

                {referenceEmailsList.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2 className="text-lg font-bold mb-2">Include a personal message (optional)</h2>
                    <textarea
                      value={referenceMessage}
                      onChange={(e) => setReferenceMessage(e.target.value)}
                      className="w-full h-32 p-4 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-blue-600 focus:border-blue-600 mb-8 resize-none text-zinc-900 dark:text-zinc-100 transition-colors"
                      placeholder="Hi! I'm applying for jobs on NovaLance and I was hoping you could provide a reference based on our time working together. It would help me a lot to have you as a reference."
                    />
                  </div>
                )}

                <div className="flex justify-between items-center w-full mt-4">
                  <Button onClick={() => setStep(8)} variant="outline" className="px-8 py-2 rounded-md font-medium text-lg border-zinc-300">Back</Button>
                  <Button 
                    onClick={handleFinalComplete} 
                    disabled={isSubmitting} 
                    className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-md transition-all shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </Button>
                </div>
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
