# Global Business Taxonomy — Master Hierarchy

> Research-backed global vertical and sub-vertical structure for universal SMB website generation. Cross-references NAICS 2022, ISIC Rev.4, Schema.org LocalBusiness, Google Business Profile (~4000 categories), Yelp (~1400), Meta Business Categories.
>
> **Companion doc**: [GLOBAL_BUSINESS_TYPE_ENUMERATION.md](./GLOBAL_BUSINESS_TYPE_ENUMERATION.md) — exhaustive 1,736-type list per sub-vertical.

## Methodology

This hierarchy was constructed by cross-referencing six authoritative taxonomies and reconciling their overlaps:

- **NAICS 2022** (20 two-digit sectors, North American standard, statistically rigorous but industrial-heavy)
- **ISIC Rev.4** (UN's 21 top-level sections, global coverage including informal economies)
- **Schema.org LocalBusiness** (~75 direct subtypes plus ~40 inherited from Organization — the web-semantic baseline)
- **Google Business Profile** (~4,000 leaf categories under ~10 parent groupings, the de facto consumer-discovery taxonomy)
- **Yelp** (22 parent categories, ~1,400 leaves — heavily weighted toward consumer-facing SMBs)
- **Meta Business Categories** (which skews toward lead-gen advertiser segments)

Where taxonomies disagree — notably Schema.org grouping veterinary under MedicalBusiness while NAICS puts it under Professional/Scientific — this hierarchy follows the grouping that shares section-set and form-shape with peer businesses (so veterinary lives under health-wellness). Regulated or culturally sensitive verticals (finance, healthcare, death-care, cannabis, gambling, religion) are kept as distinct top-levels rather than folded in, because they demand different legal disclaimers, consent flows, and content guardrails even when section composition looks similar.

---

## Master Vertical Table (22 Top-Level Verticals)

| ID | Name (Es) | Name (En) | Sub-verticals | Regulation | B2B/B2C | Representative Types | Notes |
|---|---|---|---|---|---|---|---|
| beauty-personal-care | Belleza y Cuidado Personal | Beauty & Personal Care | 10 | Low | B2C | peluqueria, unas, tatuajes | **Existing.** Appointment-heavy, visual-heavy. |
| health-wellness | Salud y Bienestar | Health & Wellness | 12 | **High (HIPAA/GDPR-health)** | B2C + some B2B | dental, primary-care, veterinary | **Existing.** Consent + disclaimers mandatory. |
| food-beverage | Comida y Bebidas | Food & Beverage | 9 | Medium (alcohol, halal/kosher) | B2C | restaurant, cafe, bakery | **Existing.** Menu + ordering + reservations. |
| hospitality-tourism | Hospedaje y Turismo | Hospitality & Tourism | 9 | Medium | B2C + B2B events | hotel, tour-operator, hostel | **Existing.** Booking engine + availability. |
| service-booking | Reservas de Servicios | Appointment-Based Services | 8 | Low | Mixed | photography, coaching, event-dj | **Existing.** Generic booking shell. |
| portfolio-professional | Portafolio Profesional | Creative Portfolio | 8 | Low | B2B + B2C | graphic-design, architect, videographer | **Existing.** Gallery + case studies + contact. |
| trades-home-services | Oficios y Servicios del Hogar | Trades & Home Services | 14 | Medium (licensing) | B2C + light B2B | plumber, electrician, hvac | **Existing.** Quote form + emergency CTA. |
| automotive | Automotriz | Automotive | 10 | Medium (dealer licensing) | B2C + fleet B2B | auto-repair, dealership, car-wash | **Existing.** Service scheduling + inventory. |
| retail-local | Comercio Minorista | Local Retail | 12 | Low | B2C | boutique, bookstore, florist | **Existing.** Catalog + hours + pickup. |
| education-training | Educación y Formación | Education & Training | 10 | Medium (**COPPA** for K-12) | Mixed | tutoring, language-school, coding-bootcamp | **Existing.** Enrollment + curriculum. |
| b2b-professional | Servicios Profesionales B2B | Professional B2B Services | 11 | Medium (legal/accounting) | B2B | law-firm, accounting, consulting | **Existing.** Lead-gen + content marketing. |
| real-estate-relocation | Bienes Raíces y Reubicación | Real Estate & Relocation | 8 | **High (fair-housing)** | Mixed | realtor, property-mgmt, relocation | **Existing.** Listings + IDX feeds. |
| trades-industrial | Industria y Manufactura | Industrial & Manufacturing | 10 | Medium (OSHA/CE) | B2B | machine-shop, fabrication, packaging | **New.** NAICS 31-33. Spec-sheet + RFQ. |
| agriculture-agribusiness | Agricultura y Agronegocios | Agriculture & Agribusiness | 9 | Medium (USDA/EU) | Mixed | farm-csa, vineyard, aquaculture | **New.** NAICS 11 / ISIC A. |
| logistics-transport | Logística y Transporte | Logistics & Freight | 8 | **High (DOT/IATA)** | B2B | trucking, freight-broker, 3pl | **New.** NAICS 48-49 split out. |
| finance-insurance | Finanzas y Seguros | Finance & Insurance | 10 | **Very High (SEC/FINRA/state-ins)** | Mixed | financial-advisor, ins-broker, credit-union | **New.** NAICS 52. Disclosure-heavy. |
| technology-digital | Tecnología y Digital | Technology & Digital | 9 | Low-Med (GDPR/CCPA) | B2B + prosumer | saas-vendor, it-msp, web-agency | **New.** Split from portfolio-professional. |
| arts-entertainment-venues | Artes y Entretenimiento | Arts & Entertainment Venues | 10 | Medium (venue/liquor) | B2C | theater, music-venue, gallery | **New.** Distinct from tourism. Ticketing. |
| sports-recreation | Deportes y Recreación | Sports & Recreation | 10 | Low-Med (**waivers**) | B2C | climbing-gym, golf-course, esports-arena | **New.** Separated from fitness (health-wellness). |
| pets-animals | Mascotas y Animales | Pets & Animals | 7 | Low-Med | B2C | pet-boarding, dog-training, pet-retail | **New.** Non-medical only; vet stays in health. |
| media-publishing | Medios y Publicación | Media & Publishing | 8 | Medium (press/copyright) | Mixed | local-news, podcast-studio, indie-publisher | **New.** Subscription + ad-sales shape. |
| membership-community | Membresías y Comunidad | Membership & Community | 10 | **Variable — religion/nonprofit** | B2C + B2B assoc. | nonprofit, church, trade-association | **New.** Consolidates nonprofits + religious + clubs. |
| death-care | Servicios Funerarios | Death Care | 5 | **High + culturally sensitive** | B2C | funeral-home, cemetery, cremation | **New.** Tone, language, imagery all different. |

---

## Migration Mapping (Current 12 → New 22)

| Current Vertical | Action | Target(s) |
|---|---|---|
| beauty-personal-care | **Keep** | beauty-personal-care |
| health-wellness | **Keep + expand** (absorb gyms/yoga, add vet, add medical-aesthetics) | health-wellness |
| food-beverage | **Keep** | food-beverage |
| hospitality-tourism | **Keep + narrow** (event-venues split to arts-entertainment-venues) | hospitality-tourism |
| service-booking | **Keep + narrow** (PT moves to health.fitness) | service-booking |
| portfolio-professional | **Split**: creative stays, tech moves to technology-digital | portfolio-professional + technology-digital |
| trades-home-services | **Keep** | trades-home-services |
| automotive | **Keep** | automotive |
| retail-local | **Keep + expand** (tobacco age-gated flag) | retail-local |
| education-training | **Keep** (add early-childhood with COPPA) | education-training |
| b2b-professional | **Split**: finance/accounting to finance-insurance, legal stays, tech consulting to technology-digital | b2b-professional + finance-insurance + technology-digital |
| real-estate-relocation | **Keep + expand** (add appraisal, title/escrow, moving) | real-estate-relocation |

**Net effect**: 12 → 22 top-levels (+10 new), 2 verticals split, 0 removed.

---

## Sub-Verticals per Top-Level (177 sub-verticals)

See [GLOBAL_BUSINESS_TYPE_ENUMERATION.md](./GLOBAL_BUSINESS_TYPE_ENUMERATION.md) for business types inside each sub-vertical.

### 1. beauty-personal-care (10 sub)
hair, nails, skin-aesthetic, body-hair-removal, makeup, tattoo-piercing, wellness-spa, mens-grooming, mobile-beauty, beauty-retail

### 2. health-wellness (12 sub)
primary-care, dental, mental-health, physical-therapy, alternative-medicine, diagnostics-imaging, vision-hearing, specialty-medical, senior-homecare, veterinary, medical-aesthetics, fitness-wellness

### 3. food-beverage (9 sub)
full-service-restaurant, quick-service, cafe-bakery, bar-nightlife, food-truck, catering, specialty-food-retail, beverage-production, meal-prep-delivery

### 4. hospitality-tourism (9 sub)
hotel-resort, short-term-rental, hostel-budget, tour-operator, travel-agency, event-venue, transport-tourism, rv-camping, specialty-lodging

### 5. service-booking (8 sub)
photography, events-entertainment, coaching, personal-training, tutoring-private, officiant-celebrant, home-organization, errands-concierge

### 6. portfolio-professional (8 sub)
graphic-design, architecture-interior, fine-arts, writing-editorial, videography-film, music-audio, fashion-design, industrial-product-design

### 7. trades-home-services (14 sub)
plumbing, electrical, hvac, roofing, general-contracting, painting-finishing, flooring, landscaping, cleaning-residential, cleaning-commercial, pest-control, handyman, pool-spa, locksmith-security

### 8. automotive (10 sub)
repair-maintenance, body-collision, dealership-sales, specialty-service, wash-detail, tuning-performance, ev-hybrid, towing-roadside, rv-boat-powersport, rental

### 9. retail-local (12 sub)
apparel-fashion, jewelry-accessories, home-furnishings, hardware-garden, grocery-market, bookstore-hobby, florist, sporting-goods, electronics-appliance, toys-gifts, thrift-resale, tobacco-vape

### 10. education-training (10 sub)
tutoring-k12, test-prep, language, music-art, trade-vocational, tech-bootcamp, early-childhood, driving-school, corporate-training, online-courses

### 11. b2b-professional (11 sub)
legal, accounting-tax, management-consulting, marketing-agency, hr-recruiting, translation-localization, research-market, engineering-consulting, environmental-consulting, business-process-outsource, investigations-security

### 12. real-estate-relocation (8 sub)
residential-brokerage, commercial-brokerage, property-management, appraisal-inspection, relocation-services, moving-storage, title-escrow, land-development

### 13. trades-industrial (10 sub) — **NEW**
machining-fabrication, contract-manufacturing, printing-signage, packaging-labeling, industrial-equipment, textiles-apparel-mfg, food-processing, chemicals-materials, industrial-maintenance, recycling-waste

### 14. agriculture-agribusiness (9 sub) — **NEW**
crop-farming, livestock-ranch, csa-direct, specialty-crop, aquaculture, apiary, ag-services, ag-equipment, forestry

### 15. logistics-transport (8 sub) — **NEW**
trucking-freight, freight-brokerage, warehousing, courier-lastmile, marine-port, aviation-cargo, rail-intermodal, moving-specialty

### 16. finance-insurance (10 sub) — **NEW**
financial-advisory, accounting-bookkeeping, tax-prep, lending-retail, credit-union-community-bank, insurance-brokerage, insurance-specialty, fintech-local, crypto-local, debt-credit-services

### 17. technology-digital (9 sub) — **NEW**
it-managed-services, web-digital-agency, saas-vendor, cybersecurity, data-analytics, ai-ml-services, hardware-iot, av-integration, repair-tech

### 18. arts-entertainment-venues (10 sub) — **NEW**
live-music-venue, theater-performing, cinema, museum-gallery, comedy-club, escape-room-arcade, amusement-family, nightlife-club, casino-gambling, events-festivals

### 19. sports-recreation (10 sub) — **NEW**
climbing-adventure, racquet-sports, golf, water-sports, winter-sports, motorsports, team-sports-league, martial-arts, equestrian, esports-gaming

### 20. pets-animals (7 sub) — **NEW**
pet-grooming, pet-boarding-daycare, pet-training, pet-retail, pet-sitting-walking, animal-rescue-shelter, equestrian-breeding

### 21. media-publishing (8 sub) — **NEW**
local-news, magazine-niche, podcast-studio, indie-publisher, ad-media-local, content-creator, photo-stock-agency, print-distribution

### 22. membership-community (10 sub) — **NEW**
nonprofit-charity, religious-congregation, trade-association, professional-society, social-club, coworking-makerspace, fraternal-order, community-center, advocacy-civic, alumni-fan

### 23. death-care (5 sub) — **NEW**
funeral-home, cemetery-memorial, cremation, pre-planning, monument-headstone

---

## Anti-Recommendations (Do NOT add as verticals)

| Candidate | Why Not |
|---|---|
| **Government agencies** | Procurement-driven, no marketing funnel, bound by .gov brand standards and accessibility laws (Section 508) this engine does not validate against. |
| **Political parties / campaigns** | FEC/equivalent reporting, rapid content churn, platform TOS risk, moderation burden. Not a template-generator fit. |
| **Labor unions** | Legally distinct comms regimes (NLRA), member-auth portals, collective-bargaining content — purpose-built CMSes exist. |
| **Franchise locations of global chains** | Bound by franchisor brand systems (McDonald's, Subway, Re/Max). Generated sites would violate brand books. Target the franchisor, not the franchisee. |
| **Enterprise SaaS (>$10M ARR)** | Need ABM, intent data, enrichment, custom ICP flows. A template engine under-serves them and they won't pay template prices. |
| **Public hospitals / public schools / universities** | Procurement, accessibility (WCAG AAA often), FERPA/HIPAA at scale, student data laws. Vendor-locked to specialists (Finalsite, Blackboard). |
| **Chartered banks** | Core-system integration, examiner scrutiny. Community credit unions in finance-insurance stay, but chartered banks above a size threshold don't. |
| **Cannabis dispensaries** (as their own vertical) | Better handled as a **flag** on retail-local / agriculture — legality varies by state/country/municipality weekly. Flag, don't enshrine. |
| **Online-only marketplaces / pure e-commerce brands** | Shopify/WooCommerce/BigCommerce dominate; this engine's edge is local+appointment, not catalog depth + checkout. |
| **Adult entertainment** | Payment-processor restrictions, age-verification legal surface, ad-platform bans. Scope it out. |
| **Firearms sales** | ATF/FFL compliance, payment-processor restrictions, platform policy. Allow shooting-ranges as sports-recreation.motorsports instead. |
| **Individual influencers / personal brands** | Linktree/Beacons/Stan own this. Our section set is overkill. |

---

## Regulation & Sensitivity Flag Summary

**Highest-scrutiny verticals** (need dedicated legal/disclaimer templates, consent flows, and content guardrails before launch):
health-wellness, finance-insurance, real-estate-relocation (fair-housing), education-training (early-childhood COPPA subset), death-care, membership-community (religious sub), arts-entertainment-venues (gambling sub), retail-local (tobacco/vape sub), agriculture-agribusiness (hemp/cannabis sub).

**Culturally-variant verticals** (regional content packs mandatory; single Spanish/English copy deck insufficient):
death-care, membership-community.religious-congregation, food-beverage (halal/kosher/alcohol), arts-entertainment-venues.casino-gambling.

**B2B-dominant** (lead-gen shape, long forms, case-study sections):
b2b-professional, trades-industrial, logistics-transport, technology-digital (MSP/cyber/data sub-verticals), agriculture-agribusiness (ag-services/equipment), media-publishing (ad-sales sub).

**B2C-dominant** (booking/catalog/hours shape):
beauty-personal-care, health-wellness (most), food-beverage, retail-local, automotive (consumer sub), sports-recreation, pets-animals, death-care.

**Mixed** (need both funnels):
hospitality-tourism, education-training, real-estate-relocation, membership-community, finance-insurance.

---

## Sources

- [NAICS 2022 Manual](https://www.census.gov/naics/) — US Census Bureau
- [ISIC Rev.4](https://unstats.un.org/unsd/classifications/Econ/isic) — UN Statistics Division
- [Schema.org LocalBusiness](https://schema.org/LocalBusiness)
- [Google Business Profile Categories](https://support.google.com/business/answer/9270701) — Google Help
- [Yelp Category List](https://blog.yelp.com/businesses/yelp_category_list/)
- Meta Business Categories — inside Meta Business Manager
