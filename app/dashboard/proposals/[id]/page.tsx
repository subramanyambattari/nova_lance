import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarClock, FileText, Link2, Paperclip, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProposalStatusBadge } from "@/components/proposals/proposal-status-badge"
import { requireUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ProposalDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireUser()
  const { id } = await params
  const proposal = await prisma.proposal.findFirst({
    where: { id, freelancerId: user.id },
    include: { attachments: true, job: true },
  })

  if (!proposal) notFound()

  const timeline = [
    ["Created", proposal.createdAt],
    ["Submitted", proposal.submittedAt],
    ["Viewed", proposal.viewedAt],
    ["Responded", proposal.respondedAt],
    ["Interview", proposal.interviewAt],
    ["Accepted", proposal.acceptedAt],
    ["Withdrawn", proposal.withdrawnAt],
  ].filter((entry): entry is [string, Date] => Boolean(entry[1]))

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="outline" className="rounded-xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.04]">
            <Link href="/dashboard/proposals">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
          <ProposalStatusBadge status={proposal.status} />
        </div>

        <header className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
          <p className="text-sm text-blue-600 dark:text-blue-300">Proposal details</p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-950 dark:text-white">
            {proposal.job?.title ?? proposal.externalJobId ?? "External proposal"}
          </h1>
          <p className="mt-2 text-zinc-500">{proposal.job?.company ?? "External client"}</p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
            <div className="mb-4 flex items-center gap-2 text-zinc-950 dark:text-white">
              <FileText className="size-5 text-blue-300" />
              <h2 className="text-lg font-semibold">Cover letter</h2>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-600 dark:text-zinc-300">{proposal.coverLetter}</p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
              <div className="mb-4 flex items-center gap-2 text-zinc-950 dark:text-white">
                <UserRound className="size-5 text-violet-300" />
                <h2 className="text-lg font-semibold">Client details</h2>
              </div>
              <dl className="grid gap-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-500">Client</dt>
                  <dd className="text-zinc-800 dark:text-zinc-200">{proposal.job?.company ?? "External client"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-500">Budget</dt>
                  <dd className="text-zinc-800 dark:text-zinc-200">{proposal.budget ? `$${proposal.budget.toLocaleString()}` : "Open"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-500">Timeline</dt>
                  <dd className="text-zinc-800 dark:text-zinc-200">{proposal.timeline ?? "Flexible"}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
              <div className="mb-4 flex items-center gap-2 text-zinc-950 dark:text-white">
                <CalendarClock className="size-5 text-emerald-300" />
                <h2 className="text-lg font-semibold">Status history</h2>
              </div>
              <div className="grid gap-3">
                {timeline.map(([label, date]) => (
                  <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-950/70">
                    <span className="text-zinc-700 dark:text-zinc-300">{label}</span>
                    <span className="text-zinc-500">{date.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
            <div className="mb-4 flex items-center gap-2 text-zinc-950 dark:text-white">
              <Paperclip className="size-5 text-blue-300" />
              <h2 className="text-lg font-semibold">Attachments</h2>
            </div>
            <div className="grid gap-2">
              {proposal.attachments.map((attachment) => (
                <a key={attachment.id} href={attachment.fileUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-blue-700 hover:bg-white dark:border-white/10 dark:bg-zinc-950/70 dark:text-blue-200 dark:hover:bg-white/[0.05]">
                  {attachment.fileName}
                </a>
              ))}
              {!proposal.attachments.length ? <p className="text-sm text-zinc-500">No attachments added.</p> : null}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035]">
            <div className="mb-4 flex items-center gap-2 text-zinc-950 dark:text-white">
              <Link2 className="size-5 text-violet-300" />
              <h2 className="text-lg font-semibold">Related job info</h2>
            </div>
            <p className="line-clamp-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {proposal.job?.description ?? "This proposal is attached to an external opportunity."}
            </p>
            {proposal.job?.skills?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {proposal.job.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}
