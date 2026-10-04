import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/redis", () => ({ getRedis: vi.fn() }))

import { getRedis } from "@/lib/redis"
import { setAdminPassword, verifyAdminPassword } from "@/lib/admin-auth"

describe("administrative password hashes", () => {
  const values = new Map<string, string>()
  const redis = {
    get: vi.fn(async (key: string) => values.get(key) ?? null),
    set: vi.fn(async (key: string, value: string) => { values.set(key, value) }),
  }

  beforeEach(() => {
    values.clear()
    vi.clearAllMocks()
    vi.mocked(getRedis).mockResolvedValue(redis as never)
  })

  it("writes the compatible saltHex:hashHex format and verifies it", async () => {
    await setAdminPassword("twelve-char!")
    expect(values.get("admin:auth")).toMatch(/^[a-f0-9]{32}:[a-f0-9]{128}$/i)
    await expect(verifyAdminPassword("twelve-char!")).resolves.toBe(true)
    await expect(verifyAdminPassword("wrong-password")).resolves.toBe(false)
  })

  it("verifies hashes stored in the pre-existing saltHex:hashHex format", async () => {
    values.set("admin:auth", "00112233445566778899aabbccddeeff:b6758039ef898cc0fc5bb22a9ce9d467afe0cd8ffcc4d07933d0da17e01eff393d4994011b53a8bae7fbb63f09faa38b30fcfead9f227c76697451c3f846d3e6")

    await expect(verifyAdminPassword("legacy-password")).resolves.toBe(true)
  })

  it("rejects malformed stored hashes safely", async () => {
    values.set("admin:auth", "not-a-valid-hash")
    await expect(verifyAdminPassword("twelve-char!")).resolves.toBe(false)
  })
})
