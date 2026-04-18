# ParaguAI Builder - Homepage Improvement Plan

## Executive Summary

This document outlines a comprehensive improvement plan for the ParaguAI Builder homepage (paragu-ai.com). The goal is to increase conversions, build trust, and provide a complete user journey from landing to signup.

---

## Current State Analysis

### What's Working ✅
- Clean, professional design with good color scheme
- Clear value proposition in hero section
- Market research data (7,463 businesses, 75% without website)
- 18 template categories shown
- Mobile responsive
- Fast loading (Cloudflare Workers)

### What's Missing ❌
- No pricing section
- No testimonials/social proof
- No contact/lead capture
- No FAQ
- Template cards not clickable
- No About Us
- No Open Graph images
- No structured data for SEO

---

## Detailed Improvement Plan

### Phase 1: Critical Conversions (High Impact)

#### 1.1 Pricing Section

**Why:** Without pricing, visitors cannot convert. This is the #1 blocker for sales.

**Implementation:**
```
Planes:
├─ Gratis (Básico)
│  ├─ Subdomain (negocio.paragu-ai.com)
│  ├─ 1 pagina basica
│  ├─ WhatsApp button
│  └─ Anuncios ParaguAI
│
├─ Profesional (299.000 Gs/mes)
│  ├─ Dominio propio (.com.py)
│  ├─ Paginas ilimitadas
│  ├─ Sin anuncios
│  ├─ SEO avanzado
│  ├─ WhatsApp business
│  └─ Analytics
│
└─ Enterprise (Custom)
   ├─ Todo lo anterior
   ├─ Dashboard personalizado
   ├─ API access
   └─ Soporte prioritario
```

**Location:** Between Features and Market Opportunity sections

---

#### 1.2 Testimonials Section

**Why:** Builds trust and provides social proof. Even demo testimonials help.

**Implementation:**
```typescript
const TESTIMONIALS = [
  {
    name: "María González",
    business: "Peluquería María",
    location: "Asunción",
    quote: "En 15 minutos tenía mi sitio web listo. Mis clientes me encuentran en Google ahora.",
    template: "peluqueria",
    rating: 5,
  },
  {
    name: "Carlos Ramírez",
    business: "Gimnasio FitLife",
    location: "Luque",
    quote: "El dominio propio me dio mucha credibilidad. Mis inscriptos aumentaron un 40%.",
    template: "gimnasio",
    rating: 5,
  },
  // ... more testimonials
]
```

**Location:** After Market Opportunity, before CTA

---

#### 1.3 Contact / Lead Capture

**Why:** Capture visitors who aren't ready to buy yet.

**Implementation Options:**
1. **Simple:** Email input with "Te avisamos cuando lancemos"
2. **WhatsApp:** "Escríbenos por WhatsApp" button
3. **Form:** Name, email, business type, message

**Location:** 
- Floating button (always visible)
- Bottom of page (before footer)

---

#### 1.4 FAQ Section

**Why:** Reduces support burden, answers common questions.

**Questions to Answer:**
1. ¿Cuánto tiempo tarda en estar listo mi sitio?
2. ¿Necesito conocimientos técnicos?
3. ¿Puedo cambiar el diseño después?
4. ¿Qué incluye el dominio propio?
5. ¿Cómo funciona el pago?
6. ¿Puedo usar mi propio dominio?

**Location:** After How It Works, before Features

---

#### 1.5 Clickable Template Cards

**Why:** Users need to see live demos to convert.

**Implementation:**
- Each template card links to a demo site of that type
- Use the existing demo businesses from the database
- Add "Ver demo" button

---

### Phase 2: Trust & Credibility (Medium Impact)

#### 2.1 About Us Section

**Content:**
- Company mission: " democratizar la presencia digital en Paraguay"
- Story: Started April 2026, identified 7,000+ businesses
- Team: Photos and brief bios (optional)
- Values: Fast, affordable, local

**Location:** End of page (before CTA)

---

#### 2.2 Social Proof / Trusted By

**Implementation:**
```
┌─────────────────────────────────────────┐
│  +500 negocios ya confían en ParaguAI  │
├─────────────────────────────────────────┤
│  [Logo Grid - placeholder businesses]   │
└─────────────────────────────────────────┘
```

**Location:** After How It Works

---

#### 2.3 Case Studies (Optional)

**Format:** 2-3 detailed success stories
- Before/after metrics
- Business type
- Results achieved

---

### Phase 3: SEO & Technical (Medium Impact)

#### 3.1 Open Graph Metadata

**Add to layout.tsx:**
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://paragu-ai.com'),
  title: {
    default: 'ParaguAI Builder - Sitios Web con IA para Negocios',
    template: '%s | ParaguAI Builder'
  },
  description: 'Motor de generación con IA que crea sitios web profesionales...',
  openGraph: {
    type: 'website',
    locale: 'es_PY',
    url: 'https://paragu-ai.com',
    siteName: 'ParaguAI Builder',
    title: 'ParaguAI Builder - Sitios Web con IA',
    description: '...',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ParaguAI Builder'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ParaguAI Builder',
    description: '...',
    images: ['/og-image.png']
  }
}
```

---

#### 3.2 Structured Data (JSON-LD)

**Organization Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ParaguAI Builder",
  "url": "https://paragu-ai.com",
  "logo": "https://paragu-ai.com/logo.png",
  "description": "Motor de generación de sitios web con IA...",
  "areaServed": {
    "@type": "Country",
    "name": "Paraguay"
  },
  "serviceType": "Website Builder"
}
```

**WebSite Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ParaguAI Builder",
  "url": "https://paragu-ai.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://paragu-ai.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

### Phase 4: Polish & Features (Low Priority)

#### 4.1 Language Toggle

**Implementation:**
- Add `/en` route for English version
- Add language selector in nav
- Flag icons: 🇵🇾 / 🇺🇸

**Scope:** Homepage initially, full site if needed

---

#### 4.2 Live Chat Widget

**Options:**
- WhatsApp floating button (simplest)
- Tawk.to integration
- Custom widget

---

#### 4.3 Interactive Demo

**Feature:** "Try the generator" - select business type, see instant preview

---

## Implementation Order

### Week 1 - Critical
1. ✅ Plan document (this file)
2. Add Pricing Section
3. Add Testimonials Section
4. Add FAQ Section
5. Make Templates Clickable
6. Add Contact/Lead Capture

### Week 2 - Trust
7. Add About Us Section
8. Add Social Proof Section
9. Fix Template Count

### Week 3 - Technical
10. Add Open Graph Metadata
11. Add Structured Data
12. Add Language Toggle

### Week 4 - Polish
13. Live Chat Widget
14. Interactive Demo (if time)

---

## Success Metrics

Track these KPIs to measure improvement:

| Metric | Current | Target |
|--------|---------|--------|
| Homepage bounce rate | TBD | < 50% |
| Click-through to pricing | 0% | > 15% |
| Click-through to demo | TBD | > 25% |
| Lead form submissions | 0 | > 10/day |
| Time on page | TBD | > 2 min |

---

## Files to Modify

1. **`web/app/page.tsx`** - Main homepage (add all new sections)
2. **`web/app/layout.tsx`** - Add Open Graph metadata
3. **`web/components/ui/`** - Create new components as needed
4. **`public/`** - Add og-image.png, favicon

---

## Notes

- Keep same design language (colors, fonts, spacing)
- Use existing component patterns
- Ensure all sections are responsive
- All text should be in Spanish (with English option later)
- Test all CTAs lead to correct destinations