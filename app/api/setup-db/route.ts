import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Create UserProfile table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "UserProfile" (
        "id" SERIAL NOT NULL,
        "userId" INTEGER NOT NULL,
        "phone" TEXT,
        "location" TEXT,
        "timezone" TEXT,
        "languages" TEXT,
        "title" TEXT,
        "bio" TEXT,
        "experienceLevel" TEXT,
        "hourlyRate" DOUBLE PRECISION,
        "availability" TEXT,
        "portfolioWebsite" TEXT,
        "github" TEXT,
        "linkedin" TEXT,
        "preferredJobType" TEXT,
        "budgetRange" TEXT,
        "weeklyAvailability" TEXT,
        "remoteOnly" BOOLEAN NOT NULL DEFAULT true,
        "openToContract" BOOLEAN NOT NULL DEFAULT true,

        CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UserProfile_userId_key" ON "UserProfile"("userId");
    `)

    // Create UserSettings table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "UserSettings" (
        "id" SERIAL NOT NULL,
        "userId" INTEGER NOT NULL,
        "displayName" TEXT,
        "workspaceName" TEXT,
        "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
        "inAppNotifications" BOOLEAN NOT NULL DEFAULT true,
        "marketingDigest" BOOLEAN NOT NULL DEFAULT false,
        "proposalAlerts" BOOLEAN NOT NULL DEFAULT true,
        "messageAlerts" BOOLEAN NOT NULL DEFAULT true,
        "paymentAlerts" BOOLEAN NOT NULL DEFAULT true,
        "twoFactor" BOOLEAN NOT NULL DEFAULT false,
        "loginAlerts" BOOLEAN NOT NULL DEFAULT true,
        "publicProfile" BOOLEAN NOT NULL DEFAULT true,
        "dataSharing" BOOLEAN NOT NULL DEFAULT false,
        "autoSaveDrafts" BOOLEAN NOT NULL DEFAULT true,
        "weeklySummary" BOOLEAN NOT NULL DEFAULT true,

        CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UserSettings_userId_key" ON "UserSettings"("userId");
    `)

    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      `)
    } catch (e: any) {
      // Ignore if constraint already exists
      console.log("UserProfile constraint error (might already exist):", e.message)
    }

    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      `)
    } catch (e: any) {
      // Ignore if constraint already exists
      console.log("UserSettings constraint error (might already exist):", e.message)
    }

    return NextResponse.json({ success: true, message: "Tables created successfully" })
  } catch (error: any) {
    console.error("DB Setup Error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
