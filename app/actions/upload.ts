"use server"

import crypto from "crypto"

import { requireUser } from "@/lib/auth"

export async function generateCloudinarySignature() {
  await requireUser()
  const timestamp = Math.round(new Date().getTime() / 1000)
  const secret = process.env.CLOUDINARY_API_SECRET
  
  if (!secret) {
    throw new Error("Missing Cloudinary API secret")
  }

  // The signature string requires alphabetical sorting of parameters. 
  // We only pass timestamp in this simple upload.
  const strToSign = `timestamp=${timestamp}${secret}`
  const signature = crypto.createHash("sha1").update(strToSign).digest("hex")

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  }
}
