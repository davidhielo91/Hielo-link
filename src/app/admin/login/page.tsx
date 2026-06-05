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
    <div className="flex min-h-dvh items-center justify-center bg-zinc-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Admin</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Ingresa la contraseña para acceder
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-purple-500"
          autoFocus
        />

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-xl bg-purple-600 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </div>
  )
}
