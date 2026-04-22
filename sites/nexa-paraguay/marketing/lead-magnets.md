# Nexa Paraguay — Lead Magnets
**Updated:** April 2026

> **Strategy:** Lead with the tax calculator. It's interactive, personalizable, and delivers immediate value. Everything else is secondary.

---

## Lead Magnet 1: Tax Savings Calculator (Primary)

### Overview

| Field | Value |
|-------|-------|
| Name | "Paraguay Tax Savings Calculator" |
| Format | Interactive web tool + PDF report |
| Capture | Email required for PDF report |
| CTA | "Calculate My Savings" → "Book Consultation" |

### User Flow

1. **Landing:** "See how much you could save in taxes with Paraguay's 10% IRE + territorial system"
2. **Inputs:**
   - Country of residence (NL/BE/DE/AT/ES/Other)
   - Annual income (slider or input: €20K-€500K+)
   - Income type (Employment / Business / Mixed / Passive)
   - Has company shares? (Yes/No)
   - Has foreign income? (Yes/No - dividends, rental, royalties)
3. **Calculation:** Real-time comparison shows:
   - Current tax paid
   - Potential Paraguayan tax
   - Annual savings
   - 5-year savings projection
4. **Output:**
   - On-screen summary
   - Email required for full PDF report
5. **CTA:** "Want to discuss your specific situation?" → Book consultation

### PDF Report Contents

```
PARAGUAY TAX SAVINGS REPORT
Generated: [Date]
Your Profile: [Inputs]

---
SECTION 1: Your Tax Comparison
- Current country tax analysis
- Paraguayan setup tax analysis
- The difference: [€X,XXX] annual savings

SECTION 2: How the Math Works
- Paraguay's 10% IRE explained
- Territorial system explained
- Why your foreign income isn't taxed

SECTION 3: The Process
- 8-12 week timeline
- What documents you need
- What we handle

SECTION 4: Your Next Steps
- Book a free consultation
- Get your personalized plan
- Questions answered

[Footer: Nexa Paraguay - 250+ clients - 97% completion rate]
```

### Implementation Notes

- **Tech:** Simple React component + PDF generation (jspdf or server-side)
- **Data:** Store leads in Supabase with all input parameters
- **Follow-up:** Trigger Sequence A (Tax-Driven Interest) on download
- **Mobile:** Must work perfectly on mobile (this audience is often desktop but mobile matters)

---

## Lead Magnet 2: The Complete Paraguay Tax Guide (Secondary)

### Overview

| Field | Value |
|-------|-------|
| Name | "2026 Paraguay Tax Guide: Everything You Need to Know" |
| Format | PDF download |
| Length | 12-15 pages |
| Capture | Email required |
| CTA | "Download Guide" → "Book Consultation" |

### PDF Contents

```
2026 PARAGUAY TAX GUIDE
Everything High-Income Expats Need to Know

---
CHAPTER 1: The 10% Reality
- What IRE actually means
- Ley 6380 explained
- Why it's not a "tax haven"

CHAPTER 2: Territorial System Deep Dive
- What "territorial" actually means
- Foreign income examples
- Common structures

CHAPTER 3: Country Comparisons
- Netherlands vs Paraguay
- Belgium vs Paraguay
- Germany vs Paraguay
- Portugal (ex-NHR) vs Paraguay

CHAPTER 4: Exit Tax Explained
- Dutch exit tax: what to expect
- Belgian exit tax: what to expect
- Structuring tips

CHAPTER 5: Banking in Paraguay
- Which banks work with expats
- What you need to open an account
- Our banking introduction service

CHAPTER 6: The Process
- Step-by-step timeline
- Documents needed
- What we handle

CHAPTER 7: Frequently Asked Questions
- 15 questions prospects actually ask

[Footer: Nexa Paraguay - 250+ clients]
```

---

## Lead Magnet 3: Residency Document Checklist (Tertiary)

### Overview

| Field | Value |
|-------|-------|
| Name | "Paraguay Residency Document Checklist" |
| Format | Interactive checklist (Notion-style or PDF) |
| Capture | Optional email (for reminders) |
| CTA | None — pure value, upsell later |

### Contents

```
✓ PASSPORT
  [ ] Certified copy of valid passport
  [ ] Must be valid for 6+ months

✓ BIRTH CERTIFICATE
  [ ] Original or certified copy
  [ ] Apostilled / legalized
  [ ] Translated to Spanish (if not Spanish-speaking)

✓ MARRIAGE CERTIFICATE (if applicable)
  [ ] Original or certified copy
  [ ] Apostilled / legalized
  [ ] Translated to Spanish

✓ PROOF OF INCOME
  [ ] Bank statements (last 3 months)
  [ ] Employment contract or business registration
  [ ] Tax returns (last 2 years)

✓ CRIMINAL BACKGROUND CHECK
  [ ] From country of residence
  [ ] Apostilled / legalized
  [ ] Must be recent (< 6 months)

✓ PHOTOS
  [ ] Passport photos (4, white background)
  [ ] Digital format available

[Notes section for each item]
```

---

## Lead Magnet 4: First 30 Days Guide (Post-Arrival)

### Overview

| Field | Value |
|-------|-------|
| Name | "Your First 30 Days in Paraguay" |
| Format | PDF checklist |
| Capture | No capture (free, for clients) |
| CTA | Post-arrival upsell (accounting, advisory) |

### Contents

```
YOUR FIRST 30 DAYS IN PARAGUAY
Week-by-Week Checklist

---
WEEK 1: ARRIVAL & SETTLEMENT
[ ] Day 1: Arrive in Asunción
[ ] Day 1: Airport pickup (we coordinate)
[ ] Day 2: Hotel check-in
[ ] Day 2: Migraciones appointment
[ ] Day 3: Bank account opening
[ ] Day 4: SIM card (Tigo, Claro, or Personal)
[ ] Day 5: Currency exchange (USD to PYG)

WEEK 2: ADMINISTRATIVE
[ ] Day 6-7: RUC (tax ID) if business owner
[ ] Day 8: Set up local phone number
[ ] Day 9: Open additional accounts (if needed)
[ ] Day 10: Meet with our team

WEEK 3: INTEGRATION
[ ] Day 11-14: Neighborhood exploration
[ ] Day 11-14: Find grocery stores, restaurants
[ ] Day 14: Meet with real estate (if looking)

WEEK 4: OPTIMIZATION
[ ] Day 15-21: Set up utilities (electricity, water, internet)
[ ] Day 15-21: Get local driver's license (if needed)
[ ] Day 21-28: Finalize any remaining paperwork

---
ESSENTIAL CONTACTS
- Emergency: 911
- Police: 911
- Fire: 911
- Ambulance: 141
- Our team: [Phone/WhatsApp]

NEIGHBORHOOD RECOMMENDATIONS
- Expat areas: Manorá, Los Laureles, Villa Morra
- Near Shopping del Sol
- Gated communities: San Francisco, cp

[Map placeholder]
```

---

## Implementation Priority

| Rank | Lead Magnet | Priority | Timeline |
|------|-------------|----------|----------|
| 1 | Tax Savings Calculator | **HIGH** | Week 1 |
| 2 | Tax Guide PDF | **HIGH** | Week 2 |
| 3 | Document Checklist | Medium | Week 3 |
| 4 | First 30 Days | Low | Week 4 |

---

## Tracking & Attribution

### Events to Track

| Event | Where | Purpose |
|-------|-------|---------|
| `lead_magnet_view` | Landing page | Top of funnel |
| `lead_magnet_start` | Calculator started | Intent signal |
| `lead_magnet_complete` | Calculation done | High intent |
| `lead_magnet_pdf_download` | PDF requested | Email capture |
| `lead_magnet_cta_click` | "Book Consultation" | Conversion |

### Supabase Schema (for leads)

```sql
CREATE TABLE lead_magnet_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  first_name TEXT,
  country_of_residence TEXT,
  annual_income_estimate TEXT,
  income_type TEXT,
  has_company_shares BOOLEAN,
  has_foreign_income BOOLEAN,
  calculated_savings DECIMAL,
  source TEXT DEFAULT 'tax_calculator',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

*Document Version: 1.0 — Updated April 2026*
*For Nexa Paraguay marketing team*
