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
  source: "internal" | "remotive" | "remoteok" | "arbeitnow" | "adzuna" | "rapidapi"
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

async function fetchJson(url: string, timeoutMs = 3000, options?: RequestInit) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(url, {
      ...options,
      headers: { "User-Agent": "Nova-Lance/1.0", ...options?.headers },
      next: { revalidate: 120 },
      signal: controller.signal
    })
    clearTimeout(timeoutId);
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

async function fetchExternalJobs(query: string): Promise<UnifiedJob[]> {
  const broadQuery = query ? query : "software engineer"
  const keyword = encodeURIComponent(broadQuery)
  
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
      "x-rapidapi-host": process.env.RAPIDAPI_HOST || "remote-jobs-api1.p.rapidapi.com",
    },
  };
  
  const url = `${process.env.RAPIDAPI_URL || "https://remote-jobs-api1.p.rapidapi.com/jobs/search"}?query=${keyword}`;
  
  const rapidApiData = await fetchJson(url, 5000, options);
  
  const jobs: UnifiedJob[] = [];

  // Assuming rapidApiData returns an array of jobs directly or inside a data property
  const results = Array.isArray(rapidApiData) ? rapidApiData : rapidApiData?.data || rapidApiData?.jobs || rapidApiData?.results || [];

  for (const item of results.slice(0, 30)) {
    const text = `${item.title ?? ""} ${item.description ?? ""}`
    const skills = inferSkills(text).slice(0, 6)
    jobs.push({
      id: `external:rapidapi:${item.id || item.slug || Math.random().toString()}`,
      externalId: String(item.id || item.slug || ""),
      externalUrl: item.url || item.applyUrl || item.link,
      source: "rapidapi",
      title: item.title || item.position || "Remote role",
      company: item.company || item.company_name || "Remote client",
      description: item.description || "No description provided.",
      budget: null,
      salary: item.salary || item.salary_min ? `$${item.salary_min} - $${item.salary_max}` : "Budget not listed",
      skills,
      type: item.job_type || item.type || "Full-time",
      experience: /senior|lead|principal/i.test(item.title ?? "") ? "Senior" : "Intermediate",
      location: item.location || "Remote",
      remote: true,
      verifiedClient: true,
      postedAt: new Date(item.publication_date || item.created_at || item.date || Date.now()).toISOString(),
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
    {
      id: "demo:on-site-engineer",
      title: "Senior Backend Engineer (On-site)",
      company: "DataCorp Inc.",
      description: "Join our core infrastructure team in New York to build high-throughput data pipelines.",
      budget: 9500,
      salary: "$140k - $160k",
      skills: ["Go", "Python", "Kafka", "AWS"],
      type: "Full-time",
      experience: "Senior",
      location: "New York, NY",
      remote: false,
      verifiedClient: true,
      source: "internal",
      postedAt: now,
      match: 75,
    },
    {
      id: "demo:hybrid-designer",
      title: "UX/UI Designer (Hybrid)",
      company: "Creative Solutions",
      description: "Looking for a talented designer to work on our flagship mobile applications in a hybrid setup.",
      budget: null,
      salary: "$90k - $110k",
      skills: ["Figma", "UI/UX", "Prototyping"],
      type: "Full-time",
      experience: "Intermediate",
      location: "London, UK",
      remote: false,
      verifiedClient: false,
      source: "internal",
      postedAt: now,
      match: 60,
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
