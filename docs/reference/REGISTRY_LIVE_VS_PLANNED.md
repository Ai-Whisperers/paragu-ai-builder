# Registry: Live vs Planned

> Documents the relationship between the current live registry entries and the planned business type catalog.

## Overview

This document tracks the gap between planned business types (roadmap, backlog, or future intentions) and the actual live registry entries currently available in `src/registry/`.

## Live Registry

**As of April 2026**

- **Total entries**: 1,970 business types
- **Coverage**: Multi-tenant marketing site engine serving 20+ business verticals
- **Status**: Production-ready registry for website generation

**Verticals represented:**
- Food & Beverage (restaurant, cafe, bar, bakery, catering, etc.)
- Health & Wellness (medical, dental, fitness, spa, therapy, etc.)
- Beauty & Personal Care (hair salon, barbershop, nail salon, etc.)
- Home & Garden (construction, plumbing, electrical, landscaping, etc.)
- Retail & Shopping (clothing store, electronics, grocery, etc.)
- Professional Services (legal, accounting, consulting, IT, etc.)
- Arts & Entertainment (music, photography, theater, event planning, etc.)
- Automotive & Transportation (repair, rental, logistics, etc.)
- Education & Training (school, tutoring, training center, etc.)
- Hospitality (hotel, restaurant, travel agency, etc.)

## Planned Registry

> **NOTE**: This section should be populated based on business backlog, roadmap, or strategic priorities.

Currently, there is **no separate planned registry** documented in the repository. All business types in `src/registry/` are considered live and production-ready.

## Entry Status Categories

| Category | Count | Examples |
|---|---|---|
| **Has schema** | 23 | `relocation`, `consultoria`, `restaurant`, `barberia`, etc. |
| **Has schema scaffold** | 1,947 | All other registry entries (generated via scaffold-missing.ts) |
| **No schema** | 0 | All entries now have either full schema or scaffold |
| **Has content template** | TBD | Needs review of src/content/ |
| **Has token overrides** | TBD | Needs review of src/tokens/ |

## Schema Coverage

**Generation date**: April 24, 2026

- **Base schemas**: 1 (`base-business.schema.json`)
- **Domain-specific schemas**: 23 (relocation, consultoria, meal_prep, peluqueria, spa, etc.)
- **Scaffolds generated**: 1,947 (all missing registry entries)

**Schema coverage**: **100%** - every registry entry now has either a full schema or a scaffold ready for extension.

## Next Steps

1. **Complete schema implementations**: Review 1,947 scaffolds and add domain-specific properties
2. **Content templates**: Verify Spanish copy templates exist in `src/content/`
3. **Token overrides**: Ensure design tokens exist for all verticals in `src/tokens/`
4. **Registry completeness**: Audit registry entries for missing metadata (SEO, features, etc.)
5. **Documentation**: Create per-vertical onboarding guides

## Related Documentation

- [SECTIONS.md](./SECTIONS.md) - Full catalog of section components
- [API.md](./API.md) - REST API endpoints
- [TENANTS.md](./TENANTS.md) - Multi-tenant architecture
- [ADD_NEW_VERTICAL.md](../runbooks/ADD_NEW_VERTICAL.md) - Adding new business types

---

_Last updated: April 24, 2026_
