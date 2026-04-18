# Deployment Guide - Paragu-AI Builder

Quick start guide to deploy the platform to production on Cloudflare Pages with Supabase backend.

## Prerequisites

- Node.js 20+
- Supabase account (free tier works)
- Cloudflare account (free tier works)
- GitHub repository access
- (Optional) MercadoPago account for payments

## Phase 0: Supabase Setup (5 minutes)

### 1. Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Name: `paragu-ai-builder`
4. Region: Choose closest to your users (for Paraguay: `South America (São Paulo)`)
5. Plan: Free tier
6. Wait for project to be created (~2 minutes)

### 2. Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/000_complete_schema.sql`
4. Paste into SQL Editor
5. Click "Run"

✅ You should see "Success" and all tables created.

### 3. Get API Keys

1. Go to **Project Settings > API**
2. Copy these values for the next phase:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Project API Keys > anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `Project API Keys > service_role secret` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep secret!

## Phase 1: Cloudflare Pages Setup (5 minutes)

### 1. Create Pages Project

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **Pages > Create a project**
3. Connect to your GitHub repository: `Ai-Whisperers/paragu-ai-builder`
4. Select the `Main` branch
5. **Build settings:**
   - Build command: `cd web && npm run build`
   - Build output directory: `web/dist`

### 2. Set Environment Variables

In Cloudflare Pages project settings, add these:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Deploy

1. Click "Save and Deploy"
2. Wait for build (~2 minutes)
3. Your site will be live at `https://paragu-ai.pages.dev`

## Phase 2: Import Leads (2 minutes)

### 1. Prepare Lead Data

Ensure you have the leads CSV from `paragu-ai-leads`:

```bash
cd /path/to/paragu-ai-builder/web
```

### 2. Run Import Script

```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Run the import
npm run import:leads -- --file=../../paragu-ai-leads/data/processed/paraguay_priority_a.csv
```

Options:
- `--dry-run`: Preview without inserting
- `--limit=100`: Import only 100 leads for testing
- `--batch-size=50`: Adjust batch size (default: 100)

### 3. Verify in Admin Dashboard

Go to `https://your-site.pages.dev/admin/leads`

You should see your imported leads!

## Phase 3: Post-Deployment Verification

### Checklist

- [ ] Site loads at Cloudflare URL
- [ ] `/admin` is accessible (add auth in production)
- [ ] `/admin/leads` shows imported leads
- [ ] Supabase tables have data
- [ ] No build errors in Cloudflare logs

### Quick Smoke Test

```bash
# Test API endpoints
curl https://your-site.pages.dev/api/health

# Should return: {"status":"ok"}
```

## Phase 4: Production Hardening (Before going live)

### 1. Add Authentication

Currently the admin dashboard is open. Add auth:

Option A: Supabase Auth (recommended)
- Set up email/password auth in Supabase
- Wrap admin routes with auth check

Option B: Cloudflare Access
- Use Cloudflare Zero Trust to protect `/admin/*`
- No code changes needed

### 2. Set Up Custom Domain (Optional)

In Cloudflare Pages:
1. Go to **Custom domains**
2. Add your domain: `paragu.ai` or `tu-dominio.com`
3. Follow DNS setup instructions

### 3. Enable MercadoPago (For payments)

1. Create account at [MercadoPago Developers](https://www.mercadopago.com/developers)
2. Get credentials from dashboard
3. Add to Cloudflare env vars:
   ```
   MERCADOPAGO_PUBLIC_KEY=...
   MERCADOPAGO_ACCESS_TOKEN=...
   ```
4. Set up webhook URL: `https://your-site.pages.dev/api/webhooks/mercadopago`

## Troubleshooting

### Build Fails

```bash
# Test build locally
cd web
npm run build

# Check for TypeScript errors
npm run type-check
```

### Supabase Connection Issues

```bash
# Verify credentials
curl -X GET "https://your-project.supabase.co/rest/v1/leads?select=id" \
  -H "apikey: your-anon-key"
```

### Missing Data

1. Check Supabase Table Editor - tables exist?
2. Run import script again with `--dry-run` to see what would import
3. Check Cloudflare Functions logs for errors

### Performance Issues

- Enable Cloudflare caching rules for static assets
- Use Supabase connection pooling for high traffic
- Consider upgrading to Cloudflare Pro for better analytics

## Next Steps After Deployment

1. **Week 1**: Import all 3,960 leads, start contacting Priority A
2. **Week 2-3**: Generate preview sites for warm leads
3. **Week 4**: Set up WhatsApp outreach templates
4. **Week 5-6**: Onboarding form + MercadoPago integration
5. **Week 7-8**: Self-service editing + subscription management

See `docs/STRATEGY_NEXT_STEPS.md` for complete 8-week roadmap.

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Cloudflare Pages**: https://developers.cloudflare.com/pages
- **Next.js on Cloudflare**: https://developers.cloudflare.com/pages/framework-guides/nextjs/
