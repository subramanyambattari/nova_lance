"use client"

import {
  AlertTriangle,
  Bot,
  FileCheck2,
  Gauge,
  Layers3,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  Wand2,
  Sparkles,
} from "lucide-react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const aiTools = [
  { title: "Job description generator", text: "Turn a short brief into a scoped posting.", icon: Wand2 },
  { title: "Budget estimator", text: "Estimate hourly, fixed, and milestone ranges.", icon: Gauge },
  { title: "Freelancer recommendations", text: "Rank talent by fit, availability, and risk.", icon: Users },
  { title: "Proposal analyzer", text: "Summarize strengths, gaps, price, and timeline.", icon: FileCheck2 },
  { title: "Interview questions", text: "Generate role-specific screening questions.", icon: MessageSquare },
  { title: "Meeting summaries", text: "Capture decisions, blockers, and next steps.", icon: Bot },
  { title: "Milestone creation", text: "Break scope into payable delivery checkpoints.", icon: Layers3 },
  { title: "Risk detection", text: "Flag vague scope, low signal proposals, and delays.", icon: AlertTriangle },
]

export function AIWorkspace() {
  const [isPending, startTransition] = useTransition()
  const [aiResponse, setAiResponse] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {/* Hiring Funnel & Market Insights (New Phase 1 Widgets) */}
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-white p-6 shadow-sm dark:border-blue-900/30 dark:from-blue-950/20 dark:to-zinc-900/40">
          <div className="absolute -right-4 -top-4 size-24 rounded-full bg-blue-500/10 blur-2xl" />
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-blue-100 p-2.5 dark:bg-blue-900/40">
              <Target className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">Hiring Funnel Prediction</h3>
          </div>
          <div className="space-y-5 relative z-10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-medium dark:text-zinc-400">Total Invites Sent</span>
              <span className="font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-md shadow-sm border border-zinc-100 dark:border-white/5">45</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-medium dark:text-zinc-400">Proposals Received</span>
              <span className="font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-md shadow-sm border border-zinc-100 dark:border-white/5">12 (26%)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 font-medium dark:text-zinc-400">Shortlisted Candidates</span>
              <span className="font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-md shadow-sm border border-zinc-100 dark:border-white/5">3 (25%)</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-4 border-t border-zinc-200/60 dark:border-white/10 mt-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">Estimated Time to Hire</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Gauge className="size-4" /> 4 Days
              </span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-violet-200/50 bg-gradient-to-br from-violet-50/50 to-white p-6 shadow-sm dark:border-violet-900/30 dark:from-violet-950/20 dark:to-zinc-900/40">
          <div className="absolute -right-4 -top-4 size-24 rounded-full bg-violet-500/10 blur-2xl" />
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-violet-100 p-2.5 dark:bg-violet-900/40">
              <TrendingUp className="size-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">Talent Market Insights</h3>
          </div>
          <div className="space-y-4 relative z-10">
             <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Avg. Rate for Next.js Developers</span>
                <Badge variant="outline" className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">$65 - $85/hr</Badge>
             </div>
             <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Availability Trend</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><TrendingUp className="size-3.5" /> High Supply</span>
             </div>
             <div className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Top Required Skill (This Week)</span>
                <Badge variant="outline" className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">AI Integrations</Badge>
             </div>
          </div>
        </div>
      </section>

      {/* AI Tools Grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-normal text-zinc-950 dark:text-white">AI Tools</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {aiTools.map((tool) => (
            <button
              key={tool.title}
              type="button"
              className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-5 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:border-violet-300 dark:border-white/10 dark:bg-zinc-900/40 dark:hover:border-violet-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-transparent to-violet-500/0 transition-all group-hover:from-violet-500/5 group-hover:to-indigo-500/5" />
              <div className="relative z-10">
                <span className="grid size-12 place-items-center rounded-xl bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-violet-100 group-hover:text-violet-600 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-violet-900/40 dark:group-hover:text-violet-400">
                  <tool.icon className="size-5" />
                </span>
                <h3 className="mt-5 font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">{tool.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{tool.text}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Nova Command Center */}
      <section className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-normal text-zinc-950 dark:text-white">Nova command center</h2>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent dark:from-violet-900/20" />
            
            <div className="relative flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/20 dark:bg-violet-600">
                <Bot className="size-6" />
              </span>
              <div>
                <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100">What should I do next?</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Nova recommends comparing Marco, David, and Ava, then creating two technical milestones
                  before sending interview invites.
                </p>
              </div>
            </div>
            
            <div className="relative mt-6 flex flex-wrap gap-2.5">
              {["Explain proposals", "Suggest budgets", "Summarize meetings", "Generate job content"].map((prompt) => (
                <Button 
                  key={prompt} 
                  variant="outline" 
                  size="sm"
                  className="rounded-full border-zinc-200/80 bg-zinc-50/50 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-white/10 dark:bg-zinc-900/50 dark:hover:border-violet-500/50 dark:hover:bg-violet-900/30 dark:hover:text-violet-300 transition-all shadow-sm"
                  onClick={() => {
                    startTransition(() => {
                      setAiResponse(`Simulating AI response for: ${prompt}`)
                    })
                  }}
                  disabled={isPending}
                >
                  <Sparkles className="size-3.5 mr-2 opacity-70" />
                  {prompt}
                </Button>
              ))}
            </div>
            
            {aiResponse && (
              <div className="relative mt-6 rounded-xl border border-violet-100 bg-violet-50/50 p-5 dark:border-violet-900/30 dark:bg-violet-900/10 shadow-inner">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-violet-600 dark:text-violet-400" />
                    <strong className="text-sm font-semibold text-violet-900 dark:text-violet-200">Nova AI Response</strong>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setAiResponse(null)} className="h-6 text-xs text-violet-600 hover:text-violet-800 hover:bg-violet-200/50 dark:text-violet-400 dark:hover:bg-violet-900/50">Clear</Button>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-violet-950/80 dark:text-violet-200/80">
                  {aiResponse}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div>
           <div className="mb-4">
             <h2 className="text-lg font-semibold tracking-normal text-zinc-950 dark:text-white">Risk Scan</h2>
           </div>
           <div className="group relative overflow-hidden rounded-2xl border border-amber-200/50 bg-gradient-to-br from-amber-50/80 to-white p-5 shadow-sm transition-all hover:shadow-md dark:border-amber-900/30 dark:from-amber-950/30 dark:to-zinc-900/40">
              <div className="absolute top-0 right-0 h-full w-1.5 bg-gradient-to-b from-amber-400 to-orange-500 opacity-80" />
              <div className="flex items-start gap-4">
                 <div className="rounded-full bg-amber-100 p-2.5 dark:bg-amber-900/40">
                   <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
                 </div>
                 <div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">2 Profiles require review</h3>
                    <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 mt-2">We detected generic portfolio samples that resemble public templates. Consider requesting a custom code snippet before proceeding.</p>
                    <Button variant="link" className="px-0 mt-2 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
                      View flagged profiles &rarr;
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  )
}
