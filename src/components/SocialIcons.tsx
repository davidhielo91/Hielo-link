"use client"

import {
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaMusic,
  FaEnvelope,
} from "react-icons/fa"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  youtube: FaYoutube,
  instagram: FaInstagram,
  twitter: FaTwitter,
  github: FaGithub,
  linkedin: FaLinkedin,
  globe: FaGlobe,
  music: FaMusic,
  mail: FaEnvelope,
}

type Social = {
  platform: string
  url: string
}

export default function SocialIcons({ socials }: { socials: Social[] }) {
  return (
    <div className="flex items-center gap-3">
      {socials.map((social) => {
        const Icon = iconMap[social.platform.toLowerCase()]
        if (!Icon) return null
        return (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-10 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: "var(--social-bg)",
              color: "var(--social-color)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--social-hover-bg)"
              e.currentTarget.style.color = "var(--social-hover-color)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--social-bg)"
              e.currentTarget.style.color = "var(--social-color)"
            }}
          >
            <Icon className="size-5" />
          </a>
        )
      })}
    </div>
  )
}
