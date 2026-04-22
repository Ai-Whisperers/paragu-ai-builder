# Stoic Finch Corporation — Research Dossier

> Source: public website at https://stoicfinch.com/ (fetched 2026-04-21).
> All facts here come from the live site. No private/internal info.
> Tenant is `is_demo: true` until Stoic Finch authorizes a live cloned site.

---

## Company Identity

| Field | Value |
|---|---|
| Legal name | Stoic Finch Corporation |
| Tagline | "Use your data like a pro" |
| Headline | "The data you need to stay ahead. By experts you can trust." |
| HQ | Calgary, Alberta, Canada 🇨🇦 |
| Service area | Global ("Born in Calgary 🍁 Inspired by the Rockies 🏔 Delivered Globally 🌎") |
| Sector | Professional services — data analytics consulting / data engineering |
| Audience | B2B (mid-market and enterprise teams that own data) |
| Languages | English only |

## Web Presence

| Channel | URL |
|---|---|
| Website | https://stoicfinch.com/ |
| LinkedIn | https://www.linkedin.com/company/stoicfinch/ |

No public phone, no public email, no street address. Lead capture is via on-page form only (Full Name, Work Email, "How can we help?").

## Site Structure

Single-page site. Navigation links are anchors:

- About → `#about`
- Benefits → `#benefits-top`
- Services → `#services`
- Get Started → `#contact-section`

CTAs (all anchor to the contact form):
- "Get Started Today"
- "Take the First Step" (appears twice)

## Value Proposition

> "We provide the data professionals you need."

Stoic Finch positions itself as a flexible bench of data specialists — embedded into client teams to deliver dashboards, analyses, and pipelines without the overhead of full-time hires. Three messaging pillars:

1. **Brag a Little** — automated dashboards expose team value to leadership.
2. **Move at your pace** — scalable staffing and integration libraries cut time-to-value.
3. **Focus on your priorities** — embedded experts work with stakeholders directly.

Closing pitch: *"Where it gets serious — Lead data-driven value creation."*

## Service Lines (5)

| # | Service | Notes |
|---|---|---|
| 1 | Reports & Dashboarding | Automated executive dashboards |
| 2 | Data Analysis | Ad-hoc and recurring analysis |
| 3 | Data Science | Predictive / statistical modeling |
| 4 | Data Engineering | Pipelines, warehousing, integration |
| 5 | Data Strategy & Product Management | Roadmap, governance, data-product ownership |

Two named outcomes pushed under "Where it gets serious":
- **Attain Your Source of Truth**
- **Manage Data at Scale**

## Engagement Models (3)

Listed under "Working with Us — Simple working models to ensure you succeed":

1. **Consultation** — discovery / advisory
2. **Development** — build engagements
3. **Ongoing Maintenance** — managed operations

Pricing: not disclosed. CTA: *"No commitments. No hassle."*

## Technology Stack (10 explicitly named)

Python · Power BI · Excel · Tableau · PostgreSQL · Pandas · Apache Spark · Delta Lake · Jupyter · Git

Positioned as "the right tools for the job — enabling organizational evolution from foundational to advanced data capabilities."

## Brand & Design

| Element | Detail |
|---|---|
| Mood | Professional, confident, calm. "Stoic" name signals reliability. |
| Voice | Direct, second-person. Short sentences. No jargon. |
| Color (primary) | Dark navy / near-black background |
| Color (accent) | Teal / turquoise CTAs |
| Color (text) | White on dark, dark on light |
| Typography | Modern geometric sans-serif (heading + body). Inter-class. |
| Imagery | Stock photography of professionals at desks; tech logos for stack |
| Logo | Horizontal lockup, white wordmark |
| Layout | Single page, alternating dark/light section bands |
| Buttons | Rounded, solid teal fill |

## Missing / Not Disclosed (placeholder fields)

These are absent from the public site and need owner input before going live:

- Founders / team bios
- Office address (Calgary specifics)
- Phone number
- Direct email
- Pricing tiers
- Customer testimonials
- Case studies
- Industry verticals served
- Certifications / partnerships
- Blog content

Until provided, the tenant ships with `is_demo: true` and AI-written placeholder copy modeled on what's actually on stoicfinch.com.

## Mapping to paragu-ai-builder

| Field | Choice | Rationale |
|---|---|---|
| `vertical` | `technology-digital` | Matches `data_analytics_consulting` sub-vertical |
| `businessType` | `data_analytics_consulting` | Five service areas align exactly |
| `country` | `Canada` | HQ in Calgary |
| `defaultLocale` | `en` | Site is English-only |
| `locales` | `["en"]` | English-only |
| `is_demo` | `true` | Built from public research; not yet authorized |

## References Inside This Repo

- Registry: `src/registry/data_analytics_consulting.type.json`
- Base technology type: `src/registry/technology_base.type.json`
- Section components used: `web/components/sections/{header,hero,trust-signals,features,services,process-timeline,cta-banner,contact,footer,whatsapp-float}-section.tsx`

## Verbatim Copy Lifted From the Site

For the AI translation/rewrite layer, here is the source-of-truth copy taken verbatim:

- **Hero**: "Use your data like a pro. The data you need to stay ahead. By experts you can trust."
- **Hero CTA**: "Get Started Today" / "No commitments. No hassle."
- **About headline**: "We provide the data professionals you need."
- **Brag a Little**: "Showcase the value your team adds."
- **Move at your pace**: "Accelerate your time to value."
- **Focus on your priorities**: "Focus on what needs to get done."
- **Where it gets serious**: "Lead data-driven value creation. Attain Your Source of Truth · Manage Data at Scale"
- **Modern Technology**: "The right tools for the job."
- **Working with Us**: "Simple working models to ensure you succeed."
- **Final CTA**: "Take the first step. Level up your data."
- **Footer line**: "Born in Calgary 🍁 Inspired by the Rockies 🏔 Delivered Globally 🌎"

---

_Compiled 2026-04-21 from public sources for the paragu-ai-builder tenant onboarding._
