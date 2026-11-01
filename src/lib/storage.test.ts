import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/redis", () => ({ getRedis: vi.fn() }))

import { getRedis } from "@/lib/redis"
import { readData } from "@/lib/storage"

describe("profile storage", () => {
  const redis = { get: vi.fn(), set: vi.fn() }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getRedis).mockResolvedValue(redis as never)
  })

  it("never writes to Redis when reading existing partial data", async () => {
    redis.get.mockResolvedValue(JSON.stringify({ name: "Stored name", links: [], socials: [] }))
    const data = await readData()
    expect(data.name).toBe("Stored name")
    expect(data.theme).toBeDefined()
    expect(redis.set).not.toHaveBeenCalled()
  })

  it("seeds an empty key with NX so it cannot clobber a concurrent write", async () => {
    redis.get.mockResolvedValue(null)
    await readData()
    expect(redis.set).toHaveBeenCalledWith("profile", expect.any(String), { NX: true })
  })

  it("returns the concurrent writer's data when the NX seed is skipped", async () => {
    redis.get
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(JSON.stringify({ name: "Concurrent name", links: [], socials: [] }))
    redis.set.mockResolvedValue(null)
    const data = await readData()
    expect(data.name).toBe("Concurrent name")
  })

  it("rejects invalid JSON stored in Redis", async () => {
    redis.get.mockResolvedValue("{not json")
    await expect(readData()).rejects.toThrow(/invalid JSON/)
  })
})
