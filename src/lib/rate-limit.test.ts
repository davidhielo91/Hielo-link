import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/redis", () => ({ getRedis: vi.fn() }))

import { getRedis } from "@/lib/redis"

const originalTrustSetting = process.env.TRUST_X_FORWARDED_FOR_FOR_RATE_LIMITING

async function loadRateLimit(trustForwardedFor?: string) {
  vi.resetModules()
  if (trustForwardedFor === undefined) delete process.env.TRUST_X_FORWARDED_FOR_FOR_RATE_LIMITING
  else process.env.TRUST_X_FORWARDED_FOR_FOR_RATE_LIMITING = trustForwardedFor
  return import("@/lib/rate-limit")
}

describe("login rate limiting", () => {
  beforeEach(() => vi.clearAllMocks())

  afterEach(() => {
    if (originalTrustSetting === undefined) delete process.env.TRUST_X_FORWARDED_FOR_FOR_RATE_LIMITING
    else process.env.TRUST_X_FORWARDED_FOR_FOR_RATE_LIMITING = originalTrustSetting
  })

  it("uses a shared key unless forwarded headers are explicitly trusted", async () => {
    const { getLoginRateLimitKey } = await loadRateLimit()
    expect(getLoginRateLimitKey(new Request("https://example.com", { headers: { "x-forwarded-for": "203.0.113.10" } }))).toBe("login:shared")
  })

  it("uses a bounded client bucket only for a valid forwarded address with opt-in", async () => {
    const { getLoginRateLimitKey } = await loadRateLimit("true")
    const clientKey = getLoginRateLimitKey(new Request("https://example.com", { headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1" } }))
    expect(clientKey).toMatch(/^login:client:(?:[0-9]|[1-9][0-9]{1,2}|10[0-1][0-9]|102[0-3])$/)
    expect(getLoginRateLimitKey(new Request("https://example.com", { headers: { "x-forwarded-for": "not-an-ip" } }))).toBe("login:shared")
  })

  it("returns unavailable when Redis fails instead of allowing the request", async () => {
    vi.mocked(getRedis).mockRejectedValueOnce(new Error("Redis unavailable"))
    const { checkRateLimit } = await loadRateLimit()
    await expect(checkRateLimit("login:shared")).resolves.toBe("unavailable")
  })

  it("uses an atomic Redis transaction and limits attempts above the maximum", async () => {
    const execTyped = vi.fn().mockResolvedValue([6, 1])
    const expire = vi.fn().mockReturnValue({ execTyped })
    const incr = vi.fn().mockReturnValue({ expire })
    const multi = vi.fn().mockReturnValue({ incr })
    vi.mocked(getRedis).mockResolvedValue({ multi } as never)
    const { checkRateLimit } = await loadRateLimit()

    await expect(checkRateLimit("login:shared", 5, 1500)).resolves.toBe("limited")
    expect(incr).toHaveBeenCalledWith("ratelimit:login:shared")
    expect(expire).toHaveBeenCalledWith("ratelimit:login:shared", 2, "NX")
  })
})
