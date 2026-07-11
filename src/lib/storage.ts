import path from "path"
import fs from "fs/promises"
import { getRedis } from "@/lib/redis"
import type { ProfileData } from "@/lib/validation"

const REDIS_KEY = "profile"

async function readFile(): Promise<ProfileData | null> {
  try {
    const DATA_FILE = path.join(process.cwd(), "src", "data", "profile.json")
    const raw = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(raw)
  } catch {
    return null
  }
}

async function seedIfEmpty(): Promise<ProfileData> {
  const redis = await getRedis()
  const raw = await redis.get(REDIS_KEY)
  const fileData = await readFile()

  if (raw) {
    const parsed = JSON.parse(raw) as ProfileData
    if (fileData) {
      const merged: ProfileData = {
        ...fileData,
        ...parsed,
        theme: { ...fileData.theme, ...parsed.theme },
      }
      const mergedRaw = JSON.stringify(merged)
      if (mergedRaw !== raw) {
        await redis.set(REDIS_KEY, mergedRaw)
      }
      return merged
    }
    return parsed
  }

  if (fileData) {
    await redis.set(REDIS_KEY, JSON.stringify(fileData))
    return fileData
  }

  throw new Error("No data found in Redis or file")
}

export async function readData(): Promise<ProfileData> {
  return seedIfEmpty()
}

export async function writeData(data: ProfileData): Promise<void> {
  const redis = await getRedis()
  await redis.set(REDIS_KEY, JSON.stringify(data))
}
