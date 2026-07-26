import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: "Email is required. Example: /api/setup-admin?email=your@email.com" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" }
    })

    return NextResponse.json({ success: true, message: `User ${email} promoted to ADMIN` })
  } catch (error: any) {
    console.error("Setup Admin Error:", error)
    return NextResponse.json({ error: "Failed to promote user.", details: error?.message || String(error) }, { status: 500 })
  }
}
