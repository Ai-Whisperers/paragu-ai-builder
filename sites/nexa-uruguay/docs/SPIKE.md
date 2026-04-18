# Nexa Uruguay — reusability spike

Proof of plan's Phase-2 claim: "a new country is a config folder, not an engineering project."

## What was cloned

1. `sites/nexa-paraguay/pages/*.json` → `sites/nexa-uruguay/pages/*.json` (verbatim; renamed `por-que-paraguay.json` → `por-que-uruguay.json`)
2. `sites/nexa-paraguay/tokens.json` → swapped palette to Deep Teal (#123F5A) + same Champagne accent (#C9A96E)
3. Wrote `sites/nexa-uruguay/content/{en,es}.json` with Uruguay values (capital=Montevideo, currency=USD, taxRate=25% progressive, processWeeks=10–14, flag=🇺🇾)
4. `sites/nexa-uruguay/site.json` with Uruguay-only locales (en + es — smaller market, so NL/DE removed), 3 programs (dropped land purchase until scoped), different domain

## What did NOT change

- Zero lines of TypeScript
- Zero changes to the section catalog
- Zero changes to the compose engine
- Zero changes to adapters, routing, middleware
- CI validators pass unchanged

## How to verify

```bash
cd web
npm run validate:sites     # expects both nexa-paraguay and nexa-uruguay OK
npm run dev
# visit http://localhost:3000/s/en/nexa-uruguay  (rendered site)
# visit http://localhost:3000/s/es/nexa-uruguay  (rendered site)
```

## Time-to-new-country

If tokens + content are ready, spinning up country #3 (Costa Rica, Panama, Georgia, …) is a 1-hour task:

1. `cp -r sites/nexa-paraguay sites/nexa-<country>`
2. Edit `site.json`: domain, locales, country-specific placeholders.
3. Edit `tokens.json`: brand palette.
4. Replace `content/*.json` values (typically a translator + content-writer pass, not dev work).
5. `npm run validate:sites` → deploy.
