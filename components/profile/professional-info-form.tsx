"use client"

import { FileUp } from "lucide-react"
import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileInput, ProfileSelect, ProfileTextarea } from "@/components/profile/profile-field"
import type { ProfileFormValues } from "@/components/profile/profile-schema"
import { SkillsManager } from "@/components/profile/skills-manager"

interface ProfessionalInfoFormProps {
  register: UseFormRegister<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
}

export function ProfessionalInfoForm({
  register,
  errors,
}: ProfessionalInfoFormProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }}>
      <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Professional information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <ProfileInput label="Professional Title" name="title" register={register} errors={errors} />
          <ProfileSelect
            label="Experience Level"
            name="experienceLevel"
            register={register}
            errors={errors}
            options={["Intermediate", "Expert", "Principal"]}
          />
          <ProfileTextarea label="Bio/About Me" name="bio" register={register} errors={errors} />
          <SkillsManager />
          <ProfileInput label="Hourly Rate" name="hourlyRate" type="number" register={register} errors={errors} />
          <ProfileSelect
            label="Availability"
            name="availability"
            register={register}
            errors={errors}
            options={["Available this week", "Available next week", "Limited availability", "Not available"]}
          />
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 dark:border-white/15 dark:bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-200">
                <FileUp className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Resume Upload</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">PDF or DOCX, up to 10MB</p>
              </div>
            </div>
          </div>
          <ProfileInput label="Portfolio Website" name="portfolioWebsite" register={register} errors={errors} />
          <ProfileInput label="GitHub" name="github" register={register} errors={errors} />
          <ProfileInput label="LinkedIn" name="linkedin" register={register} errors={errors} />
        </CardContent>
      </Card>
    </motion.div>
  )
}
