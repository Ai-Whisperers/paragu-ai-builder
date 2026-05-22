# GitHub Strategy for ParaguAI Client Sites

## Overview

This document defines how we use GitHub repositories for ParaguAI client sites.

## Core Principle

**GitHub is for portfolio/SEO only, not for content management.**

All live content is stored in Supabase. GitHub repos serve as:
- SEO landing pages (brand credibility)
- Marketing showcase (code quality demo)
- Public transparency (client comfort)
- Export artifact (optional, for clients who request version control)

## Repository Structure

### Platform Repository
```
Ai-Whisperers/paragu-ai-builder
├── README.md              # Platform overview + features
├── docs/
│   ├── architecture.md    # How the platform works
│   ├── contributing.md    # Contribution guidelines
│   └── client-onboarding.md
├── web/                   # Next.js application
├── sites/
│   ├── demo-barberia/     # Marketing templates (static)
│   ├── demo-bodega/
│   └── _archive/          # Deprecated templates
└── scripts/               # CLI tools, migrations
```

**Purpose:** Platform engine, demo templates, deployment tooling.

**What it contains:**
- Next.js 15 app
- Supabase client integration
- Demo templates (for marketing)
- Deployment scripts
- Architecture documentation

**What it DOES NOT contain:**
- Live client configuration (`sites/nexa-paraguay`, etc.)
- Client-specific content (lives in Supabase)
- Client secrets (`.env` for each client)

---

### Client Repositories

Each client has a standalone repository (optional, recommended for marketing).

```
Ai-Whisperers/nexa-paraguay
├── README.md                    # Client site description + live link
├── LICENSE                      # Client license (if applicable)
└── screenshots/                 # Optional: site screenshots
```

**README.md template:**

```markdown
# Nexa Paraguay

Sitio web de Nexa Paraguay - servicios de mudanza, residencia y reubicación en Paraguay.

## 🌐 Sitio en Vivo

https://nexaparaguay.com

## 🏗️ Arquitectura

Este sitio es gestionado a través de la plataforma ParaguAI:
- **Motor:** Next.js 15 + Supabase
- **Contenido:** CMS basado en Supabase (actualizaciones en tiempo real)
- **Deploy:** Docker Swarm + Cloudflare
- **Infra:** VPS en Sunstein Cloud

## 📝 Gestión de Contenido

El contenido de este sitio se gestiona a través del panel de administración de ParaguAI, no a través de este repositorio. Este repositorio es puramente para transparencia y SEO.

Para cambios de contenido, contactar a Ai-Whisperers:
- WhatsApp: +595 981 123 456
- Email: hola@paragu-ai.com

## 🚀 Tech Stack

- Next.js 15 (App Router)
- Supabase (base de datos + CMS)
- TypeScript
- Tailwind CSS
- Docker Swarm

## 📊 Locales

- 🇪🇸 Español (es) - primary
- 🇺🇸 English (en)
- 🇳🇱 Nederlands (nl)
- 🇩🇪 Deutsch (de)

## 📄 Legal

© 2024 Nexa Paraguay. Todos los derechos reservados.
```

---

### Repositories List

| Repository | Domain | Status | Notes |
|-----------|--------|--------|-------|
| `Ai-Whisperers/paragu-ai-builder` | - | ✅ Active | Platform engine + demos |
| `Ai-Whisperers/nexa-paraguay` | nexaparaguay.com | ✅ Live | Multi-locale (4 languages) |
| `Ai-Whisperers/de-abasto-a-casa` | deabastoacasa.com.py | ✅ Live | E-commerce site |
| `Ai-Whisperers/granja-cabral` | granjacabral.com.py | ✅ Live | Agricultural site |
| `Ai-Whisperers/dayah-litworks` | dayah-litworks.com | ✅ Live | Portfolio site |
| `Ai-Whisperers/nexa-propiedades` | nexapropiedades.com | ⚠️ DNS broken | Needs A record |
| `Ai-Whisperers/stoicfinch` | stoicfinch.ca | ⚠️ DNS broken | Needs A record |
| `Ai-Whisperers/bufete-mendez` | - | 🔄 Active | Law firm site |
| `Ai-Whisperers/alejandro-villamayor` | - | 🔄 Active | Personal site |
| `Ai-Whisperers/polki-squad` | polkisquad.com | 🔄 Active | Team site |
| `Ai-Whisperers/fun4me` | - | 🔄 Active | Gym/Fitness site |
| `Ai-Whisperers/nudo` | - | 🔄 Active | Knot/rope site |
| `Ai-Whisperers/superspuma` | - | 🔄 Active | E-commerce site |
| `Ai-Whisperers/elviajero-comercio` | tiendaelviajero.com.py | ✅ Live | E-commerce site |
| `Ai-Whisperers/brahm-the-raccoon` | - | 📝 Planned | Personal brand site |

---

## Why This Approach?

### ✅ Pros

1. **Separation of concerns:**
   - Platform = infrastructure + templates
   - Client repos = marketing artifact + transparency
   - Supabase = live content (single source of truth)

2. **No Git knowledge required:**
   - Clients never touch config files
   - Content management via CMS only
   - No "push to production" confusion

3. **Real-time updates:**
   - Content changes instantly (no rebuild)
   - No CI/CD delays
   - Clients see changes immediately

4. **Scalable:**
   - 1000 sites = same architecture
   - No repo bloat
   - No git history conflicts

5. **Professional:**
   - Matches SaaS patterns (Shopify, Wix, Squarespace)
   - Clear separation of platform vs content
   - Easy onboarding for non-technical clients

### ❌ Avoided

- **Git as CMS:** Confusing for clients, requires Git knowledge
- **Monorepo client configs:** Violates "one repo per site" preference
- **GitOps for all clients:** Overkill for most Paraguayan PYMEs
- **Content in repos:** No real-time updates, rebuild delays

---

## Optional: GitHub Export (for tech-savvy clients)

If a client wants version control, we can provide a one-time export:

```bash
# Script to export client content from Supabase to GitHub
python scripts/export_to_github.py --tenant nexa-paraguay
```

This creates a `config/` directory in the client repo with:
- `site.json` - tenant configuration
- `content/` - all locale-specific content
- `export-timestamp.txt` - when export happened

**This is optional and only for clients who specifically request it.**

---

## Deployment Flow

```
┌─────────────────┐
│   Supabase      │ ← Single source of truth
│   site_config   │
│   site_content  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Docker Swarm   │ ← Live deployment
│   (VPS)         │    - Pulls from Supabase
└────────┬────────┘    - Hot reload on content change
         │
         ▼
┌─────────────────┐
│  Cloudflare     │ ← CDN + DNS
│   (CDN/DNS)     │    - Cache assets
└─────────────────┘    - Route to VPS
```

GitHub is NOT in this flow. It's a side artifact.

---

## Summary

- **Platform repo:** `Ai-Whisperers/paragu-ai-builder` - engine + demos
- **Client repos:** Optional marketing artifacts - NOT used for deployment
- **Content lives in:** Supabase (single source of truth)
- **Deployment reads from:** Supabase (via Docker Swarm)
- **GitHub purpose:** SEO, transparency, marketing only

This architecture scales, is professional, and doesn't require clients to know Git.