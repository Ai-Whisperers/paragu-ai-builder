# Abogados & Contadores — Demo Site Upgrade & Content Plan

## Current State (Analysis)

### Lawyer Demos (4 exist)
- `demo-abogado-corporativo` — corporate/business law
- `demo-abogado-penalista` — criminal defense
- `demo-abogado-familia` — family/divorce law
- `demo-abogado-migratorio` — immigration law

**Problem:** All 4 are bare minimum — 50 lines of generic content, only 5 sections (header, hero, contact, footer, whatsapp-float). No services, team, FAQ, testimonials, or process sections. Content is machine-quality with no Paraguay-specific context. They don't demonstrate the platform's real capability.

### Contador Demo (1 exists)
- `demo-contador` — generic accountant

**Problem:** Same bare-minimum structure. Despite the `contador.type.json` registry having rich metadata (tax calculators, pricing tables, service categories, regulatory vocab), none of it is used in the demo. No calculators, no pricing, no team.

### Available Engine Power (untapped)
The platform has 100+ section components including:
- Tax calculators: `calc-irp`, `calc-iva`, `calc-ire`, `calc-ips`, `calc-aguinaldo`, `calc-finiquito`, `calc-costo-empleado`
- Business tools: `tax-deadline-banner`, `pricing-table`, `lead-form`, `process-timeline`, `trust-signals`
- Content sections: `team`, `testimonials`, `faq`, `blog-index`, `features`

---

## Phase 1: Combined Demo Site — "Bufete Mendez & Estudio Contable"

**Goal:** Create a single high-quality demo showing a combined law + accounting firm (common in Paraguay). This becomes the primary sales demo for the professional services vertical.

**Slug:** `demo-bufete-estudio`
**URL:** `paragu-ai.com/s/es/demo-bufete-estudio`

### Sections

| # | Section | Variant | Content |
|---|---------|---------|---------|
| 1 | header | standard | Nav with areas + equipo + contacto |
| 2 | hero | split | Trust badges: "15+ años", "500+ clientes", "Asunción & CDE" |
| 3 | trust-signals | credentials | Licensed CCP/CTC numbers, SET registered |
| 4 | services | cards | 6 areas: Corporativo, Tributario, Laboral, Contable, Societario, Migratorio |
| 5 | team | cards | 4 profiles: 2 abogados, 2 contadores with credential numbers |
| 6 | process-timeline | horizontal | 5-step: Consulta → Diagnóstico → Implementación → Cumplimiento → Crecimiento |
| 7 | pricing-table | default | 3 planes: Básico, Profesional, Empresarial |
| 8 | testimonials | grid | 3 client testimonials |
| 9 | faq | accordion | 6 preguntas frecuentes (legal + contable) |
| 10 | tax-deadline-banner | default | Dynamic next SET/IPS deadline |
| 11 | calc-irp | default | IRP calculator widget (showcase) |
| 12 | lead-form | standard | Full intake: name, phone, email, consulta type |
| 13 | contact | split | Map + info + WhatsApp |
| 14 | footer | standard | Compliance disclaimer |
| 15 | whatsapp-float | standard | |

### Content Strategy

- Voseo for informal ("agendá", "consultá"), usted for formal service descriptions
- Paraguay-specific legal references: DNIT (ex-SET), Marangatu, e-Kuatia
- RUC, Timbrado mentioned in compliance notes
- Pricing in PYG with USD reference
- CTAs go to WhatsApp with tailored message

### Design Tokens

- **Palette:** Deep Navy & Teal (professional + trustworthy)
- **Font:** Lora (headings) + Inter (body) — serif for gravitas
- **Border radius:** small (professional edge)

---

## Phase 2: Upgrade Individual Demo Sites

### Lawyer Demo Upgrades (4 sites)

Each upgraded to include:
- `services` section with 4-5 practice areas
- `team` section with 2-3 attorney profiles
- `testimonials` section
- `faq` with 5+ preguntas
- `process-timeline` showing engagement flow
- `lead-form` for consultations
- `trust-signals` with credentials

**Per-specialty content differentiation:**

| Demo | Focus | Services | Keywords |
|------|-------|----------|----------|
| demo-abogado-corporativo | Corporate | Contratos, due diligence, M&A, gobierno corporativo | "abogado corporativo Asunción" |
| demo-abogado-penalista | Criminal | Defensa penal, delitos económicos, garantías | "abogado penalista Asunción" |
| demo-abogado-familia | Family | Divorcio, alimentos, guarda, sucesiones | "abogado de familia Asunción" |
| demo-abogado-migratorio | Immigration | Residencia, ciudadanía, visas, inversores | "abogado migratorio Paraguay" |

### Contador Demo Upgrade

**New sections:**
- `services` — Contabilidad, IVA, IRP/IRE, Sueldos, Societario, Auditoría
- `pricing-table` — 3 planes mensuales en PYG
- `team` — 3 contadores with CCP numbers
- `process-timeline` — Monthly cycle: recepción → procesamiento → presentación → cierre
- `testimonials` — Client success stories
- `faq` — Tax questions for PYMES
- `tax-deadline-banner` — Próximo vencimiento SET
- `calc-irp` — IRP calculator
- `calc-iva` — IVA calculator
- `calc-costo-empleado` — Employee cost calculator
- `lead-form` — "Consulta gratuita" intake

**Regulatory content:** Specific to Paraguay tax framework (IVA 10%/5%, IRP, IRE, RESIMPLE, Marangatu, e-Kuatia, CCP).

---

## Phase 3: Content Production Pipeline

### Copywriting Guidelines

1. **Tone:** Professional but accessible. Voseo for CTAs, usted for service descriptions
2. **Length:** 80-150 words per service description, 30-50 per FAQ answer
3. **Placeholders:** Use `{{businessName}}`, `{{city}}`, `{{year}}` system
4. **SEO:** Title tags with "Abogado [especialidad] [ciudad]" patterns
5. **Legal disclaimers:** Every footer includes compliance text about demo nature

### Image Requirements

Per demo site:
- Hero background (1920x800, professional office/team)
- Team headshots (400x400, professional portraits)
- Service icons (Lucide icons via platform)
- Office/location photo

### Image Sourcing Strategy

1. **AI-generated** for demo purposes (Midjourney / DALL-E / Replicate)
2. **Stock** for backgrounds (Unsplash: legal, accounting, office)
3. **Note:** All demo images tagged for replacement at handoff

---

## Phase 4: Landing Page & Acquisition Funnel

### New Routes

| Route | Purpose |
|-------|---------|
| `/p/abogados` | Lawyer vertical landing page |
| `/p/contadores` | Accountant vertical landing page |
| `/demo/abogados-contadores` | Demo showcase hub |
| `/c/asuncion/abogados` | City-based lawyer listings |

### SEO Content Strategy

- Blog posts targeting: "cómo elegir abogado en Asunción", "contador para PYMES Paraguay", "impuestos Paraguay 2026"
- Each lawyer demo targets `abogado [especialidad] [city]` keyword cluster
- Contador demo targets `contador para PYMES [city]` + `estudio contable [city]`

### Lead Capture

- Demo site CTA → WhatsApp with message: "Hola, vi el demo de [rubro] y quiero un sitio para mi estudio"
- Lead form → Supabase `leads` table → HubSpot sync
- Follow-up: automated WhatsApp reminder at 24h if no response

---

## Implementation Priority

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| P0 | Create `demo-bufete-estudio` combined site | 2h | Showcases full platform power |
| P1 | Upgrade `demo-contador` with calculators | 1.5h | Differentiates from competitors |
| P1 | Upgrade 4 lawyer demos with full content | 2h per demo | Covers major specialties |
| P2 | `/p/abogados` and `/p/contadores` landing pages | 4h | SEO + lead generation |
| P2 | Blog content for legal/tax keywords | 6h | Organic traffic |
| P3 | Image optimization for all demos | 2h | Polish |

---

## Success Metrics

- Demo-to-lead conversion rate >15%
- Time-to-first-demo-view <2s (Cloudflare cached)
- All 5 demos score >90 Lighthouse mobile
- Each demo covers ≥12 sections (from current 5)
