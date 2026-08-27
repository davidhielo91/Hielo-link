import { z } from "zod"

const webUrlSchema = z.url({ protocol: /^https?$/ })
const httpsUrlSchema = z.url({ protocol: /^https$/ })

const themeSchema = z.object({
  bgFrom: z.string(),
  bgVia: z.string(),
  bgTo: z.string(),
  bgImage: httpsUrlSchema.nullable(),
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
  url: webUrlSchema,
  icon: z.string().optional(),
})

const socialSchema = z.object({
  platform: z.string(),
  url: webUrlSchema,
})

export const profileDataSchema = z.object({
  name: z.string(),
  bio: z.string(),
  avatar: z.string().nullable(),
  calendlyUrl: webUrlSchema.nullable(),
  theme: themeSchema,
  links: z.array(linkSchema),
  socials: z.array(socialSchema),
})

export type ProfileData = z.infer<typeof profileDataSchema>
export type Theme = z.infer<typeof themeSchema>
export type Link = z.infer<typeof linkSchema>
export type Social = z.infer<typeof socialSchema>
