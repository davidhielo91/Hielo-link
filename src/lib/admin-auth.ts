import { createHash, randomBytes, scrypt, timingSafeEqual } from "crypto"
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

/**
 * Returns the stored hash, or null when none exists.
 * Redis errors are NOT swallowed: callers must not treat "unavailable"
 * as "no custom password" (that would re-enable the ADMIN_PASSWORD fallback).
 */
export async function getAdminPasswordHash(): Promise<string | null> {
  const redis = await getRedis()
  return redis.get(REDIS_KEY)
}

/** Constant-time comparison against the ADMIN_PASSWORD environment fallback. */
export function matchesEnvPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const a = createHash("sha256").update(password).digest()
  const b = createHash("sha256").update(expected).digest()
  return timingSafeEqual(a, b)
}

export async function setAdminPassword(password: string): Promise<void> {
  const redis = await getRedis()
  await redis.set(REDIS_KEY, await hashPassword(password))
}

export type AdminAuthResult = "ok" | "invalid" | "unavailable"

/**
 * Single source of truth for admin credential checks. A stored hash is
 * authoritative; ADMIN_PASSWORD is only used when no hash exists.
 * Reads Redis once and reports Redis failures as "unavailable".
 */
export async function authenticateAdmin(password: string): Promise<AdminAuthResult> {
  let storedHash: string | null
  try {
    storedHash = await getAdminPasswordHash()
  } catch {
    return "unavailable"
  }

  const valid = storedHash !== null
    ? await verifyPassword(password, storedHash)
    : matchesEnvPassword(password)
  return valid ? "ok" : "invalid"
}
