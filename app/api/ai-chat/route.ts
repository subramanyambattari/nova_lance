import { NextRequest } from "next/server"
import { z } from "zod"

import { rateLimit } from "@/lib/rate-limit"

const messageSchema = z.object({
  role: z.enum(["user", "model", "assistant"]),
  content: z.string().trim().min(1).max(4000),
})

const chatSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
})

export const dynamic = "force-dynamic"

function normalizeMessages(messages: z.infer<typeof messageSchema>[]) {
  const normalized: { role: string; content: string }[] = []

  for (const message of messages) {
    const previous = normalized.at(-1)
    const mappedRole = message.role === "model" ? "assistant" : message.role

    if (previous?.role === mappedRole) {
      previous.content = `${previous.content}\n\n${message.content}`
    } else {
      normalized.push({ role: mappedRole, content: message.content })
    }
  }

  while (normalized[0]?.role === "assistant") {
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

  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    return Response.json(
      { error: "Groq is not configured. Add GROQ_API_KEY to your environment." },
      { status: 500 }
    )
  }

  try {
    const body = chatSchema.parse(await request.json())
    const messages = normalizeMessages(body.messages)

    if (!messages.length) {
      return Response.json({ error: "Send a message to start the chat." }, { status: 400 })
    }

    const systemInstruction = "You are Nova, a concise AI assistant inside Nova Lance, a freelance work dashboard. Help users with proposals, project planning, profile improvements, client replies, pricing, deadlines, and navigating freelance work. Keep answers practical and friendly. Do not claim access to private account data unless the user provides it in the chat."

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "qwen/qwen3.8-27b",
          messages: [
            { role: "system", content: systemInstruction },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 700,
        }),
      }
    )

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content?.trim()

    if (!response.ok) {
      console.error("Groq API error", data.error?.message ?? data)
      return Response.json({ error: `Groq error: ${data.error?.message ?? "Unknown error"}` }, { status: response.status })
    }

    if (!reply) {
      return Response.json({ error: "Nova AI returned an empty response. Try rephrasing your message." }, { status: 502 })
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
