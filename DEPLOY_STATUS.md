# Deployment Complete

## ✅ Live Sites

| URL | Type | Status |
|-----|------|--------|
| `https://paragu-ai.com` | Custom Domain | ✅ Working |
| `https://paragu-ai-builder.weissvanderpol-ivan.workers.dev` | Workers.dev | ✅ Working |

**Business count:** 7,491 negocios

---

## ⚠️ Disable Pages Build (Required)

Cloudflare Pages keeps auto-building on git push but uses deprecated `@cloudflare/next-on-pages` which fails.

**Manually disable:**

1. Go to: https://dash.cloudflare.com → Workers & Pages
2. Click `paragu-ai-builder` 
3. **Settings** → **Build** → Toggle OFF

Or delete the project:
1. **Settings** → **Delete**

---

## Deploy Commands

```bash
cd web

# Deploy to Workers
npm run deploy:cloudflare

# Preview locally  
npm run preview:cloudflare
```

## CI/CD (Optional - Disable Pages First)

Add to GitHub for auto-deploy on push:
https://dash.cloudflare.com/profile/api-tokens

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [Main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd web && npm install && npm run deploy:cloudflare
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```