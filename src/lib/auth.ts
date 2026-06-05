import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-dev-secret"
)

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function verifySession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value
    if (!token) return false
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
