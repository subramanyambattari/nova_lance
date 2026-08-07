"use client"

import { Dialog as DialogPrimitive } from "radix-ui"
import { Check, Clock, MapPin, Send, Sparkles, Star, Trophy, Briefcase, GraduationCap, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function TalentProfileDialog({
  talent,
  onClose,
}: {
  talent: any | null
  onClose: () => void
}) {
  const open = Boolean(talent)

  if (!talent) {
    return null
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-open:animate-in data-open:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 grid max-h-[95vh] w-[calc(100vw-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 gap-0 overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 text-zinc-100 shadow-2xl shadow-black/80 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95">
          
          {/* Header Banner */}
          <div className="relative h-48 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
            
            <DialogPrimitive.Close asChild>
              <Button type="button" variant="ghost" size="icon" className="absolute right-4 top-4 rounded-xl bg-black/20 text-white hover:bg-black/40 backdrop-blur-md border border-white/10">
                <X className="size-4" />
              </Button>
            </DialogPrimitive.Close>
          </div>

          <div className="px-8 pb-10">
            {/* Profile Info (Overlapping Banner) */}
            <div className="relative -mt-16 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6 md:items-end">
                <div className="grid size-32 shrink-0 place-items-center rounded-3xl border-4 border-zinc-950 bg-gradient-to-br from-zinc-100 to-zinc-300 text-4xl font-bold text-zinc-800 shadow-xl dark:from-zinc-800 dark:to-zinc-900 dark:text-white">
                  {talent.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="pb-2">
                  <DialogPrimitive.Title className="text-3xl font-bold text-white tracking-tight">
                    {talent.name}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="text-lg font-medium text-zinc-400 mt-1">
                    {talent.title}
                  </DialogPrimitive.Description>
                </div>
              </div>
              
              <div className="flex gap-3 pb-2">
                <Button className="h-12 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold px-6 shadow-[0_0_15px_rgba(255,255,255,0.1)]" onClick={() => {
                  toast.success(`Invited ${talent.name} to apply.`)
                  onClose()
                }}>
                  <Send className="mr-2 size-4" />
                  Invite to Job
                </Button>
                <Button variant="outline" className="h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 font-semibold px-5" onClick={() => toast.success(`Saved ${talent.name} to lists.`)}>
                  <Star className="size-4" />
                </Button>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                  <Sparkles className="size-4 text-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Match Score</span>
                </div>
                <span className="text-2xl font-bold text-emerald-400">{talent.match}%</span>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                  <Trophy className="size-4 text-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Hourly Rate</span>
                </div>
                <span className="text-2xl font-bold text-white">{talent.rate}</span>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                  <Clock className="size-4 text-blue-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Availability</span>
                </div>
                <span className="text-lg font-bold text-white leading-tight">{talent.availability}</span>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                  <MapPin className="size-4 text-violet-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Timezone</span>
                </div>
                <span className="text-lg font-bold text-white leading-tight">{talent.timezone}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-[2fr_1fr] gap-8">
              {/* Left Main Content */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Briefcase className="size-5 text-zinc-400" />
                    About & Experience
                  </h3>
                  <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-5 text-zinc-300 leading-relaxed text-sm">
                    {talent.bio || talent.portfolio || `${talent.name} is a highly rated professional specializing in ${talent.skills[0]} and ${talent.skills[1] || 'related fields'}. They have a proven track record of delivering high-quality results for clients matching your criteria.`}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Check className="size-5 text-emerald-400" />
                    Verified Skills
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {talent.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="rounded-xl border-emerald-500/20 bg-emerald-500/10 text-emerald-300 px-3 py-1.5 text-sm">
                        {skill}
                      </Badge>
                    ))}
                    {talent.missingSkills?.map((skill: string) => (
                      <Badge key={`missing-${skill}`} variant="outline" className="rounded-xl border-rose-500/20 bg-rose-500/10 text-rose-300 px-3 py-1.5 text-sm">
                        {skill} (Missing)
                      </Badge>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <section className="rounded-2xl border border-white/5 bg-zinc-900/50 p-5">
                   <h3 className="font-bold text-white mb-4">Nova Insights</h3>
                   <ul className="space-y-4 text-sm text-zinc-400">
                     <li className="flex gap-3">
                       <div className="mt-0.5 rounded-full bg-violet-500/20 p-1 text-violet-400 shrink-0">
                         <Sparkles className="size-3" />
                       </div>
                       <span>Strong match for your required tech stack based on their recent completed projects.</span>
                     </li>
                     <li className="flex gap-3">
                       <div className="mt-0.5 rounded-full bg-emerald-500/20 p-1 text-emerald-400 shrink-0">
                         <Check className="size-3" />
                       </div>
                       <span>Excellent communication rating (4.9/5.0). Responds typically within 2 hours.</span>
                     </li>
                     <li className="flex gap-3">
                       <div className="mt-0.5 rounded-full bg-amber-500/20 p-1 text-amber-400 shrink-0">
                         <Trophy className="size-3" />
                       </div>
                       <span>Top Rated Plus talent. Earned {talent.earned || "Top 3%"} status on the platform.</span>
                     </li>
                   </ul>
                </section>
                
                <section className="rounded-2xl border border-white/5 bg-zinc-900/50 p-5">
                   <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                     <GraduationCap className="size-5 text-zinc-400" />
                     Education
                   </h3>
                   <div className="text-sm">
                     <p className="font-semibold text-zinc-200">B.S. Computer Science</p>
                     <p className="text-zinc-500">University of Technology • 2014 - 2018</p>
                   </div>
                </section>
              </div>
            </div>

          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
