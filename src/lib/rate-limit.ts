const attempts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 60000): boolean {
  const now = Date.now()
  const entry = attempts.get(key)

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= maxAttempts) {
    return false
  }

  entry.count++
  return true
}
