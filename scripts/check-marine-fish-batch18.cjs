#!/usr/bin/env node
// Batch 18: direct Table-I row crosswalk, taxonomy, image credits and Commons paths.
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
require('./register-typescript.cjs')

const { SPECIES } = require('../data/seed/index.ts')
const { MORE_FISH18 } = require('../data/seed/more-fish18.ts')
const { allMediaLicenses, licenseFor } = require('../data/seed/media-licenses.ts')
const { MARINE_FISH_BD } = require('../data/seed/sources.ts')
const rows = new Map([
  ['moonfish', 388],
  ['great-barracuda', 389],
  ['yellowstripe-barracuda', 390],
  ['bigeye-barracuda', 391],
  ['pickhandle-barracuda', 392],
  ['obtuse-barracuda', 393],
  ['sawtooth-barracuda', 394],
  ['blackfin-barracuda', 395],
  ['swordfish', 396],
  ['black-marlin', 397],
  ['indo-pacific-sailfish', 398],
  ['margarets-dragonet', 401],
  ['goram-dragonet', 404],
  ['largehead-hairtail', 409],
])
const taxonomy = {
  'moonfish': ['Carangaria incertae sedis', 'Menidae'],
  'great-barracuda': ['Carangaria incertae sedis', 'Sphyraenidae'],
  'yellowstripe-barracuda': ['Carangaria incertae sedis', 'Sphyraenidae'],
  'bigeye-barracuda': ['Carangaria incertae sedis', 'Sphyraenidae'],
  'pickhandle-barracuda': ['Carangaria incertae sedis', 'Sphyraenidae'],
  'obtuse-barracuda': ['Carangaria incertae sedis', 'Sphyraenidae'],
  'sawtooth-barracuda': ['Carangaria incertae sedis', 'Sphyraenidae'],
  'blackfin-barracuda': ['Carangaria incertae sedis', 'Sphyraenidae'],
  'swordfish': ['Carangiformes', 'Xiphiidae'],
  'black-marlin': ['Carangiformes', 'Istiophoridae'],
  'indo-pacific-sailfish': ['Carangiformes', 'Istiophoridae'],
  'margarets-dragonet': ['Callionymiformes', 'Callionymidae'],
  'goram-dragonet': ['Callionymiformes', 'Callionymidae'],
  'largehead-hairtail': ['Scombriformes', 'Trichiuridae'],
}
const statusByRow = { 388: 'NE', 389: 'LC', 390: 'NE', 391: 'NE', 392: 'NE', 393: 'NE', 394: 'LC', 395: 'NE', 396: 'LC', 397: 'DD', 398: 'LC', 401: 'NE', 404: 'NE', 409: 'LC' }
assert.equal(MORE_FISH18.length, 14, 'batch 18 must contain 14 species')
assert.equal(rows.size, MORE_FISH18.length, 'direct Table-I row map must cover every record')
assert.equal(new Set(rows.values()).size, rows.size, 'Table-I row map must not reuse a row')
assert.equal(new Set(MORE_FISH18.map((species) => species.slug)).size, 14, 'batch slugs must be unique')
assert.equal(new Set(MORE_FISH18.map((species) => species.scientificName)).size, 14, 'scientific names must be unique')

const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const batchSlugs = new Set(MORE_FISH18.map((species) => species.slug))
const existing = SPECIES.filter((species) => !batchSlugs.has(species.slug))
const supportedLicenses = new Set(['CC BY 2.0', 'CC BY 3.0', 'CC BY 4.0', 'CC BY-SA 2.0', 'CC BY-SA 2.5', 'CC BY-SA 3.0', 'CC BY-SA 4.0', 'Public domain'])
const uniqueKeys = ['slug', 'scientificName', 'nameBn', 'image']

for (const species of MORE_FISH18) {
  const row = rows.get(species.slug)
  assert.ok(row && row <= 712, `${species.slug}: row missing or past stop marker`)
  assert.equal(Object.keys(species).length, 31, `${species.slug}: expected 31 keys`)
  assert.equal(species.type, 'prani')
  assert.equal(species.group, 'machh')
  assert.equal(species.origin, 'native')
  assert.equal(species.conservation, statusByRow[row], `${species.slug}: Table-I global category mismatch`)
  assert.equal(species.dataStatus, 'partial')
  assert.equal(species.taxonomy?.class, 'Actinopterygii')
  assert.deepEqual([species.taxonomy?.order, species.taxonomy?.family], taxonomy[species.slug])
  assert.ok(species.sources?.some((source) => source.url === MARINE_FISH_BD.url), `${species.slug}: checklist source absent`)
  assert.ok(species.sources?.some((source) => source.title.startsWith('WoRMS accepted taxon:')), `${species.slug}: accepted-taxonomy citation absent`)
  if (species.taxonomy?.family === 'Sphyraenidae') {
    assert.match(species.threats, /ciguatera/i, `${species.slug}: family-level food safety caution absent`)
    assert.ok(species.sources?.some((source) => source.url === 'https://www.fda.gov/media/80235/download'), `${species.slug}: FDA toxin guidance citation absent`)
  }

  for (const key of uniqueKeys) {
    assert.equal(MORE_FISH18.filter((candidate) => normalize(candidate[key]) === normalize(species[key])).length, 1, `${species.slug}: duplicate batch ${key}`)
    assert.equal(existing.some((candidate) => normalize(candidate[key]) === normalize(species[key])), false, `${species.slug}: conflicts with existing seed ${key}`)
  }
  const license = licenseFor(species.image)
  assert.ok(license, `${species.slug}: image has no license record`)
  assert.equal(license.slug, species.slug, `${species.slug}: image credit slug mismatch`)
  assert.equal(license.file, species.image, `${species.slug}: image and credit URL differ`)
  assert.equal(license.verified, true, `${species.slug}: media credit is not verified`)
  assert.ok(supportedLicenses.has(license.license), `${species.slug}: unsupported license ${license.license}`)
  assert.match(license.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
  const title = decodeURIComponent(license.source.split('File:')[1])
  const digest = createHash('md5').update(title.replace(/ /g, '_')).digest('hex')
  const path = new URL(license.file).pathname.split('/').filter(Boolean)
  assert.equal(path[2], digest[0], `${species.slug}: Commons MD5 first directory mismatch`)
  assert.equal(path[3], digest.slice(0, 2), `${species.slug}: Commons MD5 second directory mismatch`)
}

const registered = allMediaLicenses().filter((entry) => batchSlugs.has(entry.slug) && entry.kind === 'image')
assert.equal(registered.length, 14, 'every batch record must have one registered image credit')
assert.equal(new Set(MORE_FISH18.map((species) => species.image)).size, 14, 'batch images must be unique')
console.log(JSON.stringify({ batch: 14, checklistRows: [...rows.values()].sort((a, b) => a - b), verifiedImageCredits: 14, commonsMd5Paths: 14, taxonomyStatus: 'passed', tableCategoryCounts: { LC: 6, NE: 7, DD: 1 }, exclusions: [{ row: 387, reason: 'exact-name own-work image found at only 324×137 px' }, { row: 399, reason: 'available exact-name image is an 1800s historical plate' }, { row: 400, reason: 'no exact-species Commons image located' }, { row: 402, reason: 'no exact-species Commons image located' }, { row: 403, reason: 'Commons results were historical plates/scans' }, { row: 405, reason: 'exact-name photograph is only 640×181 px' }, { row: 406, reason: 'available exact-name file is a historical Ford plate' }, { row: 407, reason: 'Lepturacanthus savala already seeded in Batch13' }, { row: 408, reason: 'no eligible exact-species photograph located' }], nextUnseenCandidateRow: 410 }, null, 2))
