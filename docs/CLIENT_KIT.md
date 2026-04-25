# Client Kit — Everything Available Per Lead

Each lead has the following personalized resources available:

---

## 1. Preview Website
**Generator:** `web/scripts/generate-batch-previews.ts`
**Location:** `sites/preview-{slug}/`
**URL:** `https://paragu-ai.com/s/es/preview-{slug}`

Includes: services, team, gallery, booking, Google reviews, gift cards, real photos, hours, Instagram feed.

---

## 2. Google Reviews (Real, Spanish-Only)
**Generator:** `web/scripts/fetch-all-google-data.py`
**Data:** Up to 5 real customer reviews from Google Maps per lead

---

## 3. Real Business Photos (Up to 10)
**Generator:** `web/scripts/fetch-all-google-data.py`
**Served via:** `/api/place-photo?ref=...` (proxy, API key not exposed)

---

## 4. Per-Lead Image Prompts for AI Generation
**Generator:** `web/scripts/generate-image-prompts.py`
**Location:** `sites/image-prompts/{n}-{slug}/prompts.md`
**Contents:** Hero image prompt + 4-6 gallery prompts per lead

---

## 5. Personalized PDF QR Flyer
**Generator:** inline Python (fpdf + qrcode)
**Location:** `sites/lead-flyers/{slug}.pdf`
**Contents:** A5 flyer with business name, rating, QR code to preview site

Ideal for: printing and putting in the shop window, or sending via WhatsApp as a PDF.

---

## 6. Google Business Profile Update Link
For each lead, send them this link to add their website to Google Maps:
```
https://business.google.com/add?site_url=https://paragu-ai.com/s/es/{slug}
```

---

## 7. Social Media Announcement Post
Copy-paste for Instagram/Facebook:

> "Nos renovamos! 🎉 Ya tenemos nuestra página web oficial. Visitanos en 🌐 https://paragu-ai.com/s/es/{slug} — Ahí pueden ver todos nuestros servicios, precios, galería de trabajos y hasta reservar online. Los esperamos! 💪"

---

## 8. WhatsApp Status / Story
> "NUEVO SITIO WEB 🔥 Ya pueden ver todos nuestros servicios, precios y agendar online en: https://paragu-ai.com/s/es/{slug}"

---

## 9. Personalized Outreach Messages
**Generator:** `web/scripts/generate-premium-outreach.ts`
**Location:** `sites/premium-outreach.json`
**Contents:** 5-message sequence per lead (initial, demo, follow-up 3d, follow-up 7d, pricing)

---

## 10. SEO Keywords
**Generator:** `web/scripts/generate-lead-resources.py`
**Location:** `sites/lead-resources/{n}-{slug}/seo-keywords.txt`
**Contents:** 12+ localized Spanish keywords per lead

---

## 11. Competitor Analysis
**Generator:** `web/scripts/generate-lead-resources.py`
**Location:** `sites/lead-resources/{n}-{slug}/competitor-analysis.txt`
**Contents:** Similar businesses in same city with ratings

---

## Generation Commands

```bash
# Generate everything for all leads:
python3 web/scripts/fetch-all-google-data.py         # Reviews + photos + hours
python3 web/scripts/generate-image-prompts.py          # AI image prompts
python3 web/scripts/fetch-all-google-data.py           # Update content
python3 web/scripts/generate-image-prompts.py           # (keep last)

# Generate flyers (run from repo root):
python3 -c "
import json, os
from fpdf import FPDF
import qrcode
# ... run the flyer generation script
"

# Refresh all data:
python3 web/scripts/fetch-all-google-data.py
```
