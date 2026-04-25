# Archived scripts

One-shot scripts that produced the current registry state. Kept here for audit
traceability — the types they created are now part of `src/registry/` and
maintained via the unified CLI (`npx tsx scripts/cli.ts`).

- `seed-types.ts` — first curated batch (10 P0 types)
- `seed-batch-2.ts` — hospitality + portfolio + real-estate (31 types)
- `seed-batch-3.ts` — P2 long-tail (73 types)
- `generate-static-config-monolithic.ts.archived` — old monolithic generator,
  superseded by the sharded version in `../generate-static-config.ts`

To add more types now, use:

```bash
npm run cli seed-from-enum                    # bulk from enumeration doc
npm run cli add-type <id> --vertical=<vid>    # single type
```
