import type { FieldErrors, Path, UseFormRegister } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { ProfileFormValues } from "@/components/profile/profile-schema"

interface FieldProps {
  label: string
  name: Path<ProfileFormValues>
  register: UseFormRegister<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
  placeholder?: string
  type?: string
  options?: string[]
}

const inputClass =
  "h-10 rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:ring-blue-500/30"

export function ProfileInput({
  label,
  name,
  register,
  errors,
  placeholder,
  type = "text",
}: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        className={inputClass}
        {...register(name, type === "number" ? { valueAsNumber: true } : undefined)}
      />
      {errors[name]?.message ? (
        <p className="text-xs text-rose-600 dark:text-rose-300">{String(errors[name]?.message)}</p>
      ) : null}
    </div>
  )
}

export function ProfileTextarea({
  label,
  name,
  register,
  errors,
  placeholder,
}: FieldProps) {
  return (
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        placeholder={placeholder}
        className="min-h-32 rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:ring-blue-500/30"
        {...register(name)}
      />
      {errors[name]?.message ? (
        <p className="text-xs text-rose-600 dark:text-rose-300">{String(errors[name]?.message)}</p>
      ) : null}
    </div>
  )
}

export function ProfileSelect({
  label,
  name,
  register,
  errors,
  options = [],
}: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Select
        id={name}
        className="border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/80 text-zinc-900 dark:text-zinc-100 focus-visible:ring-blue-500/30"
        {...register(name)}
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-white dark:bg-zinc-950">
            {option}
          </option>
        ))}
      </Select>
      {errors[name]?.message ? (
        <p className="text-xs text-rose-600 dark:text-rose-300">{String(errors[name]?.message)}</p>
      ) : null}
    </div>
  )
}
