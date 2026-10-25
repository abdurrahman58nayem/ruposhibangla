#!/usr/bin/env node
// Contract checks for externally hosted, attributable seed videos and image credits.
const assert = require('node:assert/strict')
require('./register-typescript.cjs')
const { SPECIES } = require('../data/seed/index.ts')
const { SEED_VIDEOS } = require('../data/seed/media-videos.ts')
const { CURATED_REELS, speciesMediaReels } = require('../lib/curated-reels.ts')
const { allMediaLicenses, licenseFor } = require('../data/seed/media-licenses.ts')
const { SEED_IMAGES } = require('../data/seed/media-images.ts')

let expectedVideos = 0
for (const [slug, videos] of Object.entries(SEED_VIDEOS)) {
  const species = SPECIES.find((entry) => entry.slug === slug)
  assert.ok(species, `video seed references unknown species: ${slug}`)
  for (const video of videos) {
    expectedVideos += 1
    assert.equal(video.kind, 'video')
    assert.match(video.url, /^https:\/\/upload\.wikimedia\.org\//, `video must stream from Commons: ${slug}`)
    assert.ok(video.caption && video.credit && video.license && video.licenseUrl && video.sourceUrl)
    assert.match(video.sourceUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
    assert.match(video.licenseUrl, /^https:\/\/creativecommons\.org\//)
    assert.ok(species.media.some((item) => item.kind === 'video' && item.url === video.url), `video missing from Species.media: ${slug}`)
  }
}

const reels = speciesMediaReels(SPECIES)
assert.equal(reels.length, expectedVideos, 'all eligible video seeds should produce a reel')
for (const reel of reels) {
  assert.equal(reel.kind, 'reel')
  assert.equal(reel.mediaType, 'video')
  assert.equal(reel.likes, 0, 'editorial reels must not invent likes')
  assert.equal(reel.comments, 0, 'editorial reels must not invent comments')
  assert.ok(reel.curatedAttribution?.credit && reel.curatedAttribution?.license && reel.curatedAttribution?.licenseUrl && reel.curatedAttribution?.sourceUrl)
  assert.ok(reel.speciesHref)
}

const canonicalVideoOverlaps = reels.filter((reel) => CURATED_REELS.some((existing) => existing.mediaUrl === reel.mediaUrl))
assert.equal(canonicalVideoOverlaps.length, 2, 'known kingfisher clips should already have their canonical editorial reels')
for (const reel of canonicalVideoOverlaps) {
  const canonical = CURATED_REELS.find((existing) => existing.mediaUrl === reel.mediaUrl)
  assert.equal(canonical?.speciesSlug, reel.speciesSlug, 'canonical reel must retain its species identity')
  assert.equal(canonical?.speciesHref, reel.speciesHref, 'canonical reel must link to the exact species detail page')
}
const creditEntries = allMediaLicenses()
const creditKeys = creditEntries.map((entry) => `${entry.file}::${entry.slug}`)
assert.equal(new Set(creditKeys).size, creditEntries.length, 'credits register has one row per file/species pair')
for (const seedImage of SEED_IMAGES) assert.ok(creditKeys.includes(`${seedImage.file}::${seedImage.slug}`), `seed image missing from credits register: ${seedImage.file}`)
const speciesImageRefs = SPECIES.filter((species) => species.image)
const unregisteredSpeciesImageRefs = speciesImageRefs.filter((species) => !licenseFor(species.image))
// প্রতিটি ছবির (নিজস্ব চিত্রণসহ) ক্রেডিট/লাইসেন্স রেকর্ড থাকতেই হবে (§12)
assert.equal(
  unregisteredSpeciesImageRefs.length,
  0,
  `species image without a credits record: ${unregisteredSpeciesImageRefs.map((s) => `${s.slug} (${s.image})`).join(', ')}`,
)
const photoLicense = licenseFor('/seed/prani/jal-moyur.jpg')
assert.equal(photoLicense?.verified, false, 'unverified image licence must remain explicitly pending')
assert.equal(photoLicense?.license, 'যাচাই বাকি')
assert.match(photoLicense?.source || '', /^https:\/\/commons\.wikimedia\.org\//)

console.log(JSON.stringify({ seedVideos: expectedVideos, speciesReels: reels.length, canonicalVideoOverlaps: canonicalVideoOverlaps.length, creditRegisterRecords: creditEntries.length, verifiedCreditRecords: creditEntries.filter((entry) => entry.verified).length, pendingCreditRecords: creditEntries.filter((entry) => !entry.verified).length, speciesImageReferences: speciesImageRefs.length, imageReferencesUsingUnregisteredPlaceholder: unregisteredSpeciesImageRefs.length, unverifiedImageAttribution: 'explicitly pending' }, null, 2))
