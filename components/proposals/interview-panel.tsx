"use client"

import { CalendarClock, MessageSquare, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProposalStatusBadge } from "@/components/proposals/proposal-status-badge"
import type { ProposalItem } from "@/components/proposals/types"

export function InterviewPanel({ proposals }: { proposals: ProposalItem[] }) {
  const interviews = proposals.filter((proposal) => proposal.status === "INTERVIEW")

  return (
    <aside className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Interview requests</h2>
          <p className="text-sm text-zinc-500">Upcoming meetings and client notes.</p>
        </div>
        <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2 py-1 text-xs text-violet-200">
          {interviews.length} active
        </span>
      </div>

      <div className="grid gap-3">
        {interviews.map((proposal) => (
          <div key={proposal.id} className="rounded-xl border border-white/10 bg-zinc-950/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-white">{proposal.job?.title ?? "External proposal"}</p>
                <p className="mt-1 text-sm text-zinc-500">{proposal.job?.company ?? "External client"}</p>
              </div>
              <ProposalStatusBadge status={proposal.status} />
            </div>
            <div className="mt-4 grid gap-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <CalendarClock className="size-4 text-blue-300" />
                {proposal.interviewAt ? new Date(proposal.interviewAt).toLocaleString() : "Scheduling pending"}
              </div>
              <div className="flex items-start gap-2">
                <MessageSquare className="mt-0.5 size-4 text-violet-300" />
                <span>{proposal.clientMessage ?? "Client requested a follow-up conversation."}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" className="rounded-xl bg-white text-zinc-950 hover:bg-blue-100">
                <a href={proposal.meetingUrl ?? "#"} target={proposal.meetingUrl ? "_blank" : undefined} rel="noreferrer">
                  <Video className="size-4" />
                  Join meeting
                </a>
              </Button>
              <Button size="sm" variant="outline" className="rounded-xl border-white/10">
                Reschedule
              </Button>
            </div>
          </div>
        ))}

        {!interviews.length ? (
          <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-zinc-500">
            Interview requests will appear here as clients respond.
          </div>
        ) : null}
      </div>
    </aside>
  )
}
