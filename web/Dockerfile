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
RUN --mount=type=cache,target=/root/.npm \
    npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Public build args — safe to embed (exposed in browser)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_APP_URL

# Private secrets passed via BuildKit --secret (not embedded in image)
#   docker build --secret id=supabase_key,env=SUPABASE_SERVICE_ROLE_KEY ...
#   Run with: echo $SUPABASE_SERVICE_ROLE_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-https://qyvokpribmbrosafntqa.supabase.co}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dm9rcHJpYm1icm9zYWZudHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTgxNTUsImV4cCI6MjA5MTg5NDE1NX0.ww_-gt4beuTcr_HbUCv0HmuKCw-J-HWTAI441yDSXRg}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-https://paragu-ai.com}
# Secrets are made available at build time via BuildKit --secret mounts
# and consumed in the build stage below.

# Copy source tree (repo root is build context)
COPY --from=deps /app/node_modules ./web/node_modules
COPY web ./web
COPY src ./src
COPY sites ./sites
# CHANGELOG.md is read at build time by web/app/changelog/page.tsx (via
# process.cwd() + '..'). Without this file the static-generation step
# throws ENOENT and the build fails. Keep this copy until the changelog
# page is refactored to embed content at generate-tenant-data time.
COPY CHANGELOG.md ./CHANGELOG.md

# Build inside web/
WORKDIR /app/web
COPY web/.cachebust ./.cachebust
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SRC_DIR=/app/src
ENV SITES_DIR=/app/sites
RUN --mount=type=secret,id=supabase_key,env=SUPABASE_SERVICE_ROLE_KEY \
    --mount=type=secret,id=google_places_key,env=GOOGLE_PLACES_API_KEY \
    npx next build && \
    for d in /app/web/.next/server/app/s/*/; do \
      base=$(basename "$$d"); \
      [ "$$base" != "[locale]" ] && rm -rf "$$d"; \
    done && \
    for d in /app/web/.next/standalone/.next/server/app/s/*/; do \
      [ -d "$$d" ] && base=$(basename "$$d"); \
      [ "$$base" != "[locale]" ] && rm -rf "$$d"; \
    done && \
    echo "Cleaned locale shadow dirs"

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

# Next.js 16 creates static locale dirs that shadow [locale] — remove them
RUN for d in /app/.next/server/app/s/*/; do \
      base=$(basename "$$d"); \
      [ "$$base" != "[locale]" ] && rm -rf "$$d"; \
    done && echo "Cleaned locale shadow dirs"

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
