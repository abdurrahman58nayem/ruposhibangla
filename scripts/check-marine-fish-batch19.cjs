#!/usr/bin/env node
// Batch 19: direct Table-I row crosswalk, accepted taxonomy, licenses and Commons paths.
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
require('./register-typescript.cjs')

const { SPECIES } = require('../data/seed/index.ts')
const { MORE_FISH19 } = require('../data/seed/more-fish19.ts')
const { MORE_FISH } = require('../data/seed/more-fish.ts')
const { MORE_FISH12 } = require('../data/seed/more-fish12.ts')
const { MORE_FISH13 } = require('../data/seed/more-fish13.ts')
const { allMediaLicenses, licenseFor } = require('../data/seed/media-licenses.ts')
const { MARINE_FISH_BD } = require('../data/seed/sources.ts')
const rows = new Map([
  ['bullet-tuna', 410], ['frigate-tuna', 411], ['kawakawa', 412], ['skipjack-tuna', 413],
  ['short-mackerel', 414], ['island-mackerel', 415], ['indian-mackerel', 416], ['striped-bonito', 417],
  ['blue-mackerel', 418], ['narrow-barred-spanish-mackerel', 419], ['korean-seerfish', 421],
  ['yellowfin-tuna', 423], ['bigeye-tuna', 424], ['longtail-tuna', 425],
])
const expectedStatus = { 410: 'LC', 411: 'NE', 412: 'LC', 413: 'LC', 414: 'DD', 415: 'DD', 416: 'DD', 417: 'LC', 418: 'LC', 419: 'NT', 421: 'LC', 423: 'NT', 424: 'VU', 425: 'DD' }
const expectedTaxonomy = ['Scombriformes', 'Scombridae']
const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const uniqueKeys = ['slug', 'scientificName', 'nameBn', 'image']
const supportedLicenses = new Set(['CC BY 2.0', 'CC BY 3.0', 'CC BY 4.0', 'CC BY-SA 2.0', 'CC BY-SA 2.5', 'CC BY-SA 3.0', 'CC BY-SA 4.0', 'CC0', 'Public domain'])

assert.equal(MORE_FISH19.length, 14, 'batch 19 must contain 14 species')
assert.equal(rows.size, 14, 'direct Table-I row map must cover all records')
assert.equal(new Set(rows.values()).size, 14, 'Table-I rows must be unique')
assert.equal(new Set(MORE_FISH19.map((species) => species.scientificName)).size, 14, 'scientific names must be unique')
const priorSeed = [...MORE_FISH, ...MORE_FISH12, ...MORE_FISH13]
const reusedRows = new Set([412, 416, 423])
const newCanonicalCount = MORE_FISH19.filter((species) => !priorSeed.some((old) => normalize(old.scientificName) === normalize(species.scientificName))).length
assert.equal(newCanonicalCount, 11, 'expected 11 additions after accounting for 3 prior seed taxa')
for (const row of reusedRows) {
  const species = MORE_FISH19.find((candidate) => rows.get(candidate.slug) === row)
  assert.ok(species, `reused checklist row ${row} is missing`)
  assert.ok(priorSeed.some((old) => normalize(old.scientificName) === normalize(species.scientificName)), `row ${row}: expected pre-existing seed taxon`)
}

for (const species of MORE_FISH19) {
  const row = rows.get(species.slug)
  assert.ok(row && row <= 712, `${species.slug}: row missing or beyond stop marker`)
  assert.equal(Object.keys(species).length, 31, `${species.slug}: expected 31 keys`)
  assert.equal(species.type, 'prani')
  assert.equal(species.group, 'machh')
  assert.equal(species.origin, 'native')
  assert.equal(species.conservation, expectedStatus[row], `${species.slug}: candidate Table-I global IUCN value mismatch`)
  assert.equal(species.dataStatus, 'partial')
  assert.equal(species.taxonomy?.class, 'Actinopterygii')
  assert.deepEqual([species.taxonomy?.order, species.taxonomy?.family], expectedTaxonomy)
  for (const key of uniqueKeys) {
    assert.equal(MORE_FISH19.filter((candidate) => normalize(candidate[key]) === normalize(species[key])).length, 1, `${species.slug}: duplicate batch ${key}`)
  }

  const canonical = SPECIES.filter((record) => normalize(record.scientificName) === normalize(species.scientificName))
  assert.equal(canonical.length, 1, `${species.slug}: final catalog must deduplicate this taxon`)
  const finalRecord = canonical[0]
  assert.equal(finalRecord.slug, species.slug, `${species.slug}: unexpected canonical slug`)
  assert.ok(finalRecord.sources?.some((source) => source.title.includes(`row ${row}`) && source.url === MARINE_FISH_BD.url), `${species.slug}: row-specific checklist citation not retained after dedupe`)
  assert.ok(finalRecord.sources?.some((source) => source.title.startsWith('WoRMS accepted taxon:')), `${species.slug}: WoRMS accepted-name citation missing after dedupe`)
  assert.ok(finalRecord.sources?.some((source) => source.url === 'https://www.fda.gov/media/80248/download'), `${species.slug}: FDA histamine hazard citation missing after dedupe`)
  assert.ok(finalRecord.image === species.image || finalRecord.gallery?.includes(species.image), `${species.slug}: candidate image was lost by dedupe`)

  const license = licenseFor(species.image)
  assert.ok(license, `${species.slug}: image has no license record`)
  assert.equal(license.slug, species.slug, `${species.slug}: credit slug mismatch`)
  assert.equal(license.file, species.image, `${species.slug}: credit URL mismatch`)
  assert.equal(license.verified, true, `${species.slug}: image credit is not verified`)
  assert.ok(supportedLicenses.has(license.license), `${species.slug}: unsupported license ${license.license}`)
  assert.match(license.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
  const filename = decodeURIComponent(license.source.split('File:')[1])
  const digest = createHash('md5').update(filename.replace(/ /g, '_')).digest('hex')
  const path = new URL(license.file).pathname.split('/').filter(Boolean)
  assert.equal(path[2], digest[0], `${species.slug}: Commons MD5 first directory mismatch`)
  assert.equal(path[3], digest.slice(0, 2), `${species.slug}: Commons MD5 second directory mismatch`)
}

const batchImages = new Set(MORE_FISH19.map((species) => species.image))
const registered = allMediaLicenses().filter((entry) => batchImages.has(entry.file) && entry.kind === 'image')
assert.equal(registered.length, 14, 'all records must have a registered image credit')
assert.equal(new Set(MORE_FISH19.map((species) => species.image)).size, 14, 'all image URLs must be unique')
console.log(JSON.stringify({
  checklistRowMatches: 14,
  newCanonicalSpecies: newCanonicalCount,
  mergedIntoPriorSeeds: [...reusedRows].sort((a, b) => a - b),
  checklistRows: [...rows.values()].sort((a, b) => a - b),
  verifiedImageCredits: 14,
  commonsMd5Paths: 14,
  taxonomy: '14 WoRMS accepted taxa; Scombriformes / Scombridae',
  tableCategoryCounts: { LC: 7, DD: 4, NT: 2, NE: 1, VU: 1 },
  safety: 'FDA Chapter 7 family-level histamine handling caution on all 14',
  exclusions: [
    { row: 420, reason: 'exact-name Commons hits are a 1801 historical illustration or historical scans; no eligible modern photo located' },
    { row: 422, reason: 'exact-name Commons hits are historical illustrations/scans; no eligible modern photo located' },
  ],
  row426: 'no checklist entry; Table-I numbering jumps from 425 to duplicate row 427',
  nextUnseenCandidateRow: 427,
}, null, 2))
