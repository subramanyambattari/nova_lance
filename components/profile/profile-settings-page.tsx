"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Loader2, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { AnalyticsCard } from "@/components/profile/analytics-card"
import { PersonalInfoForm } from "@/components/profile/personal-info-form"
import { PortfolioSection } from "@/components/profile/portfolio-section"
import { ProfessionalInfoForm } from "@/components/profile/professional-info-form"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileHero } from "@/components/profile/profile-hero"
import { RecentActivity } from "@/components/profile/recent-activity"
import { SecuritySettings } from "@/components/profile/security-settings"
import {
  defaultProfileValues,
  profileSchema,
  type ProfileFormValues,
} from "@/components/profile/profile-schema"
import { WorkPreferences } from "@/components/profile/work-preferences"
import { Button } from "@/components/ui/button"

const draftKey = "nova-lance-profile-draft"

export function ProfileSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: defaultProfileValues,
  })

  const { control, formState, handleSubmit, register, reset, watch } = form

  useEffect(() => {
    const rawDraft = window.localStorage.getItem(draftKey)
    if (!rawDraft) return

    try {
      reset({ ...defaultProfileValues, ...JSON.parse(rawDraft) })
    } catch {
      window.localStorage.removeItem(draftKey)
    }
  }, [reset])

  useEffect(() => {
    const subscription = watch((value) => {
      window.localStorage.setItem(draftKey, JSON.stringify(value))
    })

    return () => subscription.unsubscribe()
  }, [watch])

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  async function onSubmit(values: ProfileFormValues) {
    setIsSaving(true)
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    window.localStorage.setItem(draftKey, JSON.stringify(values))
    setIsSaving(false)
    showToast("Profile changes saved.")
  }

  function onCancel() {
    reset(defaultProfileValues)
    window.localStorage.removeItem(draftKey)
    showToast("Draft changes discarded.")
  }

  return (
    <div className="min-h-screen overflow-hidden bg-transparent text-zinc-900 dark:text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/4 top-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-10 top-96 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-0 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8"
      >
        <ProfileHeader isSaving={isSaving} onCancel={onCancel} />
        <ProfileHero />
        <AnalyticsCard />
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-4">
            <PersonalInfoForm register={register} errors={formState.errors} />
            <ProfessionalInfoForm register={register} errors={formState.errors} />
            <WorkPreferences
              register={register}
              control={control}
              errors={formState.errors}
            />
            <PortfolioSection />
          </div>
          <div className="space-y-4">
            <SecuritySettings control={control} />
            <RecentActivity />
          </div>
        </div>

        <div className="sticky bottom-4 z-20 rounded-2xl border border-zinc-200 bg-white/90 p-3 shadow-sm dark:border-white/10 dark:bg-zinc-950/85 dark:shadow-2xl dark:shadow-black/40 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-950 dark:text-zinc-100">
                {formState.isDirty ? "Unsaved profile changes" : "Profile draft autosaved"}
              </p>
              <p className="text-xs text-zinc-500">
                Validation runs as you edit. Draft changes are stored locally.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="rounded-xl border-zinc-200 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-blue-100"
              >
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm dark:border-white/10 dark:bg-zinc-950/95 dark:text-zinc-100 dark:shadow-2xl dark:shadow-black/40 backdrop-blur-xl"
          >
            <Check className="size-4 text-emerald-500 dark:text-emerald-300" />
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
