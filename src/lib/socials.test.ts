import { describe, expect, it } from "vitest"
import { getIcon, platforms } from "@/lib/socials"

describe("social platforms", () => {
  it("has unique ids and labels", () => {
    expect(new Set(platforms.map((p) => p.id)).size).toBe(platforms.length)
    expect(new Set(platforms.map((p) => p.label)).size).toBe(platforms.length)
  })

  it("offers X and no longer offers the Twitter entry", () => {
    expect(platforms.some((p) => p.id === "x" && p.label === "X")).toBe(true)
    expect(platforms.some((p) => p.id === "twitter")).toBe(false)
  })

  it("renders profiles saved with the legacy twitter id using the X icon", () => {
    expect(getIcon("twitter")).toBe(getIcon("x"))
    expect(getIcon("Twitter")).toBe(getIcon("x"))
  })

  it("resolves every offered platform and returns undefined for unknown ids", () => {
    for (const p of platforms) expect(getIcon(p.id)).toBe(p.icon)
    expect(getIcon("does-not-exist")).toBeUndefined()
  })
})
