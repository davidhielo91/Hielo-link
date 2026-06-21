export type FontInfo = {
  url: string
  family: string
}

export const fonts: Record<string, FontInfo> = {
  Inter: {
    url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    family: "'Inter', sans-serif",
  },
  "DM Sans": {
    url: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap",
    family: "'DM Sans', sans-serif",
  },
  "Space Grotesk": {
    url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
    family: "'Space Grotesk', sans-serif",
  },
  Outfit: {
    url: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap",
    family: "'Outfit', sans-serif",
  },
  "Playfair Display": {
    url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap",
    family: "'Playfair Display', serif",
  },
  "JetBrains Mono": {
    url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap",
    family: "'JetBrains Mono', monospace",
  },
}

export const fontNames = Object.keys(fonts)

export function getFontInfo(name: string): FontInfo | null {
  return fonts[name] ?? null
}
