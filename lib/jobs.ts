import { z } from "zod"

import { isDatabaseUnavailableError, withTimeout } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export type UnifiedJob = {
  id: string
  title: string
  company: string
  description: string
  budget: number | null
  salary: string
  skills: string[]
  type: string
  experience: string
  location: string
  remote: boolean
  verifiedClient: boolean
  source: "internal" | "remotive" | "remoteok" | "arbeitnow" | "adzuna"
  externalId?: string
  externalUrl?: string
  postedAt: string
  match: number
  saved?: boolean
}

export const jobSearchSchema = z.object({
  q: z.string().optional().default(""),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(30).optional().default(12),
  remoteOnly: z.coerce.boolean().optional().default(true),
  experience: z.string().optional().default("all"),
  type: z.string().optional().default("all"),
  minBudget: z.coerce.number().optional().default(0),
  skills: z.string().optional().default(""),
  posted: z.string().optional().default("any"),
  verified: z.coerce.boolean().optional().default(false),
})

const profileSkills = ["React", "Next.js", "TypeScript", "Prisma", "Tailwind", "Node"]

function uniq(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
}

function inferSkills(text: string) {
  const terms = [
    "React",
    "Next.js",
    "TypeScript",
    "Node",
    "Prisma",
    "Tailwind",
    "Figma",
    "UI/UX",
    "PostgreSQL",
    "GraphQL",
    "Python",
    "AWS",
    "Stripe",
  ]
  const haystack = text.toLowerCase()
  return terms.filter((term) => haystack.includes(term.toLowerCase()))
}

function computeMatch(job: Pick<UnifiedJob, "title" | "description" | "skills" | "remote" | "verifiedClient">) {
  const skillHits = job.skills.filter((skill) =>
    profileSkills.some((profileSkill) =>
      skill.toLowerCase().includes(profileSkill.toLowerCase())
    )
  ).length
  const titleBonus = /react|next|typescript|dashboard|frontend|full stack/i.test(job.title)
    ? 16
    : 0
  const remoteBonus = job.remote ? 8 : 0
  const verifiedBonus = job.verifiedClient ? 5 : 0

  return Math.min(98, 58 + skillHits * 7 + titleBonus + remoteBonus + verifiedBonus)
}

function postedAfter(posted: string) {
  const now = Date.now()
  if (posted === "24h") return new Date(now - 24 * 60 * 60 * 1000)
  if (posted === "7d") return new Date(now - 7 * 24 * 60 * 60 * 1000)
  if (posted === "30d") return new Date(now - 30 * 24 * 60 * 60 * 1000)
  return null
}

async function fetchJson(url: string) {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Nova-Lance/1.0" },
      next: { revalidate: 120 },
    })
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

async function fetchExternalJobs(query: string): Promise<UnifiedJob[]> {
  const keyword = encodeURIComponent(query || "react developer")
  const [remotive, remoteOk, arbeitnow, adzuna] = await Promise.all([
    fetchJson(`https://remotive.com/api/remote-jobs?search=${keyword}`),
    fetchJson("https://remoteok.com/api"),
    fetchJson("https://www.arbeitnow.com/api/job-board-api"),
    process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY
      ? fetchJson(
          `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&what=${keyword}&content-type=application/json&category=it-jobs`
        )
      : Promise.resolve(null),
  ])

  const jobs: UnifiedJob[] = []

  for (const item of remotive?.jobs?.slice?.(0, 25) ?? []) {
    const text = `${item.title ?? ""} ${item.description ?? ""} ${item.tags?.join?.(" ") ?? ""}`
    const skills = uniq([...(item.tags ?? []), ...inferSkills(text)]).slice(0, 6)
    jobs.push({
      id: `external:remotive:${item.id}`,
      externalId: String(item.id),
      externalUrl: item.url,
      source: "remotive",
      title: item.title ?? "Remote role",
      company: item.company_name ?? "Remote client",
      description: item.description ?? "",
      budget: null,
      salary: item.salary || "Budget not listed",
      skills,
      type: item.job_type || "Full-time",
      experience: /senior|lead|principal/i.test(item.title ?? "") ? "Senior" : "Intermediate",
      location: item.candidate_required_location || "Remote",
      remote: true,
      verifiedClient: true,
      postedAt: new Date(item.publication_date ?? Date.now()).toISOString(),
      match: 0,
    })
  }

  for (const item of Array.isArray(remoteOk) ? remoteOk.slice(1, 26) : []) {
    const text = `${item.position ?? ""} ${item.description ?? ""} ${item.tags?.join?.(" ") ?? ""}`
    const skills = uniq([...(item.tags ?? []), ...inferSkills(text)]).slice(0, 6)
    jobs.push({
      id: `external:remoteok:${item.id}`,
      externalId: String(item.id),
      externalUrl: item.url,
      source: "remoteok",
      title: item.position ?? "Remote role",
      company: item.company ?? "RemoteOK client",
      description: item.description ?? "",
      budget: null,
      salary: item.salary_min ? `$${item.salary_min} - $${item.salary_max}` : "Budget not listed",
      skills,
      type: "Remote",
      experience: /senior|lead|principal/i.test(item.position ?? "") ? "Senior" : "Intermediate",
      location: item.location || "Remote",
      remote: true,
      verifiedClient: true,
      postedAt: new Date(item.date ?? Date.now()).toISOString(),
      match: 0,
    })
  }

  for (const item of arbeitnow?.data?.slice?.(0, 25) ?? []) {
    const text = `${item.title ?? ""} ${item.description ?? ""} ${item.tags?.join?.(" ") ?? ""}`
    const skills = uniq([...(item.tags ?? []), ...inferSkills(text)]).slice(0, 6)
    jobs.push({
      id: `external:arbeitnow:${item.slug}`,
      externalId: item.slug,
      externalUrl: item.url,
      source: "arbeitnow",
      title: item.title ?? "Remote role",
      company: item.company_name ?? "Arbeitnow client",
      description: item.description ?? "",
      budget: null,
      salary: "Budget not listed",
      skills,
      type: item.job_types?.[0] ?? "Full-time",
      experience: /senior|lead|principal/i.test(item.title ?? "") ? "Senior" : "Intermediate",
      location: item.location || "Remote",
      remote: item.remote ?? true,
      verifiedClient: false,
      postedAt: new Date((item.created_at ?? Date.now() / 1000) * 1000).toISOString(),
      match: 0,
    })
  }

  for (const item of adzuna?.results?.slice?.(0, 20) ?? []) {
    const text = `${item.title ?? ""} ${item.description ?? ""}`
    const skills = inferSkills(text).slice(0, 6)
    jobs.push({
      id: `external:adzuna:${item.id}`,
      externalId: String(item.id),
      externalUrl: item.redirect_url,
      source: "adzuna",
      title: item.title ?? "Freelance role",
      company: item.company?.display_name ?? "Adzuna client",
      description: item.description ?? "",
      budget: null,
      salary: item.salary_min ? `$${item.salary_min} - $${item.salary_max}` : "Budget not listed",
      skills,
      type: item.contract_time ?? "Contract",
      experience: /senior|lead|principal/i.test(item.title ?? "") ? "Senior" : "Intermediate",
      location: item.location?.display_name || "Remote",
      remote: /remote/i.test(`${item.location?.display_name ?? ""} ${item.title ?? ""}`),
      verifiedClient: true,
      postedAt: new Date(item.created ?? Date.now()).toISOString(),
      match: 0,
    })
  }

  return jobs.map((job) => ({ ...job, match: computeMatch(job) }))
}

async function fetchInternalJobs() {
  const count = await withTimeout(prisma.job.count(), 2500, "Internal jobs count")
  if (count === 0) {
    await seedInternalJobs()
  }

  const jobs = await withTimeout(
    prisma.job.findMany({
      orderBy: { postedAt: "desc" },
      take: 50,
      include: { _count: { select: { proposals: true } } },
    }),
    2500,
    "Internal jobs query"
  )

  return jobs.map<UnifiedJob>((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    description: job.description,
    budget: job.budget,
    salary: job.salary ?? (job.budget ? `$${job.budget.toLocaleString()} fixed` : "Budget not listed"),
    skills: job.skills,
    type: job.type,
    experience: job.experience,
    location: job.location,
    remote: job.remote,
    verifiedClient: job.verifiedClient,
    source: "internal",
    externalId: job.externalId ?? undefined,
    externalUrl: job.externalUrl ?? undefined,
    postedAt: job.postedAt.toISOString(),
    match: computeMatch(job),
  }))
}

async function seedInternalJobs() {
  const user = await prisma.user.upsert({
    where: { email: "client@novalance.dev" },
    update: { name: "Nova Client" },
    create: { email: "client@novalance.dev", name: "Nova Client" },
  })
  await prisma.job.createMany({
    data: [
      {
        title: "Next.js SaaS Dashboard Build",
        description: "Build a premium dashboard with charts, auth flows, and billing UX for a B2B SaaS team.",
        company: "Relay Cloud",
        budget: 6200,
        skills: ["Next.js", "React", "TypeScript", "Tailwind", "Recharts"],
        type: "Fixed price",
        experience: "Expert",
        verifiedClient: true,
        clientId: user.id,
      },
      {
        title: "Prisma Performance Audit",
        description: "Review a Prisma and PostgreSQL app, optimize queries, and document production recommendations.",
        company: "FinOps Studio",
        budget: 2800,
        skills: ["Prisma", "PostgreSQL", "Node", "TypeScript"],
        type: "Contract",
        experience: "Senior",
        verifiedClient: true,
        clientId: user.id,
      },
    ],
  })
}

function fallbackInternalJobs(): UnifiedJob[] {
  const now = new Date().toISOString()

  return [
    {
      id: "demo:nextjs-dashboard",
      title: "Next.js SaaS Dashboard Build",
      company: "Relay Cloud",
      description: "Build a premium dashboard with charts, auth flows, and billing UX for a B2B SaaS team.",
      budget: 6200,
      salary: "$6,200 fixed",
      skills: ["Next.js", "React", "TypeScript", "Tailwind", "Recharts"],
      type: "Fixed price",
      experience: "Expert",
      location: "Remote",
      remote: true,
      verifiedClient: true,
      source: "internal",
      postedAt: now,
      match: 96,
    },
    {
      id: "demo:prisma-audit",
      title: "Prisma Performance Audit",
      company: "FinOps Studio",
      description: "Review a Prisma and PostgreSQL app, optimize queries, and document production recommendations.",
      budget: 2800,
      salary: "$2,800 fixed",
      skills: ["Prisma", "PostgreSQL", "Node", "TypeScript"],
      type: "Contract",
      experience: "Senior",
      location: "Remote",
      remote: true,
      verifiedClient: true,
      source: "internal",
      postedAt: now,
      match: 88,
    },
  ]
}

export async function getUnifiedJobs(params: z.infer<typeof jobSearchSchema>, userId?: number) {
  const [internal, external, saved] = await Promise.all([
    fetchInternalJobs().catch((error) => {
      if (!isDatabaseUnavailableError(error)) {
        console.error("Unable to load internal jobs.", error)
      }
      return fallbackInternalJobs()
    }),
    fetchExternalJobs(params.q),
    userId
      ? withTimeout(
          prisma.savedJob.findMany({ where: { userId }, select: { jobId: true, externalJobId: true } }),
          2500,
          "Saved jobs query"
        ).catch(() => [])
      : Promise.resolve([]),
  ])

  const savedKeys = new Set(saved.map((item) => item.jobId ?? item.externalJobId).filter(Boolean))
  const terms = `${params.q} ${params.skills}`.toLowerCase().split(/\s|,/).filter(Boolean)
  const minDate = postedAfter(params.posted)

  const filtered = [...internal, ...external]
    .map((job) => ({
      ...job,
      saved: savedKeys.has(job.id) || savedKeys.has(job.externalId ?? ""),
    }))
    .filter((job) => {
      const text = `${job.title} ${job.company} ${job.description} ${job.skills.join(" ")}`.toLowerCase()
      if (terms.length && !terms.every((term) => text.includes(term))) return false
      if (params.remoteOnly && !job.remote) return false
      if (params.experience !== "all" && job.experience.toLowerCase() !== params.experience.toLowerCase()) return false
      if (params.type !== "all" && !job.type.toLowerCase().includes(params.type.toLowerCase())) return false
      if (params.minBudget && (job.budget ?? 0) < params.minBudget && job.budget !== null) return false
      if (params.verified && !job.verifiedClient) return false
      if (minDate && new Date(job.postedAt) < minDate) return false
      return true
    })
    .sort((a, b) => b.match - a.match || +new Date(b.postedAt) - +new Date(a.postedAt))

  const start = (params.page - 1) * params.limit
  const end = start + params.limit

  return {
    jobs: filtered.slice(start, end),
    nextPage: end < filtered.length ? params.page + 1 : null,
    total: filtered.length,
    updatedAt: new Date().toISOString(),
  }
}
