"use client"

import { Controller, type Control } from "react-hook-form"
import { Code2, KeyRound, Laptop, ShieldCheck, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { ProfileFormValues } from "@/components/profile/profile-schema"

interface SecuritySettingsProps {
  control: Control<ProfileFormValues>
}

export function SecuritySettings({ control }: SecuritySettingsProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.25 }}>
      <Card className="rounded-2xl border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base text-zinc-100">Security settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <KeyRound className="size-4 text-blue-300" />
              <Label>Change password</Label>
            </div>
            <Button type="button" variant="outline" className="rounded-xl border-white/10 bg-white/[0.04] text-zinc-200">
              Update
            </Button>
          </div>
          <Controller
            control={control}
            name="twoFactor"
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-4 text-emerald-300" />
                  <Label>Two-factor authentication</Label>
                </div>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <Code2 className="size-4 text-violet-300" />
              <p className="mt-3 text-sm font-medium text-zinc-100">Connected accounts</p>
              <p className="mt-1 text-xs text-zinc-500">GitHub and LinkedIn connected</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <Laptop className="size-4 text-blue-300" />
              <p className="mt-3 text-sm font-medium text-zinc-100">Login sessions</p>
              <p className="mt-1 text-xs text-zinc-500">2 active devices</p>
            </div>
          </div>
          <Button type="button" variant="destructive" className="w-full rounded-xl">
            <Trash2 className="size-4" />
            Delete account
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
