import { verifySession } from "@/lib/auth"
import { readData, writeData } from "@/lib/storage"
import { profileDataSchema } from "@/lib/validation"
import { revalidateTag } from "next/cache"

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
    const result = profileDataSchema.safeParse(body)

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))
      return Response.json({ errors }, { status: 400 })
    }

    await writeData(result.data)
    revalidateTag("profile", "max")
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
