"use client"

import { SlidersHorizontal } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { JobFilters } from "@/components/jobs/types"

export function JobsFilters({
  filters,
  onChange,
}: {
  filters: JobFilters
  onChange: (filters: JobFilters) => void
}) {
  return (
    <Card className="relative overflow-hidden rounded-3xl border-zinc-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900/30 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-50/50 via-transparent to-transparent dark:from-zinc-800/10" />
      <CardHeader className="relative z-10 flex-row items-center gap-3 border-b border-zinc-100 dark:border-white/5 pb-4">
        <div className="rounded-xl bg-blue-50 p-2 dark:bg-blue-500/10">
          <SlidersHorizontal className="size-4.5 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Advanced filters</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 grid gap-5 pt-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2.5">
          <Label className="text-zinc-600 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider">Experience</Label>
          <Select
            value={filters.experience}
            onChange={(event) => onChange({ ...filters, experience: event.target.value })}
            className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 dark:border-white/10 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 font-medium focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            {["all", "Intermediate", "Senior", "Expert"].map((item) => (
              <option key={item} value={item} className="bg-white dark:bg-zinc-950 font-medium">{item === "all" ? "All levels" : item}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2.5">
          <Label className="text-zinc-600 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider">Job type</Label>
          <Select
            value={filters.type}
            onChange={(event) => onChange({ ...filters, type: event.target.value })}
            className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 dark:border-white/10 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 font-medium focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            {["all", "Contract", "Fixed", "Full-time", "Part-time"].map((item) => (
              <option key={item} value={item} className="bg-white dark:bg-zinc-950 font-medium">{item === "all" ? "All types" : item}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2.5">
          <Label className="text-zinc-600 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider">Posted date</Label>
          <Select
            value={filters.posted}
            onChange={(event) => onChange({ ...filters, posted: event.target.value })}
            className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 dark:border-white/10 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 font-medium focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            <option value="any" className="bg-white dark:bg-zinc-950 font-medium">Any time</option>
            <option value="24h" className="bg-white dark:bg-zinc-950 font-medium">Last 24 hours</option>
            <option value="7d" className="bg-white dark:bg-zinc-950 font-medium">Last 7 days</option>
            <option value="30d" className="bg-white dark:bg-zinc-950 font-medium">Last 30 days</option>
          </Select>
        </div>
        <div className="space-y-2.5">
          <Label className="text-zinc-600 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider">Minimum budget</Label>
          <Input
            type="number"
            value={filters.minBudget}
            onChange={(event) => onChange({ ...filters, minBudget: Number(event.target.value) })}
            className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 dark:border-white/10 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 font-medium focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all"
          />
        </div>
        <div className="space-y-2.5 md:col-span-2">
          <Label className="text-zinc-600 dark:text-zinc-400 font-semibold text-xs uppercase tracking-wider">Skills</Label>
          <Input
            value={filters.skills}
            onChange={(event) => onChange({ ...filters, skills: event.target.value })}
            placeholder="React, Prisma, Tailwind..."
            className="h-11 rounded-xl border-zinc-200 bg-zinc-50/50 dark:border-white/10 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-medium focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all"
          />
        </div>
        <div className="flex h-11 items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/80 dark:border-white/10 dark:bg-white/[0.02] px-4 hover:border-blue-500/30 transition-colors">
          <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Remote only</Label>
          <Switch checked={filters.remoteOnly} onCheckedChange={(remoteOnly) => onChange({ ...filters, remoteOnly })} className="data-[state=checked]:bg-blue-600" />
        </div>
        <div className="flex h-11 items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/80 dark:border-white/10 dark:bg-white/[0.02] px-4 hover:border-blue-500/30 transition-colors">
          <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Verified clients</Label>
          <Switch checked={filters.verified} onCheckedChange={(verified) => onChange({ ...filters, verified })} className="data-[state=checked]:bg-blue-600" />
        </div>
      </CardContent>
    </Card>
  )
}
