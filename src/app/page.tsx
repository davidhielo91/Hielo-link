import type { CSSProperties } from "react"
import Profile from "@/components/Profile"
import LinkCard from "@/components/LinkCard"
import SocialIcons from "@/components/SocialIcons"
import { readData } from "@/lib/storage"

export const dynamic = "force-dynamic"

export default async function Home() {
  const { name, bio, avatar, theme, links, socials } = await readData()

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

  return (
    <div
      className="flex min-h-dvh flex-col items-center px-4 py-12"
      style={{
        ...themeVars,
        background: `linear-gradient(135deg, var(--bg-from), var(--bg-via), var(--bg-to))`,
      }}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <Profile name={name} bio={bio} avatar={avatar} />

        <div className="flex w-full flex-col gap-3">
          {links.map((link) => (
            <LinkCard key={link.id} title={link.title} url={link.url} icon={link.icon} />
          ))}
        </div>

        <SocialIcons socials={socials} />

        <p
          className="text-center text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          &copy; {new Date().getFullYear()} {name}
        </p>
      </div>
      <a
        href="/admin"
        className="mt-8 text-xs text-white/30 transition-colors hover:text-white/60"
      >
        Admin
      </a>
    </div>
  )
}
