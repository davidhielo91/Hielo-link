import { z } from "zod"

const themeSchema = z.object({
  bgFrom: z.string(),
  bgVia: z.string(),
  bgTo: z.string(),
  bgImage: z.string().nullable(),
  bgAnimated: z.boolean(),
  fontHeading: z.string(),
  fontBody: z.string(),
  cardBg: z.string(),
  cardBorder: z.string(),
  cardBgHover: z.string(),
  textPrimary: z.string(),
  textSecondary: z.string(),
  textMuted: z.string(),
  ringColor: z.string(),
  socialBg: z.string(),
  socialColor: z.string(),
  socialHoverBg: z.string(),
  socialHoverColor: z.string(),
})

const linkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  icon: z.string().optional(),
})

const socialSchema = z.object({
  platform: z.string(),
  url: z.string(),
})

export const profileDataSchema = z.object({
  name: z.string(),
  bio: z.string(),
  avatar: z.string().nullable(),
  calendlyUrl: z.string().nullable(),
  theme: themeSchema,
  links: z.array(linkSchema),
  socials: z.array(socialSchema),
})
