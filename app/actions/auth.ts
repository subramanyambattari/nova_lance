"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function setRole(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Not authenticated")
  }

  const role = formData.get("role") as "CLIENT" | "FREELANCER"
  if (role !== "CLIENT" && role !== "FREELANCER") {
    throw new Error("Invalid role")
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { role },
  })

  // Redirect to correct dashboard
  redirect(role === "CLIENT" ? "/client-dashboard" : "/user-dashboard")
}
