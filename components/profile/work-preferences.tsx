"use client"

import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ProfileSelect } from "@/components/profile/profile-field"
import type { ProfileFormValues } from "@/components/profile/profile-schema"

interface WorkPreferencesProps {
  register: UseFormRegister<ProfileFormValues>
  control: Control<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
}

export function WorkPreferences({
  register,
  control,
  errors,
}: WorkPreferencesProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 }}>
      <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Work preferences</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <ProfileSelect
            label="Preferred Job Type"
            name="preferredJobType"
            register={register}
            errors={errors}
            options={["Long-term contracts", "Fixed-price projects", "Hourly consulting", "Part-time retainers"]}
          />
          <ProfileSelect
            label="Project budget range"
            name="budgetRange"
            register={register}
            errors={errors}
            options={["$1k - $5k", "$5k - $15k", "$15k - $30k", "$30k+"]}
          />
          <ProfileSelect
            label="Weekly availability"
            name="weeklyAvailability"
            register={register}
            errors={errors}
            options={["10 hours/week", "25 hours/week", "40 hours/week", "Flexible"]}
          />
          <Controller
            control={control}
            name="remoteOnly"
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-white/[0.03] p-4">
                <Label>Remote only</Label>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />
          <Controller
            control={control}
            name="openToContract"
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-white/[0.03] p-4 md:col-span-2">
                <Label>Open to contract work</Label>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
