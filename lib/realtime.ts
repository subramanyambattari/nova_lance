type RealtimeEvent = {
  type:
    | "receive-message"
    | "typing-start"
    | "typing-stop"
    | "mark-seen"
    | "user-online"
    | "conversation-update"
    | "notification"
  payload: unknown
}

type Subscriber = (event: RealtimeEvent) => void

const channels = new Map<number, Set<Subscriber>>()

function subscribeLocal(userId: number, subscriber: Subscriber) {
  const subscribers = channels.get(userId) ?? new Set<Subscriber>()
  subscribers.add(subscriber)
  channels.set(userId, subscribers)

  return () => {
    subscribers.delete(subscriber)
    if (subscribers.size === 0) channels.delete(userId)
  }
}

async function publishPusher(userIds: number[], event: RealtimeEvent) {
  const appId = process.env.PUSHER_APP_ID
  const key = process.env.PUSHER_KEY
  const secret = process.env.PUSHER_SECRET
  const cluster = process.env.PUSHER_CLUSTER

  if (!appId || !key || !secret || !cluster) return

  const crypto = await import("node:crypto")
  const body = JSON.stringify({
    name: event.type,
    channels: userIds.map((userId) => `private-user-${userId}`),
    data: JSON.stringify(event.payload),
  })
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const query = new URLSearchParams({
    auth_key: key,
    auth_timestamp: timestamp,
    auth_version: "1.0",
    body_md5: crypto.createHash("md5").update(body).digest("hex"),
  })
  const stringToSign = ["POST", `/apps/${appId}/events`, query.toString()].join("\n")
  const signature = crypto.createHmac("sha256", secret).update(stringToSign).digest("hex")
  query.set("auth_signature", signature)

  await fetch(`https://api-${cluster}.pusher.com/apps/${appId}/events?${query.toString()}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  }).catch(() => undefined)
}

export async function publishRealtime(userIds: number[], event: RealtimeEvent) {
  for (const userId of userIds) {
    const subscribers = channels.get(userId)
    if (subscribers) {
      for (const subscriber of subscribers) subscriber(event)
    }
  }

  await publishPusher(userIds, event)

  // Send to our local WebSocket server via IPC route
  try {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const host = process.env.NODE_ENV === "production" 
      ? (process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '')) 
      : "127.0.0.1:3000"
    
    // Broadcast to each user in the participant list
    for (const userId of userIds) {
      await fetch(`${protocol}://${host}/api/internal/ws-broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          payload: {
            // Remap event.type to match frontend websocket-provider expectations
            type: event.type === 'receive-message' ? 'chat_message' : event.type,
            ...(event.payload as any),
          },
        }),
      }).catch(() => undefined)
    }
  } catch (e) {
    console.error("Failed to broadcast real-time event", e)
  }
}

export function createRealtimeStream(userId: number) {
  const encoder = new TextEncoder()
  let heartbeat: ReturnType<typeof setInterval> | undefined
  let unsubscribe: (() => void) | undefined

  return new ReadableStream({
    start(controller) {
      const send = (event: RealtimeEvent) => {
        controller.enqueue(
          encoder.encode(`event: ${event.type}\ndata: ${JSON.stringify(event.payload)}\n\n`)
        )
      }

      unsubscribe = subscribeLocal(userId, send)
      controller.enqueue(encoder.encode(`event: connected\ndata: {"ok":true}\n\n`))
      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`event: ping\ndata: {}\n\n`))
      }, 25_000)
    },
    cancel() {
      unsubscribe?.()
      if (heartbeat) clearInterval(heartbeat)
    },
  })
}
