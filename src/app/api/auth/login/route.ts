import { createSession } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { password } = await req.json()

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    await createSession()
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Error interno" }, { status: 500 })
  }
}
