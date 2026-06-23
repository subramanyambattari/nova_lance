import "dotenv/config"
import { PrismaClient } from "@/app/generated/prisma/client"
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Set up WebSocket constructor for Node environment
neonConfig.webSocketConstructor = ws

let connectionString = process.env.DATABASE_URL
console.log("[SERVER] lib/prisma.ts: loaded DATABASE_URL =", connectionString ? "(present)" : "(MISSING)")
if (connectionString) {
  // Strip potential leading/trailing quotes from environment variable
  connectionString = connectionString.replace(/^['"]|['"]$/g, '')
}


// Pass the connection string config directly to the PrismaNeon factory adapter
const adapter = new PrismaNeon({ connectionString })

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Force Turbopack to recompile this file
