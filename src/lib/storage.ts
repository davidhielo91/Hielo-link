import path from "path"
import fs from "fs/promises"

const DATA_FILE = path.join(process.cwd(), "src", "data", "profile.json")

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
  const raw = await fs.readFile(DATA_FILE, "utf-8")
  return JSON.parse(raw)
}

export async function writeData(data: ProfileData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8")
}
