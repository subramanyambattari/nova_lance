import { useTransition } from "react"
import { ArrowUpRight, Plus, Upload, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "./ui-components"
import { createJob } from "@/app/actions/client"
import { toast } from "@/lib/toast"
import { jobFieldOptions, initialJobDraft, initialSkills } from "./data"
import type { Job } from "./types"

export function PostJobTab({
  editingJobId,
  setEditingJobId,
  jobDraft,
  setJobDraft,
  skills,
  setSkills,
  skillDraft,
  setSkillDraft,
  attachments,
  setAttachments,
  addSkill,
  setJobsState,
  handleTabChange,
}: {
  editingJobId?: string | null
  setEditingJobId?: React.Dispatch<React.SetStateAction<string | null>>
  jobDraft: typeof initialJobDraft
  setJobDraft: React.Dispatch<React.SetStateAction<typeof initialJobDraft>>
  skills: string[]
  setSkills: React.Dispatch<React.SetStateAction<string[]>>
  skillDraft: string
  setSkillDraft: React.Dispatch<React.SetStateAction<string>>
  attachments: string[]
  setAttachments: React.Dispatch<React.SetStateAction<string[]>>
  addSkill: () => void
  setJobsState: React.Dispatch<React.SetStateAction<Job[]>>
  handleTabChange: (value: string) => void
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_390px]">
      <div>
        <SectionHeader eyebrow="Smart job creation" title="Post a job" />
        <div className="space-y-5">
          <label className="block group">
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition-colors group-focus-within:text-violet-600 dark:group-focus-within:text-violet-400">Job title</span>
            <input
              value={jobDraft.title}
              onChange={(event) => setJobDraft((draft) => ({ ...draft, title: event.target.value }))}
              className="mt-2 h-11 w-full rounded-xl border border-zinc-200/80 bg-white px-4 text-sm font-medium outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-zinc-900/50 dark:focus:border-violet-400 dark:focus:ring-violet-400/10 shadow-sm"
              placeholder="e.g. Senior Frontend Developer for AI Dashboard"
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            {jobFieldOptions.map((field) => (
              <label key={field.key} className="block group">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition-colors group-focus-within:text-violet-600 dark:group-focus-within:text-violet-400">{field.label}</span>
                <select
                  value={jobDraft[field.key as keyof typeof initialJobDraft]}
                  onChange={(event) =>
                    setJobDraft((draft) => ({
                      ...draft,
                      [field.key]: event.target.value,
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-zinc-200/80 bg-white px-4 text-sm font-medium outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-zinc-900/50 dark:focus:border-violet-400 dark:focus:ring-violet-400/10 shadow-sm appearance-none"
                >
                  {field.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div>
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Skill tags</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className="group flex items-center gap-1.5 rounded-full border border-violet-200/60 bg-violet-50/50 px-3 py-1.5 text-sm font-medium text-violet-800 transition-all hover:bg-violet-100 hover:border-violet-300 dark:border-violet-900/30 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:bg-violet-900/40"
                  onClick={() => setSkills((items) => items.filter((item) => item !== skill))}
                >
                  {skill}
                  <XCircle className="size-4 opacity-50 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={skillDraft}
                onChange={(event) => setSkillDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    addSkill()
                  }
                }}
                placeholder="Add a required skill..."
                className="h-11 min-w-0 flex-1 rounded-xl border border-zinc-200/80 bg-white px-4 text-sm outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-white/10 dark:bg-zinc-900/50 dark:focus:border-violet-400 dark:focus:ring-violet-400/10 shadow-sm"
              />
              <Button type="button" variant="outline" onClick={addSkill} className="h-11 rounded-xl px-5 border-zinc-200/80 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 dark:border-white/10 dark:hover:bg-violet-900/30 dark:hover:text-violet-400 dark:hover:border-violet-800/50">
                <Plus className="size-4 mr-1.5" />
                Add
              </Button>
            </div>
          </div>

          <label className="group mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200/80 bg-zinc-50/50 p-6 text-center text-sm font-medium text-zinc-500 transition-all hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-600 dark:border-white/10 dark:bg-zinc-900/30 dark:hover:border-violet-500/50 dark:hover:bg-violet-900/20 dark:hover:text-violet-400">
            <div className="rounded-full bg-white p-3 shadow-sm mb-3 group-hover:bg-violet-100 group-hover:shadow-md transition-all dark:bg-zinc-800 dark:group-hover:bg-violet-900/50">
              <Upload className="size-5" />
            </div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-violet-700 dark:group-hover:text-violet-300">Click to upload</span> or drag and drop files
            <span className="text-xs font-normal text-zinc-400 mt-1">Briefs, brand files, specs, or screenshots</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(event) =>
                setAttachments(Array.from(event.target.files ?? []).map((file) => file.name))
              }
            />
          </label>
          {attachments.length ? (
            <div className="flex flex-wrap gap-2">
              {attachments.map((name) => (
                <Badge key={name} variant="outline" className="rounded-md bg-white dark:bg-zinc-900">
                  {name}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <aside>
        <SectionHeader eyebrow="Preview" title="AI-generated details" />
        <div className="relative overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/80 via-white to-white p-6 shadow-sm dark:border-violet-900/30 dark:from-violet-950/40 dark:via-zinc-900/60 dark:to-zinc-900/40">
          <div className="absolute top-0 right-0 h-full w-1.5 bg-gradient-to-b from-violet-500 to-indigo-500 opacity-80" />
          
          <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{jobDraft.title || "Untitled Job Post"}</h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            We need an experienced freelancer to build a production-ready AI chatbot with secure
            authentication, analytics, admin controls, and documented deployment.
          </p>
          
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Budget", jobDraft.budget],
              ["Timeline", jobDraft.timeline],
              ["Priority", jobDraft.priority],
              ["Experience", jobDraft.experience],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-zinc-200/60 bg-white/60 p-3.5 dark:border-white/5 dark:bg-zinc-950/40 shadow-sm">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
                <p className="mt-1 font-semibold text-zinc-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <Button
              variant="outline"
              className="rounded-xl h-11 px-6 shadow-sm"
              disabled={isPending}
              onClick={() => {
                setJobsState((prev) => [
                  {
                    title: jobDraft.title || "Untitled Job Post",
                    status: "Draft",
                    proposals: 0,
                    hired: 0,
                    progress: 0,
                    budget: jobDraft.budget,
                  },
                  ...prev,
                ])
                toast.success("Job saved as draft!")
                setJobDraft(initialJobDraft)
                setSkills(initialSkills)
                if (setEditingJobId) setEditingJobId(null)
                handleTabChange("jobs")
              }}
            >
              Save as draft
            </Button>
            <Button
              disabled={isPending}
              className="rounded-xl h-11 px-6 bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/20 transition-all"
              onClick={() => {
                startTransition(async () => {
                  if (editingJobId) {
                    setJobsState((prev) => 
                      prev.map((job) => 
                        job.id === editingJobId 
                          ? { ...job, title: jobDraft.title, budget: jobDraft.budget } 
                          : job
                      )
                    )
                    toast.success("Job updated successfully!")
                  } else {
                    await createJob({
                      title: jobDraft.title,
                      budget: jobDraft.budget,
                      timeline: jobDraft.timeline,
                      priority: jobDraft.priority,
                      experience: jobDraft.experience,
                      skills: skills,
                    })
                    setJobsState((prev) => [
                      {
                        title: jobDraft.title,
                        status: "Active",
                        proposals: 0,
                        hired: 0,
                        progress: 0,
                        budget: jobDraft.budget,
                      },
                      ...prev,
                    ])
                    toast.success("Job posted successfully!")
                  }
                  setJobDraft(initialJobDraft)
                  setSkills(initialSkills)
                  if (setEditingJobId) setEditingJobId(null)
                  handleTabChange("jobs")
                })
              }}
            >
              {isPending ? (editingJobId ? "Updating..." : "Posting...") : (editingJobId ? "Update job" : "Post job")}
              <ArrowUpRight className="size-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </aside>
    </section>
  )
}
