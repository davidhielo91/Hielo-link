import { createHash } from "crypto"
import { isIP } from "net"
import { getRedis } from "@/lib/redis"

const LOGIN_BUCKET_COUNT = 1024
const TRUST_FORWARDED_FOR = process.env.TRUST_X_FORWARDED_FOR_FOR_RATE_LIMITING === "true"

export type RateLimitResult = "allowed" | "limited" | "unavailable"

function getClientBucket(clientIp: string): number {
  return createHash("sha256")
    .update(clientIp)
    .digest()
    .readUInt32BE(0) % LOGIN_BUCKET_COUNT
}

export function getLoginRateLimitKey(req: Request): string {
  if (!TRUST_FORWARDED_FOR) {
    return "login:shared"
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim()
  if (!clientIp || isIP(clientIp) === 0) {
    return "login:shared"
  }

  return `login:client:${getClientBucket(clientIp)}`
}

export async function checkRateLimit(key: string, maxAttempts = 5, windowMs = 60000): Promise<RateLimitResult> {
  try {
    const redis = await getRedis()
    const redisKey = `ratelimit:${key}`
    const windowSeconds = Math.ceil(windowMs / 1000)

    const [count] = await redis
      .multi()
      .incr(redisKey)
      .expire(redisKey, windowSeconds, "NX")
      .execTyped()

    return count <= maxAttempts ? "allowed" : "limited"
  } catch (error) {
    console.error("Rate limit error:", error)
    return "unavailable"
  }
}
