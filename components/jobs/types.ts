export type JobSource = "internal" | "remotive" | "remoteok" | "arbeitnow" | "adzuna"

export type Job = {
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
  source: JobSource
  externalId?: string
  externalUrl?: string
  postedAt: string
  match: number
  saved?: boolean
}

export type JobsResponse = {
  jobs: Job[]
  nextPage: number | null
  total: number
  updatedAt: string
}

export type JobFilters = {
  q: string
  remoteOnly: boolean
  experience: string
  type: string
  minBudget: number
  skills: string
  posted: string
  verified: boolean
}
