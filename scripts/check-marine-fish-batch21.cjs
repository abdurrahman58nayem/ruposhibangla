#!/usr/bin/env node
// Batch 21: direct checklist rows, WoRMS accepted taxonomy, image credit/license and Commons paths.
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
require('./register-typescript.cjs')

const { SPECIES } = require('../data/seed/index.ts')
const { MORE_FISH21, MORE_FISH21_MEDIA } = require('../data/seed/more-fish21.ts')
const { allMediaLicenses, licenseFor } = require('../data/seed/media-licenses.ts')
const { MARINE_FISH_BD } = require('../data/seed/sources.ts')
const priorSeeds = []
for (let n = 1; n <= 20; n++) {
  const file = n === 1 ? 'more-fish' : `more-fish${n}`
  const batchModule = require(`../data/seed/${file}.ts`)
  const key = n === 1 ? 'MORE_FISH' : `MORE_FISH${n}`
  priorSeeds.push(...batchModule[key])
}

const rows = new Map([
  ['raggedfin-parrotfish', 455], ['blue-barred-parrotfish', 456], ['common-parrotfish', 457],
  ['rivulated-parrotfish', 458], ['whipfin-silver-biddy', 463], ['glowbelly', 467],
  ['yellowfin-goatfish', 469], ['red-sea-goatfish', 470], ['cinnabar-goatfish', 471],
  ['japanese-goatfish', 472], ['goldband-goatfish', 473], ['ochrebanded-goatfish', 475],
  ['finstripe-goatfish', 477], ['freckled-goatfish', 478],
])
const expectedStatus = {
  455: 'LC', 456: 'LC', 457: 'LC', 458: 'LC', 463: 'LC', 467: 'NE', 469: 'LC',
  470: 'NE', 471: 'LC', 472: 'NE', 473: 'LC', 475: 'LC', 477: 'LC', 478: 'LC',
}
const taxonomy = {
  'raggedfin-parrotfish': ['Labriformes', 'Labridae', 277510],
  'blue-barred-parrotfish': ['Labriformes', 'Labridae', 219127],
  'common-parrotfish': ['Labriformes', 'Labridae', 219125],
  'rivulated-parrotfish': ['Labriformes', 'Labridae', 367210],
  'whipfin-silver-biddy': ['Gerreiformes', 'Gerreidae', 218524],
  glowbelly: ['Pempheriformes', 'Acropomatidae', 220048],
  'yellowfin-goatfish': ['Mulliformes', 'Mullidae', 218648],
  'red-sea-goatfish': ['Mulliformes', 'Mullidae', 218669],
  'cinnabar-goatfish': ['Mulliformes', 'Mullidae', 1841078],
  'japanese-goatfish': ['Mulliformes', 'Mullidae', 218694],
  'goldband-goatfish': ['Mulliformes', 'Mullidae', 126989],
  'ochrebanded-goatfish': ['Mulliformes', 'Mullidae', 273673],
  'finstripe-goatfish': ['Mulliformes', 'Mullidae', 218685],
  'freckled-goatfish': ['Mulliformes', 'Mullidae', 218689],
}
const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const supportedLicenses = new Set([
  'CC BY 2.0', 'CC BY 3.0', 'CC BY 4.0', 'CC BY-SA 2.5', 'CC BY-SA 4.0', 'CC0',
])

assert.equal(MORE_FISH21.length, 14, 'batch 21 must contain exactly 14 eligible taxa')
assert.equal(rows.size, 14, 'direct Table-I row map must cover every candidate')
assert.equal(new Set(rows.values()).size, 14, 'direct Table-I rows must be unique')
assert.deepEqual([...rows.values()].sort((a, b) => a - b), [455,456,457,458,463,467,469,470,471,472,473,475,477,478])
assert.equal(new Set(MORE_FISH21.map((species) => normalize(species.scientificName))).size, 14, 'accepted scientific names must be unique')
assert.equal(MORE_FISH21.filter((species) => !priorSeeds.some((old) => normalize(old.scientificName) === normalize(species.scientificName))).length, 14, 'all accepted taxa must be new against fish batches 1–20')

for (const species of MORE_FISH21) {
  const row = rows.get(species.slug)
  assert.ok(row && row < 712, `${species.slug}: row missing or beyond stop marker`)
  assert.equal(Object.keys(species).length, 31, `${species.slug}: expected 31 species keys`)
  assert.equal(species.type, 'prani')
  assert.equal(species.group, 'machh')
  assert.equal(species.origin, 'native', `${species.slug}: Bangladesh checklist occurrence must be retained`)
  assert.equal(species.conservation, expectedStatus[row], `${species.slug}: paper-reported global IUCN value mismatch`)
  assert.equal(species.dataStatus, 'partial')
  assert.equal(species.taxonomy?.class, 'Actinopterygii')
  assert.deepEqual([species.taxonomy?.order, species.taxonomy?.family], taxonomy[species.slug].slice(0, 2), `${species.slug}: WoRMS order/family mismatch`)
  assert.ok(species.sources?.some((source) => source.title.includes(`row ${row}`) && source.url === MARINE_FISH_BD.url), `${species.slug}: direct checklist row citation missing`)
  const worms = species.sources?.find((source) => source.title === `WoRMS accepted taxon: ${species.scientificName}`)
  assert.ok(worms, `${species.slug}: WoRMS accepted-name citation missing`)
  assert.equal(worms.url, `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${taxonomy[species.slug][2]}`, `${species.slug}: WoRMS AphiaID mismatch`)

  const finalMatches = SPECIES.filter((record) => normalize(record.scientificName) === normalize(species.scientificName))
  assert.equal(finalMatches.length, 1, `${species.slug}: catalog must contain one accepted-taxon entry`)
  assert.equal(finalMatches[0].slug, species.slug, `${species.slug}: unexpected catalog canonical after dedupe`)
  assert.ok(finalMatches[0].sources?.some((source) => source.title.includes(`row ${row}`) && source.url === MARINE_FISH_BD.url), `${species.slug}: checklist row source lost in catalog`)

  const media = licenseFor(species.image)
  assert.ok(media, `${species.slug}: image has no credit/license record`)
  assert.equal(media.slug, species.slug)
  assert.equal(media.file, species.image)
  assert.equal(media.verified, true)
  assert.ok(supportedLicenses.has(media.license), `${species.slug}: unsupported or unverified license ${media.license}`)
  const expectedMedia = MORE_FISH21_MEDIA.find((entry) => entry.slug === species.slug)
  assert.ok(expectedMedia)
  assert.equal(media.license, expectedMedia.license)
  assert.match(media.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
  assert.ok(media.licenseUrl?.startsWith('https://creativecommons.org/'))
  const filename = decodeURIComponent(media.source.split('File:')[1])
  const digest = createHash('md5').update(filename.replace(/ /g, '_')).digest('hex')
  const path = new URL(media.file).pathname.split('/').filter(Boolean)
  assert.equal(path[2], digest[0], `${species.slug}: Commons MD5 first directory mismatch`)
  assert.equal(path[3], digest.slice(0, 2), `${species.slug}: Commons MD5 second directory mismatch`)
}

const heptacantha = MORE_FISH21.find((species) => species.slug === 'cinnabar-goatfish')
assert.equal(heptacantha.scientificName, 'Parupeneus heptacantha')
assert.ok(heptacantha.otherNames.includes('Parupeneus heptacanthus'), 'checklist spelling must remain searchable')
assert.match(heptacantha.description, /checklist prints “Parupeneus heptacanthus”/)
const imageSet = new Set(MORE_FISH21.map((species) => species.image))
const credits = allMediaLicenses().filter((entry) => imageSet.has(entry.file) && entry.kind === 'image')
assert.equal(credits.length, 14, 'all batch records must have one image credit')
assert.equal(new Set(credits.map((entry) => entry.file)).size, 14, 'image URLs must be unique')

console.log(JSON.stringify({
  checklistRowMatches: 14,
  newAcceptedTaxa: 14,
  rows: [...rows.values()].sort((a, b) => a - b),
  verifiedImageCredits: 14,
  commonsMd5Paths: 14,
  paperGlobalCategories: { LC: 11, NE: 3 },
  taxonomyNormalization: 'row 471 checklist Parupeneus heptacanthus mapped to accepted WoRMS Parupeneus heptacantha (AphiaID 1841078)',
  excludedDuplicates: ['row 460 Lates calcarifer', 'row 466 Pentaprion longimanus', 'row 474 Upeneus sulphureus'],
  stopMarker: 712,
}, null, 2))
