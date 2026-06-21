import { randomBytes, scryptSync, timingSafeEqual } from "crypto"
import { createClient } from "redis"

const REDIS_KEY = "admin:auth"

let client: ReturnType<typeof createClient> | null = null

async function getRedis() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL })
    client.on("error", (err) => console.error("Redis Error:", err))
    await client.connect()
  }
  return client
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":")
  const derived = scryptSync(password, salt, 64)
  return timingSafeEqual(derived, Buffer.from(hash, "hex"))
}

export async function getAdminPasswordHash(): Promise<string | null> {
  try {
    const redis = await getRedis()
    return await redis.get(REDIS_KEY)
  } catch {
    return null
  }
}

export async function setAdminPassword(password: string): Promise<void> {
  const redis = await getRedis()
  await redis.set(REDIS_KEY, hashPassword(password))
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const stored = await getAdminPasswordHash()
  if (!stored) return false
  return verifyPassword(password, stored)
}
