import { describe, expect, it } from "vitest"
import { getLinkIcon, linkIcons } from "@/lib/link-icons"

describe("link icons", () => {
  it("has unique ids and non-empty labels", () => {
    const ids = linkIcons.map((option) => option.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(linkIcons.every((option) => option.label.trim().length > 0)).toBe(true)
  })

  it("resolves known ids and ignores unknown or empty ones", () => {
    expect(getLinkIcon("globe")?.id).toBe("globe")
    expect(getLinkIcon("does-not-exist")).toBeNull()
    expect(getLinkIcon("")).toBeNull()
    expect(getLinkIcon(undefined)).toBeNull()
  })
})
