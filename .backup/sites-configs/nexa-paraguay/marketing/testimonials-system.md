# Nexa Paraguay — Testimonials System
**Updated:** April 2026

> **Note:** Current testimonials.json contains AI-generated placeholders. This document specifies the real testimonial collection, display system, and organization for production.

---

## 1. Testimonial Collection

### Categories to Collect

| Category | Questions | Target Sources |
|----------|-----------|---------------|
| **Tax Success** | "How much are you saving?" "What's your home country?" | NL/BE/DE clients with €60K+ income |
| **Process** | "How was the timeline?" "Any surprises?" | All clients |
| **Banking** | "How was banking?" "Did you have issues?" | Clients who struggled pre-Nexa |
| **Family** | "How's raising kids there?" "Schools?" | Family clients |
| **Business** | "How's business?" "Would you recommend?" | Business program clients |

### Collection Template

```
Subject: Share your story — Feature you on Nexa Paraguay?

Hi [Name],

Thank you again for choosing Nexa Paraguay. We'd love to feature your story on our website.

Quick questions:
1. What was your situation before relocating?
2. Why did you choose Paraguay?
3. How was the process? Any surprises?
4. What's life like now?
5. What would you tell someone considering it?

We can do:
- Written quote (3-4 sentences)
- Video testimonial (2-3 min, phone is fine)
- Full interview (we ask, you answer)

Photos: Happy to include if you have them, otherwise we use a placeholder.

Permission: We only publish with explicit consent. You choose:
- Full name + country
- First name only
- Anonymous

Link: [Consent Form]
```

### Consent Form Fields

```json
{
  "fullName": "boolean",
  "firstNameOnly": "boolean", 
  "anonymous": "boolean",
  "photoRelease": "boolean",
  "videoRelease": "boolean",
  "countryDisplay": "string | null",
  "programDisplay": "string",
  "dateShared": "date"
}
```

---

## 2. Organization Schema

### Enhanced testimonials.json Structure

```json
{
  "testimonials": {
    "categories": [
      {
        "id": "tax-success",
        "name": { "en": "Tax Savings", "es": "Ahorro Fiscal" },
        "description": { "en": "How much clients save", "es": "Cuánto ahorran los clientes" },
        "filterKey": "savingsAmount"
      },
      {
        "id": "process",
        "name": { "en": "The Process", "es": "El Proceso" },
        "description": { "en": "Timeline & experience", "es": "Cronografía y experiencia" }
      },
      {
        "id": "banking",
        "name": { "en": "Banking", "es": "Banca" },
        "description": { "en": "Bank account opening", "es": "Apertura de cuenta" }
      },
      {
        "id": "family",
        "name": { "en": "Family Life", "es": "Vida Familiar" },
        "description": { "en": "Kids & lifestyle", "es": "Niños y estilo de vida" }
      },
      {
        "id": "business",
        "name": { "en": "Business", "es": "Negocios" },
        "description": { "en": "Business setup", "es": "Estructura empresarial" }
      }
    ],
    "byCountry": {
      "nl": { "label": "Netherlands", "labelEs": "Países Bajos" },
      "be": { "label": "Belgium", "labelEs": "Bélgica" },
      "de": { "label": "Germany", "labelEs": "Alemania" },
      "es": { "label": "Spain", "labelEs": "España" },
      "ar": { "label": "Argentina", "labelEs": "Argentina" },
      "br": { "label": "Brazil", "labelEs": "Brasil" },
      "other": { "label": "Other", "labelEs": "Otros" }
    },
    "items": [
      {
        "id": "string",
        "name": "string",
        "firstName": "string",
        "country": "nl|be|de|es|ar|br|other",
        "program": "base|business|investor",
        "quote": "string",
        "quoteEs": "string",
        "videoUrl": "string|null",
        "videoPoster": "string",
        "thumbnail": "string",
        "savingsAmount": "number|null",
        "savingsCurrency": "eur|usd|null",
        "category": "tax-success|process|banking|family|business",
        "date": "2024-01-15",
        "consent": {
          "showFullName": true,
          "showCountry": true,
          "showVideo": false,
          "agreedToPublish": "2024-01-15"
        }
      }
    ],
    "stats": {
      "totalClients": 250,
      "satisfactionRate": 98,
      "averageRating": 4.9,
      "withVideo": 12,
      "byCountry": { "nl": 45, "be": 38, "de": 28, "es": 52, "other": 87 }
    }
  }
}
```

---

## 3. Display Component Spec

### TestimonialsGrid Component

```tsx
interface TestimonialsProps {
  variant?: 'grid' | 'carousel' | 'featured'
  filterBy?: 'country' | 'category' | 'program'
  showVideo?: boolean
  maxItems?: number
  locale: 'en' | 'es' | 'nl' | 'de'
}

// Usage
<TestimonialsGrid 
  variant="grid" 
  filterBy="country"
  showVideo={true}
  locale="nl"
/>
```

### Filter UI

| Filter Type | Options | Default |
|-----------|--------|---------|
| Country | NL, BE, DE, ES, AR, ALL | ALL |
| Category | Tax, Process, Banking, Family, Business | ALL |
| Program | Base, Business, Investor | ALL |
| Has Video | Yes, No | All |

### Video Modal Behavior

```
1. Click thumbnail → Modal opens
2. Autoplay off (user initiates)
3. Close on X, ESC, or outside click
4. Track: testimonial_video_play
```

### Track Events

| Event | When |
|-------|------|
| `testimonial_view` | Grid rendered |
| `testimonial_filter` | Filter applied |
| `testimonial_video_play` | Video started |
| `testimonial_video_complete` | Video finished |
| `testimonial_cta_click` | "Speak with client" clicked |

---

## 4. Client Referrer Program

### Program Rules

| Reward | Condition |
|--------|----------|
| €500 credit | Referred client closes |
| €250 credit | Referred client books consult |
| €100 credit | Referred client submits form |

### Referrer Tracking

```sql
CREATE TABLE referrer_program (
  referrer_id UUID REFERENCES leads(id),
  referred_id UUID REFERENCES leads(id),
  referrer_reward DECIMAL,
  referred_reward DECIMAL,
  status 'pending' | 'consult_booked' | 'closed' | 'paid',
  created_at TIMESTAMPTZ,
  reward_paid_at TIMESTAMPTZ
);
```

---

## 5. Current Testimonials Status

### As of April 2026

| Source | Count | Status |
|--------|-------|-------|
| Placeholder (AI) | 5 | Replace with real |
| Real (consented) | 0 | Need collection |
| With video | 0 | Need recording |
| NL/BE/DE specific | 0 | Priority gap |

### Priority Collection Targets

1. **NL client** with tax savings quote — for homepage
2. **BE client** with banking story — for objection handling
3. **DE client** with exit tax experience — for comparison page
4. **Family client** with school story — for family page

---

## 6. Usage in Marketing

### Homepage (Featured)

```
Show: 1 random testimonial
Filter: Has video = true
Track: testimonial_home_view
```

### Comparison Page

```
Show: NL/BE/DE specific only
Context: "See what [country] clients say"
Track: testimonial_comparison_view
```

### Objection Handling

```
Objection: "Can I speak with someone from my country?"
Response: "Here's what a [country] client says [link to filtered testimonials]"
```

### Post-Consultation Email

```
Include: 1 relevant testimonial
Context: Post-call follow-up
Track: testimonial_email_include
```

---

*Document Version: 1.0 — Updated April 2026*
*For Nexa Paraguay marketing team*