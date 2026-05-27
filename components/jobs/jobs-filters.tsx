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
    <Card className="rounded-2xl border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045] shadow-2xl dark:shadow-black/20 backdrop-blur-xl">
      <CardHeader className="flex-row items-center gap-2">
        <SlidersHorizontal className="size-4 text-blue-600 dark:text-blue-300" />
        <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">Advanced filters</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <Label>Experience</Label>
          <Select
            value={filters.experience}
            onChange={(event) => onChange({ ...filters, experience: event.target.value })}
            className="border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/80 text-zinc-900 dark:text-zinc-100"
          >
            {["all", "Intermediate", "Senior", "Expert"].map((item) => (
              <option key={item} value={item} className="bg-white dark:bg-zinc-950">{item === "all" ? "All levels" : item}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Job type</Label>
          <Select
            value={filters.type}
            onChange={(event) => onChange({ ...filters, type: event.target.value })}
            className="border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/80 text-zinc-900 dark:text-zinc-100"
          >
            {["all", "Contract", "Fixed", "Full-time", "Remote"].map((item) => (
              <option key={item} value={item} className="bg-white dark:bg-zinc-950">{item === "all" ? "All types" : item}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Posted date</Label>
          <Select
            value={filters.posted}
            onChange={(event) => onChange({ ...filters, posted: event.target.value })}
            className="border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/80 text-zinc-900 dark:text-zinc-100"
          >
            <option value="any" className="bg-white dark:bg-zinc-950">Any time</option>
            <option value="24h" className="bg-white dark:bg-zinc-950">Last 24 hours</option>
            <option value="7d" className="bg-white dark:bg-zinc-950">Last 7 days</option>
            <option value="30d" className="bg-white dark:bg-zinc-950">Last 30 days</option>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Minimum budget</Label>
          <Input
            type="number"
            value={filters.minBudget}
            onChange={(event) => onChange({ ...filters, minBudget: Number(event.target.value) })}
            className="rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Skills</Label>
          <Input
            value={filters.skills}
            onChange={(event) => onChange({ ...filters, skills: event.target.value })}
            placeholder="React, Prisma, Tailwind"
            className="rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-white/[0.03] p-4">
          <Label>Remote only</Label>
          <Switch checked={filters.remoteOnly} onCheckedChange={(remoteOnly) => onChange({ ...filters, remoteOnly })} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-zinc-150 bg-zinc-50/50 dark:border-white/10 dark:bg-white/[0.03] p-4">
          <Label>Verified clients</Label>
          <Switch checked={filters.verified} onCheckedChange={(verified) => onChange({ ...filters, verified })} />
        </div>
      </CardContent>
    </Card>
  )
}
