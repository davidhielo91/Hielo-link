"use client"

import { ExternalLink } from "lucide-react"

type LinkItem = {
  title: string
  url: string
  icon?: string
}

export default function LinkCard({ title, url, icon }: LinkItem) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full items-center gap-3 rounded-2xl border px-5 py-4 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--card-bg-hover)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--card-bg)"
      }}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span
        className="flex-1 text-center font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </span>
      <ExternalLink
        className="size-4 transition-all duration-200 group-hover:opacity-80"
        style={{ color: "var(--text-muted)" }}
      />
    </a>
  )
}
