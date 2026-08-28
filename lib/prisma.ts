import "dotenv/config"
import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const connectionString = 'postgresql://neondb_owner:npg_Io9EBMnWk1AT@ep-wild-shape-aol7rw84-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
// Explicitly set the environment variable for Prisma's internal Rust engine fallback just in case
process.env.DATABASE_URL = connectionString;

// In Prisma adapter-neon ^7.8.0, PrismaNeon takes a PoolConfig object directly, NOT a Pool instance.
const adapter = new PrismaNeon({ connectionString })

const globalForPrisma = globalThis as unknown as {
  prisma2?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma2 ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma2 = prisma
}
