import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/redis", () => ({ getRedis: vi.fn() }))

import { getRedis } from "@/lib/redis"
import { authenticateAdmin, setAdminPassword } from "@/lib/admin-auth"

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

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("writes the compatible saltHex:hashHex format and verifies it", async () => {
    await setAdminPassword("twelve-char!")
    expect(values.get("admin:auth")).toMatch(/^[a-f0-9]{32}:[a-f0-9]{128}$/i)
    await expect(authenticateAdmin("twelve-char!")).resolves.toBe("ok")
    await expect(authenticateAdmin("wrong-password")).resolves.toBe("invalid")
  })

  it("verifies hashes stored in the pre-existing saltHex:hashHex format", async () => {
    values.set("admin:auth", "00112233445566778899aabbccddeeff:b6758039ef898cc0fc5bb22a9ce9d467afe0cd8ffcc4d07933d0da17e01eff393d4994011b53a8bae7fbb63f09faa38b30fcfead9f227c76697451c3f846d3e6")

    await expect(authenticateAdmin("legacy-password")).resolves.toBe("ok")
  })

  it("rejects malformed stored hashes safely", async () => {
    values.set("admin:auth", "not-a-valid-hash")
    await expect(authenticateAdmin("twelve-char!")).resolves.toBe("invalid")
  })

  it("uses ADMIN_PASSWORD only when no hash is stored", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "env-password")
    await expect(authenticateAdmin("env-password")).resolves.toBe("ok")

    values.set("admin:auth", "not-a-valid-hash")
    await expect(authenticateAdmin("env-password")).resolves.toBe("invalid")
  })

  it("does not fall back to ADMIN_PASSWORD when the stored hash is an empty string", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "env-password")
    values.set("admin:auth", "")
    await expect(authenticateAdmin("env-password")).resolves.toBe("invalid")
  })

  it("reports unavailable (never the env fallback) when Redis fails", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "env-password")
    redis.get.mockRejectedValueOnce(new Error("redis down"))
    await expect(authenticateAdmin("env-password")).resolves.toBe("unavailable")
  })
})
