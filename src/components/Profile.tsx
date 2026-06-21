"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

type ProfileData = {
  name: string
  bio: string
  avatar: string | null
}

export default function Profile({ name, bio, avatar }: ProfileData) {
  const [displayedBio, setDisplayedBio] = useState("")
  const [typingDone, setTypingDone] = useState(false)

  useEffect(() => {
    if (!bio) return

    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayedBio(bio.slice(0, i))
      if (i >= bio.length) {
        clearInterval(interval)
        setTypingDone(true)
      }
    }, 35)

    return () => clearInterval(interval)
  }, [bio])

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex flex-col items-center gap-4">
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          width={96}
          height={96}
          className="size-24 rounded-full object-cover"
          style={{ boxShadow: "0 0 0 4px var(--ring-color)" }}
          unoptimized
        />
      ) : (
        <div
          className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-2xl font-bold text-white"
          style={{ boxShadow: "0 0 0 4px var(--ring-color)" }}
        >
          {initials}
        </div>
      )}
      <div className="text-center">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
          {name}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          {displayedBio}
          {!typingDone && <span className="typing-cursor" />}
        </p>
      </div>
    </div>
  )
}
