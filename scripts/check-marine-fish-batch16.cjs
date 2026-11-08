#!/usr/bin/env node
// Batch 16: direct checklist row mapping, seed contract, license and Commons path.
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
require('./register-typescript.cjs')

const { SPECIES } = require('../data/seed/index.ts')
const { MORE_FISH16 } = require('../data/seed/more-fish16.ts')
const { allMediaLicenses, licenseFor } = require('../data/seed/media-licenses.ts')
const { MARINE_FISH_BD } = require('../data/seed/sources.ts')

const rowBySlug = new Map([
  ['cleftbelly-trevally', 352],
  ['yellowtail-scad', 353],
  ['longfin-trevally', 354],
  ['longnose-trevally', 355],
  ['coastal-trevally', 356],
  ['blue-trevally', 357],
  ['bumpnose-trevally', 358],
  ['malabar-trevally', 359],
  ['blacktip-trevally', 360],
  ['giant-trevally', 362],
  ['bluefin-trevally', 363],
  ['bigeye-trevally', 364],
  ['shortfin-scad', 366],
  ['japanese-scad', 367],
])
assert.equal(MORE_FISH16.length, 14, 'batch 16 must contain 14 species')
assert.deepEqual(new Set(MORE_FISH16.map((species) => species.slug)).size, 14, 'batch 16 slugs must be unique')
assert.deepEqual(new Set(MORE_FISH16.map((species) => species.scientificName)).size, 14, 'batch 16 scientific names must be unique')
assert.equal(rowBySlug.size, MORE_FISH16.length, 'direct Table-I row map must cover the whole batch')

const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const keys = ['slug', 'scientificName', 'nameBn', 'image']
const batchSlugs = new Set(MORE_FISH16.map((species) => species.slug))
const existing = SPECIES.filter((species) => !batchSlugs.has(species.slug))
const expectedLicenses = new Set(['CC BY-SA 3.0', 'CC BY-SA 4.0', 'CC BY 3.0', 'CC BY 4.0', 'Public domain'])

for (const species of MORE_FISH16) {
  const row = rowBySlug.get(species.slug)
  assert.ok(row, `${species.slug}: no verified Table-I row mapping`)
  assert.equal(Object.keys(species).length, 31, `${species.slug}: expected 31 keys`)
  assert.equal(species.type, 'prani', `${species.slug}: wrong type`)
  assert.equal(species.group, 'machh', `${species.slug}: wrong group`)
  assert.equal(species.origin, 'native', `${species.slug}: expected Bangladesh checklist presence`)
  assert.equal(species.conservation, 'LC', `${species.slug}: status differs from Table-I`)
  assert.equal(species.dataStatus, 'partial', `${species.slug}: retain partial status for unsourced biology`)
  assert.equal(species.taxonomy?.order, 'Carangiformes', `${species.slug}: current order is unexpected`)
  assert.ok(species.taxonomy?.family && species.taxonomy?.genus, `${species.slug}: incomplete accepted taxonomy`)
  assert.ok(species.sources?.some((source) => source.url === MARINE_FISH_BD.url), `${species.slug}: missing checklist bibliography source`)

  for (const key of keys) {
    assert.equal(MORE_FISH16.filter((candidate) => normalize(candidate[key]) === normalize(species[key])).length, 1, `${species.slug}: duplicate batch ${key}`)
    assert.equal(existing.some((candidate) => normalize(candidate[key]) === normalize(species[key])), false, `${species.slug}: conflicts with existing seed ${key}`)
  }
  const aliases = (species.otherNames ?? []).map(normalize)
  assert.equal(new Set(aliases).size, aliases.length, `${species.slug}: repeated alias`)
  for (const alias of aliases) {
    assert.equal(existing.some((candidate) => [candidate.scientificName, ...(candidate.otherNames ?? []), ...(candidate.synonyms ?? [])].some((value) => normalize(value) === alias)), false, `${species.slug}: alias conflicts with existing species: ${alias}`)
  }

  const license = licenseFor(species.image)
  assert.ok(license, `${species.slug}: image has no license record`)
  assert.equal(license.slug, species.slug, `${species.slug}: image credit points elsewhere`)
  assert.equal(license.file, species.image, `${species.slug}: image and credit URLs differ`)
  assert.equal(license.verified, true, `${species.slug}: license is not marked verified`)
  assert.ok(expectedLicenses.has(license.license), `${species.slug}: unapproved license ${license.license}`)
  assert.match(license.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, `${species.slug}: missing Commons source page`)

  const title = decodeURIComponent(license.source.split('File:')[1])
  const digest = createHash('md5').update(title.replace(/ /g, '_')).digest('hex')
  const path = new URL(license.file).pathname.split('/').filter(Boolean)
  assert.equal(path[2], digest[0], `${species.slug}: Commons MD5 first path segment mismatch`)
  assert.equal(path[3], digest.slice(0, 2), `${species.slug}: Commons MD5 second path segment mismatch`)
}

const registered = allMediaLicenses().filter((entry) => batchSlugs.has(entry.slug) && entry.kind === 'image')
assert.equal(registered.length, 14, 'every batch 16 taxon must have exactly one image credit')
assert.equal(new Set(MORE_FISH16.map((species) => species.image)).size, 14, 'batch 16 image URLs must be unique')

console.log(JSON.stringify({ batch: MORE_FISH16.length, checklistRows: [...rowBySlug.values()], uniqueKeys: keys, verifiedImageCredits: registered.length, commonsMd5Paths: registered.length, taxonStatus: 'passed', unmatchedQuestionableRowsExcluded: [361, 365] }, null, 2))
