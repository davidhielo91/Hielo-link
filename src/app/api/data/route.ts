import { verifySession } from "@/lib/auth"
import { readData, writeData } from "@/lib/storage"
import { profileDataSchema } from "@/lib/validation"

export async function GET() {
  try {
    const data = await readData()
    return Response.json(data)
  } catch {
    return Response.json({ error: "Error al leer datos" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const isAuth = await verifySession()
  if (!isAuth) {
    return Response.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = profileDataSchema.parse(body)
    await writeData(parsed)
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Datos inválidos" }, { status: 400 })
  }
}
