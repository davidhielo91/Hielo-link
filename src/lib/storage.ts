import { kv } from "@vercel/kv"
import path from "path"
import fs from "fs/promises"

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
  const existing = await kv.get<ProfileData>(REDIS_KEY)
  if (existing) return existing

  const fileData = await readFile()
  if (fileData) {
    await kv.set(REDIS_KEY, fileData)
    return fileData
  }

  throw new Error("No data found in Redis or file")
}

export type ProfileData = {
  name: string
  bio: string
  avatar: string | null
  theme: Theme
  links: Link[]
  socials: Social[]
}

export type Theme = {
  bgFrom: string
  bgVia: string
  bgTo: string
  cardBg: string
  cardBorder: string
  cardBgHover: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  ringColor: string
  socialBg: string
  socialColor: string
  socialHoverBg: string
  socialHoverColor: string
}

export type Link = {
  id: string
  title: string
  url: string
  icon?: string
}

export type Social = {
  platform: string
  url: string
}

export async function readData(): Promise<ProfileData> {
  return seedIfEmpty()
}

export async function writeData(data: ProfileData): Promise<void> {
  await kv.set(REDIS_KEY, data)
}
