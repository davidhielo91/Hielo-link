import type { CSSProperties } from "react"
import Profile from "@/components/Profile"
import LinkCard from "@/components/LinkCard"
import CalendarCard from "@/components/CalendarCard"
import SocialIcons from "@/components/SocialIcons"
import { readData } from "@/lib/storage"
import { getFontInfo } from "@/lib/fonts"

export const dynamic = "force-dynamic"

export default async function Home() {
  const { name, bio, avatar, calendlyUrl, theme, links, socials } = await readData()

  const themeVars: CSSProperties & Record<string, string> = {
    "--bg-from": theme.bgFrom,
    "--bg-via": theme.bgVia,
    "--bg-to": theme.bgTo,
    "--card-bg": theme.cardBg,
    "--card-border": theme.cardBorder,
    "--card-bg-hover": theme.cardBgHover,
    "--text-primary": theme.textPrimary,
    "--text-secondary": theme.textSecondary,
    "--text-muted": theme.textMuted,
    "--ring-color": theme.ringColor,
    "--social-bg": theme.socialBg,
    "--social-color": theme.socialColor,
    "--social-hover-bg": theme.socialHoverBg,
    "--social-hover-color": theme.socialHoverColor,
  }

  const headingFont = getFontInfo(theme.fontHeading)
  const bodyFont = getFontInfo(theme.fontBody)
  const hasBgImage = theme.bgImage && theme.bgImage.trim()
  const isAnimated = theme.bgAnimated && !hasBgImage

  const bgStyle: CSSProperties = hasBgImage
    ? {
        backgroundImage: `linear-gradient(135deg, var(--bg-from), var(--bg-via), var(--bg-to)), url(${theme.bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }
    : isAnimated
      ? {
          backgroundImage: `linear-gradient(135deg, var(--bg-from), var(--bg-via), var(--bg-to))`,
          backgroundSize: "400% 400%",
          animation: "gradient-shift 8s ease infinite",
        }
      : {
          background: `linear-gradient(135deg, var(--bg-from), var(--bg-via), var(--bg-to))`,
        }

  const fontLinks = new Set<string>()
  if (headingFont) fontLinks.add(headingFont.url)
  if (bodyFont) fontLinks.add(bodyFont.url)

  return (
    <>
      {[...fontLinks].map((url) => (
        <link key={url} rel="stylesheet" href={url} />
      ))}
      <div
        className="flex min-h-dvh flex-col items-center px-4 py-12"
        style={{
          "--font-heading": headingFont?.family ?? "inherit",
          "--font-body": bodyFont?.family ?? "inherit",
          ...themeVars,
          ...bgStyle,
          fontFamily: "var(--font-body)",
        } as CSSProperties & Record<string, string>}
      >
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <Profile name={name} bio={bio} avatar={avatar} />

          <div className="flex w-full flex-col gap-3">
            {links.map((link) => (
              <LinkCard key={link.id} title={link.title} url={link.url} />
            ))}
          </div>

          {calendlyUrl && <CalendarCard url={calendlyUrl} />}

          <SocialIcons socials={socials} />

          <p
            className="text-center text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            &copy; {new Date().getFullYear()} {name}
          </p>
        </div>
      </div>
    </>
  )
}
