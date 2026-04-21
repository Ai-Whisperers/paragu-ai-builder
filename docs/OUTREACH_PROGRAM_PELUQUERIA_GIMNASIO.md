# Outreach Program: Peluquería & Gimnasio

Complete documentation for the Peluquería (1,653 leads) and Gimnasio (761 leads) outreach program.

## Quick Links

| Resource | URL | Description |
|----------|-----|-------------|
| Admin Dashboard | `/admin/leads` | Manage leads, generate previews, send WhatsApp |
| Peluquería Intake | `/onboarding/peluqueria` | Multi-step form for salon owners |
| Gimnasio Intake | `/onboarding/gimnasio` | Multi-step form for gym owners |
| Demo Peluquería | `/s/es/demo-peluqueria` | Live demo site |
| Demo Gimnasio | `/s/es/demo-gimnasio` | Live demo site |

## Program Overview

### What's Implemented

✅ **Demo Sites** - Complete 4-page websites for both verticals  
✅ **Intake Forms** - Multi-step wizards with 30-35 questions each  
✅ **Lead Pipeline** - Automatic preview generation from admin  
✅ **WhatsApp Tracking** - Click tracking and outreach analytics  
✅ **Admin Dashboard** - Full lead management with actions  

### Lead Statistics

| Vertical | Total Leads | Cities | Priority Distribution |
|----------|-------------|--------|----------------------|
| Peluquería | 1,653 | 35+ | Hot: 15%, Warm: 35%, Cool: 50% |
| Gimnasio | 761 | 20+ | Hot: 20%, Warm: 40%, Cool: 40% |

## Demo Sites

### Peluquería (Estilo Divino)

**Structure:**
```
sites/demo-peluqueria/
├── site.json                 # Site configuration
├── pages/
│   ├── home.json            # 10 sections
│   ├── servicios.json       # Service details + FAQ
│   ├── galeria.json         # Portfolio showcase
│   └── equipo.json          # Team profiles
└── content/
    ├── home.hero.json
    ├── home.services.json
    ├── home.portfolio.json
    ├── home.team.json
    ├── home.testimonials.json
    ├── home.cta.json
    ├── home.contact.json
    ├── navigation.json
    ├── footer.json
    ├── whatsapp.json
    ├── services.detailed.json
    ├── services.faq.json
    ├── booking.json
    └── seo.json
```

**Sections:** header, hero, services, portfolio, team, testimonials, cta-banner, contact, footer, whatsapp-float

**Features:**
- Service menu with PYG pricing (Corte Dama: 80.000 Gs, Keratina: 350.000 Gs)
- 4 stylists with photos and specialties
- 6 client testimonials with ratings
- WhatsApp Business integration
- Booking system integration

### Gimnasio (PowerGym)

**Structure:**
```
sites/demo-gimnasio/
├── site.json
├── pages/
│   ├── home.json            # 10 sections
│   ├── planes.json          # Membership details
│   ├── clases.json          # Class schedule
│   └── equipo.json          # Trainer profiles
└── content/
    ├── home.hero.json
    ├── home.membership.json
    ├── home.schedule.json
    ├── home.team.json
    ├── home.testimonials.json
    ├── home.cta.json
    ├── home.contact.json
    ├── navigation.json
    ├── footer.json
    ├── whatsapp.json
    ├── pricing.faq.json
    ├── booking.json
    └── seo.json
```

**Sections:** header, hero, membership-plans, class-schedule, team, testimonials, cta-banner, contact, footer, whatsapp-float

**Features:**
- 3 membership tiers (Básico: 180.000 Gs/mes, Premium: 320.000 Gs/mes)
- Weekly class schedule (CrossFit, Yoga, Spinning, etc.)
- 4 trainers with certifications
- 6 member testimonials
- Trial class booking

## Intake Forms

### Peluquería Intake

**URL:** `/onboarding/peluqueria`

**Sections (8):**
1. **Información Básica** - Business name, address, contact
2. **Servicios** - Service list, pricing, specialties
3. **Equipo** - Team members, stylists, certifications
4. **Horarios** - Opening hours, booking policies
5. **Galería** - Photo uploads (logo, salon, work samples)
6. **Promociones** - Current offers, packages
7. **Preferencias** - Design preferences, branding
8. **Redes Sociales** - Instagram, Facebook links

**Questions:** 30+

### Gimnasio Intake

**URL:** `/onboarding/gimnasio`

**Sections (9):**
1. **Información Básica** - Business name, address, contact
2. **Instalaciones** - Equipment, amenities, capacity
3. **Membresías** - Plans, pricing, benefits
4. **Clases** - Class types, schedule, instructors
5. **Entrenadores** - Personal trainers, certifications
6. **Horarios** - Operating hours, peak times
7. **Galería** - Facility photos, equipment, classes
8. **Promociones** - Trials, discounts, referrals
9. **Preferencias** - Design choices, branding

**Questions:** 35+

**How It Works:**
- Form data → `POST /api/onboarding/submit` → `lead_submissions` table
- Admin reviews submission → Generates preview site
- Client receives preview URL via WhatsApp

## Lead Pipeline

### Lead-to-Preview Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│  CSV Import │ → │  leads table │ → │  Admin Click │ → │    Preview   │
│  (1,653 +   │    │  (scored)    │    │  "Generar    │    │    Site      │
│   761 leads)│    │              │    │   Preview"   │    │  Generated   │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                                                                  ↓
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   Client    │ ← │  WhatsApp    │ ← │  Demo URL    │ ← │  sites/preview-│
│  Onboards   │    │   Sent       │    │   Sent       │    │  [lead-id]/   │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
```

### Admin Dashboard Actions

**Lead Detail Panel (`/admin/leads`):**

1. **Generar Preview** - Creates personalized demo site
   - Copies demo content
   - Replaces business name, contact info
   - Creates `sites/preview-[lead-id]/`
   - Updates lead status to `demo_ready`
   - Toast notification with URL

2. **WhatsApp** - Opens wa.me link with templated message
   - Auto-tracks click in `outreach_events`
   - Updates lead status to `contacted`
   - Template: "Hola [business]! Soy de Paragu-AI..."

3. **Favorito** - Mark lead as favorite for follow-up

4. **Etiquetas** - Add tags (e.g., "llamada_programada", "interesado")

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leads/[id]/generate-preview` | POST | Generate preview site for lead |
| `/api/onboarding/submit` | POST | Submit intake form |
| `/api/outreach/track` | POST | Track outreach events |
| `/api/admin/daily-metrics` | GET | Get outreach metrics |

## WhatsApp Outreach

### Message Templates

**Location:** `web/lib/outreach/templates.ts`

**Initial Outreach:**
```
Hola [business_name]! Soy de Paragu-AI. Veo que no tienen sitio web aún. 
Podemos crearles uno profesional para atraer más clientes. 
¿Tienen 5 minutos para conversar?
```

**Demo Ready:**
```
¡Hola [business_name]! 🎉 Su demo está lista. 
Pueden verla aquí: [preview_url]
¿Les gustaría que lo activemos?
```

### Tracking

**outreach_events table:**
- `event_type`: whatsapp_sent, demo_viewed, onboarding_started, etc.
- `message_template`: which template was used
- `message_content`: actual message sent
- `created_at`: timestamp
- Automatically updates `leads.status` to `contacted`

### Metrics Available

- Messages sent (by day, week, month)
- Response rate
- Demo views
- Onboarding starts
- Conversion to paying customers

## Quick Start for Sales Team

### 1. Find Leads

1. Go to `/admin/leads`
2. Use filters: Business Type = peluquería or gimnasio
3. Sort by Priority Score (highest first)
4. Look for "hot" priority tier

### 2. First Contact (WhatsApp)

1. Click lead row to open detail panel
2. Click **WhatsApp** button
3. Message opens in WhatsApp Web/App
4. Send initial outreach
5. Click is automatically tracked

### 3. Generate Preview (After Interest)

1. In lead detail panel, click **Generar Preview**
2. Wait for generation (shows spinner)
3. Toast notification shows preview URL
4. Copy URL and send via WhatsApp

### 4. Track Progress

- Check `outreach_events` table for activity history
- Use tags to mark status: "interesado", "demo_vista", "negociacion"
- Update lead status manually if needed

## Database Schema

### leads table

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  business_name TEXT NOT NULL,
  business_type TEXT,  -- 'peluqueria', 'gimnasio', etc.
  status TEXT,         -- 'new', 'contacted', 'demo_ready', 'responded', 'paying'
  priority_tier TEXT,  -- 'hot', 'warm', 'cool'
  priority_score INTEGER,
  city TEXT,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  has_website BOOLEAN,
  preview_site_id TEXT,
  preview_generated_at TIMESTAMPTZ,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### lead_submissions table

```sql
CREATE TABLE lead_submissions (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  vertical TEXT NOT NULL,
  form_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending',  -- 'pending', 'reviewed', 'converted'
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
```

### outreach_events table

```sql
CREATE TABLE outreach_events (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  event_type TEXT NOT NULL,  -- 'whatsapp_sent', 'demo_viewed', etc.
  channel TEXT,              -- 'whatsapp', 'email', etc.
  message_template TEXT,
  message_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Testing Checklist

### Demo Sites

- [ ] `/s/es/demo-peluqueria` loads without errors
- [ ] `/s/es/demo-gimnasio` loads without errors
- [ ] All sections render correctly
- [ ] WhatsApp buttons work
- [ ] Mobile responsive
- [ ] PYG pricing displays correctly

### Intake Forms

- [ ] `/onboarding/peluqueria` loads
- [ ] `/onboarding/gimnasio` loads
- [ ] All form sections accessible
- [ ] Validation works on required fields
- [ ] Submit creates record in `lead_submissions`

### Admin Dashboard

- [ ] `/admin/leads` loads with data
- [ ] Filters work (business type, city, status)
- [ ] Lead detail panel opens
- [ ] **Generar Preview** button works
- [ ] Preview site created in `sites/preview-*`
- [ ] **WhatsApp** button opens wa.me link
- [ ] Click tracked in `outreach_events`

### API Endpoints

- [ ] `POST /api/leads/[id]/generate-preview` returns 200
- [ ] `POST /api/onboarding/submit` creates submission
- [ ] `POST /api/outreach/track` creates event

## Troubleshooting

### Preview Generation Fails

1. Check lead has valid `business_type` (peluqueria/gimnasio)
2. Check file permissions on `sites/` directory
3. Check demo site files exist
4. Check API response for error message

### WhatsApp Link Not Working

1. Verify lead has `phone` or `whatsapp` field
2. Check phone number format (should be +595...)
3. Check browser console for tracking errors

### Intake Form Won't Submit

1. Check all required fields filled
2. Check browser console for validation errors
3. Verify API endpoint accessible
4. Check `lead_submissions` table for constraints

## File Locations

### Demo Sites
```
sites/demo-peluqueria/    # Salon demo
sites/demo-gimnasio/      # Gym demo
sites/preview-[id]/       # Generated previews
```

### Intake Forms
```
src/content/peluqueria-intake.json    # Form config
src/content/gimnasio-intake.json      # Form config
web/app/onboarding/peluqueria/page.tsx
web/app/onboarding/gimnasio/page.tsx
web/components/onboarding/intake-form.tsx
```

### Lead Pipeline
```
web/lib/generation/from-lead.ts              # Lead→Schema mapping
web/app/api/leads/[id]/generate-preview/     # Generation API
web/app/api/onboarding/submit/               # Intake submission
web/app/admin/leads/leads-dashboard-client.tsx  # Admin UI
```

### WhatsApp/Outreach
```
web/lib/outreach/templates.ts        # Message templates
web/app/api/outreach/track/route.ts  # Tracking endpoint
```

## Next Steps / Future Enhancements

### Phase 2 Ideas

1. **Automated Follow-ups** - Scheduled WhatsApp reminders
2. **A/B Testing** - Test different message templates
3. **Email Outreach** - Add email templates alongside WhatsApp
4. **Calendar Integration** - Schedule calls with leads
5. **Pipeline Dashboard** - Visual funnel view
6. **Bulk Actions** - Generate previews for multiple leads

### Metrics to Track

- Conversion rate: Lead → Contacted → Demo Generated → Paying
- Response rate by template
- Time to conversion
- Most effective city/vertical combinations

## Support

For technical issues:
1. Check this documentation
2. Review error logs in browser console
3. Check Supabase logs for database errors
4. Run validation: `npm run validate:sites`

For sales process questions:
1. Review `docs/SALES_PLAYBOOK.md`
2. Review `docs/DEMO_GIVEAWAY_SCRIPT.md`

---

**Last Updated:** April 21, 2026  
**Program Status:** ✅ Active and Ready for Outreach  
**Total Leads Available:** 2,414 (1,653 Peluquería + 761 Gimnasio)
