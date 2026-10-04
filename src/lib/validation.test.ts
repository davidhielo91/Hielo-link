import { describe, expect, it } from "vitest"
import { profileDataSchema } from "@/lib/validation"

const validProfile = {
  name: "Hielo", bio: "Profile", avatar: null, calendlyUrl: "https://calendly.com/hielo",
  theme: {
    bgFrom: "#000000", bgVia: "#111111", bgTo: "#222222", bgImage: "https://example.com/background.png", bgAnimated: false,
    fontHeading: "Inter", fontBody: "Inter", cardBg: "#000000", cardBorder: "#111111", cardBgHover: "#222222",
    textPrimary: "#ffffff", textSecondary: "#eeeeee", textMuted: "#dddddd", ringColor: "#cccccc", socialBg: "#bbbbbb",
    socialColor: "#aaaaaa", socialHoverBg: "#999999", socialHoverColor: "#888888",
  },
  links: [{ id: "link-1", title: "Website", url: "http://example.com" }],
  socials: [{ platform: "github", url: "https://github.com/hielo" }],
}

describe("profileDataSchema URL protocols", () => {
  it("accepts HTTP and HTTPS profile links", () => {
    expect(profileDataSchema.safeParse(validProfile).success).toBe(true)
  })

  it("rejects unsafe link and social protocols", () => {
    expect(profileDataSchema.safeParse({ ...validProfile, links: [{ ...validProfile.links[0], url: "javascript:alert(1)" }] }).success).toBe(false)
    expect(profileDataSchema.safeParse({ ...validProfile, socials: [{ ...validProfile.socials[0], url: "data:text/html,unsafe" }] }).success).toBe(false)
  })

  it("requires HTTPS for background images", () => {
    expect(profileDataSchema.safeParse({ ...validProfile, theme: { ...validProfile.theme, bgImage: "http://example.com/background.png" } }).success).toBe(false)
  })
})
