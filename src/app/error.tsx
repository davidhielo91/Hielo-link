"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, var(--bg-from, #1e1e2e), var(--bg-via, #181825), var(--bg-to, #1e1e2e))",
        color: "var(--text-primary, #cdd6f4)",
      }}
    >
      <div
        className="flex max-w-md flex-col items-center gap-6 rounded-2xl border p-8 text-center"
        style={{
          borderColor: "var(--card-border, rgba(69,71,90,0.5))",
          backgroundColor: "color-mix(in srgb, var(--card-bg, rgba(24,24,37,0.85)) 60%, transparent)",
        }}
      >
        <div className="text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold">Algo salió mal</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary, #89b4fa)" }}>
          Ocurrió un error inesperado. Ya lo registramos y lo revisaremos pronto.
        </p>
        <button
          onClick={reset}
          className="rounded-xl px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--ring-color, rgba(69,71,90,0.5))" }}
        >
          Volver a intentar
        </button>
      </div>
      <p className="mt-8 text-xs" style={{ color: "var(--text-muted, rgba(137,180,250,0.4))" }}>
        &copy; {new Date().getFullYear()} Hielo.link
      </p>
    </div>
  )
}
