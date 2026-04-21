# Leads repo audit · paragu-ai-leads

Read-only audit of `Ai-Whisperers/paragu-ai-leads` (private, default branch `main`, last push 2026-04-19, 75 files, ~7.1 MB, no license file despite README claim, no issues / PRs / topics).

---

## 1. Inventory

**Format:** Three CSVs in `data/processed/` (no DB, no JSON-per-business).

| File | Rows / Size | Purpose |
|---|---|---|
| `paraguay_beauty_prioritized.csv` | 7,463 / 1.6 MB | Master dataset |
| `paraguay_priority_a.csv` | 3,960 / 864 KB | High-score subset |
| `paraguay_priority_b.csv` | ~2,836 / 627 KB | Medium-score subset |
| `data/processed/deep_analysis_summary.json` | 28 KB | Aggregates per category & city |
| `data/processed/business_requirements_analysis.json` | 15 KB | Feature requirements rollup |

**CSV schema (16 cols, BOM-prefixed):** `name, category, subcategory, city, neighborhood, address, lat, lng, phone, website, rating, total_reviews, has_website, deep_score, priority, types`. The exported CSV is a thin slice of a much richer `Business` dataclass (`src/models.py:11-89`) which has ~70 fields including `place_id`, `international_phone`, `business_hours`, `photos`, `editorial_summary`, `lead_score`, etc. — **all dropped on export.**

**Verticals (12, beauty/wellness only):** Peluqueria 1,293 · Salon de Belleza 1,210 · Gimnasio/Fitness 1,073 · Otros 963 · Spa/Wellness 864 · Barberia 778 · Uñas/Nails 595 · Tatuajes/Piercing 275 · Maquillaje 174 · Estetica/Facial 169 · Pestañas/Cejas 49 · Depilacion 20.

**Geographic claim:** "209 cities" / "Cities Covered 209" in README. **Reality: 210 distinct `city` values, but ~115 are garbage** (postal-code fragments like `"282"`/`"294"`/`"000"`/`"07"`/`"c"`, neighborhood names, misspellings: `"Cuidad del Este"`, `"Ciudad del Est"`, `"Hernandaria"`, `"Roque Alonso"`, `"Mariano R Alonso"`, `"VILLA"`/`"Villa"`, `"concepcion"`/`"Concepción"`, `"alberdi"`/`"Alberdi"`, plus **non-Paraguay rows** — `Medellín`, `Buenos Aires`, `Santo Domingo`, `Philadelphia`, `Caguas`, `Humacao`, `Guaynabo`, `Bahía Blanca`, `Montevideo`, `Panamá`). The 46 cities the scraper actually targets are listed in `scripts/scrape_nationwide.py:34-83` — anything outside that list is contamination from radius spillover.

**Per-business missingness (from CSV sample + summary):** website 75% missing (5,602/7,463) — this is the headline stat, **but it's poorly defined** (see §2). Phone 81% present (6,079/7,463). `neighborhood` is empty for nearly all non-Asunción rows (analyzer only knows 22 Asunción coords, see `src/config.py:NEIGHBORHOODS_ASUNCION`). No social handles, no email, no opening hours, no photos in the exported CSV (they exist in the model but aren't dumped).

## 2. Data quality

- **Stale.** Footer says "Extraction Date: April 2025" but README/PROJECT_INDEX say "Last Updated: April 2026". Pick one. At minimum 1 year old; Google Places data decays fast (closed shops, new sites).
- **Likely duplicates.** The scraper de-dupes on `place_id` in-checkpoint (`scrape_nationwide.py:235`), but never normalises business name. Multi-keyword + radius overlap across 46 cities × 17 keywords means the same shop gets hit many times; Google sometimes returns slightly different `place_id`s after re-indexing. No name+lat+lng dedupe pass exists.
- **City field is dirty.** ~55% of distinct `city` values are noise (see §1). Aggregation in the summary (`Asunción: 492` etc.) is roughly OK because the long tail is rare, but any per-city UI segment will look broken.
- **`has_website` is misleading.** The CSV column is `bool(website_string_present)`. The richer fields (`website_is_social_only`, `website_is_free_builder`, `website_redirects_to_social`, `website_status`) implemented in `src/analyzer.py:_analyze_website` are computed but **never exported to CSV**. So "75% sin web" almost certainly **understates** the real opportunity (Instagram-only and Wix sites are counted as "has website" in the CSV).
- **Web verification is opportunistic.** `analyzer.py:88-117` does a 10s `HEAD` request with no retries, no caching, no User-Agent — many false `unreachable`/`timeout` results.
- **Lead score is hand-tuned, not validated.** `_compute_lead_score` (`analyzer.py:121-159`) is +5/+10/+15 buckets with no calibration against actual conversion data.
- **Provenance per-row:** `scraped_at` exists in the model but is **dropped from CSV**, so you can't tell which rows are 6 months stale vs 2 weeks stale.
- **No `place_id` in CSV.** The export drops it (`exporter.py` style). Means leads can't be merged back against fresh Google pulls.

## 3. Provenance

- **Source:** Google Maps Places API (legacy, via `googlemaps==4.10.0`, see `requirements.txt:1`). Scraper at `scripts/scrape_nationwide.py`. Calls `places_nearby` and `places` (text search) + per-place `place(...)` details.
- **Method:** 46 hardcoded city centroids × 17 base keywords + 17 extra keywords ≈ 1,564 queries, with checkpoint resume (`CHECKPOINT = "data/py_beauty_checkpoint.json"`).
- **Legality:** Google ToS allows caching place IDs and basic data; **storing phone/address indefinitely and redistributing is in a gray zone**, especially under Paraguay's Ley 6534/2020 (data protection). No consent record per business. README's `License: MIT` claim conflicts with ToS — MIT can't license data you don't own.
- **Documentation:** No `METHODOLOGY.md`, no record of API spend, no provenance per row. Only README's one-liner "Data Source: Google Maps Places API".

## 4. Documentation

Strong narrative docs (28 markdown files under `docs/`, ~250 KB), heavy on strategy/wireframes/pricing. **Weak on the data itself:** no schema doc, no data dictionary, no methodology, no contribution guide, no `CHANGELOG`, no LICENSE file (despite "License: MIT" claim in README), no `CODE_OF_CONDUCT`/`SECURITY`. `docs/06_builder_integration/BUILDER_EXTRACTION_MAP.md` is the cleanest piece — it explicitly maps lead-repo content to builder paths.

## 5. Tooling

- **Tests:** zero. No `tests/`, no pytest config.
- **CI:** zero. No `.github/`, no pre-commit hooks, no linting config.
- **Code health:** `src/__pycache__/*.pyc` is **committed** despite being in `.gitignore:2-3`. 6 redundant scrape scripts (`scrape_beauty.py`, `_v2`, `_expanded`, `_final`, `_resume`, plus `scrape_nationwide.py`) — PROJECT_INDEX even admits "*Multiple versions exist ... these are development iterations*". Two near-duplicate merge scripts (`merge_quick.py`, `merge_nationwide.py`, `merge_and_export.py`).
- **Type hints:** present on `src/models.py` and api_client signatures, absent on most analyzer/script code.

## 6. Concrete improvements

| # | Item | Priority | Effort |
|---|---|---|---|
| 1 | **Re-export CSV with full schema** — add `place_id`, `scraped_at`, `website_status`, `website_is_social_only`, `website_is_free_builder`, `website_redirects_to_social`, `lead_score`. Fixes the misleading "75% sin web" claim (real number is likely 85%+ once IG-only and Wix are excluded). | **P0** | 2h |
| 2 | **City normalisation pass.** Add `scripts/clean_cities.py` with a canonical alias map (`Cuidad del Este`→`Ciudad del Este`, `Roque Alonso`→`Mariano Roque Alonso`, etc.) and drop / re-geocode the ~115 garbage values + foreign cities. | **P0** | 4h |
| 3 | **Dedupe pass on name+lat+lng.** Even with `place_id` dedup, scrape iterations can introduce dupes. Add `scripts/dedupe.py` with fuzzy-match + 50m proximity. | **P0** | 3h |
| 4 | **Add LICENSE file or remove the MIT claim** from README + clarify data redistribution terms re Google ToS + Paraguay Ley 6534/2020. Without this, downstream use in `paragu-ai-builder` carries legal risk. | **P0** | 1h |
| 5 | **Document provenance.** Create `docs/METHODOLOGY.md` covering scrape date(s), query coverage, known gaps, refresh cadence, ToS posture. Required if you cite "7,463 negocios" on the public marketing site. | **P1** | 3h |
| 6 | **Refresh the dataset.** Re-run `scrape_nationwide.py` for any rows where `scraped_at < 90 days ago`. Status field will catch closed shops. Budget ~$50-200 in Places API depending on details fetches. | **P1** | 1d (compute) |
| 7 | **Replace `__pycache__/` commit + delete 5 redundant scrape scripts.** Keep only `scrape_nationwide.py`. Add a real `.gitattributes` and run `git rm --cached -r src/__pycache__/`. | **P1** | 1h |
| 8 | **Calibrate `lead_score`.** Take the 6 real clients in `paragu-ai-builder` (3 Nexa + 3 PY SMBs) and back-test which scores they would have received. Tune the buckets in `src/analyzer.py:121-159`. | **P1** | 4h |
| 9 | **Expand neighborhoods beyond Asunción.** `NEIGHBORHOODS_ASUNCION` (22 entries) is the only geocoder; that's why nearly all non-Asunción rows have empty `neighborhood`. Add CDE / San Lorenzo / Encarnación dictionaries, or call Google reverse-geocode once per row. | **P1** | 6h |
| 10 | **Add minimal CI** — `pytest` smoke tests on parsers + ruff/black + a CSV-shape integration test that fails if the export schema regresses. | **P2** | 4h |
| 11 | **Enrich with social handles + opening hours.** Already in the `Business` model, just not exported. Adds significant value for outreach / pre-filling builder content. | **P2** | 3h |
| 12 | **Publish a stable JSON view** at `data/processed/leads.v1.json` (versioned schema) for `paragu-ai-builder` to consume directly via the build pipeline, instead of CSV scraping. | **P2** | 4h |

---

## Source files cited

- Repo root: <https://github.com/Ai-Whisperers/paragu-ai-leads>
- `README.md` — headline metrics & "License: MIT" claim
- `PROJECT_INDEX.md` — admits redundant scripts
- `src/models.py:11-89` — full `Business` schema
- `src/api_client.py:11-44` — Google fields requested
- `src/analyzer.py:88-117` — website analysis (computed but unexported)
- `src/analyzer.py:121-159` — lead score formula
- `src/config.py:NEIGHBORHOODS_ASUNCION` — Asunción-only geocoder, 22 points
- `scripts/scrape_nationwide.py:34-83` — 46 target cities
- `data/processed/paraguay_beauty_prioritized.csv` — 16-col CSV header
- `data/processed/deep_analysis_summary.json` — 210 city values, ~115 noisy
- `docs/06_builder_integration/BUILDER_EXTRACTION_MAP.md` — handoff map to builder
- `.gitignore:2-3` — vs committed `src/__pycache__/`

_Audit date: 2026-04-20_
