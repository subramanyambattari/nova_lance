"use client"

import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileInput, ProfileSelect } from "@/components/profile/profile-field"
import type { ProfileFormValues } from "@/components/profile/profile-schema"

interface PersonalInfoFormProps {
  register: UseFormRegister<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
}

export function PersonalInfoForm({ register, errors }: PersonalInfoFormProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
      <Card className="rounded-2xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-zinc-100">Personal information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <ProfileInput label="Full Name" name="fullName" register={register} errors={errors} />
          <ProfileInput label="Username" name="username" register={register} errors={errors} />
          <ProfileInput label="Email" name="email" type="email" register={register} errors={errors} />
          <ProfileInput label="Phone Number" name="phone" register={register} errors={errors} />
          <ProfileInput label="Location" name="location" register={register} errors={errors} />
          <ProfileSelect
            label="Timezone"
            name="timezone"
            register={register}
            errors={errors}
            options={["Pacific Time", "Eastern Time", "Central European Time", "India Standard Time"]}
          />
          <ProfileInput label="Languages" name="languages" register={register} errors={errors} />
        </CardContent>
      </Card>
    </motion.div>
  )
}
