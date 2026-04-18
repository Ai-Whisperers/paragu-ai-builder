# Disable Cloudflare Pages Build

The Workers deployment works. Pages build fails because it uses deprecated `@cloudflare/next-on-pages`.

## Manual Fix Required

Go to Cloudflare Dashboard:

1. **URL:** https://dash.cloudflare.com
2. **Workers & Pages** → Find `paragu-ai-builder`
3. **Settings** → **Build** → **Disable**

Or delete the Pages project entirely (we only need Workers):

1. **Workers & Pages** → `paragu-ai-builder` 
2. **Settings** → **Delete**

## What's Already Working

- ✅ Workers deploy: `npm run deploy:cloudflare` 
- ✅ Domain: `https://paragu-ai.com`
- ✅ Workers.dev: `https://paragu-ai-builder.weissvanderpol-ivan.workers.dev`

## CI/CD (GitHub Actions)

Once Pages is disabled, add to GitHub for auto-deploy:

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
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Generate tokens at: Cloudflare Dashboard → Profile → API Tokens