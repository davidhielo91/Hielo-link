"use client"

import { Calendar } from "lucide-react"

export default function CalendarCard({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full items-center justify-center gap-3 rounded-2xl border px-5 py-4 backdrop-blur-md transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--card-bg-hover)"
        e.currentTarget.style.borderColor = "var(--ring-color)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--card-bg)"
        e.currentTarget.style.borderColor = "var(--card-border)"
      }}
    >
      <Calendar className="size-5" style={{ color: "var(--text-secondary)" }} />
      <span className="font-medium" style={{ color: "var(--text-primary)" }}>
        Agenda una llamada
      </span>
    </a>
  )
}
