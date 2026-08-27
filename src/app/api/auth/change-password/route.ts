import { verifySession } from "@/lib/auth"
import { verifyAdminPassword, setAdminPassword } from "@/lib/admin-auth"

export async function POST(req: Request) {
  const isAuth = await verifySession()
  if (!isAuth) {
    return Response.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json()

    if (typeof currentPassword !== "string" || typeof newPassword !== "string" || typeof confirmPassword !== "string") {
      return Response.json({ error: "Completa todos los campos de contraseña" }, { status: 400 })
    }

    if (newPassword.length === 0) {
      return Response.json({ error: "La nueva contraseña no puede estar vacía" }, { status: 400 })
    }

    if (newPassword.length < 12) {
      return Response.json({ error: "La nueva contraseña debe tener al menos 12 caracteres" }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return Response.json({ error: "Las contraseñas nuevas no coinciden" }, { status: 400 })
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
