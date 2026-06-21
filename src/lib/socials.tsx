import type { ReactNode } from "react"
import {
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaTiktok,
  FaSnapchatGhost,
  FaPinterest,
  FaReddit,
  FaTelegram,
  FaWhatsapp,
  FaDiscord,
  FaTwitch,
  FaSpotify,
  FaMedium,
  FaDribbble,
  FaBehance,
  FaSoundcloud,
  FaGlobe,
  FaMusic,
  FaEnvelope,
} from "react-icons/fa"

export type Platform = {
  id: string
  label: string
  icon: (props: { className?: string }) => ReactNode
}

export const platforms: Platform[] = [
  { id: "youtube",     label: "YouTube",     icon: (p) => <FaYoutube {...p} /> },
  { id: "instagram",   label: "Instagram",   icon: (p) => <FaInstagram {...p} /> },
  { id: "twitter",     label: "X (Twitter)", icon: (p) => <FaTwitter {...p} /> },
  { id: "github",      label: "GitHub",      icon: (p) => <FaGithub {...p} /> },
  { id: "linkedin",    label: "LinkedIn",    icon: (p) => <FaLinkedin {...p} /> },
  { id: "facebook",    label: "Facebook",    icon: (p) => <FaFacebook {...p} /> },
  { id: "tiktok",      label: "TikTok",      icon: (p) => <FaTiktok {...p} /> },
  { id: "snapchat",    label: "Snapchat",    icon: (p) => <FaSnapchatGhost {...p} /> },
  { id: "pinterest",   label: "Pinterest",   icon: (p) => <FaPinterest {...p} /> },
  { id: "reddit",      label: "Reddit",      icon: (p) => <FaReddit {...p} /> },
  { id: "telegram",    label: "Telegram",    icon: (p) => <FaTelegram {...p} /> },
  { id: "whatsapp",    label: "WhatsApp",    icon: (p) => <FaWhatsapp {...p} /> },
  { id: "discord",     label: "Discord",     icon: (p) => <FaDiscord {...p} /> },
  { id: "twitch",      label: "Twitch",      icon: (p) => <FaTwitch {...p} /> },
  { id: "spotify",     label: "Spotify",     icon: (p) => <FaSpotify {...p} /> },
  { id: "medium",      label: "Medium",      icon: (p) => <FaMedium {...p} /> },
  { id: "dribbble",    label: "Dribbble",    icon: (p) => <FaDribbble {...p} /> },
  { id: "behance",     label: "Behance",     icon: (p) => <FaBehance {...p} /> },
  { id: "soundcloud",  label: "SoundCloud",  icon: (p) => <FaSoundcloud {...p} /> },
  { id: "globe",       label: "Sitio Web",   icon: (p) => <FaGlobe {...p} /> },
  { id: "music",       label: "Música",      icon: (p) => <FaMusic {...p} /> },
  { id: "mail",        label: "Email",       icon: (p) => <FaEnvelope {...p} /> },
]

const iconLookup: Record<string, (props: { className?: string }) => ReactNode> = {}
for (const p of platforms) {
  iconLookup[p.id] = p.icon
}

export function getIcon(id: string) {
  return iconLookup[id.toLowerCase()]
}
