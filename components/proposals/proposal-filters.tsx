"use client"

import { Search, SlidersHorizontal } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ProposalStatus } from "@/components/proposals/types"

export type ProposalFilterState = {
  search: string
  status: "ALL" | ProposalStatus
  sort: "newest" | "oldest" | "budget-high" | "budget-low"
  budget: "all" | "under-1k" | "1k-5k" | "over-5k"
  client: string
}

export function ProposalFilters({
  value,
  clients,
  onChange,
}: {
  value: ProposalFilterState
  clients: string[]
  onChange: (value: ProposalFilterState) => void
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.035] p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
          <Input
            value={value.search}
            onChange={(event) => onChange({ ...value, search: event.target.value })}
            placeholder="Search proposals, jobs, clients, or skills..."
            className="h-10 rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/70 pl-9 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-650"
          />
        </div>
        <Tabs
          value={value.status}
          onValueChange={(status) => onChange({ ...value, status: status as ProposalFilterState["status"] })}
        >
          <TabsList className="w-full justify-start overflow-x-auto xl:w-auto">
            {["ALL", "DRAFT", "SUBMITTED", "VIEWED", "INTERVIEW", "ACCEPTED"].map((status) => (
              <TabsTrigger key={status} value={status} className="capitalize">
                {status.toLowerCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <label className="relative">
          <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-zinc-450 dark:text-zinc-500" />
          <Select
            value={value.sort}
            onChange={(event) => onChange({ ...value, sort: event.target.value as ProposalFilterState["sort"] })}
            className="rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/70 pl-9 text-zinc-900 dark:text-zinc-100"
          >
            <option value="newest" className="bg-white dark:bg-zinc-950">Newest first</option>
            <option value="oldest" className="bg-white dark:bg-zinc-950">Oldest first</option>
            <option value="budget-high" className="bg-white dark:bg-zinc-950">Highest budget</option>
            <option value="budget-low" className="bg-white dark:bg-zinc-950">Lowest budget</option>
          </Select>
        </label>
        <Select
          value={value.budget}
          onChange={(event) => onChange({ ...value, budget: event.target.value as ProposalFilterState["budget"] })}
          className="rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/70 text-zinc-900 dark:text-zinc-100"
        >
          <option value="all" className="bg-white dark:bg-zinc-950">Any budget</option>
          <option value="under-1k" className="bg-white dark:bg-zinc-950">Under $1k</option>
          <option value="1k-5k" className="bg-white dark:bg-zinc-950">$1k - $5k</option>
          <option value="over-5k" className="bg-white dark:bg-zinc-950">Over $5k</option>
        </Select>
        <Select
          value={value.client}
          onChange={(event) => onChange({ ...value, client: event.target.value })}
          className="rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950/70 text-zinc-900 dark:text-zinc-100"
        >
          <option value="all" className="bg-white dark:bg-zinc-950">All clients</option>
          {clients.map((client) => (
            <option key={client} value={client} className="bg-white dark:bg-zinc-950">
              {client}
            </option>
          ))}
        </Select>
      </div>
    </section>
  )
}
