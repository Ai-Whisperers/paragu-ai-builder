# Testimonials gating — Nexa Paraguay

**Status:** OFF. `features.testimonials` is `false` in `site.json`.
Keep it that way until every checklist item below is green.

## Why this is gated

The 5 portraits in `sites/nexa-paraguay/images/testimonials/testimonial-client-*.png`
are **AI-generated placeholder faces**, not real clients. Shipping them to
production as "testimonios de clientes reales" would be:

1. **A GDPR problem.** Synthetic likenesses sold as real people = unlawful
   processing of "personal data" (biometric) without a lawful basis.
2. **A consumer-trust problem.** The Paraguayan consumer protection law
   and our own `/privacidad` page explicitly promise truthfulness of
   claims and testimonials.
3. **A reputation problem.** "Fake testimonial" screenshots become viral
   very fast.

See `sites/nexa-paraguay/docs/IMAGE_GENERATION_PROMPTS.md` line 5
(Ethics note) and § testimonials for the canonical rule.

## How to turn testimonials ON

All three steps required. Do them in order:

### 1. Replace the placeholder images

For each of the 5 clients whose testimonial is in `testimonials.json`:

- [ ] Obtain a GDPR-compliant **signed consent form** covering:
  - right to publish name, role, city
  - right to publish photograph
  - duration and revocation rights
- [ ] Collect a real photograph (or an illustrated avatar they
  explicitly chose).
- [ ] Save the new file at the same path
  `sites/nexa-paraguay/images/testimonials/testimonial-client-N.png`
  (keeping the stable filename lets us leave `testimonials.json` alone).

### 2. Remove the placeholder hash gate

- [ ] Run `cd web && npm run validate:tenant-images -- nexa-paraguay` —
  it must exit zero.
- [ ] The validator hard-blocks deployment when `site.json` has
  `isLiveProduction: true` and any placeholder SHA-256 still matches
  the hashes recorded in `docs/PLACEHOLDER_HASHES.json`. Once every
  portrait is swapped this check passes automatically.

### 3. Flip the feature flag

- [ ] Set `"testimonials": true` in `sites/nexa-paraguay/site.json`
  under `features`.
- [ ] Re-run `npm run generate:tenant-data` and `npm run validate:tenant-images`.
- [ ] Deploy.

## Until then

- Content files may reference testimonial copy; the `enabledWhen: testimonials`
  guard on the home-page section skips it at composition time.
- `testimonials.json` carries the full data structure (names, quotes,
  image paths) so the flip itself is a one-line change once the ethics
  prerequisites are met.
- Any PR that both flips `features.testimonials=true` AND keeps
  placeholder hashes is a blocker — reviewers MUST reject.
