import "dotenv/config"
import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Set up WebSocket constructor for Node environment
neonConfig.webSocketConstructor = ws

let connectionString = process.env.DATABASE_URL

if (connectionString) {
  // Strip potential leading/trailing quotes from environment variable
  connectionString = connectionString.replace(/^['"]|['"]$/g, '')
}

// Initialize Neon Pool
const pool = new Pool({ connectionString })

// Pass the pool to the PrismaNeon factory adapter
const adapter = new PrismaNeon(pool)

const globalForPrisma = globalThis as unknown as {
  prisma2?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma2 ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma2 = prisma
}

// Force Turbopack to recompile this file
