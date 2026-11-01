import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/auth", () => ({ createSession: vi.fn() }))
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: vi.fn(), getLoginRateLimitKey: vi.fn(() => "k") }))
vi.mock("@/lib/admin-auth", () => ({
  getAdminPasswordHash: vi.fn(),
  verifyAdminPassword: vi.fn(),
  matchesEnvPassword: vi.fn(),
}))

import { createSession } from "@/lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"
import { getAdminPasswordHash, matchesEnvPassword, verifyAdminPassword } from "@/lib/admin-auth"
import { POST } from "@/app/api/auth/login/route"

const login = (body: unknown) =>
  POST(new Request("https://example.com/api/auth/login", { method: "POST", body: JSON.stringify(body) }))

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkRateLimit).mockResolvedValue("allowed" as never)
  })

  it("returns 429 when rate limited and 503 when the limiter is unavailable", async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce("limited" as never)
    expect((await login({ password: "x" })).status).toBe(429)
    vi.mocked(checkRateLimit).mockResolvedValueOnce("unavailable" as never)
    expect((await login({ password: "x" })).status).toBe(503)
  })

  it("rejects non-string passwords with 400", async () => {
    expect((await login({ password: { a: 1 } })).status).toBe(400)
    expect((await login({})).status).toBe(400)
  })

  it("does NOT fall back to ADMIN_PASSWORD when Redis fails", async () => {
    vi.mocked(getAdminPasswordHash).mockRejectedValue(new Error("redis down"))
    const res = await login({ password: "env-password" })
    expect(res.status).toBe(503)
    expect(matchesEnvPassword).not.toHaveBeenCalled()
    expect(createSession).not.toHaveBeenCalled()
  })

  it("uses the env password only when no custom hash exists", async () => {
    vi.mocked(getAdminPasswordHash).mockResolvedValue(null)
    vi.mocked(matchesEnvPassword).mockReturnValue(true)
    expect((await login({ password: "env-password" })).status).toBe(200)
    expect(createSession).toHaveBeenCalled()
  })

  it("ignores the env password once a custom hash is stored", async () => {
    vi.mocked(getAdminPasswordHash).mockResolvedValue("salt:hash")
    vi.mocked(verifyAdminPassword).mockResolvedValue(false)
    expect((await login({ password: "env-password" })).status).toBe(401)
    expect(matchesEnvPassword).not.toHaveBeenCalled()
  })
})
