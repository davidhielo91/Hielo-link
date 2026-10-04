import { randomBytes, scrypt, timingSafeEqual } from "crypto"
import { getRedis } from "@/lib/redis"

const REDIS_KEY = "admin:auth"
const SALT_BYTES = 16
const KEY_LENGTH = 64

function deriveKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) reject(error)
      else resolve(derivedKey)
    })
  })
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES).toString("hex")
  const hash = (await deriveKey(password, salt)).toString("hex")
  return `${salt}:${hash}`
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash, ...extra] = stored.split(":")
  if (extra.length > 0 || !salt || !hash || !/^[a-f0-9]+$/i.test(salt) || !/^[a-f0-9]+$/i.test(hash)) {
    return false
  }

  const storedHash = Buffer.from(hash, "hex")
  if (storedHash.length !== KEY_LENGTH) return false

  const derived = await deriveKey(password, salt)
  return timingSafeEqual(derived, storedHash)
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
  await redis.set(REDIS_KEY, await hashPassword(password))
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const stored = await getAdminPasswordHash()
  if (!stored) return false
  return verifyPassword(password, stored)
}
