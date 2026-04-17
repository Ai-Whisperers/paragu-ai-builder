# Paragu-AI Builder - All Clients, Tenants & Business Types

Complete inventory of all defined clients, tenants, business types, and planned leads.

## 📊 Summary

| Category | Count | Status |
|----------|-------|--------|
| **Active Multi-Tenant Sites** | 2 | ✅ Live (Nexa Paraguay, Nexa Uruguay) |
| **Demo/Example Businesses** | 13 | ✅ Ready for dev/testing |
| **Business Type Templates** | 20 | ✅ Ready to generate sites |
| **Priority A Leads (Database)** | 3,960 | 📋 Ready to import |
| **Database Seed Businesses** | 5 | ✅ In migration |
| **Vertical Architectures** | 4 | ✅ Configured |

---

## 🌐 Active Multi-Tenant Sites (Real Clients)

### 1. Nexa Paraguay 🇵🇾
**Status:** ✅ Fully Working (Fixed 404 issues)

| Property | Value |
|----------|-------|
| **Slug** | `nexa-paraguay` |
| **Vertical** | Relocation Services |
| **Domain** | nexaparaguay.com |
| **Country** | Paraguay |
| **Default Locale** | Dutch (nl) |
| **All Locales** | nl, en, de, es |
| **Pages** | 8 (home, programas, por-que-paraguay, proceso, sobre, faq, blog, contacto) |
| **Blog Posts** | 10 (Spanish) |
| **Live URLs** | `/s/nl/nexa-paraguay`, `/s/en/nexa-paraguay`, `/s/de/nexa-paraguay`, `/s/es/nexa-paraguay` |

**Content Languages:**
- 🇳🇱 Dutch: Complete (312 lines of content)
- 🇬🇧 English: Available
- 🇩🇪 German: Available  
- 🇪🇸 Spanish: Available + 10 blog posts

**Programs Offered:**
1. Paraguay Base (Residency + ID)
2. Paraguay Business (Company + Banking)
3. Paraguay Investor (12-month support)
4. Grondaankoop (Land acquisition)

---

### 2. Nexa Uruguay 🇺🇾
**Status:** ✅ Configured

| Property | Value |
|----------|-------|
| **Slug** | `nexa-uruguay` |
| **Vertical** | Relocation Services |
| **Domain** | nexa-uruguay.com |
| **Country** | Uruguay |
| **Default Locale** | English (en) |
| **All Locales** | en, es |
| **Pages** | 7 (home, programas, por-que-uruguay, proceso, sobre, faq, contacto) |

---

## 🎭 Demo/Example Businesses (Development/Testing)

Located in `web/lib/engine/demo-data.ts` - Used for local development and demos.

### Beauty & Wellness (7)

| Slug | Name | Type | City |
|------|------|------|------|
| `salon-maria` | Salon Maria | peluqueria | Asuncion |
| `gymfit-py` | GymFit Paraguay | gimnasio | Asuncion |
| `spa-serenidad` | Spa Serenidad | spa | Asuncion |
| `dayah-litworks` | Dayah Lit Works | estetica | Asuncion |
| `barberia-clasica` | Barberia Clasica | barberia | Asuncion |
| `unas-y-mas` | Unas y Mas | unas | Asuncion |
| `tinta-viva` | Tinta Viva | tatuajes | Asuncion |
| `belleza-integral` | Belleza Integral | salon_belleza | Asuncion |
| `studio-belleza` | Studio Belleza | maquillaje | Asuncion |
| `pestanas-flore` | Pestanas Flore | pestanas | Asuncion |

### Services (3)

| Slug | Name | Type | City |
|------|------|------|------|
| `de-abasto-a-casa` | De Abasto a Casa | meal_prep | Asuncion |
| `depilacion-perfecta` | Depilacion Perfecta | depilacion | Asuncion |
| `nexaparaguay` | Nexa Paraguay | relocation | Asuncion |

**Total Demo Businesses:** 13 (with full data: services, team, testimonials, hours)

---

## 🏢 Business Type Templates (Registry)

Located in `src/registry/index.json` - Templates for generating websites.

### Beauty & Wellness (12 types) 💅

| ID | Name (ES) | Name (EN) | Lead Count | No Website % | Priority A |
|----|-----------|-----------|------------|--------------|------------|
| `peluqueria` | Peluqueria | Hair Salon | 2,393 | 81% | 1,653 |
| `salon_belleza` | Salon de Belleza | Beauty Salon | 1,210 | 75% | 847 |
| `gimnasio` | Gimnasio/Fitness | Gym | 1,087 | 72% | 761 |
| `spa` | Spa/Wellness | Spa | 927 | 76% | 649 |
| `unas` | Unas | Nail Salon | 488 | 75% | 342 |
| `barberia` | Barberia | Barbershop | 778 | 77% | 545 |
| `tatuajes` | Tatuajes/Piercing | Tattoo Studio | 272 | 70% | 190 |
| `estetica` | Estetica/Facial | Aesthetic Clinic | 137 | 77% | 96 |
| `maquillaje` | Maquillaje | Makeup Artist | 130 | 72% | 91 |
| `depilacion` | Depilacion | Hair Removal | 20 | 78% | 7 |
| `pestanas` | Pestanas y Cejas | Lashes & Brows | 49 | 76% | 34 |
| `diseno_grafico` | Diseno Grafico | Graphic Design | 0 | - | - |

**Total Beauty Leads:** 7,491 businesses analyzed

### Service/Consulting (8 types) 💼

| ID | Name (ES) | Name (EN) | Status |
|----|-----------|-----------|--------|
| `relocation` | Servicios de Reubicacion | Relocation Services | ✅ Nexa live |
| `inmobiliaria` | Inmobiliaria | Real Estate | Ready |
| `legal` | Servicios Legales | Legal Services | Ready |
| `consultoria` | Consultoria | Business Consulting | Ready |
| `educacion` | Educacion | Education/Training | Ready |
| `salud` | Salud | Healthcare | Ready |
| `inversiones` | Inversiones | Financial Services | Ready |
| `meal_prep` | Meal Prep & Compras | Meal Prep | Ready |

---

## 📋 Database Schema (Supabase)

### Tables for Clients/Tenants

```sql
-- LEADS (3,960 Priority A from paragu-ai-leads)
- business_name, contact info, location, scoring
- status: new → enriched → demo_ready → contacted → responded → onboarding → paying

-- BUSINESSES (Active customers)
- 5 seed businesses in migration
- Linked to leads via lead_id

-- GENERATED_SITES (Site versions per business)
- Tracks each generation attempt
- Supports multiple versions per business

-- SUBSCRIPTIONS (Payment tracking)
- MercadoPago integration ready
- Plans: free, starter, professional, enterprise
```

### Seed Data (In Migration)

5 businesses pre-loaded:
1. `salon-maria` - Salon Maria (peluqueria)
2. `gymfit-py` - GymFit Paraguay (gimnasio)
3. `spa-serenidad` - Spa Serenidad (spa)
4. `unias-arte` - Unias Arte (unas)
5. `barberia-clasica` - Barberia Clasica (barberia)

---

## 🏗️ Vertical Architectures (Multi-Tenant System)

Located in `src/verticals/`

### 1. Relocation (`relocacion`)
**For:** Immigration, real estate, legal services
**Tenants:** Nexa Paraguay, Nexa Uruguay
**Features:**
- Multi-locale (i18n)
- Program comparison tables
- Process timeline
- Country-specific content
- Blog support

### 2. Hospitality
**For:** Hotels, restaurants, event venues
**Status:** Architecture ready

### 3. Portfolio-Professional
**For:** Designers, photographers, consultants
**Status:** Architecture ready

### 4. Service-Booking
**For:** Appointments, classes, rentals
**Status:** Architecture ready

---

## 🎯 Priority A Leads (Potential Clients)

From `paragu-ai-leads` repo - Ready to import:

### By Business Type

| Type | Priority A Leads | Est. Conversion |
|------|------------------|-----------------|
| peluqueria | 1,653 | ~33 (2%) |
| salon_belleza | 847 | ~17 (2%) |
| gimnasio | 761 | ~15 (2%) |
| spa | 649 | ~13 (2%) |
| barberia | 545 | ~11 (2%) |
| unas | 342 | ~7 (2%) |
| tatuajes | 190 | ~4 (2%) |
| estetica | 96 | ~2 (2%) |
| Others | 117 | ~2 (2%) |

**Total Priority A:** 3,960 leads
**Potential Customers (2% conversion):** ~79 businesses
**Revenue Potential (avg $59/month):** ~$4,600 MRR

### Lead Data Includes:
- Business name, address, phone
- Google Maps URL, ratings, reviews
- City/neighborhood (mostly Asuncion)
- Priority score (A/B/C/D tiers)

---

## 📅 Planned/Future Clients

### From Strategy Docs:

**Phase 3 Pilot (Weeks 5-6):**
- Target: 50 Priority A leads in beauty/wellness
- Verticals: Beauty + Relocation
- Goal: 2% conversion → 1 paying customer

**Dayah Lit Works:**
- Type: Book cover design (diseno_grafico)
- Status: Content created, needs deployment
- Purpose: Prove non-beauty vertical works

**Expansion Cities:**
- Ciudad del Este
- Encarnación
- San Lorenzo
- Luque
- Capiatá
- (Currently most leads are Asuncion-only)

---

## 🔗 URL Structure

### Multi-Tenant Sites
```
/s/{locale}/{site-slug}           → Home
/s/{locale}/{site-slug}/{page}    → Sub-pages
/s/{locale}/{site-slug}/blog/{slug} → Blog posts
```

### Generated Business Sites
```
/{business-slug}                  → Business home
/{business-slug}/{page}           → Business pages
```

### Examples
```
https://paragu-ai.pages.dev/s/nl/nexa-paraguay
https://paragu-ai.pages.dev/s/es/nexa-paraguay/blog/abrir-cuenta-bancaria-paraguay
https://paragu-ai.pages.dev/salon-maria
https://paragu-ai.pages.dev/gymfit-py
```

---

## 📊 Client Funnel Status

```
Current State:

Leads (3,960)
    ↓ (Import to Supabase)
Enriched (0) ← Need IG/FB enrichment, phone validation
    ↓
Demo Ready (0) ← Need preview site generation
    ↓
Contacted (0) ← WhatsApp outreach
    ↓
Responded (0)
    ↓
Onboarding (0) ← Form submission
    ↓
Paying (0) ← MercadoPago checkout
```

---

## ✅ Checklist: Making Clients Live

For each client type:

- [x] **Nexa Paraguay** - ✅ Multi-locale, full content, working
- [x] **Nexa Uruguay** - ✅ Configured, ready
- [ ] **Dayah Lit Works** - Need deployment test
- [ ] **Beauty Salons** - Import 3,960 leads, start outreach
- [ ] **Gyms/Spas** - Import leads, generate previews
- [ ] **New Verticals** - Choose next from leads analysis

---

## 🎯 Next Actions for Clients

1. **Import 3,960 leads** → Supabase
2. **Generate 50 preview sites** → For Priority A beauty leads
3. **Start WhatsApp outreach** → First 50 contacted
4. **Onboard first paying client** → Test full funnel
5. **Deploy Dayah Lit Works** → Prove non-beauty vertical

---

**Total Clients Defined:** 3,975 (2 live multi-tenant + 13 demo + 3,960 leads + 5 seed)
**Ready to Deploy Now:** Nexa Paraguay, Nexa Uruguay
**Ready to Import:** 3,960 Priority A leads
