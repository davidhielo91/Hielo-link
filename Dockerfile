FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `next build` prerenders pages that read profile data, so the build needs
# Redis access and JWT_SECRET. Coolify passes these as build arguments.
ARG REDIS_URL
ARG JWT_SECRET
ARG ADMIN_PASSWORD
ENV REDIS_URL=$REDIS_URL JWT_SECRET=$JWT_SECRET ADMIN_PASSWORD=$ADMIN_PASSWORD
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/data ./src/data
USER node
EXPOSE 3000
CMD ["npm", "start"]
