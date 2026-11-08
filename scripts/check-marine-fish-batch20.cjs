#!/usr/bin/env node
// Batch 20: checklist row crosswalk, accepted taxonomy, image credits and safety note.
const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
require('./register-typescript.cjs')

const { SPECIES } = require('../data/seed/index.ts')
const { MORE_FISH20, MORE_FISH20_MEDIA } = require('../data/seed/more-fish20.ts')
const { MORE_FISH } = require('../data/seed/more-fish.ts')
const { MORE_FISH2 } = require('../data/seed/more-fish2.ts')
const { MORE_FISH3 } = require('../data/seed/more-fish3.ts')
const { MORE_FISH4 } = require('../data/seed/more-fish4.ts')
const { MORE_FISH5 } = require('../data/seed/more-fish5.ts')
const { MORE_FISH6 } = require('../data/seed/more-fish6.ts')
const { MORE_FISH7 } = require('../data/seed/more-fish7.ts')
const { MORE_FISH8 } = require('../data/seed/more-fish8.ts')
const { MORE_FISH9 } = require('../data/seed/more-fish9.ts')
const { MORE_FISH10 } = require('../data/seed/more-fish10.ts')
const { MORE_FISH11 } = require('../data/seed/more-fish11.ts')
const { MORE_FISH12 } = require('../data/seed/more-fish12.ts')
const { MORE_FISH13 } = require('../data/seed/more-fish13.ts')
const { MORE_FISH14 } = require('../data/seed/more-fish14.ts')
const { MORE_FISH15 } = require('../data/seed/more-fish15.ts')
const { MORE_FISH16 } = require('../data/seed/more-fish16.ts')
const { MORE_FISH17 } = require('../data/seed/more-fish17.ts')
const { MORE_FISH18 } = require('../data/seed/more-fish18.ts')
const { MORE_FISH19 } = require('../data/seed/more-fish19.ts')
const { allMediaLicenses, licenseFor } = require('../data/seed/media-licenses.ts')
const { MARINE_FISH_BD } = require('../data/seed/sources.ts')

const rows = new Map([
  ['indian-driftfish', 427], ['silver-pomfret', 428], ['latticed-sandperch', 432],
  ['dollfus-stargazer', 439], ['bay-of-bengal-hogfish', 443], ['floral-wrasse', 444],
  ['robust-tuskfish', 445], ['clown-coris', 446], ['african-coris', 447],
  ['checkerboard-wrasse', 449], ['barred-thicklip', 450], ['bluestreak-cleaner-wrasse', 451],
  ['moon-wrasse', 452], ['green-humphead-parrotfish', 453],
])
const expectedStatus = {
  427: 'NE', 428: 'NE', 432: 'NE', 439: 'LC', 443: 'LC', 444: 'LC', 445: 'NE',
  446: 'LC', 447: 'LC', 449: 'LC', 450: 'LC', 451: 'LC', 452: 'NE', 453: 'VU',
}
const taxonomy = {
  'indian-driftfish': ['Scombriformes', 'Ariommatidae', 219752],
  'silver-pomfret': ['Scombriformes', 'Stromateidae', 127075],
  'latticed-sandperch': ['Uranoscopiformes', 'Pinguipedidae', 276987],
  'dollfus-stargazer': ['Uranoscopiformes', 'Uranoscopidae', 274036],
  'bay-of-bengal-hogfish': ['Labriformes', 'Labridae', 273537],
  'floral-wrasse': ['Labriformes', 'Labridae', 218941],
  'robust-tuskfish': ['Labriformes', 'Labridae', 218950],
  'clown-coris': ['Labriformes', 'Labridae', 218957],
  'african-coris': ['Labriformes', 'Labridae', 218960],
  'checkerboard-wrasse': ['Labriformes', 'Labridae', 218985],
  'barred-thicklip': ['Labriformes', 'Labridae', 218999],
  'bluestreak-cleaner-wrasse': ['Labriformes', 'Labridae', 219014],
  'moon-wrasse': ['Labriformes', 'Labridae', 212209],
  'green-humphead-parrotfish': ['Labriformes', 'Labridae', 219074],
}
const normalize = (value) => String(value ?? '').normalize('NFKC').trim().toLocaleLowerCase('en')
const uniqueKeys = ['slug', 'scientificName', 'nameBn', 'image']
const supportedLicenses = new Set([
  'CC BY 2.0', 'CC BY 3.0', 'CC BY 4.0', 'CC BY-SA 2.0', 'CC BY-SA 2.5',
  'CC BY-SA 3.0', 'CC BY-SA 4.0', 'CC0', 'Public domain',
])
const priorSeeds = [
  MORE_FISH, MORE_FISH2, MORE_FISH3, MORE_FISH4, MORE_FISH5, MORE_FISH6, MORE_FISH7,
  MORE_FISH8, MORE_FISH9, MORE_FISH10, MORE_FISH11, MORE_FISH12, MORE_FISH13,
  MORE_FISH14, MORE_FISH15, MORE_FISH16, MORE_FISH17, MORE_FISH18, MORE_FISH19,
].flat()

assert.equal(MORE_FISH20.length, 14, 'batch 20 must contain 14 candidates')
assert.equal(rows.size, 14, 'direct Table-I row map must cover all candidates')
assert.equal(new Set(rows.values()).size, 14, 'direct Table-I rows must be unique')
assert.equal(new Set(MORE_FISH20.map((species) => species.scientificName)).size, 14, 'accepted scientific names must be unique')
assert.equal(MORE_FISH20.filter((species) => !priorSeeds.some((old) => normalize(old.scientificName) === normalize(species.scientificName))).length, 14, 'all batch taxa must be new canonical records')

for (const species of MORE_FISH20) {
  const row = rows.get(species.slug)
  assert.ok(row && row <= 712, `${species.slug}: row missing or beyond stop marker`)
  assert.equal(Object.keys(species).length, 31, `${species.slug}: expected 31 species keys`)
  assert.equal(species.type, 'prani')
  assert.equal(species.group, 'machh')
  assert.equal(species.origin, 'native', `${species.slug}: Bangladesh checklist occurrence must be retained`)
  assert.equal(species.conservation, expectedStatus[row], `${species.slug}: paper-reported global IUCN value mismatch`)
  assert.equal(species.dataStatus, 'partial')
  assert.equal(species.taxonomy?.class, 'Actinopterygii')
  assert.deepEqual([species.taxonomy?.order, species.taxonomy?.family], taxonomy[species.slug].slice(0, 2), `${species.slug}: WoRMS order/family mismatch`)
  assert.ok(species.sources?.some((source) => source.title.includes(`row ${row}`) && source.url === MARINE_FISH_BD.url), `${species.slug}: row-specific checklist source missing`)
  const worms = species.sources?.find((source) => source.title === `WoRMS accepted taxon: ${species.scientificName}`)
  assert.ok(worms, `${species.slug}: accepted-name WoRMS citation missing`)
  assert.equal(worms.url, `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${taxonomy[species.slug][2]}`, `${species.slug}: WoRMS AphiaID mismatch`)

  for (const key of uniqueKeys) {
    assert.equal(MORE_FISH20.filter((candidate) => normalize(candidate[key]) === normalize(species[key])).length, 1, `${species.slug}: duplicate batch ${key}`)
  }
  const canonical = SPECIES.filter((record) => normalize(record.scientificName) === normalize(species.scientificName))
  assert.equal(canonical.length, 1, `${species.slug}: final catalog must have one accepted-taxon entry`)
  const finalRecord = canonical[0]
  assert.equal(finalRecord.slug, species.slug, `${species.slug}: unexpected canonical record after dedupe`)
  assert.ok(finalRecord.sources?.some((source) => source.title.includes(`row ${row}`) && source.url === MARINE_FISH_BD.url), `${species.slug}: checklist row source lost after dedupe`)
  assert.ok(finalRecord.sources?.some((source) => source.title.startsWith('WoRMS accepted taxon:')), `${species.slug}: WoRMS source lost after dedupe`)
  assert.ok(finalRecord.image === species.image || finalRecord.gallery?.includes(species.image), `${species.slug}: licensed photo lost after dedupe`)

  const license = licenseFor(species.image)
  assert.ok(license, `${species.slug}: image has no credit/license record`)
  assert.equal(license.slug, species.slug, `${species.slug}: media credit slug mismatch`)
  assert.equal(license.file, species.image, `${species.slug}: media credit URL mismatch`)
  assert.equal(license.verified, true, `${species.slug}: media credit is not verified`)
  const expectedMedia = MORE_FISH20_MEDIA.find((entry) => entry.slug === species.slug)
  assert.ok(expectedMedia, `${species.slug}: candidate media entry is missing`)
  assert.equal(license.license, expectedMedia.license, `${species.slug}: registered license mismatch`)
  assert.ok(supportedLicenses.has(license.license), `${species.slug}: unsupported license ${license.license}`)
  assert.match(license.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
  assert.ok(license.licenseUrl?.startsWith('https://creativecommons.org/'), `${species.slug}: license URL missing`)
  const filename = decodeURIComponent(license.source.split('File:')[1])
  const digest = createHash('md5').update(filename.replace(/ /g, '_')).digest('hex')
  const path = new URL(license.file).pathname.split('/').filter(Boolean)
  assert.equal(path[2], digest[0], `${species.slug}: Commons MD5 first directory mismatch`)
  assert.equal(path[3], digest.slice(0, 2), `${species.slug}: Commons MD5 second directory mismatch`)
}

const ariomma = MORE_FISH20.find((species) => species.slug === 'indian-driftfish')
assert.equal(ariomma.scientificName, 'Ariomma indica')
assert.ok(ariomma.otherNames.includes('Ariomma indicum'), 'checklist synonym spelling must be preserved as an alternate name')
assert.match(ariomma.description, /checklist prints “Ariomma indicum”/)

const stargazer = MORE_FISH20.find((species) => species.slug === 'dollfus-stargazer')
assert.match(stargazer.threats, /venom.*uncertain/i, 'stargazer spine warning must preserve uncertainty')
assert.ok(stargazer.sources.some((source) => source.url === 'https://www.vapaguide.info/catalogue/NORAM-FIS-141'), 'stargazer handling caution must have a source')
assert.doesNotMatch(stargazer.threats, /has an? electric organ/i, 'do not transfer an electric-organ claim to Uranoscopus dollfusi')
assert.ok(MORE_FISH20.every((species) => species.slug === 'dollfus-stargazer' || !species.sources.some((source) => source.url === 'https://www.vapaguide.info/catalogue/NORAM-FIS-141')), 'family/genus safety claim must not leak to unrelated taxa')

const images = new Set(MORE_FISH20.map((species) => species.image))
const credits = allMediaLicenses().filter((entry) => images.has(entry.file) && entry.kind === 'image')
assert.equal(credits.length, 14, 'all 14 records must have registered image credits')
assert.equal(new Set(credits.map((entry) => entry.file)).size, 14, 'all image URLs must be unique')

console.log(JSON.stringify({
  checklistRowMatches: 14,
  newCanonicalSpecies: 14,
  checklistRows: [...rows.values()].sort((a, b) => a - b),
  acceptedTaxa: 14,
  verifiedImageCredits: 14,
  commonsMd5Paths: 14,
  tableCategoryCounts: { LC: 7, NE: 6, VU: 1 },
  ariomma: 'row 427 checklist name Ariomma indicum mapped to accepted WoRMS name Ariomma indica (AphiaID 219752)',
  safety: 'Uranoscopus dollfusi stargazer-spine caution preserves the source uncertainty; no electric-organ claim',
  exclusions: [
    { row: 426, reason: 'no Table-I entry; numbering jumps from 425 to duplicate-numbered row 427' },
    { row: 427, taxon: 'Cubiceps whiteleggii', reason: 'duplicate-numbered row; no eligible exact-taxon modern image located' },
    { row: 436, taxon: 'Astroscopus guttatus', reason: 'no reliable Bangladesh occurrence evidence established; candidate excluded' },
    { row: 430, taxon: 'Champsodon capensis', reason: 'available Commons exact-name illustration is a historical 1898 plate' },
    { row: 434, taxon: 'Trichonotus setiger', reason: 'available Commons image is a historical 1801 illustration' },
    { row: 442, taxon: 'Uranoscopus marmoratus', reason: 'available Commons exact-name image is a historical 1878 plate' },
    { row: 454, taxon: 'Chlorurus japanensis', reason: 'checklist marks occurrence questionable (#); excluded pending reliable Bangladesh evidence' },
  ],
  nextUnseenCandidateRow: 455,
  stopMarker: 712,
}, null, 2))
