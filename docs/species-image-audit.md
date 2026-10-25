# Species image audit — 2026-10-15

> **ঐতিহাসিক নথি।** নিচের ৬৬১-এর সংখ্যাগুলো ২০২৬-১০-১৫ তারিখের অডিটের।
> বর্তমান অবস্থা (১৪৫১ রেকর্ড, ছবি ১৪৪৮, ৩টি নথিভুক্ত ফাঁক) জানতে `npm run stats`
> চালান অথবা `README.md`-এর “জ্ঞানভান্ডার” সারি দেখুন।

## Verified locally

Run `node scripts/check-species-images.cjs`.

- 661 deduplicated records: 449 animals, 193 plants/fungi/microbes, 19 other records.
- All 661 have image paths. All distinct referenced seed image files exist and have readable dimensions (checked with Sharp).
- All entries in the generated image manifest also point to readable files.
- Empty/whitespace legacy image values resolve to bundled images; custom images are preserved. Legacy slug aliases are covered.
- `npx tsc --noEmit` passes.

## Data-loading defect

`withSeedImages()` enriches the source seed exports only. Neon seeds only when both species and posts are empty. Existing Neon rows therefore do not automatically receive later image additions. Previously `rowToSpecies()` returned an empty image for these rows, triggering the icon placeholder in `SmartImage`. Existing JSON databases likewise did not merge later image additions.

Fix: resolve blank image values against the current bundled seed images on reads in both repositories. This does not reseed, overwrite custom images, or delete database content. Neon stored values are unchanged; its SQL-based coverage report still counts stored blank images rather than resolved images.

Related defect (same root cause, record level, fixed 2026-10-15): species **records** added to the seed after the first deployment never reached the database at all, so the site kept showing the old count. Fixed by `repo.syncSpecies()` — see [`docs/SEED-SYNC.md`](./SEED-SYNC.md).

## Separate listing limit

`/gyan` previously stopped at 60 records. It now has filter-preserving previous/next navigation, page-range information, bounded page numbers, and stable sorting. Local production-server checks reached all 377 animals across seven pages without duplicates; plant page 4, oversized/invalid page inputs and empty search also returned HTTP 200.

## Production limitations

The live Vercel page, production database values and production image-optimizer responses were not inspected: this environment's outbound host allowlist does not include the deployed site. The deployed list of affected slugs and any additional runtime/optimizer failures remain unverified. PR #4 contains the deployment changes. GitHub workflow dispatch was attempted on the working branch but returned HTTP 403 (Resource not accessible by integration). A repository user with Actions permission can run **Migrate (Neon)** with `repair_images=true` and `reseed=false`. The repair fills only blank/whitespace images on existing known species; it never inserts, deletes or reseeds content, and reports any remaining blank slugs. Do not use the destructive reseed operation to repair image values.
