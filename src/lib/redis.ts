import { createClient } from "redis"

let client: ReturnType<typeof createClient> | null = null

export async function getRedis() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL })
    client.on("error", (err) => console.error("Redis Error:", err))
    await client.connect()
  }
  return client
}
