# =============================================================================
# Paragu-AI Builder — Production Dockerfile
# Multi-stage build for optimized Next.js deployment on VPS (Hostinger)
#
# Build context must be the REPO ROOT (so src/ and sites/ are available):
#   docker build -f web/Dockerfile \
#     --build-arg NEXT_PUBLIC_SUPABASE_URL=... \
#     --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
#     --build-arg NEXT_PUBLIC_APP_URL=... \
#     -t paragu-ai:prod .
#
# Layout inside the runner:
#   /app/server.js          Next.js standalone entrypoint
#   /app/.next/static/      static assets (JS/CSS bundles)
#   /app/public/            static public files
#   /app/src/               design tokens, schemas, registry, verticals
#   /app/sites/             per-tenant JSON (site.json, pages, content)
# =============================================================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++
COPY web/package.json web/package-lock.json* ./
RUN npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Copy source tree (repo root is build context)
COPY --from=deps /app/node_modules ./web/node_modules
COPY web ./web
COPY src ./src
COPY sites ./sites

# Build inside web/
WORKDIR /app/web
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SRC_DIR=/app/src
ENV SITES_DIR=/app/sites
RUN npm run build

# Stage 3: Runner (Production)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV SRC_DIR=/app/src
ENV SITES_DIR=/app/sites

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Standalone output contains server.js + minimal node_modules.
# Copy alongside: public/, .next/static/, src/, sites/ so the runtime
# can serve static assets + read tenant + token JSON.
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/web/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/sites ./sites

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
