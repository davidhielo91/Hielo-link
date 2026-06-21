"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"

type LinkItem = {
  title: string
  url: string
}

export default function LinkCard({ title, url }: LinkItem) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -y * 12, y: x * 12 })
  }

  function handleMouseEnter() {
    setHovered(true)
  }

  function handleMouseLeave() {
    setHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  const transform = `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovered ? -2 : 0}px)`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full items-center gap-3 rounded-2xl border px-5 py-4 backdrop-blur-md transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out"
      style={{
        transform,
        boxShadow: hovered ? "0 8px 25px rgba(0,0,0,0.25)" : "none",
        backgroundColor: hovered ? "var(--card-bg-hover)" : "var(--card-bg)",
        borderColor: hovered ? "var(--card-border)" : "var(--card-border)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className="flex-1 text-center font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </span>
      <ExternalLink
        className="size-4 transition-opacity duration-200"
        style={{ color: "var(--text-muted)", opacity: hovered ? 0.8 : 0.5 }}
      />
    </a>
  )
}
