"use client"

import { Check, Loader2, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

interface ProfileHeaderProps {
  isSaving: boolean
  onCancel: () => void
}

export function ProfileHeader({ isSaving, onCancel }: ProfileHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 lg:flex-row lg:items-end lg:justify-between"
    >
      <div>
        <p className="text-sm font-medium text-blue-300">Freelancer profile</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
          Profile Settings
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
          Manage your freelancer profile and professional information.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/[0.08]"
        >
          <RotateCcw className="size-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-white text-zinc-950 hover:bg-blue-100"
        >
          {isSaving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Check className="size-4" />
          )}
          Save Changes
        </Button>
      </div>
    </motion.header>
  )
}
