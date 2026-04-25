# Product Critique & Feature Roadmap

---

## Current State Assessment

### What Works Well ✅
- 201 personalized preview sites with real Google data
- Multi-tenant engine (one codebase serves all)
- 107 reusable section components
- Real Google reviews, photos, hours, prices
- Booking system (API + wizard + admin)
- Gift cards, packages, Google reviews sections
- Multi-location branch selector
- Product catalog / e-commerce per type
- Admin panel (leads, bookings, orders, tenants)

### What's Broken/Incomplete ⚠️
- **Booking notifications** — customer books via wizard, business owner never knows
- **Tenant portal** — exists but needs activation flow for each lead
- **Custom domains** — no DNS automation
- **Analytics** — tracking API always 500s (env issue)
- **Photo management** — no UI for owners to upload their own photos
- **Email notifications** — Resend key is CHANGE_ME, not configured
- **Cron jobs** — all commerce crons 500 (env issue)
- **Supabase env** — needs to be set during Docker build, not at runtime

---

## Feature Gaps vs Competitors (1st-World Standards)

### Critical — Must Build Before Client Handoff

| Feature | Why | Effort |
|---------|-----|--------|
| **WhatsApp Booking Notification** | Owner needs to know when someone books | 1 day |
| **Tenant Self-Service Activation** | Let clients log in and see their site | 2 days |
| **Analytics Dashboard** | "How many people visited my site?" | 3 days |
| **Photo Upload UI** | Let clients replace stock photos | 2 days |
| **Custom Domain Setup** | fun4me.com.py → their own name | 1 day |

### High Value — Should Build

| Feature | Why | Effort |
|---------|-----|--------|
| **Content Editor** | Clients edit their own text | 5 days |
| **Booking Reminder (SMS/WhatsApp)** | Reduce no-shows 30% | 2 days |
| **Google Business Profile Sync** | Auto-sync reviews | 2 days |
| **Instagram Feed Integration** | Show their IG posts on site | 2 days |
| **Multi-language Toggle** | ES/EN for border cities | 2 days |

### Premium — Competitive Differentiator

| Feature | Why | Effort |
|---------|-----|--------|
| **Before/After Gallery** | Critical for depilación, estética | 1 day |
| **Staff Booking Calendar** | Each staff member's schedule | 3 days |
| **Inventory Management** | For retail types | 3 days |
| **Loyalty Program** | Points → repeat customers | 2 days |
| **SEO Suite** | Keywords, sitemap, GSC integration | 3 days |

---

## Architecture Issues to Fix

| Issue | Problem | Fix |
|-------|---------|-----|
| **Cron env 500s** | NEXT_PUBLIC_SUPABASE_URL not available at runtime in standalone | Set ENV in Dockerfile build stage |
| **Photo hotlinking** | Google Photos URLs redirect to lh3.googleusercontent.com | Cache to Supabase storage |
| **Slow builds** | Docker build runs npm ci + build every time | Multi-stage with better caching |
| **No CI pipeline** | Manual VPS deploy only | GitHub Actions auto-deploy |
| **Preview site cleanup** | 201 previews + 35 demos = 236 site dirs | Archive demos not actively used |
| **No monitoring** | No uptime alerts for preview sites | Health check + email alert |

---

## Build Order (Next 30 Days)

### Week 1: Booking Notifications + Tenant Portal
- WhatsApp notification to owner on booking
- Activate tenant login for top 10 leads
- Simple analytics (page views, bookings)

### Week 2: Content Management
- Photo upload to Supabase storage
- Content editor for services, hours, team
- Custom domain DNS guide

### Week 3: Polish & Launch
- Fix cron env issue permanently
- Deploy CI/CD pipeline
- Send outreach to all 201 leads

### Week 4: Premium Features
- Before/after gallery for depilación
- Instagram feed integration
- Booking calendar for staff
