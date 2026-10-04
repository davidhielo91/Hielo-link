import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/auth", () => ({ verifySession: vi.fn() }))
vi.mock("@/lib/storage", () => ({ readData: vi.fn(), writeData: vi.fn() }))
vi.mock("@/lib/admin-auth", () => ({ verifyAdminPassword: vi.fn(), setAdminPassword: vi.fn() }))
vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }))

import { verifySession } from "@/lib/auth"
import { setAdminPassword, verifyAdminPassword } from "@/lib/admin-auth"
import { PUT } from "@/app/api/data/route"
import { POST as changePassword } from "@/app/api/auth/change-password/route"
import { GET as getSession } from "@/app/api/auth/me/route"

describe("administrative API authorization", () => {
  beforeEach(() => vi.clearAllMocks())

  it("rejects unauthenticated data writes", async () => {
    vi.mocked(verifySession).mockResolvedValue(false)
    expect((await PUT(new Request("https://example.com/api/data", { method: "PUT" }))).status).toBe(401)
  })

  it("rejects unauthenticated password changes", async () => {
    vi.mocked(verifySession).mockResolvedValue(false)
    expect((await changePassword(new Request("https://example.com/api/auth/change-password", { method: "POST", body: JSON.stringify({}) }))).status).toBe(401)
  })

  it("enforces a confirmed 12-character password before persisting", async () => {
    vi.mocked(verifySession).mockResolvedValue(true)
    vi.mocked(verifyAdminPassword).mockResolvedValue(true)
    const tooShort = await changePassword(new Request("https://example.com/api/auth/change-password", { method: "POST", body: JSON.stringify({ currentPassword: "current", newPassword: "short", confirmPassword: "short" }) }))
    expect(tooShort.status).toBe(400)

    const accepted = await changePassword(new Request("https://example.com/api/auth/change-password", { method: "POST", body: JSON.stringify({ currentPassword: "current", newPassword: "twelve-char!", confirmPassword: "twelve-char!" }) }))
    expect(accepted.status).toBe(200)
    expect(setAdminPassword).toHaveBeenCalledWith("twelve-char!")
  })

  it("reports the session endpoint as unauthorized without a valid session", async () => {
    vi.mocked(verifySession).mockResolvedValue(false)
    const response = await getSession()
    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ authenticated: false })
  })
})
