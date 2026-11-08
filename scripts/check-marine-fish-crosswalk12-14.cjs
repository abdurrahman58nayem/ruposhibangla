#!/usr/bin/env node
// Direct row crosswalk for marine-fish seed batches 12–14 against Habib & Islam (2021), Supplementary Table-I.
const assert = require('node:assert/strict')
require('./register-typescript.cjs')
const batches = [
  require('../data/seed/more-fish12.ts').MORE_FISH12,
  require('../data/seed/more-fish13.ts').MORE_FISH13,
  require('../data/seed/more-fish14.ts').MORE_FISH14,
]

const rowsBySlug = new Map([
  ['milk-shark', 22],
  ['blackspotted-croaker', 647],
  ['kawakawa', 412],
  ['longjaw-thryssa', 137],
  ['estuary-seahorse', 279],
  ['longtail-butterfly-ray', 70],
  ['bennetts-stingray', 53],
  ['long-billed-halfbeak', 230],
  ['banded-eagle-ray', 73],
  ['live-sharksucker', 339],
  ['winghead-shark', 28],
  ['honeycomb-whipray', 56],
  ['fringescale-sardinella', 145],
  ['indian-mackerel', 416],
  ['torpedo-scad', 371],
  ['talang-queenfish', 374],
  ['whitecheek-shark', 12],
  ['spadenose-shark', 23],
  ['numbray', 40],
  ['jarbua-terapon', 485],
  ['spotted-scat', 608],
  ['johns-snapper', 590],
  ['russells-lionfish', 684],
  ['starry-triggerfish', 722],
  ['shaggy-frogfish', 711],
  ['savalai-hairtail', 407],
  ['banded-sicklefish', 613],
  ['greater-lizardfish', 183],
  ['tripletail', 657],
  ['red-cornetfish', 278],
  ['sunrise-goatfish', 474],
  ['emperor-red-snapper', 597],
  ['longfin-grouper', 505],
  ['sin-croaker', 630],
  ['toothed-ponyfish', 517],
  ['spotted-sicklefish', 614],
  ['bengal-sergeant', 537],
  ['shortnose-tripodfish', 716],
  ['malayan-flounder', 245],
  ['longnosed-stargazer', 437],
])
const absent = new Map([
  ['bluespotted-maskray', { name: 'Neotrygon kuhlii', note: 'row 60 is Neotrygon indica, a distinct accepted species; not a synonym match' }],
  ['longnose-seahorse', { name: 'Hippocampus trimaculatus', note: 'not present in Syngnathidae rows 279–281; row 279 is H. kuda' }],
])
assert.deepEqual(batches.map((batch) => batch.length), [14, 14, 14], 'batches 12–14 must retain 14 entries each')
const all = batches.flat()
assert.equal(all.length, 42)
assert.equal(rowsBySlug.size, 40)
assert.equal(absent.size, 2)
assert.equal(new Set(all.map((species) => species.slug)).size, 42, 'batch slugs must be unique')
assert.equal(new Set([...rowsBySlug.keys(), ...absent.keys()]).size, 42, 'every entry needs exactly one disposition')

for (const species of all) {
  const row = rowsBySlug.get(species.slug)
  if (row !== undefined) {
    const taxon = species.scientificName.toLocaleLowerCase('en')
    assert.ok(taxon, `${species.slug}: scientific name missing`)
    assert.ok(row >= 1 && row <= 740, `${species.slug}: row outside the 740-entry table`)
    assert.ok(species.sources?.some((source) => source.url?.includes('10.52168/bjf.2020.32.40')), `${species.slug}: paper citation absent`)
  } else {
    const excluded = absent.get(species.slug)
    assert.ok(excluded, `${species.slug}: missing crosswalk disposition`)
    assert.equal(species.scientificName, excluded.name, `${species.slug}: unexpected taxon in absent disposition`)
  }
}
const outOfStopScope = [...rowsBySlug.entries()].filter(([, row]) => row > 712)
assert.deepEqual(outOfStopScope.sort((a, b) => a[1] - b[1]), [['shortnose-tripodfish', 716], ['starry-triggerfish', 722]])
const withinStop = [...rowsBySlug.entries()].filter(([, row]) => row <= 712)
assert.equal(withinStop.length, 38)
console.log(JSON.stringify({ batches: [14, 14, 14], rowMatched: rowsBySlug.size, tableAbsentOrNonmatching: [...absent.entries()].map(([slug, value]) => ({ slug, ...value })), rowsWithin712Marker: withinStop.length, alreadySeededRowsOutside712Marker: outOfStopScope, membershipStatus: 'passed' }, null, 2))
