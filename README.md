# Hielo.link

Link-in-Bio page personalizable. Sin depender de Linktree, Beacons, ni Carrd.

**Stack**: Next.js 16, React 19, Tailwind CSS 4, TypeScript, Redis.

## Características

- 10 temas visuales (Dracula, Tokyo Night, Catppuccin, etc.)
- Gradiente animado en fondo (toggle)
- Efecto 3D tilt en tarjetas
- Bio con efecto de escritura automática
- Drag & drop para reordenar enlaces
- Selector visual de iconos de redes sociales
- Pairing de fuentes (títulos + cuerpo)
- Botón de agenda (Calendly / Cal.com)
- Login con contraseña (personalizable desde el admin)
- Rate limiting + validación Zod + headers de seguridad

## Requisitos

- Node.js 22+
- Redis (Upstash o local)

## Variables de entorno

```bash
ADMIN_PASSWORD=tu-contraseña
JWT_SECRET=tu-secreto-jwt
REDIS_URL=redis://default:password@host:port
```

Ver `.env.example`.

## Instalación

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

El admin está en `/admin`. La primera vez se crean datos de ejemplo desde `src/data/profile.json`.

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint (flat config) |
| `npx tsc --noEmit` | TypeScript check |

## Deploy en Vercel

Conecta el repo a Vercel y agrega estas 3 variables de entorno en el dashboard:

- `REDIS_URL` — conexión a Redis (Upstash o local)
- `ADMIN_PASSWORD` — contraseña para el panel de admin
- `JWT_SECRET` — secreto para firmar sesiones

El proyecto tiene CI/CD integrado: en cada push a `main` corre lint, typecheck y build automáticamente.
