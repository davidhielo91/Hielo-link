import { createSession } from "@/lib/auth"
import { checkRateLimit, getLoginRateLimitKey } from "@/lib/rate-limit"
import { authenticateAdmin } from "@/lib/admin-auth"

export async function POST(req: Request) {
  try {
    const rateLimitResult = await checkRateLimit(getLoginRateLimitKey(req))
    if (rateLimitResult === "unavailable") {
      return Response.json({ error: "Inicio de sesión no disponible temporalmente" }, { status: 503 })
    }
    if (rateLimitResult === "limited") {
      return Response.json({ error: "Demasiados intentos. Intenta de nuevo en 1 minuto" }, { status: 429 })
    }

    const { password } = await req.json()
    if (typeof password !== "string" || !password) {
      return Response.json({ error: "Contraseña requerida" }, { status: 400 })
    }

    const auth = await authenticateAdmin(password)
    if (auth === "unavailable") {
      return Response.json({ error: "Inicio de sesión no disponible temporalmente" }, { status: 503 })
    }
    if (auth === "invalid") {
      return Response.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    await createSession()
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Error interno" }, { status: 500 })
  }
}
