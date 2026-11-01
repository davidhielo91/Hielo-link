import type { ReactNode } from "react"
import {
  FaBehance,
  FaBluesky,
  FaCodepen,
  FaDiscord,
  FaDribbble,
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaGitlab,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaMastodon,
  FaMedium,
  FaMusic,
  FaPatreon,
  FaPhone,
  FaPinterest,
  FaReddit,
  FaSnapchat,
  FaSoundcloud,
  FaSpotify,
  FaStackOverflow,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaTwitch,
  FaVimeo,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6"
import {
  SiApplemusic,
  SiBuymeacoffee,
  SiKofi,
  SiLinktree,
  SiSignal,
  SiSubstack,
} from "react-icons/si"

export type Platform = {
  id: string
  label: string
  icon: (props: { className?: string }) => ReactNode
}

export const platforms: Platform[] = [
  { id: "youtube",       label: "YouTube",         icon: (p) => <FaYoutube {...p} /> },
  { id: "instagram",     label: "Instagram",       icon: (p) => <FaInstagram {...p} /> },
  { id: "x",             label: "X",               icon: (p) => <FaXTwitter {...p} /> },
  { id: "threads",       label: "Threads",         icon: (p) => <FaThreads {...p} /> },
  { id: "bluesky",       label: "Bluesky",         icon: (p) => <FaBluesky {...p} /> },
  { id: "mastodon",      label: "Mastodon",        icon: (p) => <FaMastodon {...p} /> },
  { id: "github",        label: "GitHub",          icon: (p) => <FaGithub {...p} /> },
  { id: "gitlab",        label: "GitLab",          icon: (p) => <FaGitlab {...p} /> },
  { id: "linkedin",      label: "LinkedIn",        icon: (p) => <FaLinkedin {...p} /> },
  { id: "facebook",      label: "Facebook",        icon: (p) => <FaFacebook {...p} /> },
  { id: "tiktok",        label: "TikTok",          icon: (p) => <FaTiktok {...p} /> },
  { id: "snapchat",      label: "Snapchat",        icon: (p) => <FaSnapchat {...p} /> },
  { id: "pinterest",     label: "Pinterest",       icon: (p) => <FaPinterest {...p} /> },
  { id: "reddit",        label: "Reddit",          icon: (p) => <FaReddit {...p} /> },
  { id: "telegram",      label: "Telegram",        icon: (p) => <FaTelegram {...p} /> },
  { id: "whatsapp",      label: "WhatsApp",        icon: (p) => <FaWhatsapp {...p} /> },
  { id: "signal",        label: "Signal",          icon: (p) => <SiSignal {...p} /> },
  { id: "discord",       label: "Discord",         icon: (p) => <FaDiscord {...p} /> },
  { id: "twitch",        label: "Twitch",          icon: (p) => <FaTwitch {...p} /> },
  { id: "vimeo",         label: "Vimeo",           icon: (p) => <FaVimeo {...p} /> },
  { id: "spotify",       label: "Spotify",         icon: (p) => <FaSpotify {...p} /> },
  { id: "applemusic",    label: "Apple Music",     icon: (p) => <SiApplemusic {...p} /> },
  { id: "soundcloud",    label: "SoundCloud",      icon: (p) => <FaSoundcloud {...p} /> },
  { id: "medium",        label: "Medium",          icon: (p) => <FaMedium {...p} /> },
  { id: "substack",      label: "Substack",        icon: (p) => <SiSubstack {...p} /> },
  { id: "dribbble",      label: "Dribbble",        icon: (p) => <FaDribbble {...p} /> },
  { id: "behance",       label: "Behance",         icon: (p) => <FaBehance {...p} /> },
  { id: "codepen",       label: "CodePen",         icon: (p) => <FaCodepen {...p} /> },
  { id: "stackoverflow", label: "Stack Overflow",  icon: (p) => <FaStackOverflow {...p} /> },
  { id: "patreon",       label: "Patreon",         icon: (p) => <FaPatreon {...p} /> },
  { id: "kofi",          label: "Ko-fi",           icon: (p) => <SiKofi {...p} /> },
  { id: "buymeacoffee",  label: "Buy Me a Coffee", icon: (p) => <SiBuymeacoffee {...p} /> },
  { id: "linktree",      label: "Linktree",        icon: (p) => <SiLinktree {...p} /> },
  { id: "globe",         label: "Sitio Web",       icon: (p) => <FaGlobe {...p} /> },
  { id: "music",         label: "Música",          icon: (p) => <FaMusic {...p} /> },
  { id: "mail",          label: "Email",           icon: (p) => <FaEnvelope {...p} /> },
  { id: "phone",         label: "Teléfono",        icon: (p) => <FaPhone {...p} /> },
]

// Ids that were saved before a platform was renamed. They keep rendering,
// but are not offered in the picker anymore.
const legacyIds: Record<string, string> = {
  twitter: "x",
}

const iconLookup: Record<string, (props: { className?: string }) => ReactNode> = {}
for (const p of platforms) {
  iconLookup[p.id] = p.icon
}

export function getIcon(id: string) {
  const key = id.toLowerCase()
  return iconLookup[legacyIds[key] ?? key]
}
