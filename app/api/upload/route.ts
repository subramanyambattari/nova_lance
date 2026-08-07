import { NextRequest } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

import { requireUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json({ error: "No file uploaded." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    const uniqueName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const filePath = path.join(uploadsDir, uniqueName)

    await writeFile(filePath, buffer)

    return Response.json({
      url: `/uploads/${uniqueName}`
    })
  } catch (error) {
    console.error("Local file upload error", error)
    return Response.json({ error: "Failed to upload file." }, { status: 500 })
  }
}
