# Nexa Paraguay — Ads asset library

Inventory of the 22 pre-rendered paid-ad creatives in
`sites/nexa-paraguay/images/ads/`. Each is indexed in
`sites/nexa-paraguay/images.json` under the `ads.*` bucket.

These are template creatives designed to be paired with channel-specific
copy. Replace with performance-proven variants after the first
optimization cycle. Consent note: no real human faces in these — either
back-shots, silhouettes, or still-life compositions.

## Meta (Facebook + Instagram) — 8 creatives

4 feed (1:1) + 4 story (9:16), one per locale.

| Manifest key               | File                      | Placement                | Locale | Campaign angle                                  | Headline seed                          |
| -------------------------- | ------------------------- | ------------------------ | ------ | ----------------------------------------------- | -------------------------------------- |
| `ads.metaFeedNl`           | `meta-feed-nl.png`        | Meta Feed (1:1)          | nl     | Lead gen — residency in one trip                | "In één reis naar Paraguay"            |
| `ads.metaFeedEn`           | `meta-feed-en.png`        | Meta Feed (1:1)          | en     | Lead gen — residency in one trip                | "One trip. Residency. Bank account."   |
| `ads.metaFeedDe`           | `meta-feed-de.png`        | Meta Feed (1:1)          | de     | Lead gen — residency in one trip                | "In einer Reise nach Paraguay"         |
| `ads.metaFeedEs`           | `meta-feed-es.png`        | Meta Feed (1:1)          | es     | Lead gen — residency in one trip                | "En un solo viaje a Paraguay"          |
| `ads.metaStoryNl`          | `meta-story-nl.png`       | Meta Story (9:16)        | nl     | Brand awareness — professional relocation       | "Residency in Paraguay — NL market"    |
| `ads.metaStoryEn`          | `meta-story-en.png`       | Meta Story (9:16)        | en     | Brand awareness — professional relocation       | "Residency in Paraguay — EN market"    |
| `ads.metaStoryDe`          | `meta-story-de.png`       | Meta Story (9:16)        | de     | Brand awareness — professional relocation       | "Residency in Paraguay — DE market"    |
| `ads.metaStoryEs`          | `meta-story-es.png`       | Meta Story (9:16)        | es     | Brand awareness — professional relocation       | "Residencia en Paraguay — ES"          |

## LinkedIn — 8 creatives

4 institutional-trust + 4 investor-angle, one per locale.

| Manifest key                 | File                         | Placement              | Locale | Campaign angle                         | Headline seed                                                |
| ---------------------------- | ---------------------------- | ---------------------- | ------ | -------------------------------------- | ------------------------------------------------------------ |
| `ads.linkedinTrustNl`        | `linkedin-trust-nl.png`      | LinkedIn Sponsored     | nl     | Institutional trust                    | "Geïntegreerd systeem, geen gestoría"                        |
| `ads.linkedinTrustEn`        | `linkedin-trust-en.png`      | LinkedIn Sponsored     | en     | Institutional trust                    | "An integrated system — not an agency"                       |
| `ads.linkedinTrustDe`        | `linkedin-trust-de.png`      | LinkedIn Sponsored     | de     | Institutional trust                    | "Integriertes System — keine Agentur"                        |
| `ads.linkedinTrustEs`        | `linkedin-trust-es.png`      | LinkedIn Sponsored     | es     | Institutional trust                    | "Un sistema integral — no una gestoría"                      |
| `ads.linkedinInvestorNl`     | `linkedin-investor-nl.png`   | LinkedIn Sponsored     | nl     | Investor angle                         | "10% vennootschap — territoriaal"                             |
| `ads.linkedinInvestorEn`     | `linkedin-investor-en.png`   | LinkedIn Sponsored     | en     | Investor angle                         | "10% corporate tax — territorial system"                     |
| `ads.linkedinInvestorDe`     | `linkedin-investor-de.png`   | LinkedIn Sponsored     | de     | Investor angle                         | "10% Körperschaft — territorial"                              |
| `ads.linkedinInvestorEs`     | `linkedin-investor-es.png`   | LinkedIn Sponsored     | es     | Investor angle                         | "10% corporativo — régimen territorial"                       |

## Google Display — 4 creatives

One per standard IAB size. Locale-agnostic headline placeholder embedded
in the creative.

| Manifest key          | File                 | Placement          | Size     | Campaign angle                                 |
| --------------------- | -------------------- | ------------------ | -------- | ---------------------------------------------- |
| `ads.google728x90`    | `google-728x90.png`  | Google Display     | 728×90   | Leaderboard — desktop article premium          |
| `ads.google300x250`   | `google-300x250.png` | Google Display     | 300×250  | Medium rectangle — sidebar / inline            |
| `ads.google336x280`   | `google-336x280.png` | Google Display     | 336×280  | Large rectangle — sidebar / inline             |
| `ads.google970x250`   | `google-970x250.png` | Google Display     | 970×250  | Billboard — desktop premium                    |

## YouTube — 2 creatives

Pre-roll thumbnails. The actual 15-30s bumper videos are not in this
repo; these are the poster frames used for click-through creative.

| Manifest key         | File                 | Placement            | Locale | Angle                                                    |
| -------------------- | -------------------- | -------------------- | ------ | -------------------------------------------------------- |
| `ads.youtubeThumb1`  | `youtube-thumb-1.png`| YouTube pre-roll      | all    | Founder silhouette against Asunción skyline              |
| `ads.youtubeThumb2`  | `youtube-thumb-2.png`| YouTube pre-roll      | all    | Cédula placed on passport — tactile proof close-up       |

## Totals

- Meta: 8 (4 feed + 4 story)
- LinkedIn: 8 (4 trust + 4 investor)
- Google Display: 4 (IAB sizes)
- YouTube: 2 (pre-roll thumbnails)
- **Total: 22** — matches `images.json` ads bucket size.

## Workflow notes

- Source prompts: `docs/IMAGE_GENERATION_PROMPTS.md § paid-ads`.
- Rotate after 2 weeks or when CTR drops below benchmark — whichever
  first. Keep retired creatives in the repo for regression A/B testing.
- Add a `utm_campaign` matching the manifest key when linking (e.g.
  `utm_campaign=ads.linkedinTrustEn`) so analytics can tie back to the
  source file without ambiguity.
