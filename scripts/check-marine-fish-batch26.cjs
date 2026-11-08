#!/usr/bin/env node
// Batch 26: direct Table-I rows, accepted WoRMS taxonomy, Commons credit/license and MD5 paths.
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
require('./register-typescript.cjs')
const { SPECIES } = require('../data/seed/index.ts')
const { MORE_FISH26, MORE_FISH26_MEDIA } = require('../data/seed/more-fish26.ts')
const { allMediaLicenses, licenseFor } = require('../data/seed/media-licenses.ts')
const { MARINE_FISH_BD } = require('../data/seed/sources.ts')
const priorSeeds = []
for (let n = 1; n <= 25; n++) {
  const file = n === 1 ? 'more-fish' : `more-fish${n}`
  const batch = require(`../data/seed/${file}.ts`)
  priorSeeds.push(...batch[n === 1 ? 'MORE_FISH' : `MORE_FISH${n}`])
}
const rows = new Map([
  ['onespot-demoiselle', 549], ['marginate-dascyllus', 550], ['white-damsel', 551],
  ['honeyhead-damsel', 552], ['yellowtail-demoiselle', 553], ['regal-demoiselle', 554],
  ['obscure-damsel', 556], ['caerulean-damsel', 558], ['neon-damselfish', 559],
  ['similar-damsel', 561], ['threespot-damselfish', 562], ['ocellate-damselfish', 563],
  ['maroon-anemonefish', 564], ['pacific-gregory', 566],
])
const expectedStatus = { 549: 'LC', 550: 'NE', 551: 'NE', 552: 'NE', 553: 'NE', 554: 'VU', 556: 'NE', 558: 'NE', 559: 'NE', 561: 'NE', 562: 'NE', 563: 'NE', 564: 'NE', 566: 'LC' }
const taxonomy = {
  'onespot-demoiselle': ['Ovalentaria incertae sedis', 'Pomacentridae', 218782],
  'marginate-dascyllus': ['Ovalentaria incertae sedis', 'Pomacentridae', 212849],
  'white-damsel': ['Ovalentaria incertae sedis', 'Pomacentridae', 280563],
  'honeyhead-damsel': ['Ovalentaria incertae sedis', 'Pomacentridae', 280564],
  'yellowtail-demoiselle': ['Ovalentaria incertae sedis', 'Pomacentridae', 218837],
  'regal-demoiselle': ['Ovalentaria incertae sedis', 'Pomacentridae', 218839],
  'obscure-damsel': ['Ovalentaria incertae sedis', 'Pomacentridae', 277127],
  'caerulean-damsel': ['Ovalentaria incertae sedis', 'Pomacentridae', 212993],
  'neon-damselfish': ['Ovalentaria incertae sedis', 'Pomacentridae', 277145],
  'similar-damsel': ['Ovalentaria incertae sedis', 'Pomacentridae', 277170],
  'threespot-damselfish': ['Ovalentaria incertae sedis', 'Pomacentridae', 212968],
  'ocellate-damselfish': ['Ovalentaria incertae sedis', 'Pomacentridae', 277176],
  'maroon-anemonefish': ['Ovalentaria incertae sedis', 'Pomacentridae', 1605249],
  'pacific-gregory': ['Ovalentaria incertae sedis', 'Pomacentridae', 1592381],
}
const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const supportedLicenses = new Set(['CC BY 2.0', 'CC BY 3.0', 'CC BY 4.0', 'CC BY-SA 3.0', 'CC BY-SA 4.0', 'CC0'])
assert.equal(MORE_FISH26.length, 14)
assert.equal(rows.size, 14)
assert.equal(new Set(rows.values()).size, 14)
assert.deepEqual([...rows.values()].sort((a, b) => a - b), [549,550,551,552,553,554,556,558,559,561,562,563,564,566])
assert.equal(new Set(MORE_FISH26.map((s) => normalize(s.scientificName))).size, 14)
assert.equal(new Set(MORE_FISH26.map((s) => normalize(s.nameBn))).size, 14)
assert.equal(MORE_FISH26.filter((s) => !priorSeeds.some((old) => normalize(old.scientificName) === normalize(s.scientificName))).length, 14)
assert.equal(priorSeeds.filter((s) => normalize(s.scientificName) === 'abudefduf bengalensis').length, 1, 'row537 prior taxon remains represented once')

for (const species of MORE_FISH26) {
  const row = rows.get(species.slug), expected = taxonomy[species.slug]
  assert.ok(row && row < 712, `${species.slug}: row missing or past stop marker`)
  assert.equal(Object.keys(species).length, 31)
  assert.equal(species.type, 'prani'); assert.equal(species.group, 'machh')
  assert.equal(species.origin, 'native'); assert.equal(species.conservation, expectedStatus[row])
  assert.equal(species.dataStatus, 'partial'); assert.equal(species.taxonomy?.class, 'Actinopterygii')
  assert.deepEqual([species.taxonomy?.order, species.taxonomy?.family], expected.slice(0, 2))
  assert.ok(species.sources?.some((source) => source.title.includes(`row ${row}`) && source.url === MARINE_FISH_BD.url))
  const worms = species.sources?.find((source) => source.title === `WoRMS accepted taxon: ${species.scientificName}`)
  assert.ok(worms); assert.equal(worms.url, `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${expected[2]}`)
  assert.match(species.conservationBn, /জাতীয় অবস্থার দাবি নয়/)
  assert.ok(!species.sources?.some((source) => /IUCN Bangladesh|national status/i.test(source.title)))
  const matches = SPECIES.filter((record) => normalize(record.scientificName) === normalize(species.scientificName))
  assert.equal(matches.length, 1, `${species.slug}: catalog dedupe lost or duplicated the taxon`)
  assert.equal(matches[0].slug, species.slug)
  assert.ok(matches[0].sources?.some((source) => source.title.includes(`row ${row}`) && source.url === MARINE_FISH_BD.url))
  const media = licenseFor(species.image)
  assert.ok(media); assert.equal(media.slug, species.slug); assert.equal(media.file, species.image); assert.equal(media.verified, true)
  assert.ok(media.credit); assert.ok(supportedLicenses.has(media.license), `${species.slug}: unsupported license`)
  const expectedMedia = MORE_FISH26_MEDIA.find((entry) => entry.slug === species.slug)
  assert.ok(expectedMedia); assert.equal(media.license, expectedMedia.license); assert.equal(media.licenseUrl, expectedMedia.licenseUrl)
  assert.match(media.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
  assert.match(media.note, /Commons file page reviewed;/)
  const filename = decodeURIComponent(media.source.split('File:')[1])
  const digest = createHash('md5').update(filename.replace(/ /g, '_')).digest('hex')
  const path = new URL(media.file).pathname.split('/').filter(Boolean)
  assert.equal(path[2], digest[0], `${species.slug}: MD5 first directory mismatch`)
  assert.equal(path[3], digest.slice(0, 2), `${species.slug}: MD5 second directory mismatch`)
}
for (const [slug, alias, id] of [
  ['maroon-anemonefish', 'Premnas biaculeatus', 212768],
  ['pacific-gregory', 'Stegastes fasciolatus', 218850],
]) {
  const species = MORE_FISH26.find((s) => s.slug === slug)
  assert.deepEqual(species.otherNames, [alias], `${slug}: checklist name must remain searchable`)
  assert.ok(species.sources?.some((source) => source.title === `WoRMS checklist-name mapping: ${alias}` && source.url.endsWith(`id=${id}`)))
  if (slug === 'pacific-gregory') assert.ok(species.sources?.some((source) => source.title.includes('iNaturalist observation taxon confirmation') && source.url.endsWith('/140112794')))
}
const imageSet = new Set(MORE_FISH26.map((species) => species.image))
const credits = allMediaLicenses().filter((entry) => imageSet.has(entry.file) && entry.kind === 'image')
assert.equal(credits.length, 14); assert.equal(new Set(credits.map((entry) => entry.file)).size, 14)
assert.deepEqual(credits.reduce((counts, entry) => ({ ...counts, [entry.license]: (counts[entry.license] || 0) + 1 }), {}), {
  'CC BY-SA 4.0': 5, 'CC BY-SA 3.0': 3, 'CC BY 2.0': 2, 'CC BY 3.0': 1, 'CC BY 4.0': 2, CC0: 1,
})
console.log(JSON.stringify({
  checklistRowMatches: 14, newAcceptedTaxa: 14,
  rows: [...rows.values()].sort((a, b) => a - b), verifiedImageCredits: 14, commonsMd5Paths: 14,
  paperGlobalCategories: { LC: 2, NE: 11, VU: 1 },
  verifiedLicenses: { 'CC BY-SA 4.0': 5, 'CC BY-SA 3.0': 3, 'CC BY 4.0': 2, 'CC BY 2.0': 2, 'CC BY 3.0': 1, CC0: 1 },
  acceptedNameMappings: { 'Premnas biaculeatus': 'Amphiprion biaculeatus (AphiaID 1605249)', 'Stegastes fasciolatus': 'Plectroglyphidodon fasciolatus (AphiaID 1592381)' },
  exclusions: { 555: 'only surfaced Commons exact-name images are historical plates', 557: 'no Commons exact-name image found', 560: 'no eligible Commons exact-name image found' },
  nextCandidate: 565, stopMarker: 712,
}, null, 2))
