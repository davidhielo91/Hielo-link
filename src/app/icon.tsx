/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/og"
import { connection } from "next/server"
import { readData } from "@/lib/storage"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

const MAX_AVATAR_DATA_URL_LENGTH = 3 * 1024 * 1024
const PNG_SIGNATURE = "iVBORw0KGgo"
const JPEG_SIGNATURE = "/9j/"

function getSafeAvatarDataUrl(avatar: string | null): string | null {
  if (!avatar || avatar.length > MAX_AVATAR_DATA_URL_LENGTH) return null

  const match = /^data:image\/(png|jpeg);base64,([A-Za-z0-9+/]+={0,2})$/.exec(avatar)
  if (!match) return null

  const [, type, data] = match
  if (data.length % 4 !== 0) return null
  if (type === "png" && !data.startsWith(PNG_SIGNATURE)) return null
  if (type === "jpeg" && !data.startsWith(JPEG_SIGNATURE)) return null

  return avatar
}

function createIcon(avatar: string | null) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#7c3aed",
        }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt=""
            width="32"
            height="32"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ color: "white", fontSize: 20, fontWeight: 700 }}>H</div>
        )}
      </div>
    ),
    size,
  )
}

export default async function Icon() {
  await connection()

  let avatar: string | null = null

  try {
    avatar = getSafeAvatarDataUrl((await readData()).avatar)
  } catch {
    // The fallback icon remains available when profile storage is unavailable.
  }

  const response = createIcon(avatar)
  response.headers.set("Cache-Control", "no-store")
  return response
}
