# Tenant Upgrade: nudo

## Current Problems
1. **`letras` page has only `hero` section** — renders as a blank page with just a heading.
2. **`shows` page uses `features`** — should use `event-venues` or `class-schedule` for show dates.
3. **`musica` and `videos` pages overlap** — both have hero + gallery, nearly identical.
4. **No ticket/show booking integration** — eventsCalendar feature enabled but not used.
5. **No custom domain** — needed for a music act.
6. **Homepage has `programs-comparison` section** — irrelevant for a music band.

## Changes

### File: `sites/nudo/pages/letras.json`
Remove or add content:
```json
{
  "slug": "letras",
  "titleKey": "letrasPage.seo.title",
  "descriptionKey": "letrasPage.seo.description",
  "sections": [
    { "id": "header", "variant": "standard", "content": "navigation" },
    { "id": "hero", "variant": "minimal", "content": "letrasPage.hero" },
    { "id": "gallery", "variant": "grid", "content": "letrasPage.lyrics" },
    { "id": "footer", "variant": "standard", "content": "footer" },
    { "id": "whatsapp-float", "variant": "standard", "content": "whatsapp" }
  ]
}
```

### File: `sites/nudo/pages/shows.json`
Replace features with eventsCalendar:
```json
{
  "slug": "shows",
  "titleKey": "showsPage.seo.title",
  "descriptionKey": "showsPage.seo.description",
  "sections": [
    { "id": "header", "variant": "standard", "content": "navigation" },
    { "id": "hero", "variant": "minimal", "content": "showsPage.hero" },
    { "id": "event-venues", "variant": "grid", "content": "showsPage.events" },
    { "id": "footer", "variant": "standard", "content": "footer" },
    { "id": "whatsapp-float", "variant": "standard", "content": "whatsapp" }
  ]
}
```

### File: `sites/nudo/pages/home.json`
Replace `programs-comparison` with `events-calendar` or remove it:
Remove the programs-comparison entry.

### File: `sites/nudo/content/es.json`
Add showsPage.events data with show dates, venues, ticket links.

## Verification
- [ ] letras page shows lyrics content
- [ ] shows page shows event calendar
- [ ] No programs-comparison on music band homepage
- [ ] Build passes
