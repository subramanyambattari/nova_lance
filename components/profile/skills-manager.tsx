"use client"

import { Plus, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SkillsManager() {
  const [skills, setSkills] = useState([
    "Next.js",
    "React",
    "TypeScript",
    "Prisma",
    "Tailwind CSS",
  ])
  const [nextSkill, setNextSkill] = useState("")

  function addSkill() {
    const value = nextSkill.trim()
    if (!value || skills.includes(value)) return
    setSkills((current) => [...current, value])
    setNextSkill("")
  }

  return (
    <div className="md:col-span-2">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <Input
          value={nextSkill}
          onChange={(event) => setNextSkill(event.target.value)}
          placeholder="Add a skill..."
          className="h-10 rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:ring-blue-500/30"
        />
        <Button type="button" onClick={addSkill} className="rounded-xl bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-blue-100">
          <Plus className="size-4" />
          Add skill
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {skills.map((skill) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Badge variant="outline" className="gap-1 border-blue-500/20 bg-blue-50 dark:border-blue-400/20 dark:bg-blue-500/10 px-3 py-1 text-blue-700 dark:text-blue-100">
                {skill}
                <button
                  type="button"
                  aria-label={`Remove ${skill}`}
                  onClick={() => setSkills((current) => current.filter((item) => item !== skill))}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
