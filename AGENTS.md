<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Hielo.link — Link-in-Bio page

Stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript, Redis.

## Commands

| Command | What |
|---|---|
| `npm run dev` | dev server on `localhost:3000` |
| `npm run build` | production build |
| `npm run lint` | eslint only (flat config, `eslint.config.mjs`) |

No `typecheck` script — run `npx tsc --noEmit` if needed. No tests exist.

## Tailwind CSS v4

Uses `@import "tailwindcss"` in CSS (not `@tailwind` directives). PostCSS plugin is `@tailwindcss/postcss`. `@theme inline` block in `globals.css` defines theme tokens. Custom keyframes (`gradient-shift`, `cursor-blink`) and reduced-motion media query in `globals.css`.

## Data & Storage

Data stored in **Redis** (`REDIS_URL` env var) under key `profile`. Seeded from `src/data/profile.json` on first read — JSON schema matches the `ProfileData` type in `src/lib/storage.ts`. The `seedIfEmpty` function merges file data with existing Redis data (file acts as baseline defaults + migration). All writes go to Redis only. The `@vercel/kv` dependency is unused — raw `redis` client is used directly.

Admin password hash stored separately under Redis key `admin:auth` (see Auth section).

## Auth

Two modes, checked in order:
1. **Custom password** saved in Redis (`admin:auth` key) — set via Admin → Seguridad
2. **Env var fallback** — `ADMIN_PASSWORD` (used only if no Redis password exists)

Other env vars:
- `JWT_SECRET` — HS256 signing key for `jose` library
- `REDIS_URL` — Upstash/Redis connection string

Login has **rate limiting** (5 attempts/min per IP, in-memory Map in `src/lib/rate-limit.ts`). Session stored in httpOnly cookie via `jose` SignJWT/jwtVerify, expires in 7 days. Admin password is hashed with `crypto.scryptSync` + random salt (no dependencies).

## Profile Data Fields

`src/lib/storage.ts:ProfileData` includes:
- `name`, `bio`, `avatar` (string|null)
- `calendlyUrl` (string|null) — Calendly/Cal.com link, renders CalendarCard
- `theme` — colors, fonts, bgImage, bgAnimated, fontHeading/fontBody
- `links[]` — `{ id, title, url }`, sortable via drag & drop (@dnd-kit)
- `socials[]` — `{ platform, url }`, platform picked from dropdown in admin

## API Routes

| Route | Method | Auth | Notes |
|---|---|---|---|
| `/api/data` | GET | No | Reads profile from Redis |
| `/api/data` | PUT | Yes | Writes profile, validated with Zod schema |
| `/api/auth/login` | POST | No | Rate-limited (5/min) |
| `/api/auth/logout` | POST | No | Destroys session |
| `/api/auth/me` | GET | No | Returns 401 or 200 |
| `/api/auth/change-password` | POST | Yes | Validates current + saves new to Redis |

## Env files

`.env*` files are gitignored (except `.env.example`). Local overrides go in `.env.local`.

## Code conventions

- No Prettier config. No format script.
- `@/` path alias maps to `src/`
- Theming via CSS custom properties set inline (`--bg-from`, `--text-primary`, etc.)
- Font pairing via `--font-heading` / `--font-body` CSS vars. Profile `<h1>` uses `--font-heading`.
- App Router: `src/app/` layout → `page.tsx` (public `force-dynamic`), `admin/` (client-side panel), `api/` (auth + data)
- `next/font/google` with Geist/Geist_Mono sets `--font-geist-sans` / `--font-geist-mono`
- `lucide-react` for UI icons, `react-icons/fa` for social platform icons (mapped in `src/lib/socials.tsx`)
- Client components: Profile, LinkCard, SocialIcons, AvatarUpload, CalendarCard, admin pages
- Zod validation schema in `src/lib/validation.ts` mirrors `ProfileData` type — update both together

## Features implemented

- **Animated gradient background** — toggle in Admin → Tema, via `bgAnimated` + `@keyframes gradient-shift`
- **Typing effect on bio** — `Profile.tsx` types bio char-by-char on load (35ms/char, cursor blinks)
- **3D tilt on link cards** — `LinkCard.tsx` tracks mouse position, applies `perspective(600px) rotateX/Y`
- **Drag & drop reorder** — links sortable in admin via `@dnd-kit/core` + `@dnd-kit/sortable`
- **Social platform selector** — dropdown with icons in admin, from `src/lib/socials.tsx`
- **Font pairing** — heading/body dropdowns in admin theme section
- **10 theme presets** in `src/lib/presets.ts` with curated color + font pairings
- **Calendly/Cal.com** — `calendlyUrl` field in admin Profile section, renders CalendarCard
- **QR code was removed** — don't look for it

## Skills installed

- `.opencode/skills/ui-ux-pro-max/` — design system guidance
- `.agents/skills/nodejs-best-practices/` — Node.js decision-making
- `.agents/skills/find-skills/` — skill discovery
