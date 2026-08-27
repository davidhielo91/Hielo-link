import type { ProfileData } from "@/lib/validation"

export type AdminMessage = { type: "ok" | "error"; text: string }
export type LinkForm = { title: string; url: string }
export type SocialForm = { platform: string; url: string }
export type ProfileField = "name" | "bio" | "avatar" | "calendlyUrl"
export type ThemeFieldKey = keyof ProfileData["theme"]
