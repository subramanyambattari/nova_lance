import { GoogleGenerativeAI } from "@google/generative-ai"
import { prisma } from "@/lib/prisma"
import { publishRealtime } from "@/lib/realtime"
import { getConversationParticipantIds } from "@/lib/messages"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function triggerNovaClientReply(conversationId: string) {
  // Execute in the background to not block the user's HTTP request
  void (async () => {
    try {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      })

      if (!conversation) return

      // Find Nova Client and the Freelancer in the conversation
      const novaClientParticipant = conversation.participants.find(
        (p) => p.user.email === "client@novalance.dev"
      )
      if (!novaClientParticipant) return

      const novaClientId = novaClientParticipant.userId
      const freelancerParticipant = conversation.participants.find(
        (p) => p.user.email !== "client@novalance.dev"
      )
      const freelancerId = freelancerParticipant?.userId

      const participantIds = conversation.participants.map((p) => p.userId)

      // 1. Set presence to online and start typing event
      await prisma.userPresence.upsert({
        where: { userId: novaClientId },
        update: { online: true, lastActiveAt: new Date() },
        create: { userId: novaClientId, online: true },
      })

      await publishRealtime(participantIds, {
        type: "typing-start",
        payload: {
          conversationId,
          user: {
            id: novaClientId,
            name: "Nova Client",
            email: "client@novalance.dev",
          },
        },
      })

      // 2. Fetch Freelancer context dynamically to make responses realistic and personalized
      const freelancer = freelancerId
        ? await prisma.user.findUnique({
            where: { id: freelancerId },
            include: {
              proposals: {
                include: {
                  job: true,
                },
                orderBy: { createdAt: "desc" },
                take: 3,
              },
            },
          })
        : null

      const proposalsContext = freelancer?.proposals?.length
        ? freelancer.proposals
            .map(
              (p) =>
                `- Job: "${p.job?.title ?? "Freelance Job"}", Company: "${p.job?.company ?? "Client"}", Budget: $${p.job?.budget ?? "N/A"}, Status: ${p.status}`
            )
            .join("\n")
        : "No recent proposals submitted yet."

      // 3. Fetch conversation history (last 15 messages)
      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        take: 15,
      })

      if (messages.length === 0) return

      // Find all uploaded files in the conversation to build file context
      const uploadedFiles = messages
        .filter((m) => m.fileName || m.fileUrl)
        .map(
          (m) =>
            `- File Name: "${m.fileName}", Type: "${m.fileType}", Size: ${m.fileSize ? Math.round(m.fileSize / 1024) + " KB" : "Unknown"}`
        )
        .join("\n")

      const filesContext = uploadedFiles.length
        ? uploadedFiles
        : "No files uploaded in this conversation yet."

      // Only respond if the last message is from the user (freelancer)
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.senderId === novaClientId) return

      // 4. Simulate a natural typing delay (2.5 seconds)
      await delay(2500)

      // 5. Initialize Gemini AI
      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
      if (!apiKey) {
        console.error("Gemini API key is missing. Cannot trigger Nova Client reply.")
        await publishRealtime(participantIds, {
          type: "typing-stop",
          payload: { conversationId },
        })
        return
      }

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
      })

      // Construct system instruction with active dynamic freelancer data and files context
      const systemInstruction = `
You are Nova Client, a busy, professional hiring client on the "Nova Lance" freelance marketplace.
You own projects for companies like "Relay Cloud" (looking for a Next.js SaaS Dashboard builder, budget $6,200) and "FinOps Studio" (looking for a Prisma Performance Audit, budget $2,800).
Your tone should be professional, collaborative, welcoming, and direct.
You are currently chatting with the freelancer ${freelancer?.name ?? "Subramanyam"}.

Here is some real-time context about the freelancer you are talking to:
- Name: ${freelancer?.name ?? "Subramanyam"}
- Recent Proposals submitted by this freelancer:
${proposalsContext}

Here are the files the freelancer has uploaded to this chat:
${filesContext}

Guidelines for replying:
1. Act like a real, busy client who wants to collaborate or is reviewing their application.
2. Address them by their name (${freelancer?.name ?? "Subramanyam"}) naturally if appropriate.
3. Reference their submitted proposals, experience, or skills if they ask about jobs or active listings.
4. If they say simple greetings, greet them back and ask about their availability for the "Next.js SaaS Dashboard Build" or "Prisma Performance Audit" projects.
5. If the freelancer asks you to "summarize this" or references an uploaded file (like a PDF, document, or Zip), simulate having reviewed the file based on its name and file type. For example:
   - "tcsapplicationform.pdf" is a standard TCS job application form containing their personal, academic, and professional details. Summarize it by saying you've reviewed their application details (mentioning education/skills) and discuss if they are ready to proceed with Next.js or Prisma work.
   - For other files, mention the file name and make an intelligent, professional summary relating to their application.
6. Keep your responses highly conversational, realistic, and concise (2-4 sentences max).
7. Do not include markdown headers or AI-style conversational filler.
`

      const contents = messages.map((m) => ({
        role: m.senderId === novaClientId ? "model" : "user",
        parts: [{ text: m.content ?? "" }],
      }))

      // Generate the reply with robust 3x retry strategy for 503 spikes
      let responseResult
      let attempts = 3
      while (attempts > 0) {
        try {
          responseResult = await model.generateContent({
            contents,
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 300,
            },
            systemInstruction,
          })
          break // Success! Break the retry loop
        } catch (error: any) {
          attempts--
          console.warn(`Gemini API attempt failed. Remaining attempts: ${attempts}. Error: ${error.message}`)
          if (attempts === 0) throw error
          await delay(2000) // Wait 2 seconds before retrying
        }
      }

      const replyContent = responseResult?.response.text()?.trim() || "Thanks for getting in touch. Let's discuss details soon!"

      // 6. Stop typing indicator
      await publishRealtime(participantIds, {
        type: "typing-stop",
        payload: { conversationId },
      })

      // 7. Save reply to the database
      const replyMessage = await prisma.message.create({
        data: {
          conversationId,
          senderId: novaClientId,
          content: replyContent,
        },
        include: { sender: { select: { id: true, name: true, email: true } } },
      })

      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      })

      // 8. Create notifications for the freelancer
      if (freelancerId) {
        await prisma.notification.create({
          data: {
            userId: freelancerId,
            conversationId,
            messageId: replyMessage.id,
            type: "MESSAGE",
            title: "Nova Client",
            body: replyContent,
          },
        })
      }

      // 9. Publish new message events
      await publishRealtime(participantIds, {
        type: "receive-message",
        payload: { message: replyMessage, conversationId },
      })

      await publishRealtime(participantIds, {
        type: "conversation-update",
        payload: { conversationId },
      })

      if (freelancerId) {
        await publishRealtime([freelancerId], {
          type: "notification",
          payload: {
            conversationId,
            title: "Nova Client",
            body: replyContent,
          },
        })
      }

      // Also mark as offline or update presence if needed (keep online for a bit)
      setTimeout(async () => {
        try {
          await prisma.userPresence.update({
            where: { userId: novaClientId },
            data: { online: false, lastActiveAt: new Date() },
          })
        } catch (e) {
          // ignore
        }
      }, 5000)

    } catch (error) {
      console.error("Error in background Nova Client reply:", error)
      // Make sure typing indicator stops even if error occurs
      try {
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { participants: true }
        })
        if (conversation) {
          const participantIds = conversation.participants.map((p) => p.userId)
          await publishRealtime(participantIds, {
            type: "typing-stop",
            payload: { conversationId },
          })
        }
      } catch (e) {
        // ignore
      }
    }
  })()
}
