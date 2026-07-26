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

  return (
    <div className="space-y-8">
      {/* Top Widgets */}
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
           <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="size-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-semibold">Trending Skills</h3>
           </div>
           <div className="flex flex-wrap gap-2">
              {["Next.js", "LangChain", "Figma", "Tailwind CSS", "Prisma"].map(skill => (
                <Badge key={skill} variant="secondary" className="rounded-md">{skill}</Badge>
              ))}
           </div>
        </div>
        
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
           <div className="flex items-center gap-2 mb-4">
              <Users className="size-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold">Recently Active Talent</h3>
           </div>
           <p className="text-sm text-zinc-500 mb-2">14 top-rated freelancers matching your drafts became available in the last 24h.</p>
           <Button variant="link" className="px-0 h-auto font-medium">View active talent &rarr;</Button>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
           <div className="flex items-center gap-2 mb-4">
              <Map className="size-5 text-violet-600 dark:text-violet-400" />
              <h3 className="font-semibold">Talent Heatmap</h3>
           </div>
           <div className="space-y-2 text-sm">
             <div className="flex justify-between">
                <span>North America</span>
                <span className="font-medium">45%</span>
             </div>
             <div className="flex justify-between">
                <span>Europe</span>
                <span className="font-medium">35%</span>
             </div>
             <div className="flex justify-between">
                <span>Asia Pacific</span>
                <span className="font-medium">20%</span>
             </div>
           </div>
        </div>
      </section>

      {/* Talent Matches List */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-normal text-zinc-950 dark:text-white">AI-Recommended Talent</h2>
            <p className="text-sm text-zinc-500">Smart matched based on your active drafts and past hires.</p>
          </div>
        </div>
        <div className="grid gap-4">
          {displayTalents.map((talent) => (
            <div key={talent.name} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <div className="grid gap-4 lg:grid-cols-[1fr_200px_200px]">
                {/* Left Col */}
                <div>
                  <div className="flex items-start gap-3">
                    <div className="grid size-12 place-items-center rounded-full bg-zinc-100 font-semibold text-zinc-600 dark:bg-white/10 dark:text-white">
                      {talent.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{talent.name}</h3>
                      <p className="text-sm text-zinc-500">{talent.title}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                       <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                         <Sparkles className="size-3" /> {talent.match}% Match
                       </span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{talent.bio || talent.portfolio}</p>
                  
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-500 mr-2">Matched Skills:</span>
                    {talent.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="rounded-md border-emerald-200 bg-emerald-50/50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        {skill}
                      </Badge>
                    ))}
                    {talent.missingSkills && talent.missingSkills.length > 0 && (
                      <>
                        <span className="text-xs font-semibold text-zinc-500 ml-2 mr-2">Missing:</span>
                        {talent.missingSkills.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="rounded-md border-amber-200 bg-amber-50/50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                            {skill}
                          </Badge>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Mid Col: Details */}
                <div className="flex flex-col gap-3 border-t pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0 dark:border-white/10">
                   <div className="flex items-center gap-2 text-sm">
                      <Clock className="size-4 text-zinc-400" />
                      <span className="text-zinc-700 dark:text-zinc-300">{talent.availability}</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                      <MapPin className="size-4 text-zinc-400" />
                      <span className="text-zinc-700 dark:text-zinc-300">{talent.timezone}</span>
                   </div>
                   <div className="flex justify-between items-center mt-auto">
                     <div>
                       <p className="text-xs text-zinc-500">Rate</p>
                       <p className="font-medium">{talent.rate}</p>
                     </div>
                     <div>
                       <p className="text-xs text-zinc-500">Earned</p>
                       <p className="font-medium">{talent.earned || talent.rank}</p>
                     </div>
                   </div>
                </div>

                {/* Right Col: Actions */}
                <div className="flex flex-col gap-2 border-t pt-4 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0 dark:border-white/10">
                  <Button className="w-full justify-start" onClick={() => toast.success(`Invited ${talent.name} to apply.`)}>
                    <Send className="mr-2 size-4" />
                    Invite to Job
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => toast.success(`Saved ${talent.name} for later.`)}>
                    <Star className="mr-2 size-4" />
                    Save Freelancer
                  </Button>
                  <Button variant="ghost" className="w-full justify-start mt-auto">
                    View Full Profile &rarr;
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
