import { verifySession } from "@/lib/auth"

export async function GET() {
  const isAuth = await verifySession()
  if (!isAuth) {
    return Response.json({ authenticated: false }, { status: 401 })
  }
  return Response.json({ authenticated: true })
}
