# Cloudflare Workers Deployment Guide

Deploy Paragu-AI Builder to Cloudflare Workers using OpenNext adapter.

## Endpoints

| Environment | URL | Custom Domain |
|-------------|-----|---------------|
| Production | `https://paragu-ai-builder.weissvanderpol-ivan.workers.dev` | `https://paragu-ai.com` |
| Staging | (configurable) | — |

## Quick Deploy

```bash
cd web

# Build and deploy to Workers dev
npm run deploy:cloudflare

# Preview locally
npm run preview:cloudflare

# Deploy to production worker
npm run deploy:cloudflare:prod
```

## Available Scripts

| Script | Description |
|--------|------------|
| `npm run build:cloudflare` | Build for Cloudflare Workers |
| `npm run preview:cloudflare` | Preview locally with Wrangler |
| `npm run preview:cloudflare:staging` | Preview staging locally |
| `npm run deploy:cloudflare` | Deploy to Workers.dev |
| `npm run deploy:cloudflare:staging` | Deploy to staging environment |
| `npm run deploy:cloudflare:prod` | Deploy to production environment |

## Environment Variables

### Build Time (in .env)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Runtime (in wrangler.toml vars)
```toml
[vars]
NEXT_PUBLIC_SITE_URL = "https://paragu-ai.com"
```

### Secrets (via CLI)
```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

## Custom Domain

The domain `paragu-ai.com` is already configured via Cloudflare Dashboard:

1. Go to **Workers & Pages** → **paragu-ai-builder**
2. **Custom Domains** → Add `paragu-ai.com`
3. SSL automatically provision

## Troubleshooting

```bash
# Check deployment status
curl -s -o /dev/null -w "%{http_code}" https://paragu-ai.com

# Test workers.dev URL
curl -s -o /dev/null -w "%{http_code}" https://paragu-ai-builder.weissvanderpol-ivan.workers.dev

# View real-time logs
npx wrangler tail
```

## Best Practices

1. **compatibility_date** must be `2025-04-01` or later for `process.env` support
2. Use `nodejs_compat` flag for Node.js APIs
3. Test locally with `preview:cloudflare` before deploying
4. Use staging environment for testing changes