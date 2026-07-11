import { getRedis } from "@/lib/redis"

export async function checkRateLimit(key: string, maxAttempts = 5, windowMs = 60000): Promise<boolean> {
  try {
    const redis = await getRedis()
    const redisKey = `ratelimit:${key}`
    const windowSeconds = Math.ceil(windowMs / 1000)

    const count = await redis.incr(redisKey)
    if (count === 1) {
      await redis.expire(redisKey, windowSeconds)
    }

    return count <= maxAttempts
  } catch (error) {
    console.error("Rate limit error:", error)
    return true
  }
}
