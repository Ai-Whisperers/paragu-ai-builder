# Business Types, Verticals, and Tenants

The tenant model has three levels:

1. **Vertical** — a broad industry cluster (e.g. `real-estate-relocation`, `food-beverage`, `portfolio-professional`). Defined in `src/verticals/<vertical>/vertical.json`.
2. **Business type** — a specific kind of business within a vertical (e.g. `peluqueria`, `meal_prep`, `relocation`). Defined in `src/registry/<type>.type.json`. Each type declares the sections it uses and SEO defaults.
3. **Tenant** — an actual client site. Defined under `sites/<slug>/`.

```
vertical ⬅ one-to-many ⬅ business type ⬅ one-to-many ⬅ tenant
```

Tokens and copy flow down this chain: **base → vertical → business type → tenant**, with later layers overriding earlier ones.

See [/ARCHITECTURE.md § code map](../../ARCHITECTURE.md#2-code-map) for where these fit.

---

## Verticals (23)

| Vertical id | Member types | Default locales | Notable features |
|---|---|---|---|
| `portfolio-professional` | `diseno_grafico`, `fotografia`, `book_cover_designer`, freelance professionals | es | Portfolio, case studies, quote forms, before-after |
| `food-beverage` | `meal_prep`, restaurants, cafes, bakeries, `kaiten_zushi`, `sushi_bar`, `restaurant` | es, en | Menu, reservations, delivery, business hours, regulatory badges |
| `real-estate-relocation` | `relocation`, `inmobiliaria` | es, en, de, nl | Booking, multi-page process, trust signals, mortgage calc |
| `relocacion` | (alias folder) | es, en, pt | Same as above |
| `beauty-personal-care` | `peluqueria`, `salon_belleza`, `barberia`, `unas`, `pestanas`, `maquillaje`, `depilacion`, `estetica` | es | Booking, staff selector, service menu |
| `fitness-wellness` | `gimnasio`, `spa` | es | Class schedule, membership plans |
| `professional-services` | `legal`, `consultoria`, `inversiones`, `educacion`, `salud` | es | Intake questionnaire, tiered service ladder |
| `creative-arts` | `tatuajes` | es | Portfolio, gallery, before-after |
| `agriculture` | egg-farm types | es | Stock indicator, delivery calculator, recipe |
| _(~14 more)_ | automotive, pets, retail, sports, tech, trades, etc. | varies | Varies |

Verticals are additive — adding a new business type to an existing vertical costs nothing; the vertical's defaults apply.

---

## Business types

Business types are defined in `src/registry/<id>.type.json`. Each declares:

- `type` — kebab- or snake-case id
- `displayName` — Spanish human label
- `verticalId` — parent vertical (optional — inherits if missing)
- `sections` — ordered list of section ids to render on the default home page
- `seo` — title/description templates with placeholders
- `features` — feature flags (booking? catalog? blog?)

### Core catalog (~30 types)

| Type id | Display name (ES) | Vertical | Status |
|---|---|---|---|
| `peluqueria` | Peluquería | beauty-personal-care | supported |
| `salon_belleza` | Salón de Belleza | beauty-personal-care | supported |
| `gimnasio` | Gimnasio | fitness-wellness | supported |
| `spa` | Spa | fitness-wellness | supported |
| `unas` | Uñas | beauty-personal-care | supported |
| `tatuajes` | Tatuajes | creative-arts | supported |
| `barberia` | Barbería | beauty-personal-care | supported |
| `estetica` | Estética | beauty-personal-care | supported |
| `maquillaje` | Maquillaje | beauty-personal-care | supported |
| `depilacion` | Depilación | beauty-personal-care | supported |
| `pestanas` | Pestañas | beauty-personal-care | supported |
| `diseno_grafico` | Diseño Gráfico | portfolio-professional | supported |
| `fotografia` | Fotografía | portfolio-professional | supported |
| `book_cover_designer` | Diseño de Portadas | portfolio-professional | supported (used by dayah-litworks) |
| `relocation` | Servicios de Reubicación | real-estate-relocation | supported (Nexa Paraguay/Uruguay) |
| `inmobiliaria` | Inmobiliaria | real-estate-relocation | supported (falls through to relocacion defaults) |
| `meal_prep` | Meal Prep & Compras | food-beverage | supported (De Abasto a Casa) |
| `restaurant` | Restaurante | food-beverage | supported |
| `sushi_bar` | Sushi Bar | food-beverage | supported |
| `kaiten_zushi` | Kaiten Zushi | food-beverage | supported |
| `educacion` | Educación | professional-services | supported |
| `salud` | Salud | professional-services | supported |
| `inversiones` | Inversiones | professional-services | supported |
| `legal` | Legal | professional-services | supported |
| `consultoria` | Consultoría | professional-services | supported |

The full listing is generated from `src/registry/*.type.json`. Run `ls src/registry/` for a live list.

### Adding a business type

1. Create `src/registry/<id>.type.json` — section list, SEO, features.
2. If the type needs brand colors, add `src/tokens/<id>.tokens.json` (otherwise it inherits vertical defaults).
3. Add `src/content/<id>.content.json` with Spanish copy templates using `{{placeholder}}` keys.
4. Add the type to its parent vertical's `vertical.json` if the vertical lists members explicitly.

See [web/docs/ADDING_BUSINESS_TYPES.md](../../web/docs/ADDING_BUSINESS_TYPES.md) for the full runbook.

---

## Live tenants (6 real clients, April 2026)

| Slug | Display | Type | Vertical | Hostname | Locales | Integrations | Status |
|---|---|---|---|---|---|---|---|
| `nexa-paraguay` | Nexa Paraguay (4-locale) | `relocation` | real-estate-relocation | nexaparaguay.com | nl · en · de · es | Calendly, HubSpot, Mailchimp, GA4 | Staging; pre-cutover |
| `nexaparaguay` | Nexa Paraguay (ES landing) | `relocation` | real-estate-relocation | nexaparaguay.com | es | HubSpot, Mailchimp, GA4 | Staging |
| `nexa-propiedades` | Nexa Propiedades | real-estate (custom) | relocacion | nexapropiedades.com | es · en · pt | HubSpot, Mailchimp, GA4, Google Maps | In progress |
| `de-abasto-a-casa` | De Abasto a Casa | `meal_prep` | food-beverage | deabastoacasa.com.py | es | HubSpot, Mailchimp, GA4 | In progress |
| `dayah-litworks` | Dayah Litworks | `diseno_grafico` → `book_cover_designer` | portfolio-professional | dayah-litworks.com | es | HubSpot, Mailchimp, GA4 | In progress |

## Demo tenants (~15 under `sites/`)

Demo tenants exercise the engine across verticals and are not client work: `salon-maria` (peluqueria), `gymfit-py` (gimnasio), `spa-serenidad` (spa), and sushi / restaurant / egg-farm demos. They live alongside real tenants in `sites/` and follow the same schema. They ship in production behind the `/` landing for marketing showcase.

---

## Compliance templates per vertical

| Vertical / tenant concern | Template | Regulation |
|---|---|---|
| All Paraguay tenants | `src/compliance/privacy-policy-py.template.md` | Ley 1.682/01, 5.543/15, 6.534/20 |
| All tenants (generic) | `src/compliance/terms-of-service.template.md` | N/A (standard ToS) |
| Relocation / real-estate / financial | `src/compliance/aml-disclosure-nexa.template.md` | SEPRELAD (Paraguay AML) |
| Food-beverage | `src/compliance/inan-food-disclaimer.template.md` | INAN (Paraguay food safety) |
| GDPR-scope tenants | `src/compliance/cookie-classification.json` | GDPR Art. 6, CNIL, ePrivacy |

A tenant declares which compliance docs to include in its `site.json`; `src/compliance/` provides the master text.

---

## Tenant directory schema

```
sites/<slug>/
├── site.json              required
│   ├── slug                tenant id (must match dir name)
│   ├── displayName
│   ├── hostnames           [ "nexaparaguay.com" ]
│   ├── businessType         e.g. "relocation"
│   ├── verticalId           optional — inherited from businessType if missing
│   ├── defaultLocale        e.g. "es"
│   ├── locales              [ "es", "en", "de", "nl" ]
│   ├── features             { booking: true, blog: true, … }
│   └── integrations         { booking: "calendly", crm: "hubspot", email: "mailchimp", analytics: "ga4" }
│
├── tokens.json            optional  — brand-color overrides
│
├── pages/                 required — at minimum home.json
│   └── <page>.json
│       ├── slug            ""  for home, else path segment
│       ├── titleKey        i18n key (resolved from content/)
│       ├── descriptionKey
│       └── sections[]      ordered list: { id, variant, content }
│
├── content/               required — at minimum <defaultLocale>.json
│   └── <locale>.json       deeply-keyed copy; referenced by content keys in pages/
│
├── blog/                  optional — per-locale markdown
│   └── <locale>/*.md
│
├── assets/                optional — tenant-owned images
│
└── docs/                  optional — stakeholder / ops docs for this tenant
```

See a live example: `sites/nexa-paraguay/` (4-locale relocation site with 10 blog posts).

---

_Last reviewed: April 2026. When adding a tenant or business type, update this file in the same PR._
