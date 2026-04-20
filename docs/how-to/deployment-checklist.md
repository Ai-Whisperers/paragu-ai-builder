# Deployment Checklist

Pre-deployment checklist for Paragu-AI Builder.

## Pre-Deployment

### Code Quality

- [ ] All TypeScript errors resolved (`npm run typecheck`)
- [ ] All ESLint warnings resolved (`npm run lint`)
- [ ] All unit tests passing (`npm run test:unit`)
- [ ] No console.log statements in production code
- [ ] No TODO/FIXME comments that should be resolved

### Environment Variables

- [ ] `.env.local` created from `.env.example`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set correctly
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set correctly
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set correctly
- [ ] `NEXT_PUBLIC_SITE_URL` updated for production
- [ ] Optional: MercadoPago keys configured
- [ ] Optional: Analytics ID configured

### Database

- [ ] All migrations run on production database
- [ ] RLS policies verified
- [ ] Indexes created for performance
- [ ] Seed data loaded (if needed)
- [ ] Database backups configured

### Assets

- [ ] All images optimized
- [ ] Favicon and app icons generated
- [ ] Open Graph images uploaded
- [ ] robots.txt configured
- [ ] sitemap.xml generated

## Build Verification

### Local Build Test

```bash
# Clean build
rm -rf .next dist

# Production build
npm run build

# Verify build output
ls -la dist/
```

### Build Checks

- [ ] Build completes without errors
- [ ] Build size is reasonable (< 100MB)
- [ ] All static pages generated
- [ ] Dynamic routes working
- [ ] API routes responding

## Pre-Launch Testing

### Functionality

- [ ] Homepage loads correctly
- [ ] Business pages render properly
- [ ] Navigation works on all pages
- [ ] Forms submit correctly
- [ ] WhatsApp links work
- [ ] Images load properly
- [ ] Mobile responsive on all breakpoints

### Performance

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.5s
- [ ] No layout shifts (CLS < 0.1)

### SEO

- [ ] Meta titles present on all pages
- [ ] Meta descriptions present
- [ ] Open Graph tags working
- [ ] Schema.org JSON-LD valid
- [ ] Canonical URLs correct
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible

### Security

- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CORS policies set
- [ ] No secrets in client bundle
- [ ] RLS policies active
- [ ] Rate limiting enabled

## Deployment

### Cloudflare Pages

```bash
# Deploy via Wrangler
npm run deploy

# Or deploy via Git integration
# Push to main branch triggers auto-deploy
```

### Post-Deployment

- [ ] Site accessible at custom domain
- [ ] SSL certificate valid
- [ ] DNS propagated
- [ ] Redirects working (www to non-www)
- [ ] 404 page styled correctly

## Verification

### Smoke Tests

```bash
# Health check
curl https://paragu-ai.pages.dev/api/health

# Business page
curl https://paragu-ai.pages.dev/salon-maria

# Admin dashboard
curl https://paragu-ai.pages.dev/admin/leads
```

### Analytics Setup

- [ ] Google Analytics 4 connected
- [ ] Search Console verified
- [ ] Sitemap submitted to Search Console
- [ ] Real-time monitoring active

### Monitoring

- [ ] Error tracking configured (Sentry)
- [ ] Uptime monitoring enabled
- [ ] Performance monitoring active
- [ ] Alert thresholds set

## Rollback Plan

In case of issues:

1. **Immediate rollback:**
   ```bash
   # Revert to previous version in Cloudflare dashboard
   # Or rollback git commit
   git revert HEAD
   npm run deploy
   ```

2. **Database rollback:**
   - Restore from latest backup
   - Run down migrations if needed

3. **Communication:**
   - Notify team via Slack
   - Post status update
   - Document incident

## Post-Launch

- [ ] Monitor error rates for 24 hours
- [ ] Check performance metrics
- [ ] Verify lead tracking
- [ ] Confirm email notifications
- [ ] Review user feedback
- [ ] Document lessons learned

## Emergency Contacts

- DevOps: [contact info]
- Database: [contact info]
- Product: [contact info]
