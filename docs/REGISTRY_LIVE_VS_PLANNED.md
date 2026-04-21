# Registry · live vs planned

> **Generated 2026-04-20** from `src/registry/` and `src/content/`.
> Auto-regenerable: re-run `comm -23 <(ls src/registry/*.type.json | sed -E 's|.*/([^.]+)\..*|\1|') <(ls src/content/*.content.json | sed -E 's|.*/([^.]+)\..*|\1|')`

The registry has **1,942 type definitions**. Only **34** have backing content
(copy + tokens). The rest are **planned** — they exist as schema scaffolding
to support the eventual SEO and admin tooling but cannot be sold to a real
client today.

> **Why we don't physically move planned types to a `_planned/` subdir:** 1,902 of 1,942 type files declare `extends: <other-type>`. Any base type or intermediate type referenced by an extends chain must remain in `src/registry/` for the static-config generator (`web/scripts/generate-static-config.ts`) to compose them. Moving files would break the inheritance graph at runtime.

## ✅ Live (34) — productized today

These types have content templates in `src/content/<id>.content.json` and theme tokens in `src/tokens/<id>.tokens.json`. They can be sold to real clients without further authoring work.

```
barberia
cerrajero
consultoria
depilacion
diseno_grafico
educacion
egg_farm
electricista
estetica
fotografia_bodas
gimnasio
inmobiliaria
inversiones
kaiten_zushi
legal
maquillaje
meal_prep
panaderia
peluqueria
pestanas
pilates
plomero
relocation
restaurant
salon_belleza
salon_eventos
salud
spa
sushi_bar
taller_mecanico
tatuajes
unas
veterinaria
yoga
```

## 📋 Planned (1,908) — schema only

The remaining 1,908 types exist as schema definitions but have no content.
**Do not promise these to clients without first authoring their content + tokens.**
Adding a new "live" type takes ~2 hours per:
1. Author copy in Spanish targeting the vertical's needs (~1h)
2. Tune theme tokens for brand fit (~30 min)
3. Validate via `npm run validate:content` and `npm run validate:sites`
4. Add a demo route + sample content if linking from `/p/<rubro>`

## How the marketing site refers to this

The landing page now says **"Plantillas por rubro"** instead of "16 plantillas listas". The hero stat label changed from "Plantillas listas" → "Rubros cubiertos". This honestly reflects what's productized today.

When a prospect asks "do you have a template for X?":

- ✅ If `X` is in the live list above → "Yes, here's a demo: paragu-ai.com/p/<id>"
- ⚠️ If `X` is in the planned list → "Not yet productized — we can do it as a custom build (Plan Profesional) or add it to the queue"
- ❌ If `X` is not in the registry at all → "Not in scope yet, send me details"

## Build a new live type — checklist

Use this when promoting a planned type to live:

- [ ] `src/registry/<id>.type.json` exists (it does for all 1,942)
- [ ] `src/content/<id>.content.json` — author from a similar live type
- [ ] `src/tokens/<id>.tokens.json` — base tokens + brand override
- [ ] `npm run validate:content` passes
- [ ] `npm run validate:sites` passes
- [ ] Add to `web/lib/landing/marketing-data.ts` → TEMPLATES if it should appear in the vertical grid
- [ ] If `demoSlug` is set, also add a demo tenant under `sites/<demoSlug>/`
- [ ] `npm run generate:config` to refresh static-config shards

## When to revisit pruning

If/when content authoring tooling lets us bulk-bootstrap 50+ types from a
template, the planned-to-live ratio will improve and this doc becomes less
load-bearing. Until then, keep this list current as new types come online.
