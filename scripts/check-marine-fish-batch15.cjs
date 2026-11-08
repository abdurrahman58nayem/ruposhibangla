#!/usr/bin/env node
// Regression checks for the 14-record marine-fish batch 15.
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
require('./register-typescript.cjs')

const { SPECIES } = require('../data/seed/index.ts')
const { MORE_FISH15 } = require('../data/seed/more-fish15.ts')
const { allMediaLicenses, licenseFor } = require('../data/seed/media-licenses.ts')
const { MARINE_FISH_BD } = require('../data/seed/sources.ts')

assert.equal(MORE_FISH15.length, 14, 'batch 15 must remain a 14-species batch')
const batchSlugs = new Set(MORE_FISH15.map((species) => species.slug))
assert.equal(batchSlugs.size, MORE_FISH15.length, 'batch 15 has duplicate slugs')
const existing = SPECIES.filter((species) => !batchSlugs.has(species.slug))
const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const keys = ['slug', 'scientificName', 'nameBn', 'image']

for (const species of MORE_FISH15) {
  assert.equal(Object.keys(species).length, 31, `${species.slug}: expected 31 fields`)
  assert.equal(species.type, 'prani', `${species.slug}: wrong type`)
  assert.equal(species.group, 'machh', `${species.slug}: wrong group`)
  assert.equal(species.origin, 'native', `${species.slug}: Bangladesh origin is not native`)
  assert.equal(species.dataStatus, 'partial', `${species.slug}: preserve partial source status`)
  assert.ok(species.taxonomy?.order && species.taxonomy?.family, `${species.slug}: taxonomy is incomplete`)
  assert.ok(species.sources?.some((source) => source.url === MARINE_FISH_BD.url), `${species.slug}: missing Habib & Islam checklist citation`)
  assert.ok(species.sources?.some((source) => source.url?.includes('bdfish.org/2012/05/commonly-harvested-fishes')), `${species.slug}: missing BdFISH marine/coastal source`)

  for (const key of keys) {
    assert.equal(MORE_FISH15.filter((candidate) => normalize(candidate[key]) === normalize(species[key])).length, 1, `${species.slug}: duplicate batch ${key}`)
    assert.equal(existing.some((candidate) => normalize(candidate[key]) === normalize(species[key])), false, `${species.slug}: conflicts with existing seed ${key}`)
  }

  const aliases = [...(species.otherNames ?? []), ...(species.synonyms ?? [])].map(normalize)
  assert.equal(new Set(aliases).size, aliases.length, `${species.slug}: repeated alias in this record`)
  for (const alias of aliases) {
    assert.equal(
      existing.some((candidate) => [candidate.scientificName, ...(candidate.otherNames ?? []), ...(candidate.synonyms ?? [])].some((name) => normalize(name) === alias)),
      false,
      `${species.slug}: alias conflicts with another seed record: ${alias}`,
    )
  }

  const license = licenseFor(species.image)
  assert.ok(license, `${species.slug}: image has no credit record`)
  assert.equal(license.slug, species.slug, `${species.slug}: image credit points to another species`)
  assert.equal(license.file, species.image, `${species.slug}: image URL differs from its credit URL`)
  assert.equal(license.verified, true, `${species.slug}: image attribution is not verified`)
  assert.equal(license.license, 'CC BY-SA 4.0', `${species.slug}: unexpected image license`)
  assert.match(license.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, `${species.slug}: credit source is not a Commons file page`)

  // Commons' upload path is the MD5 of the normalized file title (spaces -> underscores).
  const fileTitle = decodeURIComponent(license.source.split('File:')[1])
  const digest = createHash('md5').update(fileTitle.replace(/ /g, '_')).digest('hex')
  const pathSegments = new URL(license.file).pathname.split('/').filter(Boolean)
  assert.equal(pathSegments[2], digest[0], `${species.slug}: Commons MD5 first-level path mismatch`)
  assert.equal(pathSegments[3], digest.slice(0, 2), `${species.slug}: Commons MD5 second-level path mismatch`)
}

const registered = allMediaLicenses().filter((entry) => batchSlugs.has(entry.slug) && entry.kind === 'image')
assert.equal(registered.length, 14, 'each batch 15 species must have one registered image credit')
assert.equal(new Set(MORE_FISH15.map((species) => species.image)).size, 14, 'batch 15 image URLs are not unique')
for (const slug of ['shoemaker-spinefoot', 'grey-stingfish']) {
  const species = MORE_FISH15.find((candidate) => candidate.slug === slug)
  assert.match(`${species.summary} ${species.description} ${species.conservationBn}`, /বিষ|venom/i, `${slug}: venom warning is missing`)
}
const mullet = MORE_FISH15.find((species) => species.slug === 'fringelip-mullet')
assert.match(`${mullet.description} ${mullet.conservationBn}`, /ciguatera/i, 'fringelip mullet ciguatera warning is missing')

console.log(JSON.stringify({ batch: MORE_FISH15.length, uniformFields: 31, uniqueSeedKeys: keys, verifiedLicenseLinks: registered.length, commonsMd5Paths: registered.length, checklistSources: MORE_FISH15.length, localTaxonomyAndSafetyChecks: 'passed' }, null, 2))
