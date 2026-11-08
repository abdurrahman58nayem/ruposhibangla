#!/usr/bin/env node
// Batch 17: direct Table-I row mapping, seed contract, license and Commons MD5 path.
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
require('./register-typescript.cjs')

const { SPECIES } = require('../data/seed/index.ts')
const { MORE_FISH17 } = require('../data/seed/more-fish17.ts')
const { allMediaLicenses, licenseFor } = require('../data/seed/media-licenses.ts')
const { MARINE_FISH_BD } = require('../data/seed/sources.ts')
const rowBySlug = new Map([
  ['rainbow-runner', 369],
  ['golden-trevally', 370],
  ['pilotfish', 372],
  ['longrakered-trevally', 386],
  ['doublespotted-queenfish', 375],
  ['barred-queenfish', 376],
  ['oxeye-scad', 378],
  ['bigeye-scad', 379],
  ['yellowstripe-scad', 380],
  ['longfin-yellowtail', 381],
  ['blackbanded-trevally', 382],
  ['small-spotted-dart', 383],
  ['snubnose-pompano', 384],
  ['arabian-scad', 385],
])
assert.equal(MORE_FISH17.length, 14, 'batch 17 must contain 14 species')
assert.equal(new Set(MORE_FISH17.map((species) => species.slug)).size, 14, 'batch 17 slugs must be unique')
assert.equal(new Set(MORE_FISH17.map((species) => species.scientificName)).size, 14, 'batch 17 scientific names must be unique')
assert.equal(rowBySlug.size, MORE_FISH17.length, 'direct Table-I row map must cover the whole batch')
assert.equal(new Set(rowBySlug.values()).size, rowBySlug.size, 'Table-I row map must not reuse a row')
const longrakered = MORE_FISH17.find((species) => species.slug === 'longrakered-trevally')
assert.equal(longrakered?.scientificName, 'Atropus mentalis', 'row 386 must use the current accepted name')
assert.ok(longrakered?.otherNames?.includes('Ulua mentalis'), 'row 386 must retain the Table-I combination')
assert.ok(longrakered?.sources?.some((source) => source.url === 'https://www.marinespecies.org/aphia.php?id=218447&p=taxdetails'), 'row 386 must cite the WoRMS accepted-name record')

const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const keys = ['slug', 'scientificName', 'nameBn', 'image']
const batchSlugs = new Set(MORE_FISH17.map((species) => species.slug))
const existing = SPECIES.filter((species) => !batchSlugs.has(species.slug))
const expectedLicenses = new Set(['CC BY-SA 2.0', 'CC BY-SA 3.0', 'CC BY-SA 4.0', 'CC BY 2.0', 'CC BY 3.0', 'CC BY 4.0', 'Public domain'])

for (const species of MORE_FISH17) {
  const row = rowBySlug.get(species.slug)
  assert.ok(row && row <= 712, `${species.slug}: row is absent or beyond the 712 cutoff`)
  assert.equal(Object.keys(species).length, 31, `${species.slug}: expected 31 keys`)
  assert.equal(species.type, 'prani')
  assert.equal(species.group, 'machh')
  assert.equal(species.origin, 'native')
  assert.equal(species.conservation, row === 385 ? 'VU' : 'LC', `${species.slug}: Table-I global category mismatch`)
  assert.equal(species.dataStatus, 'partial')
  assert.equal(species.taxonomy?.order, 'Carangiformes')
  assert.equal(species.taxonomy?.family, 'Carangidae')
  assert.ok(species.sources?.some((source) => source.url === MARINE_FISH_BD.url), `${species.slug}: missing checklist citation`)

  for (const key of keys) {
    assert.equal(MORE_FISH17.filter((candidate) => normalize(candidate[key]) === normalize(species[key])).length, 1, `${species.slug}: duplicate batch ${key}`)
    assert.equal(existing.some((candidate) => normalize(candidate[key]) === normalize(species[key])), false, `${species.slug}: conflicts with existing seed ${key}`)
  }
  const license = licenseFor(species.image)
  assert.ok(license, `${species.slug}: image has no license record`)
  assert.equal(license.slug, species.slug, `${species.slug}: image credit points elsewhere`)
  assert.equal(license.file, species.image, `${species.slug}: image and credit URLs differ`)
  assert.equal(license.verified, true, `${species.slug}: image license is not marked verified`)
  assert.ok(expectedLicenses.has(license.license), `${species.slug}: unsupported license ${license.license}`)
  assert.match(license.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
  const title = decodeURIComponent(license.source.split('File:')[1])
  const digest = createHash('md5').update(title.replace(/ /g, '_')).digest('hex')
  const path = new URL(license.file).pathname.split('/').filter(Boolean)
  assert.equal(path[2], digest[0], `${species.slug}: Commons MD5 first path segment mismatch`)
  assert.equal(path[3], digest.slice(0, 2), `${species.slug}: Commons MD5 second path segment mismatch`)
}

const registered = allMediaLicenses().filter((entry) => batchSlugs.has(entry.slug) && entry.kind === 'image')
assert.equal(registered.length, 14, 'each batch 17 taxon needs exactly one image credit')
assert.equal(new Set(MORE_FISH17.map((species) => species.image)).size, 14, 'batch 17 image URLs must be unique')
console.log(JSON.stringify({ batch: 14, checklistRows: [...rowBySlug.values()].sort((a, b) => a - b), verifiedImageCredits: 14, commonsMd5Paths: 14, taxonomyStatus: 'passed', exclusions: [{ row: 368, name: 'Decapterus russelli', reason: 'no eligible exact-taxon photo found; available candidates cooked/misidentified' }, { row: 373, name: 'Parastromateus niger', reason: 'already represented by existing slug kalo-rupchanda; existing record retained' }, { row: 377, name: 'Scomberoides tol', reason: 'available unambiguous own-work photo is only 567×163 px; high-resolution candidate taxonomy ambiguous' }], nextRowWithin712: 387 }, null, 2))
