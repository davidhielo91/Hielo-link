"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Error al iniciar sesión")
        return
      }

      router.push("/admin")
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border p-8"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Admin</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Ingresa la contraseña para acceder
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <label htmlFor="password" className="sr-only">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--card-border)",
            color: "var(--text-primary)",
          }}
          autoFocus
        />

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-xl px-4 py-3 font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: "var(--bg-from)",
            color: "var(--text-primary)",
          }}
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </div>
  )
}
