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
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center gap-2 mb-4">
            <Target className="size-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold">Hiring Funnel Prediction</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Total Invites Sent</span>
              <span className="font-medium">45</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Proposals Received</span>
              <span className="font-medium">12 (26%)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">Shortlisted Candidates</span>
              <span className="font-medium">3 (25%)</span>
            </div>
            <div className="flex justify-between text-sm pt-3 border-t border-zinc-100 dark:border-white/10">
              <span className="font-medium">Estimated Time to Hire</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">4 Days</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="size-5 text-violet-600 dark:text-violet-400" />
            <h3 className="font-semibold">Talent Market Insights</h3>
          </div>
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Avg. Rate for Next.js Developers</span>
                <Badge variant="outline">$65 - $85/hr</Badge>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Availability Trend</span>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">High Supply</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Top Required Skill (This Week)</span>
                <Badge variant="outline">AI Integrations</Badge>
             </div>
          </div>
        </div>
      </section>

      {/* AI Tools Grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-normal text-zinc-950 dark:text-white">AI Tools</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {aiTools.map((tool) => (
            <button
              key={tool.title}
              type="button"
              className="rounded-lg border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:border-zinc-400 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/30"
            >
              <span className="grid size-9 place-items-center rounded-md bg-zinc-100 text-zinc-950 dark:bg-white/10 dark:text-white">
                <tool.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{tool.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{tool.text}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Nova Command Center */}
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-normal text-zinc-950 dark:text-white">Nova command center</h2>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                <Bot className="size-5" />
              </span>
              <div>
                <p className="font-semibold">What should I do next?</p>
                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Nova recommends comparing Marco, David, and Ava, then creating two technical milestones
                  before sending interview invites.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Explain proposals", "Suggest budgets", "Summarize meetings", "Generate job content"].map((prompt) => (
                <Button 
                  key={prompt} 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    startTransition(() => {
                      setAiResponse(`Simulating AI response for: ${prompt}`)
                    })
                  }}
                  disabled={isPending}
                >
                  {prompt}
                </Button>
              ))}
            </div>
            {aiResponse && (
              <div className="mt-4 rounded-md bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-blue-600 dark:text-blue-400">Nova AI Response:</strong>
                  <Button variant="ghost" size="sm" onClick={() => setAiResponse(null)}>Clear</Button>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300">
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
           <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <div className="flex items-start gap-3">
                 <AlertTriangle className="size-5 text-amber-500" />
                 <div>
                    <h3 className="font-semibold">2 Profiles require manual review</h3>
                    <p className="text-sm text-zinc-500 mt-1">We detected generic portfolio samples that resemble public templates. Consider requesting a custom code snippet.</p>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  )
}
