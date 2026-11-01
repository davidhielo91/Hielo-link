import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/auth", () => ({ createSession: vi.fn() }))
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: vi.fn(), getLoginRateLimitKey: vi.fn(() => "k") }))
vi.mock("@/lib/admin-auth", () => ({ authenticateAdmin: vi.fn() }))

import { createSession } from "@/lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"
import { authenticateAdmin } from "@/lib/admin-auth"
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

  it("returns 503 without creating a session when auth storage is unavailable", async () => {
    vi.mocked(authenticateAdmin).mockResolvedValue("unavailable")
    expect((await login({ password: "env-password" })).status).toBe(503)
    expect(createSession).not.toHaveBeenCalled()
  })

  it("creates a session when credentials are valid", async () => {
    vi.mocked(authenticateAdmin).mockResolvedValue("ok")
    expect((await login({ password: "good" })).status).toBe(200)
    expect(createSession).toHaveBeenCalled()
  })

  it("returns 401 without a session for invalid credentials", async () => {
    vi.mocked(authenticateAdmin).mockResolvedValue("invalid")
    expect((await login({ password: "bad" })).status).toBe(401)
    expect(createSession).not.toHaveBeenCalled()
  })
})
