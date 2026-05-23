import { NextRequest } from "next/server"
import { z } from "zod"

import { rateLimit } from "@/lib/rate-limit"

const messageSchema = z.object({
  role: z.enum(["user", "model"]),
  content: z.string().trim().min(1).max(4000),
})

const chatSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
})

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
    finishReason?: string
  }>
  error?: {
    message?: string
  }
}

export const dynamic = "force-dynamic"

function normalizeMessages(messages: z.infer<typeof messageSchema>[]) {
  const normalized: z.infer<typeof messageSchema>[] = []

  for (const message of messages) {
    const previous = normalized.at(-1)

    if (previous?.role === message.role) {
      previous.content = `${previous.content}\n\n${message.content}`
    } else {
      normalized.push({ ...message })
    }
  }

  while (normalized[0]?.role === "model") {
    normalized.shift()
  }

  return normalized.slice(-12)
}

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  const limited = rateLimit(`ai-chat:${forwardedFor ?? "local"}`, 24, 60_000)

  if (!limited.ok) {
    return Response.json({ error: "Too many AI messages. Please wait a moment." }, { status: 429 })
  }

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!apiKey) {
    return Response.json(
      { error: "Gemini is not configured. Add GEMINI_API_KEY to your environment." },
      { status: 500 }
    )
  }

  try {
    const body = chatSchema.parse(await request.json())
    const messages = normalizeMessages(body.messages)

    if (!messages.length) {
      return Response.json({ error: "Send a message to start the chat." }, { status: 400 })
    }

    const model = (process.env.GEMINI_MODEL ?? "gemini-2.5-flash").replace(/^models\//, "")
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text:
                  "You are Nova, a concise AI assistant inside Nova Lance, a freelance work dashboard. Help users with proposals, project planning, profile improvements, client replies, pricing, deadlines, and navigating freelance work. Keep answers practical and friendly. Do not claim access to private account data unless the user provides it in the chat.",
              },
            ],
          },
          contents: messages.map((message) => ({
            role: message.role,
            parts: [{ text: message.content }],
          })),
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 700,
          },
        }),
      }
    )

    const data = (await response.json()) as GeminiResponse
    const reply = data.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text)
      .filter(Boolean)
      .join("\n")
      .trim()

    if (!response.ok) {
      console.error("Gemini API error", data.error?.message ?? data)
      return Response.json({ error: "Gemini could not answer right now." }, { status: response.status })
    }

    if (!reply) {
      return Response.json({ error: "Gemini returned an empty response. Try rephrasing your message." }, { status: 502 })
    }

    return Response.json({ reply })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues[0]?.message ?? "Invalid chat message." }, { status: 400 })
    }

    console.error("AI chat route error", error)
    return Response.json({ error: "Unable to send AI message." }, { status: 500 })
  }
}
