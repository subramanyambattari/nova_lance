"use client"

import Link from "next/link"
import { Copy, Edit3, ExternalLink, MoreHorizontal, Trash2, Undo2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ProposalStatusBadge } from "@/components/proposals/proposal-status-badge"
import type { ProposalItem } from "@/components/proposals/types"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function ProposalsTable({
  proposals,
  onEdit,
  onDuplicate,
  onWithdraw,
  onDelete,
}: {
  proposals: ProposalItem[]
  onEdit: (proposal: ProposalItem) => void
  onDuplicate: (proposal: ProposalItem) => void
  onWithdraw: (proposal: ProposalItem) => void
  onDelete: (proposal: ProposalItem) => void
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-50" />
      <div className="relative z-10 mb-4 flex items-center justify-between gap-3 border-b border-zinc-100 p-6 pb-4 dark:border-white/5">
        <div>
          <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-100">Proposal pipeline</h2>
          <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">{proposals.length} proposals in view</p>
        </div>
      </div>
      <div className="relative z-10 p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-100 bg-zinc-50/50 hover:bg-transparent dark:border-white/5 dark:bg-white/[0.01]">
              <TableHead className="font-semibold uppercase tracking-wider text-xs text-zinc-500 dark:text-zinc-400">Job Title</TableHead>
              <TableHead className="font-semibold uppercase tracking-wider text-xs text-zinc-500 dark:text-zinc-400">Client</TableHead>
              <TableHead className="font-semibold uppercase tracking-wider text-xs text-zinc-500 dark:text-zinc-400">Budget</TableHead>
              <TableHead className="font-semibold uppercase tracking-wider text-xs text-zinc-500 dark:text-zinc-400">Status</TableHead>
              <TableHead className="font-semibold uppercase tracking-wider text-xs text-zinc-500 dark:text-zinc-400">Submitted Date</TableHead>
              <TableHead className="font-semibold uppercase tracking-wider text-xs text-zinc-500 dark:text-zinc-400">Timeline</TableHead>
              <TableHead className="text-right font-semibold uppercase tracking-wider text-xs text-zinc-500 dark:text-zinc-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {proposals.map((proposal) => (
            <TableRow key={proposal.id} className="border-zinc-100 transition-colors hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/[0.03]">
              <TableCell>
                <div className="max-w-72">
                  <Link
                    href={`/dashboard/proposals/${proposal.id}`}
                    className="font-bold text-zinc-950 transition-colors hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                  >
                    {proposal.job?.title ?? proposal.externalJobId ?? "Untitled proposal"}
                  </Link>
                  <p className="mt-1.5 line-clamp-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {proposal.coverLetter}
                  </p>
                </div>
              </TableCell>
              <TableCell className="font-medium text-zinc-600 dark:text-zinc-300">{proposal.job?.company ?? "External client"}</TableCell>
              <TableCell className="font-bold text-zinc-950 dark:text-zinc-100">
                {proposal.budget ? currency.format(proposal.budget) : "Open"}
              </TableCell>
              <TableCell>
                <ProposalStatusBadge status={proposal.status} />
              </TableCell>
              <TableCell className="font-medium text-zinc-500 dark:text-zinc-400">
                {proposal.submittedAt ? new Date(proposal.submittedAt).toLocaleDateString() : "Draft"}
              </TableCell>
              <TableCell className="font-medium text-zinc-600 dark:text-zinc-300">{proposal.timeline ?? "Flexible"}</TableCell>
              <TableCell className="text-right">
                <Tooltip>
                  <DropdownMenu>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-transparent hover:border-zinc-200/80 hover:bg-zinc-50/50 hover:shadow-sm dark:hover:border-white/10 dark:hover:bg-white/[0.02]">
                          <MoreHorizontal className="size-4.5" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl border-zinc-200/80 bg-white/95 p-1.5 text-zinc-950 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/95 dark:text-zinc-100">
                      <DropdownMenuItem onClick={() => onEdit(proposal)} className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-white/5">
                        <Edit3 className="size-4 text-zinc-500 dark:text-zinc-400" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(proposal)} className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-white/5">
                        <Copy className="size-4 text-zinc-500 dark:text-zinc-400" />
                        Duplicate
                      </DropdownMenuItem>
                      {proposal.job?.id ? (
                        <DropdownMenuItem asChild className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-white/5">
                          <Link href={`/jobs/${proposal.job.id}`}>
                            <ExternalLink className="size-4 text-zinc-500 dark:text-zinc-400" />
                            View Job
                          </Link>
                        </DropdownMenuItem>
                      ) : proposal.externalJobUrl ? (
                        <DropdownMenuItem asChild className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-white/5">
                          <a href={proposal.externalJobUrl} target="_blank" rel="noreferrer">
                            <ExternalLink className="size-4 text-zinc-500 dark:text-zinc-400" />
                            View Job
                          </a>
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem onClick={() => onWithdraw(proposal)} className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-white/5">
                        <Undo2 className="size-4 text-zinc-500 dark:text-zinc-400" />
                        Withdraw
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(proposal)} className="cursor-pointer gap-3 rounded-xl px-3 py-2.5 font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300">
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                    <TooltipContent className="rounded-xl border border-zinc-200/80 font-medium dark:border-white/10">Proposal actions</TooltipContent>
                  </DropdownMenu>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {!proposals.length ? (
            <TableRow className="border-zinc-100 hover:bg-transparent dark:border-white/5">
              <TableCell colSpan={7} className="py-10 text-center text-zinc-500">
                No proposals match the current filters.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      </div>
    </motion.section>
  )
}
