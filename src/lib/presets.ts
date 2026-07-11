import type { Theme } from "./validation"

export type Preset = {
  name: string
  theme: Theme
}

export const presets: Preset[] = [
  {
    name: "One Dark Pro",
    theme: {
      bgFrom: "#282c34", bgVia: "#21252b", bgTo: "#282c34",
      bgImage: null, bgAnimated: false, fontHeading: "Inter", fontBody: "JetBrains Mono",
      cardBg: "rgba(33,37,43,0.85)", cardBorder: "rgba(66,73,83,0.5)", cardBgHover: "rgba(40,44,52,0.9)",
      textPrimary: "#abb2bf", textSecondary: "#7f848e", textMuted: "rgba(127,132,142,0.45)",
      ringColor: "rgba(66,73,83,0.5)",
      socialBg: "rgba(33,37,43,0.6)", socialColor: "#7f848e",
      socialHoverBg: "rgba(97,175,239,0.15)", socialHoverColor: "#61afef",
    },
  },
  {
    name: "Dracula Official",
    theme: {
      bgFrom: "#282a36", bgVia: "#21222c", bgTo: "#282a36",
      bgImage: null, bgAnimated: false, fontHeading: "Inter", fontBody: "JetBrains Mono",
      cardBg: "rgba(33,34,44,0.85)", cardBorder: "rgba(68,71,90,0.5)", cardBgHover: "rgba(40,42,54,0.9)",
      textPrimary: "#f8f8f2", textSecondary: "#bd93f9", textMuted: "rgba(189,147,249,0.4)",
      ringColor: "rgba(68,71,90,0.5)",
      socialBg: "rgba(33,34,44,0.6)", socialColor: "#bd93f9",
      socialHoverBg: "rgba(255,121,198,0.15)", socialHoverColor: "#ff79c6",
    },
  },
  {
    name: "Tokyo Night",
    theme: {
      bgFrom: "#1a1b26", bgVia: "#24283b", bgTo: "#1a1b26",
      bgImage: null, bgAnimated: false, fontHeading: "Inter", fontBody: "JetBrains Mono",
      cardBg: "rgba(36,40,59,0.8)", cardBorder: "rgba(59,66,97,0.5)", cardBgHover: "rgba(26,27,38,0.9)",
      textPrimary: "#a9b1d6", textSecondary: "#7aa2f7", textMuted: "rgba(122,162,247,0.4)",
      ringColor: "rgba(59,66,97,0.5)",
      socialBg: "rgba(36,40,59,0.6)", socialColor: "#7aa2f7",
      socialHoverBg: "rgba(187,154,247,0.15)", socialHoverColor: "#bb9af7",
    },
  },
  {
    name: "Night Owl",
    theme: {
      bgFrom: "#011627", bgVia: "#0a1e2e", bgTo: "#011627",
      bgImage: null, bgAnimated: false, fontHeading: "Playfair Display", fontBody: "Space Grotesk",
      cardBg: "rgba(10,30,46,0.85)", cardBorder: "rgba(49,86,122,0.5)", cardBgHover: "rgba(1,22,39,0.9)",
      textPrimary: "#d6deeb", textSecondary: "#82aaff", textMuted: "rgba(130,170,255,0.4)",
      ringColor: "rgba(49,86,122,0.5)",
      socialBg: "rgba(10,30,46,0.6)", socialColor: "#82aaff",
      socialHoverBg: "rgba(199,146,234,0.15)", socialHoverColor: "#c792ea",
    },
  },
  {
    name: "Monokai Pro",
    theme: {
      bgFrom: "#2d2a2e", bgVia: "#221f22", bgTo: "#2d2a2e",
      bgImage: null, bgAnimated: false, fontHeading: "Outfit", fontBody: "JetBrains Mono",
      cardBg: "rgba(34,31,34,0.85)", cardBorder: "rgba(73,69,74,0.5)", cardBgHover: "rgba(45,42,46,0.9)",
      textPrimary: "#f8f8f2", textSecondary: "#ffd866", textMuted: "rgba(255,216,102,0.4)",
      ringColor: "rgba(73,69,74,0.5)",
      socialBg: "rgba(34,31,34,0.6)", socialColor: "#ffd866",
      socialHoverBg: "rgba(169,220,118,0.15)", socialHoverColor: "#a9dc76",
    },
  },
  {
    name: "Shades of Purple",
    theme: {
      bgFrom: "#1e1e3f", bgVia: "#2d2b55", bgTo: "#1e1e3f",
      bgImage: null, bgAnimated: false, fontHeading: "DM Sans", fontBody: "JetBrains Mono",
      cardBg: "rgba(45,43,85,0.8)", cardBorder: "rgba(80,75,135,0.5)", cardBgHover: "rgba(30,30,63,0.9)",
      textPrimary: "#e1d9ff", textSecondary: "#a479e3", textMuted: "rgba(164,121,227,0.4)",
      ringColor: "rgba(80,75,135,0.5)",
      socialBg: "rgba(45,43,85,0.6)", socialColor: "#a479e3",
      socialHoverBg: "rgba(242,95,205,0.15)", socialHoverColor: "#f25fcd",
    },
  },
  {
    name: "SynthWave '84",
    theme: {
      bgFrom: "#262335", bgVia: "#1e1c29", bgTo: "#262335",
      bgImage: null, bgAnimated: false, fontHeading: "DM Sans", fontBody: "JetBrains Mono",
      cardBg: "rgba(30,28,41,0.85)", cardBorder: "rgba(72,60,112,0.5)", cardBgHover: "rgba(38,35,53,0.9)",
      textPrimary: "#d9b8ff", textSecondary: "#ff7edb", textMuted: "rgba(255,126,219,0.4)",
      ringColor: "rgba(72,60,112,0.5)",
      socialBg: "rgba(30,28,41,0.6)", socialColor: "#ff7edb",
      socialHoverBg: "rgba(0,255,218,0.15)", socialHoverColor: "#00ffda",
    },
  },
  {
    name: "GitHub Dark",
    theme: {
      bgFrom: "#0d1117", bgVia: "#161b22", bgTo: "#0d1117",
      bgImage: null, bgAnimated: false, fontHeading: "DM Sans", fontBody: "DM Sans",
      cardBg: "rgba(22,27,34,0.85)", cardBorder: "rgba(48,54,61,0.5)", cardBgHover: "rgba(13,17,23,0.9)",
      textPrimary: "#c9d1d9", textSecondary: "#58a6ff", textMuted: "rgba(88,166,255,0.4)",
      ringColor: "rgba(48,54,61,0.5)",
      socialBg: "rgba(22,27,34,0.6)", socialColor: "#58a6ff",
      socialHoverBg: "rgba(88,166,255,0.15)", socialHoverColor: "#58a6ff",
    },
  },
  {
    name: "Catppuccin",
    theme: {
      bgFrom: "#1e1e2e", bgVia: "#181825", bgTo: "#1e1e2e",
      bgImage: null, bgAnimated: false, fontHeading: "Playfair Display", fontBody: "Inter",
      cardBg: "rgba(24,24,37,0.85)", cardBorder: "rgba(69,71,90,0.5)", cardBgHover: "rgba(30,30,46,0.9)",
      textPrimary: "#cdd6f4", textSecondary: "#89b4fa", textMuted: "rgba(137,180,250,0.4)",
      ringColor: "rgba(69,71,90,0.5)",
      socialBg: "rgba(24,24,37,0.6)", socialColor: "#89b4fa",
      socialHoverBg: "rgba(245,194,231,0.15)", socialHoverColor: "#f5c2e7",
    },
  },
  {
    name: "Ayu",
    theme: {
      bgFrom: "#1f2430", bgVia: "#191e2a", bgTo: "#1f2430",
      bgImage: null, bgAnimated: false, fontHeading: "Outfit", fontBody: "DM Sans",
      cardBg: "rgba(25,30,42,0.85)", cardBorder: "rgba(52,59,76,0.5)", cardBgHover: "rgba(31,36,48,0.9)",
      textPrimary: "#cbccc6", textSecondary: "#73d0ff", textMuted: "rgba(115,208,255,0.4)",
      ringColor: "rgba(52,59,76,0.5)",
      socialBg: "rgba(25,30,42,0.6)", socialColor: "#73d0ff",
      socialHoverBg: "rgba(185,213,110,0.15)", socialHoverColor: "#b9d56e",
    },
  },
]
