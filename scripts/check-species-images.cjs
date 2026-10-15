#!/usr/bin/env node
// Read-only audit of the actual seed exports, including deduplication and aliases.
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const sharp = require('sharp')
const root = path.resolve(__dirname, '..')
require('./register-typescript.cjs')
const { SPECIES } = require('../data/seed/index.ts')
const { SEED_IMAGES } = require('../data/seed/media-images.ts')
const { resolveSpeciesImage } = require('../lib/species-image.ts')

async function main() {
  const problems = []
  const files = new Set(SEED_IMAGES.map((s) => s.file))
  for (const s of SPECIES) {
    if (!s.image) problems.push(`${s.slug} (${s.nameBn}): no image`)
    else files.add(s.image)
    assert.equal(resolveSpeciesImage(s.slug, ''), s.image, `legacy blank image: ${s.slug}`)
    assert.equal(resolveSpeciesImage(s.slug, '   '), s.image)
    assert.equal(resolveSpeciesImage(s.slug, '/uploads/custom.jpg'), '/uploads/custom.jpg')
    for (const alias of s.synonyms || []) {
      assert.ok(resolveSpeciesImage(alias, ''), `legacy alias: ${alias}`)
    }
  }
  assert.equal(resolveSpeciesImage('unknown-species', null), '')
  for (const file of files) {
    if (!file.startsWith('/seed/')) continue
    try {
      const metadata = await sharp(path.join(root, 'public', file)).metadata()
      assert.ok(metadata.width > 0 && metadata.height > 0)
    } catch (error) {
      problems.push(`${file}: ${error.message}`)
    }
  }
  console.log(JSON.stringify({
    records: SPECIES.length,
    animals: SPECIES.filter((s) => s.type === 'prani').length,
    plantsFungiMicrobes: SPECIES.filter((s) => s.type === 'udbhid').length,
    imageFilesChecked: files.size,
    problems,
    legacyFallbackTests: 'passed',
  }, null, 2))
  if (problems.length) process.exitCode = 1
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
