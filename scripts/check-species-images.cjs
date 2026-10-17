#!/usr/bin/env node
// Read-only audit of the actual seed exports, including deduplication and aliases.
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const sharp = require('sharp')
const root = path.resolve(__dirname, '..')
require('./register-typescript.cjs')
const { SPECIES } = require('../data/seed/index.ts')
const { SEED_IMAGES } = require('../data/seed/media-images.ts')
const { SPECIES_IMAGE_GAPS } = require('../data/seed/image-gaps.ts')
const { resolveSpeciesImage } = require('../lib/species-image.ts')

async function main() {
  const problems = []
  const knownGaps = []
  const files = new Set(SEED_IMAGES.map((s) => s.file))
  const gapSlugs = new Set(SPECIES_IMAGE_GAPS.map((g) => g.slug))
  for (const s of SPECIES) {
    if (!s.image) {
      // §12 — নথিভুক্ত ফাঁক: এই প্রজাতিগুলোর কোনো মুক্ত-লাইসেন্স ছবি পাওয়া যায়নি।
      // তালিকার বাইরের যেকোনো ছবিহীন রেকর্ড ব্যর্থতা হিসেবে ধরা পড়বে।
      const record = gapSlugs.has(s.slug) ? knownGaps : problems
      record.push(`${s.slug} (${s.nameBn}): no image`)
    } else files.add(s.image)
    assert.equal(resolveSpeciesImage(s.slug, ''), s.image, `legacy blank image: ${s.slug}`)
    assert.equal(resolveSpeciesImage(s.slug, '   '), s.image)
    assert.equal(resolveSpeciesImage(s.slug, '/uploads/custom.jpg'), '/uploads/custom.jpg')
    for (const alias of s.synonyms || []) {
      assert.ok(resolveSpeciesImage(alias, ''), `legacy alias: ${alias}`)
    }
  }
  assert.equal(resolveSpeciesImage('unknown-species', null), '')
  // ছবি পেয়ে গেলে নথিভুক্ত ফাঁকের তালিকা থেকে স্লাগটি সরাতে হবে — নইলে বিভ্রান্তি।
  for (const gap of SPECIES_IMAGE_GAPS) {
    const species = SPECIES.find((s) => s.slug === gap.slug)
    assert.ok(species, `image gap references unknown species: ${gap.slug}`)
    if (resolveSpeciesImage(gap.slug, species.image)) {
      problems.push(`${gap.slug}: still listed as an image gap but now has an image`)
    }
  }
  for (const file of files) {
    if (!file.startsWith('/seed/')) continue
    try {
      const metadata = await sharp(path.join(root, 'public', file)).metadata()
      assert.ok(metadata.width > 0 && metadata.height > 0)
    } catch (error) {
      problems.push(`${file}: ${error.message}`)
    }
  }
  console.log(JSON.stringify({
    records: SPECIES.length,
    animals: SPECIES.filter((s) => s.type === 'prani').length,
    plantsFungiMicrobes: SPECIES.filter((s) => s.type === 'udbhid').length,
    imageFilesChecked: files.size,
    withImage: SPECIES.length - knownGaps.length,
    documentedGaps: knownGaps,
    problems,
    legacyFallbackTests: 'passed',
  }, null, 2))
  if (problems.length) process.exitCode = 1
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
