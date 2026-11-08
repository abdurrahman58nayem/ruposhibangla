#!/usr/bin/env node
// Batch 24: direct Table-I rows, accepted WoRMS taxonomy, media licensing and Commons paths.
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
require('./register-typescript.cjs')

const { SPECIES } = require('../data/seed/index.ts')
const { MORE_FISH24, MORE_FISH24_MEDIA } = require('../data/seed/more-fish24.ts')
const { allMediaLicenses, licenseFor } = require('../data/seed/media-licenses.ts')
const { MARINE_FISH_BD } = require('../data/seed/sources.ts')
const priorSeeds = []
for (let n = 1; n <= 23; n++) {
  const file = n === 1 ? 'more-fish' : `more-fish${n}`
  const batchModule = require(`../data/seed/${file}.ts`)
  const key = n === 1 ? 'MORE_FISH' : `MORE_FISH${n}`
  priorSeeds.push(...batchModule[key])
}

const rows = new Map([
  ['ornate-ponyfish', 515], ['splendid-ponyfish', 516], ['common-ponyfish', 519],
  ['orangefin-ponyfish', 521], ['deep-pugnose-ponyfish', 523], ['redtail-butterflyfish', 524],
  ['indian-vagabond-butterflyfish', 525], ['blackback-butterflyfish', 526],
  ['eightband-butterflyfish', 527], ['vagabond-butterflyfish', 528],
  ['pennant-coralfish', 529], ['singular-bannerfish', 530],
  ['sixspine-butterflyfish', 531], ['bluering-angelfish', 533],
])
const expectedStatus = {
  515: 'NE', 516: 'LC', 519: 'LC', 521: 'NE', 523: 'NE', 524: 'LC', 525: 'LC',
  526: 'LC', 527: 'LC', 528: 'LC', 529: 'LC', 530: 'LC', 531: 'LC', 533: 'LC',
}
const taxonomy = {
  'ornate-ponyfish': ['Gerreiformes', 'Leiognathidae', 713341],
  'splendid-ponyfish': ['Gerreiformes', 'Leiognathidae', 398527],
  'common-ponyfish': ['Gerreiformes', 'Leiognathidae', 303762],
  'orangefin-ponyfish': ['Gerreiformes', 'Leiognathidae', 398536],
  'deep-pugnose-ponyfish': ['Gerreiformes', 'Leiognathidae', 1805566],
  'redtail-butterflyfish': ['Chaetodontiformes', 'Chaetodontidae', 273330],
  'indian-vagabond-butterflyfish': ['Chaetodontiformes', 'Chaetodontidae', 273333],
  'blackback-butterflyfish': ['Chaetodontiformes', 'Chaetodontidae', 218743],
  'eightband-butterflyfish': ['Chaetodontiformes', 'Chaetodontidae', 218746],
  'vagabond-butterflyfish': ['Chaetodontiformes', 'Chaetodontidae', 218754],
  'pennant-coralfish': ['Chaetodontiformes', 'Chaetodontidae', 218765],
  'singular-bannerfish': ['Chaetodontiformes', 'Chaetodontidae', 218766],
  'sixspine-butterflyfish': ['Chaetodontiformes', 'Chaetodontidae', 282012],
  'bluering-angelfish': ['Chaetodontiformes', 'Pomacanthidae', 220004],
}
const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const supportedLicenses = new Set([
  'CC BY 2.0', 'CC BY 3.0', 'CC BY 4.0', 'CC BY-SA 2.0', 'CC BY-SA 2.5',
  'CC BY-SA 3.0', 'CC BY-SA 4.0', 'CC0',
])

assert.equal(MORE_FISH24.length, 14, 'batch 24 must contain exactly 14 eligible taxa')
assert.equal(rows.size, 14, 'direct Table-I row map must cover every candidate')
assert.equal(new Set(rows.values()).size, 14, 'direct Table-I rows must be unique')
assert.deepEqual([...rows.values()].sort((a, b) => a - b), [515,516,519,521,523,524,525,526,527,528,529,530,531,533])
assert.equal(new Set(MORE_FISH24.map((species) => normalize(species.scientificName))).size, 14, 'accepted scientific names must be unique')
assert.equal(MORE_FISH24.filter((species) => !priorSeeds.some((old) => normalize(old.scientificName) === normalize(species.scientificName))).length, 14, 'all accepted taxa must be new against fish batches 1–23')
assert.equal(priorSeeds.filter((species) => normalize(species.scientificName) === 'gazza minuta').length, 1, 'row517 Gazza minuta must remain represented exactly once in prior seeds')

for (const species of MORE_FISH24) {
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
  assert.ok(!species.sources?.some((source) => /IUCN Bangladesh|national status/i.test(source.title)), `${species.slug}: no unsupported national status source may be introduced`)

  const finalMatches = SPECIES.filter((record) => normalize(record.scientificName) === normalize(species.scientificName))
  assert.equal(finalMatches.length, 1, `${species.slug}: catalog must contain one accepted-taxon entry`)
  assert.equal(finalMatches[0].slug, species.slug, `${species.slug}: unexpected catalog canonical after dedupe`)
  assert.ok(finalMatches[0].sources?.some((source) => source.title.includes(`row ${row}`) && source.url === MARINE_FISH_BD.url), `${species.slug}: checklist row source lost in catalog`)

  if (species.slug === 'ornate-ponyfish') {
    assert.deepEqual(species.otherNames, [])
    assert.ok(species.sources?.some((source) => source.title === 'WoRMS synonym mapping: Leiognathus lineolatus' && source.url.endsWith('id=218457')), 'Commons legacy combination mapping missing')
  }
  if (species.slug === 'deep-pugnose-ponyfish') {
    assert.deepEqual(species.otherNames, ['Secutor ruconius'], 'checklist combination must remain searchable as an alias')
    assert.ok(species.sources?.some((source) => source.title === 'WoRMS checklist-name mapping: Secutor ruconius' && source.url.endsWith('id=218463')), 'superseded checklist combination mapping missing')
  }

  const media = licenseFor(species.image)
  assert.ok(media, `${species.slug}: image has no credit/license record`)
  assert.equal(media.slug, species.slug)
  assert.equal(media.file, species.image)
  assert.equal(media.verified, true)
  assert.ok(media.credit, `${species.slug}: named creator/attribution record missing`)
  assert.ok(supportedLicenses.has(media.license), `${species.slug}: unsupported or unverified license ${media.license}`)
  const expectedMedia = MORE_FISH24_MEDIA.find((entry) => entry.slug === species.slug)
  assert.ok(expectedMedia)
  assert.equal(media.license, expectedMedia.license)
  assert.match(media.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
  assert.ok(media.licenseUrl?.startsWith('https://creativecommons.org/'))
  assert.match(media.note, /Commons file page reviewed;/)
  const filename = decodeURIComponent(media.source.split('File:')[1])
  const digest = createHash('md5').update(filename.replace(/ /g, '_')).digest('hex')
  const path = new URL(media.file).pathname.split('/').filter(Boolean)
  assert.equal(path[2], digest[0], `${species.slug}: Commons MD5 first directory mismatch`)
  assert.equal(path[3], digest.slice(0, 2), `${species.slug}: Commons MD5 second directory mismatch`)
}

const imageSet = new Set(MORE_FISH24.map((species) => species.image))
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
  acceptedNameMappings: {
    'Leiognathus lineolatus': 'Equulites lineolatus (AphiaID 713341)',
    'Secutor ruconius': 'Deveximentum ruconius (AphiaID 1805566)',
  },
  excludedCandidates: {
    517: 'Gazza minuta is already seeded',
    518: 'the surfaced exact-name Commons file is 300×255',
    520: 'the surfaced exact-name Commons file is 300×225',
    522: 'the surfaced exact-name CSIRO image is 567×377; stronger eligible later-row candidates were selected instead',
    532: 'the two surfaced exact-name Commons photos are 450×403 and 501×547; stronger eligible later-row candidates were selected instead',
  },
  nextCandidate: 534,
  stopMarker: 712,
}, null, 2))
