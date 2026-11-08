#!/usr/bin/env node
// Batch 25: direct Table-I rows, exact WoRMS taxonomy, image credits/licenses and Commons paths.
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
require('./register-typescript.cjs')

const { SPECIES } = require('../data/seed/index.ts')
const { MORE_FISH25, MORE_FISH25_MEDIA } = require('../data/seed/more-fish25.ts')
const { allMediaLicenses, licenseFor } = require('../data/seed/media-licenses.ts')
const { MARINE_FISH_BD } = require('../data/seed/sources.ts')
const priorSeeds = []
for (let n = 1; n <= 24; n++) {
  const file = n === 1 ? 'more-fish' : `more-fish${n}`
  const batchModule = require(`../data/seed/${file}.ts`)
  const key = n === 1 ? 'MORE_FISH' : `MORE_FISH${n}`
  priorSeeds.push(...batchModule[key])
}

const rows = new Map([
  ['emperor-angelfish', 534], ['semicircle-angelfish', 535], ['sixbar-angelfish', 536],
  ['banded-sergeant', 538], ['scissortail-sergeant', 539], ['blackspot-sergeant', 540],
  ['indo-pacific-sergeant', 541], ['saddle-anemonefish', 542], ['orange-clownfish', 543],
  ['big-lip-damsel', 544], ['green-puller', 545], ['ternate-chromis', 546],
  ['blue-green-chromis', 547], ['surge-damselfish', 548],
])
const expectedStatus = {
  534: 'LC', 535: 'LC', 536: 'LC', 538: 'LC', 539: 'NE', 540: 'LC', 541: 'LC',
  542: 'LC', 543: 'NE', 544: 'NE', 545: 'LC', 546: 'NE', 547: 'NE', 548: 'NE',
}
const taxonomy = {
  'emperor-angelfish': ['Chaetodontiformes', 'Pomacanthidae', 220001],
  'semicircle-angelfish': ['Chaetodontiformes', 'Pomacanthidae', 220003],
  'sixbar-angelfish': ['Chaetodontiformes', 'Pomacanthidae', 276026],
  'banded-sergeant': ['Ovalentaria incertae sedis', 'Pomacentridae', 212878],
  'scissortail-sergeant': ['Ovalentaria incertae sedis', 'Pomacentridae', 159289],
  'blackspot-sergeant': ['Ovalentaria incertae sedis', 'Pomacentridae', 212888],
  'indo-pacific-sergeant': ['Ovalentaria incertae sedis', 'Pomacentridae', 212879],
  'saddle-anemonefish': ['Ovalentaria incertae sedis', 'Pomacentridae', 212782],
  'orange-clownfish': ['Ovalentaria incertae sedis', 'Pomacentridae', 278402],
  'big-lip-damsel': ['Ovalentaria incertae sedis', 'Pomacentridae', 280136],
  'green-puller': ['Ovalentaria incertae sedis', 'Pomacentridae', 212815],
  'ternate-chromis': ['Ovalentaria incertae sedis', 'Pomacentridae', 212810],
  'blue-green-chromis': ['Ovalentaria incertae sedis', 'Pomacentridae', 212811],
  'surge-damselfish': ['Ovalentaria incertae sedis', 'Pomacentridae', 276827],
}
const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const supportedLicenses = new Set(['CC BY 2.0', 'CC BY 4.0', 'CC BY-SA 4.0', 'CC0'])

assert.equal(MORE_FISH25.length, 14, 'batch 25 must contain exactly 14 eligible taxa')
assert.equal(rows.size, 14, 'direct Table-I row map must cover every candidate')
assert.equal(new Set(rows.values()).size, 14, 'direct Table-I rows must be unique')
assert.deepEqual([...rows.values()].sort((a, b) => a - b), [534,535,536,538,539,540,541,542,543,544,545,546,547,548])
assert.equal(new Set(MORE_FISH25.map((species) => normalize(species.scientificName))).size, 14, 'accepted scientific names must be unique')
assert.equal(new Set(MORE_FISH25.map((species) => normalize(species.nameBn))).size, 14, 'Bengali display names must not collapse under catalog dedupe')
assert.equal(MORE_FISH25.filter((species) => !priorSeeds.some((old) => normalize(old.scientificName) === normalize(species.scientificName))).length, 14, 'all accepted taxa must be new against fish batches 1–24')
assert.equal(priorSeeds.filter((species) => normalize(species.scientificName) === 'abudefduf bengalensis').length, 1, 'row537 Abudefduf bengalensis must remain represented once in prior seeds')

for (const species of MORE_FISH25) {
  const row = rows.get(species.slug)
  const expectedTaxon = taxonomy[species.slug]
  assert.ok(row && row < 712, `${species.slug}: row missing or beyond stop marker`)
  assert.ok(expectedTaxon, `${species.slug}: accepted taxonomy contract missing`)
  assert.equal(Object.keys(species).length, 31, `${species.slug}: expected 31 species keys`)
  assert.equal(species.type, 'prani')
  assert.equal(species.group, 'machh')
  assert.equal(species.origin, 'native', `${species.slug}: Bangladesh checklist occurrence must be retained`)
  assert.equal(species.conservation, expectedStatus[row], `${species.slug}: paper-reported global IUCN value mismatch`)
  assert.equal(species.dataStatus, 'partial')
  assert.equal(species.taxonomy?.class, 'Actinopterygii')
  assert.deepEqual([species.taxonomy?.order, species.taxonomy?.family], expectedTaxon.slice(0, 2), `${species.slug}: WoRMS order/family mismatch`)
  assert.ok(species.sources?.some((source) => source.title.includes(`row ${row}`) && source.url === MARINE_FISH_BD.url), `${species.slug}: direct checklist row citation missing`)
  const worms = species.sources?.find((source) => source.title === `WoRMS accepted taxon: ${species.scientificName}`)
  assert.ok(worms, `${species.slug}: WoRMS accepted-name citation missing`)
  assert.equal(worms.url, `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${expectedTaxon[2]}`, `${species.slug}: WoRMS AphiaID mismatch`)
  assert.match(species.conservationBn, /জাতীয় অবস্থার দাবি নয়/, `${species.slug}: global category must not be represented as national status`)
  assert.ok(!species.sources?.some((source) => /IUCN Bangladesh|national status/i.test(source.title)), `${species.slug}: unsupported national status source introduced`)

  const finalMatches = SPECIES.filter((record) => normalize(record.scientificName) === normalize(species.scientificName))
  assert.equal(finalMatches.length, 1, `${species.slug}: catalog must contain one accepted-taxon entry`)
  assert.equal(finalMatches[0].slug, species.slug, `${species.slug}: unexpected catalog canonical after dedupe`)
  assert.ok(finalMatches[0].sources?.some((source) => source.title.includes(`row ${row}`) && source.url === MARINE_FISH_BD.url), `${species.slug}: checklist row source lost in catalog`)

  const media = licenseFor(species.image)
  assert.ok(media, `${species.slug}: image has no credit/license record`)
  assert.equal(media.slug, species.slug)
  assert.equal(media.file, species.image)
  assert.equal(media.verified, true)
  assert.ok(media.credit, `${species.slug}: named creator/attribution record missing`)
  assert.ok(supportedLicenses.has(media.license), `${species.slug}: unsupported or unverified license ${media.license}`)
  const expectedMedia = MORE_FISH25_MEDIA.find((entry) => entry.slug === species.slug)
  assert.ok(expectedMedia)
  assert.equal(media.license, expectedMedia.license)
  assert.match(media.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
  assert.equal(media.licenseUrl, expectedMedia.licenseUrl)
  assert.match(media.note, /Commons file page reviewed;/)
  const filename = decodeURIComponent(media.source.split('File:')[1])
  const digest = createHash('md5').update(filename.replace(/ /g, '_')).digest('hex')
  const path = new URL(media.file).pathname.split('/').filter(Boolean)
  assert.equal(path[2], digest[0], `${species.slug}: Commons MD5 first directory mismatch`)
  assert.equal(path[3], digest.slice(0, 2), `${species.slug}: Commons MD5 second directory mismatch`)
}

const imageSet = new Set(MORE_FISH25.map((species) => species.image))
const credits = allMediaLicenses().filter((entry) => imageSet.has(entry.file) && entry.kind === 'image')
assert.equal(credits.length, 14, 'all batch records must have one image credit')
assert.equal(new Set(credits.map((entry) => entry.file)).size, 14, 'image URLs must be unique')
assert.deepEqual(credits.reduce((counts, entry) => ({ ...counts, [entry.license]: (counts[entry.license] || 0) + 1 }), {}), {
  'CC BY-SA 4.0': 7, 'CC BY 2.0': 1, 'CC BY 4.0': 5, CC0: 1,
}, 'verified license counts mismatch')

console.log(JSON.stringify({
  checklistRowMatches: 14,
  newAcceptedTaxa: 14,
  rows: [...rows.values()].sort((a, b) => a - b),
  verifiedImageCredits: 14,
  commonsMd5Paths: 14,
  paperGlobalCategories: { LC: 8, NE: 6 },
  acceptedTaxonomy: {
    Pomacanthidae: 'Chaetodontiformes',
    Pomacentridae: 'Ovalentaria incertae sedis (as reported by WoRMS)',
  },
  verifiedLicenses: { 'CC BY-SA 4.0': 7, 'CC BY 4.0': 5, 'CC BY 2.0': 1, CC0: 1 },
  excludedCandidates: {
    537: 'Abudefduf bengalensis is already represented in prior seeds',
  },
  nextCandidate: 549,
  stopMarker: 712,
}, null, 2))
