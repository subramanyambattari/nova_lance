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
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-2xl dark:shadow-black/20 backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">Proposal pipeline</h2>
          <p className="text-sm text-zinc-500">{proposals.length} proposals in view</p>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-200 dark:border-white/10 hover:bg-transparent">
            <TableHead>Job Title</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Timeline</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proposals.map((proposal) => (
            <TableRow key={proposal.id} className="border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/[0.04]">
              <TableCell>
                <div className="max-w-72">
                  <Link
                    href={`/dashboard/proposals/${proposal.id}`}
                    className="font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-200"
                  >
                    {proposal.job?.title ?? proposal.externalJobId ?? "Untitled proposal"}
                  </Link>
                  <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                    {proposal.coverLetter}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-300">{proposal.job?.company ?? "External client"}</TableCell>
              <TableCell className="text-zinc-900 dark:text-zinc-100">
                {proposal.budget ? currency.format(proposal.budget) : "Open"}
              </TableCell>
              <TableCell>
                <ProposalStatusBadge status={proposal.status} />
              </TableCell>
              <TableCell className="text-zinc-500 dark:text-zinc-400">
                {proposal.submittedAt ? new Date(proposal.submittedAt).toLocaleDateString() : "Draft"}
              </TableCell>
              <TableCell className="text-zinc-600 dark:text-zinc-300">{proposal.timeline ?? "Flexible"}</TableCell>
              <TableCell className="text-right">
                <Tooltip>
                  <DropdownMenu>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <DropdownMenuContent align="end" className="border-zinc-200 bg-white text-zinc-950 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100">
                      <DropdownMenuItem onClick={() => onEdit(proposal)} className="gap-2">
                        <Edit3 className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicate(proposal)} className="gap-2">
                        <Copy className="size-4" />
                        Duplicate
                      </DropdownMenuItem>
                      {proposal.job?.id ? (
                        <DropdownMenuItem asChild className="gap-2">
                          <Link href={`/jobs/${proposal.job.id}`}>
                            <ExternalLink className="size-4" />
                            View Job
                          </Link>
                        </DropdownMenuItem>
                      ) : proposal.externalJobUrl ? (
                        <DropdownMenuItem asChild className="gap-2">
                          <a href={proposal.externalJobUrl} target="_blank" rel="noreferrer">
                            <ExternalLink className="size-4" />
                            View Job
                          </a>
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem onClick={() => onWithdraw(proposal)} className="gap-2">
                        <Undo2 className="size-4" />
                        Withdraw
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(proposal)} className="gap-2 text-rose-500 dark:text-rose-300">
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                    <TooltipContent>Proposal actions</TooltipContent>
                  </DropdownMenu>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {!proposals.length ? (
            <TableRow className="border-zinc-200 dark:border-white/10 hover:bg-transparent">
              <TableCell colSpan={7} className="py-10 text-center text-zinc-500">
                No proposals match the current filters.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </motion.section>
  )
}
