import path from "path"
import fs from "fs/promises"
import { getRedis } from "@/lib/redis"
import { profileDataSchema, type ProfileData } from "@/lib/validation"

const REDIS_KEY = "profile"

class ProfileDataStorageError extends Error {
  constructor(source: "Redis" | "seed file", reason: string) {
    super(`Invalid profile data in ${source}: ${reason}`)
  }
}

function parseJson(raw: string, source: "Redis" | "seed file"): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    throw new ProfileDataStorageError(source, "invalid JSON")
  }
}

function validateProfileData(data: unknown, source: "Redis" | "seed file"): ProfileData {
  const result = profileDataSchema.safeParse(data)
  if (result.success) return result.data

  const fields = result.error.issues
    .map((issue) => issue.path.join(".") || "root")
    .join(", ")
  throw new ProfileDataStorageError(source, `invalid fields: ${fields}`)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

async function readFile(): Promise<ProfileData | null> {
  const DATA_FILE = path.join(process.cwd(), "src", "data", "profile.json")
  let raw: string

  try {
    raw = await fs.readFile(DATA_FILE, "utf-8")
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null
    throw new ProfileDataStorageError("seed file", "could not be read")
  }

  return validateProfileData(parseJson(raw, "seed file"), "seed file")
}

function normalizeRedisData(raw: string, seedData: ProfileData): ProfileData {
  const storedData = parseJson(raw, "Redis")
  if (!isRecord(storedData)) {
    throw new ProfileDataStorageError("Redis", "expected an object")
  }

  const { theme, ...profile } = storedData
  if (theme !== undefined && !isRecord(theme)) {
    throw new ProfileDataStorageError("Redis", "invalid fields: theme")
  }

  return validateProfileData({
    ...seedData,
    ...profile,
    theme: { ...seedData.theme, ...theme },
  }, "Redis")
}

async function seedIfEmpty(): Promise<ProfileData> {
  const redis = await getRedis()
  const raw = await redis.get(REDIS_KEY)
  const fileData = await readFile()

  if (raw) {
    if (fileData) {
      const merged = normalizeRedisData(raw, fileData)
      const mergedRaw = JSON.stringify(merged)
      if (mergedRaw !== raw) {
        await redis.set(REDIS_KEY, mergedRaw)
      }
      return merged
    }
    return validateProfileData(parseJson(raw, "Redis"), "Redis")
  }

  if (fileData) {
    await redis.set(REDIS_KEY, JSON.stringify(fileData))
    return fileData
  }

  throw new Error("No data found in Redis or file")
}

export async function readData(): Promise<ProfileData> {
  try {
    return await seedIfEmpty()
  } catch (error) {
    if (error instanceof ProfileDataStorageError) {
      console.error("Profile data storage validation failed", { message: error.message })
    }
    throw error
  }
}

export async function writeData(data: ProfileData): Promise<void> {
  const redis = await getRedis()
  await redis.set(REDIS_KEY, JSON.stringify(data))
}
