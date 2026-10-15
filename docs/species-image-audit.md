# Species image audit — 2026-10-15

## Verified locally

Run `node scripts/check-species-images.cjs`.

- 589 deduplicated records: 377 animals, 193 plants/fungi/microbes, 19 other records.
- All 589 have image paths. All 588 distinct referenced seed image files exist and have readable dimensions (checked with Sharp).
- All entries in the generated image manifest also point to readable files.
- Empty/whitespace legacy image values resolve to bundled images; custom images are preserved. Legacy slug aliases are covered.
- `npx tsc --noEmit` passes.

## Data-loading defect

`withSeedImages()` enriches the source seed exports only. Neon seeds only when both species and posts are empty. Existing Neon rows therefore do not automatically receive later image additions. Previously `rowToSpecies()` returned an empty image for these rows, triggering the icon placeholder in `SmartImage`. Existing JSON databases likewise did not merge later image additions.

Fix: resolve blank image values against the current bundled seed images on reads in both repositories. This does not reseed, overwrite custom images, or delete database content. Neon stored values are unchanged; its SQL-based coverage report still counts stored blank images rather than resolved images.

## Separate listing limit

`/gyan` requests only 60 records and currently has no pagination. Records after the first 60 are not rendered at all; this is distinct from a visible card showing an icon instead of its photograph.

## Production limitations

The live Vercel page, production database values and production image-optimizer responses were not inspected: this environment's outbound host allowlist does not include the deployed site. The deployed list of affected slugs and any additional runtime/optimizer failures remain unverified. Deploy this branch's changes and verify the live cards; do not use the destructive reseed operation to repair image values.
