"use client"

import {
  Send,
  Star,
  Users,
  MapPin,
  Clock,
  TrendingUp,
  Map,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/lib/toast"
import { useState } from "react"
import { TalentProfileDialog } from "./talent-profile-dialog"

const talents = [
  {
    name: "Ava Johnson",
    title: "Senior product designer",
    match: 96,
    availability: "Available this week",
    timezone: "EST (UTC-5)",
    rate: "$72/hr",
    rank: "Top 1%",
    skills: ["Figma", "Design systems", "SaaS UX"],
    missingSkills: ["Framer Motion"],
    portfolio: "Fintech dashboards, checkout flows, growth experiments",
  },
  {
    name: "Marco Silva",
    title: "Full-stack AI engineer",
    match: 92,
    availability: "Starts May 27",
    timezone: "CET (UTC+1)",
    rate: "$88/hr",
    rank: "Top 3%",
    skills: ["Next.js", "LangChain", "Postgres"],
    missingSkills: [],
    portfolio: "AI copilots, support automation, analytics platforms",
  },
  {
    name: "Nia Patel",
    title: "Technical project manager",
    match: 89,
    availability: "Part-time",
    timezone: "PST (UTC-8)",
    rate: "$54/hr",
    rank: "Rising talent",
    skills: ["Agile", "Milestones", "QA"],
    missingSkills: ["Jira"],
    portfolio: "Remote team delivery, sprint planning, client reporting",
  },
]

export function TalentMatches({ matches = [] }: { matches?: any[] }) {
  const displayTalents = matches.length > 0 ? matches : talents;
  const [selectedTalent, setSelectedTalent] = useState<any | null>(null)

  return (
    <div className="space-y-8">


      {/* Talent Matches List */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-normal text-zinc-950 dark:text-white">AI-Recommended Talent</h2>
            <p className="text-sm text-zinc-500">Smart matched based on your active drafts and past hires.</p>
          </div>
        </div>
        <div className="grid gap-5">
          {displayTalents.map((talent) => (
            <div key={talent.name} className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-violet-300 dark:border-white/10 dark:bg-zinc-900/40 dark:hover:border-violet-500/50">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-transparent to-violet-500/0 transition-all group-hover:from-violet-500/5 group-hover:to-indigo-500/5" />
              
              <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_220px_220px]">
                {/* Left Col */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 text-lg font-bold text-zinc-600 shadow-sm dark:from-zinc-800 dark:to-zinc-900 dark:text-white">
                      {talent.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">{talent.name}</h3>
                      <p className="font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">{talent.title}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                       <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                         <Sparkles className="size-4" /> {talent.match}% Match
                       </span>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{talent.bio || talent.portfolio}</p>
                  
                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mr-1">Matched Skills</span>
                    {talent.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="rounded-lg border-emerald-200 bg-emerald-50/50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 px-2.5 py-1">
                        {skill}
                      </Badge>
                    ))}
                    {talent.missingSkills && talent.missingSkills.length > 0 && (
                      <>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-3 mr-1">Missing</span>
                        {talent.missingSkills.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="rounded-lg border-amber-200 bg-amber-50/50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300 px-2.5 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Mid Col: Details */}
                <div className="flex flex-col gap-4 border-t border-zinc-200/60 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 dark:border-white/10">
                   <div className="flex items-center gap-3 text-sm">
                      <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                        <Clock className="size-4 text-zinc-500 dark:text-zinc-400" />
                      </div>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{talent.availability}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm">
                      <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                        <MapPin className="size-4 text-zinc-500 dark:text-zinc-400" />
                      </div>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{talent.timezone}</span>
                   </div>
                   <div className="flex justify-between items-center mt-auto bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-100 dark:border-white/5">
                     <div>
                       <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Rate</p>
                       <p className="font-bold text-zinc-900 dark:text-zinc-100">{talent.rate}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Earned</p>
                       <p className="font-bold text-zinc-900 dark:text-zinc-100">{talent.earned || talent.rank}</p>
                     </div>
                   </div>
                </div>

                {/* Right Col: Actions */}
                <div className="flex flex-col gap-3 border-t border-zinc-200/60 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 dark:border-white/10">
                  <Button className="w-full justify-center h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/20 transition-all font-semibold" onClick={() => toast.success(`Invited ${talent.name} to apply.`)}>
                    <Send className="mr-2 size-4" />
                    Invite to Job
                  </Button>
                  <Button variant="outline" className="w-full justify-center h-11 rounded-xl border-zinc-200/80 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm dark:border-white/10 dark:hover:bg-zinc-800 dark:hover:text-white transition-all font-semibold" onClick={() => toast.success(`Saved ${talent.name} for later.`)}>
                    <Star className="mr-2 size-4" />
                    Save Freelancer
                  </Button>
                  <Button variant="ghost" className="w-full justify-center mt-auto font-semibold text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/30" onClick={() => setSelectedTalent(talent)}>
                    View Full Profile &rarr;
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <TalentProfileDialog talent={selectedTalent} onClose={() => setSelectedTalent(null)} />
    </div>
  )
}
