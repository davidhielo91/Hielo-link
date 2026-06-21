import { verifySession } from "@/lib/auth"
import { verifyAdminPassword, setAdminPassword } from "@/lib/admin-auth"

export async function POST(req: Request) {
  const isAuth = await verifySession()
  if (!isAuth) {
    return Response.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return Response.json({ error: "Ambas contraseñas son requeridas" }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return Response.json({ error: "La nueva contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    const valid = await verifyAdminPassword(currentPassword)
    if (!valid) {
      const envMatch = currentPassword === process.env.ADMIN_PASSWORD
      if (!envMatch) {
        return Response.json({ error: "Contraseña actual incorrecta" }, { status: 401 })
      }
    }

    await setAdminPassword(newPassword)

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Error al cambiar contraseña" }, { status: 500 })
  }
}
