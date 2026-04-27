# Plan: Consolidate and Standardize Supabase Migrations

## Current State

There are 35+ migration files in `supabase/migrations/` with three different naming conventions:

**Convention 1: Sequential (`000_`, `001_`, `002_`, `005_`)**
```
000_complete_schema.sql         (8 CREATE TABLE statements)
001_lead_scoring_view.sql
001_payment_provider_standardization.sql
002_mercadopago_examples.sql
005_add_performance_indexes.sql
```
- Conflict: `001_` is used twice
- Jump from `002_` to `005_` (003 and 004 don't exist)

**Convention 2: ISO Date (`20260417...`, `20260421...`)**
```
20260417000000_leads.sql
20260421000000_commerce_core.sql
20260421000100_commerce_phase2.sql
...
```
- Proper Supabase convention but mixed with sequential
- Deployment order depends on alphabetical sorting mixing with sequential

**Convention 3: Placeholder Date (`2026XXXX...`)**
```
2026XXXX_create_booking_system.sql
2026XXXX_create_class_schedule.sql
2026XXXX_create_staff_members.sql
```
- Never applied (placeholder dates)
- Unclear if these are pending or abandoned

### Problems

1. **Order uncertainty**: Alphabetical sort mixes conventions; `001_` sorts before `2026...`
2. **Duplicate 001**: Two files claim `001_` prefix
3. **Abandoned migrations**: `2026XXXX*` files have never been applied and may have bitrot
4. **No down migrations**: No way to roll back
5. **No schema version tracking**: No migration_state table or checksum verification

## Proposed Solution

### Phase 1: Audit Current State

1. Connect to Supabase and get the current schema state
2. Identify which migrations have been applied vs which are pending
3. For `2026XXXX*` files: decide apply, fix, or archive

### Phase 2: Squash and Rename

1. Create a single `000_baseline.sql` that represents the current schema state (dump of all applied migrations)
2. Rename pending migrations with sequential numbering: `001_feature_x.sql`, `002_feature_y.sql`
3. Archive abandoned migrations: move `2026XXXX*` to `_archive/` with a README

### Phase 3: Standardize Going Forward

```
supabase/migrations/
├── 000_baseline.sql          # Current schema (idempotent, rerunnable)
├── 001_feature_x.sql         # Next migration
├── _archive/
│   ├── 2026XXXX_create_booking_system.sql
│   ├── 2026XXXX_create_class_schedule.sql
│   └── README.md
```

### Naming Convention (going forward)

```
{NUMBER}_{short_description}.sql
```
Where `{NUMBER}` is always 3 digits starting from applied migrations. No ISO dates, no placeholders.

### Migration Template

```sql
-- migration_name: 001_add_business_seo_fields
-- applied_at:      (filled by CI)
-- description:     Add SEO fields to businesses table

-- BEGIN BUNDLE (runs in transaction)
BEGIN;

-- Your migration here
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS meta_description text;

COMMIT;
-- END BUNDLE
```

## Files to Touch

| File | Change |
|---|---|
| `supabase/migrations/000_complete_schema.sql` | RETAIN as reference |
| `supabase/migrations/2026XXXX_create_booking_system.sql` | Audit → fix → apply OR archive |
| `supabase/migrations/2026XXXX_create_class_schedule.sql` | Same |
| `supabase/migrations/2026XXXX_create_staff_members.sql` | Same |
| `supabase/migrations/_archive/` | NEW directory for abandoned migrations |
| `docs/DEPLOYMENT.md` | Update migration procedure |

## Effort & Risk

- **Effort**: Small (1-2 hours for audit + rename)
- **Risk**: Low — schema isn't changing, just the file naming
- **Requires**: Supabase project access to check applied state

## Success Criteria

- [ ] All migration files follow one naming convention
- [ ] `000_baseline.sql` represents the exact current schema
- [ ] No `2026XXXX*` placeholder files in active migrations
- [ ] README in `_archive/` explains why each file was archived
