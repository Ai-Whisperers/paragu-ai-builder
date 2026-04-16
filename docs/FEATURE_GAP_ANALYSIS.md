# Feature Gap Analysis — Paragu-AI Builder

> Complete inventory of missing features, grouped by category and prioritized.
> Generated from full codebase audit — April 2026.

---

## Priority Legend

- **P0** — Blocks everything, must fix first
- **P1** — Required for MVP launch (show sites to real businesses)
- **P2** — Required for first paying customers
- **P3** — Growth & scale features
- **P4** — Nice to have / future

---

## GROUP 1: BUILD & DEPLOY (P0)

| # | Feature | Status | What's Needed |
|---|---------|--------|---------------|
| 1.1 | Cloudflare build passing | Fixed | Missing files pushed to Main |
| 1.2 | 4 missing npm scripts | Broken | `validate:schemas`, `validate:tokens`, `generate:site`, `generate:preview` referenced in package.json but files don't exist |
| 1.3 | Login route missing | Broken | Middleware redirects to `/login` which doesn't exist — admin unreachable |
| 1.4 | Test covers only 9/11 types | Bug | `validate.test.ts` doesn't test `salon_belleza` or `pestanas` |

---

## GROUP 2: DATA PIPELINE (P1)

| # | Feature | Status | What's Needed |
|---|---------|--------|---------------|
| 2.1 | Supabase project setup | Not started | Create project, run 2 migrations, get real credentials |
| 2.2 | Lead CSV import | Script written, not run | Run `import-leads.ts` against priority_a.csv to load 3,960 businesses |
| 2.3 | Generate lead-data.ts | Script written, not run | Run `generate-top-leads.ts` to create static site data for top 20 peluquerias |
| 2.4 | Static regeneration after import | Not implemented | New businesses need rebuild — no ISR/on-demand revalidation |
| 2.5 | DB migration for type updates | Missing | No migration to ALTER CHECK constraint when adding types |

---

## GROUP 3: SITE GENERATION ENGINE (P1)

| # | Feature | Status | What's Needed |
|---|---------|--------|---------------|
| 3.1 | Multi-page support | Not implemented | Only homepage generated. Registry defines services, gallery, team, contact as separate pages but engine only renders `homepage.sections` |
| 3.2 | Generation API endpoint | Not implemented | No `/api/generate` — sites can only be generated at build time via SSG |
| 3.3 | Generation logging | Table exists, unused | `generation_logs` table has columns for step/status/duration but nothing writes to it |
| 3.4 | Site versioning | Table exists, unused | `generated_sites` table tracks versions but nothing creates records |
| 3.5 | Palette selection | Backend ready, no UI | `resolveTokens()` accepts `paletteOverride` but no way to choose |
| 3.6 | Full Zod validation | TODO in code | `validate.ts` has a TODO to implement Zod schemas matching JSON Schema definitions |

---

## GROUP 4: AUTHENTICATION & ADMIN (P1)

| # | Feature | Status | What's Needed |
|---|---------|--------|---------------|
| 4.1 | Login page | Missing | No `/login` route — middleware redirects there but doesn't exist |
| 4.2 | Auth UI components | Missing | No login form, signup form, password reset |
| 4.3 | Admin CRUD | Read-only | Dashboard shows businesses but can't create, edit, or delete |
| 4.4 | Business creation form | Not implemented | No way to add a business through the UI |
| 4.5 | Site generation trigger | Not implemented | No "Generate Site" button in admin |
| 4.6 | Palette picker UI | Not implemented | No way to choose color palette per business |

---

## GROUP 5: GENERATED SITE FEATURES (P2)

| # | Feature | Status | What's Needed |
|---|---------|--------|---------------|
| 5.1 | Online booking integration | Not started | Fresha widget embed, or WhatsApp booking flow |
| 5.2 | Contact form submissions | No form | Content templates define form fields but component shows static info only |
| 5.3 | Google Maps embed | Partial | Works when `googleMapsUrl` provided, but most leads have link URLs not embed URLs |
| 5.4 | SEO structured data | Not implemented | Registry defines `schemaType` (BeautySalon, etc.) but no JSON-LD generated |
| 5.5 | Sitemap generation | Not implemented | No `/sitemap.xml` for generated sites |
| 5.6 | Open Graph / social meta | Partial | Title + description exist, but no OG image or Twitter cards |
| 5.7 | Before/After gallery | Registry defines it | Feature flag exists but no component built |
| 5.8 | Service filtering/tabs | Not implemented | Registry marks `filterable: true` but no tab UI |
| 5.9 | Blog/content pages | Not implemented | Content templates mention blog but no CMS |

---

## GROUP 6: MEDIA & ASSETS (P2)

| # | Feature | Status | What's Needed |
|---|---------|--------|---------------|
| 6.1 | Image upload system | Not implemented | Cloudinary env vars defined but no upload handling |
| 6.2 | Placeholder images | Not implemented | No placeholder system for businesses without photos |
| 6.3 | Image optimization | Not implemented | Using raw `<img>` tags instead of Next.js `<Image>` |
| 6.4 | Gallery from Google Photos | Not implemented | Lead data has `photo_count` but actual photo URLs not stored |
| 6.5 | Logo support | Schema ready, no UI | `branding.logoUrl` in schema but nothing uses it |
| 6.6 | Favicon per business | Not implemented | All sites share default favicon |

---

## GROUP 7: CUSTOMER ONBOARDING & OUTREACH (P2)

| # | Feature | Status | What's Needed |
|---|---------|--------|---------------|
| 7.1 | Business onboarding form | Designed in docs | `BUSINESS_INPUT_FORM.md` in leads repo defines full spec |
| 7.2 | WhatsApp outreach templates | Designed in docs | Leads repo has outreach messaging strategy |
| 7.3 | Landing page for builder | Not implemented | Current `/` is a stub linking to admin |
| 7.4 | Demo showcase page | Not implemented | No public page showing example sites |
| 7.5 | Custom domain support | Not implemented | All sites live under `builder-domain.com/{slug}` |
| 7.6 | QR code generation | Not implemented | For sharing site URLs via WhatsApp/print |

---

## GROUP 8: PAYMENTS & MONETIZATION (P3)

| # | Feature | Status | What's Needed |
|---|---------|--------|---------------|
| 8.1 | Pricing tiers | Designed in docs | FREE / BASIC ($29) / PRO ($59) / ENTERPRISE ($99) |
| 8.2 | Payment processing | Not started | No Stripe/MercadoPago integration |
| 8.3 | Subscription management | Not started | No recurring billing |
| 8.4 | Feature gating by tier | Not started | No differentiation between free and paid |
| 8.5 | Invoice generation | Not started | No billing system |

---

## GROUP 9: MONITORING & QUALITY (P3)

| # | Feature | Status | What's Needed |
|---|---------|--------|---------------|
| 9.1 | Error monitoring (Sentry) | Configured, unused | DSN env var exists, no `Sentry.init()` |
| 9.2 | Rate limiting (Upstash) | Configured, unused | Redis env vars exist, no middleware using them |
| 9.3 | Structured logging | Logger exists, unused | `logger.ts` is 7KB but not called from app code |
| 9.4 | Unit test coverage | 1 test file | Only `validate.test.ts` — no component/engine/API tests |
| 9.5 | E2E tests | Playwright config, no tests | Config exists, zero test files |
| 9.6 | Performance monitoring | Not started | No LCP/CLS/FID tracking |
| 9.7 | Analytics | Not started | No page view tracking for generated sites |
| 9.8 | Uptime monitoring | Not started | `/api/health` exists but nothing checks it |

---

## GROUP 10: GROWTH & SCALE (P4)

| # | Feature | Status | What's Needed |
|---|---------|--------|---------------|
| 10.1 | Multi-language support | Not started | Currently Spanish-only |
| 10.2 | A/B testing palettes | Not started | Show different palettes to different visitors |
| 10.3 | Business self-service editing | Not started | Let owners edit their own content |
| 10.4 | Loyalty/referral program | Not started | Designed in business plan docs |
| 10.5 | E-commerce / product catalog | Not started | Some business types sell products |
| 10.6 | Appointment reminders | Not started | SMS/WhatsApp reminders |
| 10.7 | Review collection | Not started | Prompt customers for Google reviews |
| 10.8 | Multi-location support | Schema ready | `multipleLocations` field but no UI |
| 10.9 | White-label / agency mode | Not started | Reseller accounts |
| 10.10 | AI content generation | Not started | Auto-generate taglines/descriptions |

---

## EXECUTION ORDER

```
P0 (This Week)          P1 (Next 2 Weeks)         P2 (Month 2)              P3 (Month 3+)
─────────────────       ──────────────────         ─────────────             ──────────────
1.1 Fix CF build        2.1 Supabase setup         5.1 Booking integration   8.1 Pricing tiers
1.2 Fix npm scripts     2.2 Import leads           5.2 Contact form          8.2 Payments
1.3 Add /login route    2.3 Generate lead sites    5.4 SEO structured data   9.1 Sentry
1.4 Fix tests           3.1 Multi-page support     6.1 Image uploads         9.4 Test coverage
                        4.1 Login page              7.1 Onboarding form       9.5 E2E tests
                        4.3 Admin CRUD              7.3 Landing page
                        4.5 Generate trigger
```

**Total: 55 features across 10 groups.**

Critical path to revenue: Fix build (P0) → Import data (P1) → Deploy (P0) → Outreach (P2) → Payments (P3).

---

_Last updated: April 2026_
