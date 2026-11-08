#!/usr/bin/env node
// Batch 22: direct Table-I rows, WoRMS accepted taxonomy, image credit/license and Commons paths.
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
require('./register-typescript.cjs')

const { SPECIES } = require('../data/seed/index.ts')
const { MORE_FISH22, MORE_FISH22_MEDIA } = require('../data/seed/more-fish22.ts')
const { allMediaLicenses, licenseFor } = require('../data/seed/media-licenses.ts')
const { MARINE_FISH_BD } = require('../data/seed/sources.ts')
const priorSeeds = []
for (let n = 1; n <= 21; n++) {
  const file = n === 1 ? 'more-fish' : `more-fish${n}`
  const batchModule = require(`../data/seed/${file}.ts`)
  const key = n === 1 ? 'MORE_FISH' : `MORE_FISH${n}`
  priorSeeds.push(...batchModule[key])
}

const rows = new Map([
  ['blue-sea-chub', 482], ['brassy-chub', 483], ['fourlined-terapon', 484],
  ['largescaled-terapon', 486], ['chocolate-hind', 487], ['bluelined-hind', 488],
  ['vermillion-grouper', 489], ['tomato-hind', 490], ['humpback-grouper-cromileptes', 492],
  ['duskytail-grouper', 493], ['brownspotted-grouper', 494], ['orangespotted-grouper', 495],
  ['cloudy-grouper', 496], ['blacktip-grouper', 497],
])
const expectedStatus = {
  482: 'LC', 483: 'LC', 484: 'NE', 486: 'LC', 487: 'LC', 488: 'LC', 489: 'LC',
  490: 'LC', 492: 'DD', 493: 'NT', 494: 'LC', 495: 'LC', 496: 'LC', 497: 'LC',
}
const taxonomy = {
  'blue-sea-chub': ['Centrarchiformes', 'Kyphosidae', 218708],
  'brassy-chub': ['Centrarchiformes', 'Kyphosidae', 218706],
  'fourlined-terapon': ['Centrarchiformes', 'Terapontidae', 127077],
  'largescaled-terapon': ['Centrarchiformes', 'Terapontidae', 218349],
  'chocolate-hind': ['Perciformes', 'Epinephelidae', 218182],
  'bluelined-hind': ['Perciformes', 'Epinephelidae', 218190],
  'vermillion-grouper': ['Perciformes', 'Epinephelidae', 218184],
  'tomato-hind': ['Perciformes', 'Epinephelidae', 218183],
  'humpback-grouper-cromileptes': ['Perciformes', 'Epinephelidae', 218193],
  'duskytail-grouper': ['Perciformes', 'Epinephelidae', 273838],
  'brownspotted-grouper': ['Perciformes', 'Epinephelidae', 218199],
  'orangespotted-grouper': ['Perciformes', 'Epinephelidae', 218200],
  'cloudy-grouper': ['Perciformes', 'Epinephelidae', 273850],
  'blacktip-grouper': ['Perciformes', 'Epinephelidae', 218207],
}
const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const supportedLicenses = new Set([
  'CC BY 2.0', 'CC BY 3.0', 'CC BY 4.0', 'CC BY-SA 2.5', 'CC BY-SA 3.0', 'CC BY-SA 4.0', 'CC0',
])

assert.equal(MORE_FISH22.length, 14, 'batch 22 must contain exactly 14 eligible taxa')
assert.equal(rows.size, 14, 'direct Table-I row map must cover every candidate')
assert.equal(new Set(rows.values()).size, 14, 'direct Table-I rows must be unique')
assert.deepEqual([...rows.values()].sort((a, b) => a - b), [482,483,484,486,487,488,489,490,492,493,494,495,496,497])
assert.equal(new Set(MORE_FISH22.map((species) => normalize(species.scientificName))).size, 14, 'accepted scientific names must be unique')
assert.equal(MORE_FISH22.filter((species) => !priorSeeds.some((old) => normalize(old.scientificName) === normalize(species.scientificName))).length, 14, 'all accepted taxa must be new against fish batches 1–21')

for (const species of MORE_FISH22) {
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
  const expectedMedia = MORE_FISH22_MEDIA.find((entry) => entry.slug === species.slug)
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

const imageSet = new Set(MORE_FISH22.map((species) => species.image))
const credits = allMediaLicenses().filter((entry) => imageSet.has(entry.file) && entry.kind === 'image')
assert.equal(credits.length, 14, 'all batch records must have one image credit')
assert.equal(new Set(credits.map((entry) => entry.file)).size, 14, 'image URLs must be unique')

console.log(JSON.stringify({
  checklistRowMatches: 14,
  newAcceptedTaxa: 14,
  rows: [...rows.values()].sort((a, b) => a - b),
  verifiedImageCredits: 14,
  commonsMd5Paths: 14,
  paperGlobalCategories: { LC: 11, NE: 1, DD: 1, NT: 1 },
  excludedCandidates: {
    479: 'Commons candidate Upeneus vittatus.JPG depicts U. taeniopterus, not U. vittatus',
    480: 'only historical/plate imagery surfaced',
    481: 'questionable (#) in checklist',
    485: 'Terapon jarbua already represented in the seed',
    491: 'no eligible exact-taxon Commons file found',
  },
  stopMarker: 712,
}, null, 2))
