"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function registerUser(data: { firstName: string; lastName: string; email: string; password: string }) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      if (existingUser.emailVerified) {
        return { success: false, error: "Email is already registered and verified." }
      }
      // If they exist but aren't verified, we can update their password and resend OTP
      const hashedPassword = await bcrypt.hash(data.password, 10)
      await prisma.user.update({
        where: { email: data.email },
        data: { name: `${data.firstName} ${data.lastName}`, password: hashedPassword },
      })
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10)
      await prisma.user.create({
        data: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: hashedPassword,
        },
      })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 1000 * 60 * 15) // 15 mins

    // Clear old tokens
    await prisma.verificationToken.deleteMany({
      where: { identifier: data.email },
    })

    await prisma.verificationToken.create({
      data: {
        identifier: data.email,
        token: otp,
        expires,
      },
    })

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'NovaLance <onboarding@resend.dev>',
        to: data.email,
        subject: 'Verify your NovaLance email',
        html: `
          <h1>Welcome to NovaLance!</h1>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 15 minutes.</p>
        `,
      })
    } else {
      console.warn("RESEND_API_KEY not set. OTP is:", otp)
    }

    return { success: true, requireOtp: true }
  } catch (error: any) {
    console.error("Registration error:", error)
    return { success: false, error: error.message || "Something went wrong" }
  }
}
// Force cache refresh

export async function verifyEmailOtp(email: string, otp: string) {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { identifier: email, token: otp },
    })

    if (!verificationToken) {
      return { success: false, error: "Invalid verification code" }
    }

    if (new Date(verificationToken.expires) < new Date()) {
      return { success: false, error: "Verification code has expired" }
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    })

    // Delete token
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    })

    return { success: true }
  } catch (error) {
    console.error("OTP verification error:", error)
    return { success: false, error: "Something went wrong" }
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Return success anyway to prevent email enumeration
      return { success: true }
    }

    // Generate token
    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    })

    // Create new token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // Send email
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`
    
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'NovaLance <onboarding@resend.dev>',
        to: email,
        subject: 'Reset your password',
        html: `
          <h1>Password Reset</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
        `,
      })
    } else {
      console.warn("RESEND_API_KEY is not set. Token generated:", resetLink)
    }

    return { success: true }
  } catch (error) {
    console.error("Password reset error:", error)
    return { success: false, error: "Something went wrong" }
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token },
    })

    if (!verificationToken) {
      return { success: false, error: "Invalid token" }
    }

    if (new Date(verificationToken.expires) < new Date()) {
      return { success: false, error: "Token has expired" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { password: hashedPassword },
    })

    await prisma.verificationToken.deleteMany({
      where: { identifier: verificationToken.identifier },
    })

    return { success: true }
  } catch (error) {
    console.error("Reset password error:", error)
    return { success: false, error: "Something went wrong" }
  }
}
