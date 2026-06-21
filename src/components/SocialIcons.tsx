"use client"

import { getIcon } from "@/lib/socials"
import { FaGlobe } from "react-icons/fa"

type Social = {
  platform: string
  url: string
}

export default function SocialIcons({ socials }: { socials: Social[] }) {
  return (
    <div className="flex items-center gap-3">
      {socials.map((social) => {
        const Icon = getIcon(social.platform) ?? ((p) => <FaGlobe {...p} />)
        return (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            className="flex size-11 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 hover:shadow-lg"
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
