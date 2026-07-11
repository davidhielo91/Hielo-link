"use client"

import { useEffect, useState, startTransition } from "react"

export default function CopyrightYear({ name }: { name: string }) {
  const [year, setYear] = useState("")

  useEffect(() => {
    startTransition(() => {
      setYear(String(new Date().getFullYear()))
    })
  }, [])

  return <span suppressHydrationWarning>&copy; {year || "..."} {name}</span>
}
