#!/usr/bin/env node
// Batch 23: direct Table-I rows, WoRMS accepted taxonomy, image credit/license and Commons paths.
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
require('./register-typescript.cjs')

const { SPECIES } = require('../data/seed/index.ts')
const { MORE_FISH23, MORE_FISH23_MEDIA } = require('../data/seed/more-fish23.ts')
const { allMediaLicenses, licenseFor } = require('../data/seed/media-licenses.ts')
const { MARINE_FISH_BD } = require('../data/seed/sources.ts')
const priorSeeds = []
for (let n = 1; n <= 22; n++) {
  const file = n === 1 ? 'more-fish' : `more-fish${n}`
  const batchModule = require(`../data/seed/${file}.ts`)
  const key = n === 1 ? 'MORE_FISH' : `MORE_FISH${n}`
  priorSeeds.push(...batchModule[key])
}

const rows = new Map([
  ['starspotted-grouper', 498], ['giant-grouper', 499], ['malabar-grouper', 501],
  ['honeycomb-grouper', 502], ['comet-grouper', 503], ['camouflage-grouper', 504],
  ['oblique-banded-grouper', 506], ['greasy-grouper', 507], ['goldenstriped-soapfish', 508],
  ['leopard-coral-grouper', 509], ['roving-coral-grouper', 510], ['false-trevally', 511],
  ['silver-moony', 512], ['elongate-ponyfish', 514],
])
const expectedStatus = {
  498: 'LC', 499: 'DD', 501: 'LC', 502: 'LC', 503: 'LC', 504: 'VU', 506: 'LC',
  507: 'DD', 508: 'LC', 509: 'LC', 510: 'LC', 511: 'NE', 512: 'LC', 514: 'NE',
}
const taxonomy = {
  'starspotted-grouper': ['Perciformes', 'Epinephelidae', 218232],
  'giant-grouper': ['Perciformes', 'Epinephelidae', 218224],
  'malabar-grouper': ['Perciformes', 'Epinephelidae', 218206],
  'honeycomb-grouper': ['Perciformes', 'Epinephelidae', 218228],
  'comet-grouper': ['Perciformes', 'Epinephelidae', 218201],
  'camouflage-grouper': ['Perciformes', 'Epinephelidae', 218197],
  'oblique-banded-grouper': ['Perciformes', 'Epinephelidae', 218222],
  'greasy-grouper': ['Perciformes', 'Epinephelidae', 218205],
  'goldenstriped-soapfish': ['Perciformes', 'Grammistidae', 211864],
  'leopard-coral-grouper': ['Perciformes', 'Epinephelidae', 218261],
  'roving-coral-grouper': ['Perciformes', 'Epinephelidae', 218265],
  'false-trevally': ['Sphyraeniformes', 'Lactariidae', 218381],
  'silver-moony': ['Eupercaria incertae sedis1', 'Monodactylidae', 218695],
  'elongate-ponyfish': ['Gerreiformes', 'Leiognathidae', 398517],
}
const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const supportedLicenses = new Set([
  'CC BY 2.0', 'CC BY 3.0', 'CC BY 4.0', 'CC BY-SA 2.0', 'CC BY-SA 2.5',
  'CC BY-SA 3.0', 'CC BY-SA 4.0', 'CC0',
])

assert.equal(MORE_FISH23.length, 14, 'batch 23 must contain exactly 14 eligible taxa')
assert.equal(rows.size, 14, 'direct Table-I row map must cover every candidate')
assert.equal(new Set(rows.values()).size, 14, 'direct Table-I rows must be unique')
assert.deepEqual([...rows.values()].sort((a, b) => a - b), [498,499,501,502,503,504,506,507,508,509,510,511,512,514])
assert.equal(new Set(MORE_FISH23.map((species) => normalize(species.scientificName))).size, 14, 'accepted scientific names must be unique')
assert.equal(MORE_FISH23.filter((species) => !priorSeeds.some((old) => normalize(old.scientificName) === normalize(species.scientificName))).length, 14, 'all accepted taxa must be new against fish batches 1–22')

for (const species of MORE_FISH23) {
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
  const expectedMedia = MORE_FISH23_MEDIA.find((entry) => entry.slug === species.slug)
  assert.ok(expectedMedia)
  assert.equal(media.license, expectedMedia.license)
  assert.match(media.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
  assert.ok(media.licenseUrl?.startsWith('https://creativecommons.org/'))
  const filename = decodeURIComponent(media.source.split('File:')[1])
  const digest = createHash('md5').update(filename.replace(/ /g, '_')).digest('hex')
  const path = new URL(media.file).pathname.split('/').filter(Boolean)
  assert.equal(path[2], digest[0], `${species.slug}: Commons MD5 first directory mismatch`)
  assert.equal(path[3], digest.slice(0, 2), `${species.slug}: Commons MD5 second directory mismatch`)

  if (species.taxonomy?.family === 'Epinephelidae') {
    assert.ok(species.sources?.some((source) => source.url === 'https://www.fda.gov/media/80235/download'), `${species.slug}: ciguatera food-safety source missing`)
    assert.match(species.description, /ciguatera/i, `${species.slug}: ciguatera caution missing`)
    assert.match(species.description, /not Bangladesh-specific/i, `${species.slug}: geographic caveat missing`)
  }
  if (species.slug === 'false-trevally') {
    assert.ok(species.sources?.some((source) => source.url === 'https://en.wikipedia.org/wiki/False_trevally'), 'false trevally image/species identification source missing')
  }
}

const imageSet = new Set(MORE_FISH23.map((species) => species.image))
const credits = allMediaLicenses().filter((entry) => imageSet.has(entry.file) && entry.kind === 'image')
assert.equal(credits.length, 14, 'all batch records must have one image credit')
assert.equal(new Set(credits.map((entry) => entry.file)).size, 14, 'image URLs must be unique')

console.log(JSON.stringify({
  checklistRowMatches: 14,
  newAcceptedTaxa: 14,
  rows: [...rows.values()].sort((a, b) => a - b),
  verifiedImageCredits: 14,
  commonsMd5Paths: 14,
  paperGlobalCategories: { LC: 9, DD: 2, VU: 1, NE: 2 },
  excludedCandidates: {
    500: 'the only exact-taxon Commons candidate surfaced was an 1878 historical plate',
    505: 'Epinephelus quoyanus already represented in the seed',
    513: 'Commons page title/caption/category say Aurigequula fasciata, but its structured depicts statement says Gerres filamentosus; held pending resolution',
  },
  nextCandidate: 515,
  stopMarker: 712,
}, null, 2))
