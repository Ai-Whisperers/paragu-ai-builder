# Plan: Optimize Docker Build Time and Image Size

## Current State

- Build time: ~90 seconds (no cache)
- Image size: unknown but Next.js standalone output includes all dependencies
- Build runs with `--no-cache` every time (development workflow)
- Multi-stage build exists but can be improved

## Measurements

From the last build:
```
Step 10 (deps):  51.6s  ← npm install (biggest single step)
Step 11 (build): 37.8s  ← Next.js build
Step 12 (runner deps):  5.8s
Total: ~90 seconds
```

## Optimizations

### 1. Cache npm Dependencies Layer (BIGGEST WIN)

Current Dockerfile:
```dockerfile
COPY web/package.json web/package-lock.json* ./
RUN npm install --legacy-peer-deps
```

This copies package.json and runs npm install at the same layer every time. If we split:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY web/package.json web/package-lock.json* ./
RUN npm install --legacy-peer-deps

# Stage 2: Builder  
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./web/node_modules
```

The `COPY web/package.json ...` line will use Docker's build cache — if package.json hasn't changed, `npm install` is skipped. With `--no-cache` this doesn't help, but without it the savings are ~50 seconds per rebuild.

**Recommendation**: Stop using `--no-cache`. Instead, use selective cache invalidation:

```bash
# Only invalidate cache when source code changes (not config):
docker build -t paragu-ai:prod -f web/Dockerfile .
```

If you need to force-reinstall deps (unlikely): `docker build --no-cache-filter=deps ...`

### 2. Reduce Image Size with Output Tracing

Next.js already has `output: 'standalone'` which traces dependencies. But the standalone output includes ALL node_modules that any traced file might need. Add:

```dockerfile
# web/next.config.mjs or .js
const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu/**',
        'node_modules/@next/swc-linux-x64-gnu/**',
        'node_modules/caniuse-lite/**',
        'node_modules/typescript/**',
      ],
    },
  },
}
```

### 3. Use Dependencies Cache Mount

```dockerfile
RUN --mount=type=cache,target=/root/.npm \
    npm install --legacy-peer-deps
```

This caches npm's download cache across builds — even with `--no-cache` the npm packages won't be re-downloaded.

### 4. Install Only Production Dependencies in Runner

The runner stage only needs production deps:

```dockerfile
# Stage 3: Runner
FROM node:20-alpine AS runner
COPY --from=builder /app/web/.next/standalone ./
COPY --from=builder /app/web/.next/static ./.next/static
COPY --from=builder /app/web/public ./public

# Only install production dependencies
RUN npm install --omit=dev
```

## Expected Improvements

| Optimization | Time Saved | Cache-Friendly |
|---|---|---|
| Cache npm layer | ~45s (no npm install) | Yes |
| Cache mount | ~10s (no download) | Yes |
| Output tracing excludes | ~5s | N/A |
| **Total with cache** | **~60s** (90→30s) | |
| **Without cache** | **~10s** (just cache mount) | |

## Files to Touch

| File | Change |
|---|---|
| `web/Dockerfile` | Add cache mounts, remove `--no-cache` from readme |
| `web/next.config.mjs` (or .js) | Add `outputFileTracingExcludes` |

## Effort

- **Effort**: Small (30 min)
- **Risk**: Low
