import type { CSSProperties } from "react"
import { readData } from "@/lib/storage"
import { getFontInfo } from "@/lib/fonts"
import { cacheLife, cacheTag } from "next/cache"

async function getThemeData() {
  "use cache"
  cacheLife("minutes")
  cacheTag("profile")
  return readData()
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let themeVars: CSSProperties & Record<string, string> = {}
  let bgStyle: CSSProperties = { backgroundColor: "#09090b" }
  let headingFontUrl: string | null = null
  let bodyFontUrl: string | null = null
  let headingFamily = "inherit"
  let bodyFamily = "inherit"
  let isAnimated = false

  try {
    const data = await getThemeData()
    const t = data.theme

    const hf = getFontInfo(t.fontHeading)
    const bf = getFontInfo(t.fontBody)
    headingFamily = hf?.family ?? "inherit"
    bodyFamily = bf?.family ?? "inherit"
    headingFontUrl = hf?.url ?? null
    bodyFontUrl = bf?.url ?? null

    themeVars = {
      "--bg-from": t.bgFrom,
      "--bg-via": t.bgVia,
      "--bg-to": t.bgTo,
      "--card-bg": t.cardBg,
      "--card-border": t.cardBorder,
      "--card-bg-hover": t.cardBgHover,
      "--text-primary": t.textPrimary,
      "--text-secondary": t.textSecondary,
      "--text-muted": t.textMuted,
      "--ring-color": t.ringColor,
      "--social-bg": t.socialBg,
      "--social-color": t.socialColor,
      "--social-hover-bg": t.socialHoverBg,
      "--social-hover-color": t.socialHoverColor,
      "--font-heading": headingFamily,
      "--font-body": bodyFamily,
    }

    const hasBgImage = t.bgImage && t.bgImage.trim()
    isAnimated = t.bgAnimated && !hasBgImage

    if (hasBgImage) {
      bgStyle = {
        backgroundImage: `linear-gradient(135deg, ${t.bgFrom}, ${t.bgVia}, ${t.bgTo}), url(${t.bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }
    } else if (isAnimated) {
      bgStyle = {
        backgroundImage: `linear-gradient(135deg, ${t.bgFrom}, ${t.bgVia}, ${t.bgTo})`,
        backgroundSize: "400% 400%",
        animation: "gradient-shift 8s ease infinite",
      }
    } else {
      bgStyle = {
        background: `linear-gradient(135deg, ${t.bgFrom}, ${t.bgVia}, ${t.bgTo})`,
      }
    }
  } catch {
    // fallback: keep default dark
  }

  const fontUrls = new Set<string>()
  if (headingFontUrl) fontUrls.add(headingFontUrl)
  if (bodyFontUrl) fontUrls.add(bodyFontUrl)

  return (
    <>
      {[...fontUrls].map((url) => (
        <link key={url} rel="stylesheet" href={url} />
      ))}
      <div
        style={{
          ...themeVars,
          ...bgStyle,
          fontFamily: "var(--font-body)",
        }}
      >
        <div
          className="min-h-dvh"
          style={{ backgroundColor: "rgba(9,9,11,0.85)", backdropFilter: "blur(2px)" }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
