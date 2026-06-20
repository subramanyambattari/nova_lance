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
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Job title</span>
            <input
              value={jobDraft.title}
              onChange={(event) => setJobDraft((draft) => ({ ...draft, title: event.target.value }))}
              className="mt-2 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-950/20 dark:border-white/10 dark:bg-white/[0.04]"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            {jobFieldOptions.map((field) => (
              <label key={field.key} className="block">
                <span className="text-sm font-medium">{field.label}</span>
                <select
                  value={jobDraft[field.key as keyof typeof initialJobDraft]}
                  onChange={(event) =>
                    setJobDraft((draft) => ({
                      ...draft,
                      [field.key]: event.target.value,
                    }))
                  }
                  className="mt-2 h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-950/20 dark:border-white/10 dark:bg-zinc-900"
                >
                  {field.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div>
            <span className="text-sm font-medium">Skill tags</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm dark:border-white/10 dark:bg-white/[0.04]"
                  onClick={() => setSkills((items) => items.filter((item) => item !== skill))}
                >
                  {skill}
                  <XCircle className="size-3.5" />
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={skillDraft}
                onChange={(event) => setSkillDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    addSkill()
                  }
                }}
                placeholder="Add a skill"
                className="h-9 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-950/20 dark:border-white/10 dark:bg-white/[0.04]"
              />
              <Button type="button" variant="outline" onClick={addSkill}>
                <Plus className="size-4" />
                Add
              </Button>
            </div>
          </div>

          <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white p-4 text-center text-sm text-zinc-500 dark:border-white/15 dark:bg-white/[0.04]">
            <Upload className="mb-2 size-5" />
            Upload briefs, brand files, specs, or screenshots
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
                <Badge key={name} variant="outline" className="rounded-md">
                  {name}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <aside>
        <SectionHeader eyebrow="Preview" title="AI-generated details" />
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <h3 className="text-lg font-semibold">{jobDraft.title}</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            We need an experienced freelancer to build a production-ready AI chatbot with secure
            authentication, analytics, admin controls, and documented deployment.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {[
              ["Budget", jobDraft.budget],
              ["Timeline", jobDraft.timeline],
              ["Priority", jobDraft.priority],
              ["Experience", jobDraft.experience],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-zinc-200 p-3 dark:border-white/10">
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-1 font-medium">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline">Save as draft</Button>
            <Button
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
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
                  setJobDraft(initialJobDraft)
                  setSkills(initialSkills)
                  handleTabChange("jobs")
                })
              }}
            >
              {isPending ? "Posting..." : "Post job"}
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </div>
      </aside>
    </section>
  )
}
