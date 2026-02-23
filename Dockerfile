# ---- Stage 1: Install dependencies ----
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 2: Build the application ----
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client and build Next.js
RUN npx prisma generate
RUN npm run build

# Compile seed.ts → seed.js for the production runner (esbuild ships with tsx)
RUN node -e " \
  require('esbuild').buildSync({ \
    entryPoints: ['prisma/seed.ts'], \
    bundle: true, \
    platform: 'node', \
    outfile: 'prisma/seed.js', \
    external: ['@prisma/client', 'bcryptjs'], \
  })"

# ---- Stage 3: Production runner ----
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Public assets (served by Next.js)
COPY --from=builder /app/public ./public

# Standalone build output (server.js + minimal node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma schema + compiled seed script
COPY --from=builder --chown=nextjs:nodejs /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma/seed.js ./prisma/seed.js

# Prisma CLI (needed for `db push` at container startup)
COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma

# Entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Ensure the prisma data directory is writable for SQLite
RUN mkdir -p /app/prisma && chown -R nextjs:nodejs /app/prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
