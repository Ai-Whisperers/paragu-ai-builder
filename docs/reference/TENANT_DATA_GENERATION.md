# Tenant Data Generation Reference

> How tenant websites are generated from configuration files.

## Generation Pipeline

```
Registry entry → Schema → Content template → Tokens → Site files
```

## Directory Structure

### `src/registry/<id>.type.json`
Business type definition with:
- `nameEs` / `nameEn` - Display names
- `verticalId` - Parent vertical
- `pages` - Page structure with section lists
- `features` - Feature flags (booking, ordering, gallery, etc.)
- `seo` - SEO metadata with `{{placeholder}}` templates
- `hero` - Hero section defaults
- `nav` - Navigation items and CTA

### `src/schemas/<id>.schema.json`
JSON Schema for business type data input:
- Extends `base-business.schema.json` via `allOf`
- Adds domain-specific properties
- `inputForm` section with priority1/2/3 for form ordering
- Generated via `scripts/schemas/scaffold-missing.ts`

### `src/tokens/<id>.tokens.json`
Design tokens (colors, fonts):
- Inherits from `base.tokens.json`
- Vertical-specific overrides
- Tenant-specific brand overrides in `sites/<slug>/tokens.json`

### `src/content/<id>.content.json`
Per-locale content templates with `{{placeholders}}`.

## Adding a New Business Type

1. Create registry entry in `src/registry/<id>.type.json`
2. Run `node scripts/schemas/scaffold-missing.ts --dry-run` to preview schema
3. Run without `--dry-run` to generate schema scaffold
4. Edit generated schema to add domain-specific properties
5. Create content template in `src/content/`
6. Create token overrides in `src/tokens/` (optional)

## Schema Coverage

100% - every registry entry has either a hand-written schema or a scaffold.
- **Hand-written**: 23 schemas (core business types)
- **Scaffolded**: 1,947 schemas (generated via scaffold-missing.ts)

## Validation

CI check (`scripts/validate-registry-schemas.ts`) ensures every registry entry has a schema.
Fails the build if a registry entry is missing its schema file.

---

_Last updated: April 24, 2026_
