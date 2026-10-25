#!/usr/bin/env node
/**
 * সাইটের প্রকৃত সংখ্যা — ডকুমেন্টেশনে হাতে সংখ্যা লিখে পুরোনো হয়ে যাওয়া বন্ধ করতে।
 *
 *   npm run stats            # মার্কডাউন টেবিল
 *   npm run stats -- --json  # কাঁচা JSON
 *
 * উৎস: `data/seed` (কোডে থাকা সত্য) — রানটাইম `.data/db.json` থাকলে সেটিও আলাদা করে দেখায়।
 * কখনো অনুমান করা সংখ্যা নয়; শুধু গণনা।
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
require('./register-typescript.cjs')

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const { SPECIES } = require('../data/seed/index.ts')
const { buildCoverageRows, summarizeCoverage, COVERAGE_FIELDS } = require('../lib/coverage.ts')
const { allMediaLicenses } = require('../data/seed/media-licenses.ts')
const { SPECIES_IMAGE_GAPS } = require('../data/seed/image-gaps.ts')

const by = (arr, fn) => {
  const map = {}
  for (const item of arr) {
    const key = fn(item)
    map[key] = (map[key] || 0) + 1
  }
  return map
}

const rows = buildCoverageRows(SPECIES)
const totals = summarizeCoverage(rows)
const credits = allMediaLicenses()
const videos = SPECIES.reduce(
  (n, s) => n + (s.media || []).filter((m) => m.kind === 'video').length,
  0,
)
const images = SPECIES.filter((s) => s.image)
const remoteImages = images.filter((s) => /^https?:/.test(s.image))
const localImages = images.length - remoteImages.length

const stats = {
  seedRecords: SPECIES.length,
  byType: by(SPECIES, (s) => s.type),
  byGroup: by(SPECIES, (s) => s.group),
  byDataStatus: by(SPECIES, (s) => s.dataStatus || 'partial'),
  images: {
    withImage: images.length,
    local: localImages,
    remote: remoteImages.length,
    documentedGaps: SPECIES_IMAGE_GAPS.length,
  },
  videos,
  credits: {
    total: credits.length,
    verified: credits.filter((c) => c.verified).length,
    pending: credits.filter((c) => !c.verified).length,
  },
  coverageTotals: totals,
  fieldGaps: totals.missingFields,
  fieldGapKeys: COVERAGE_FIELDS,
}

let runtime = null
const dbPath = path.join(root, '.data', 'db.json')
if (fs.existsSync(dbPath)) {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    runtime = {
      dbPath: '.data/db.json',
      species: (db.species || []).length,
      posts: (db.posts || []).length,
      users: (db.users || []).length,
      news: (db.news || []).length,
      comments: (db.comments || []).length,
      observations: (db.observations || []).length,
      reports: (db.reports || []).length,
      aiQuestions: (db.aiQuestions || []).length,
    }
  } catch (e) {
    console.warn('⚠️  .data/db.json পড়া যায়নি:', e?.message || e)
  }
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ seed: stats, runtime }, null, 2))
  process.exit(0)
}

const bn = (n) => String(n)
const typeLabels = { prani: 'প্রাণী', udbhid: 'উদ্ভিদ/ছত্রাক/অণুজীব', sthan: 'স্থান', sahitto: 'সাহিত্য' }
const statusLabels = {
  verified: 'যাচাইকৃত',
  review: 'পর্যালোচনাধীন',
  partial: 'আংশিক',
  identity_uncertain: 'পরিচয় অনিশ্চিত',
  needs_correction: 'সংশোধন প্রয়োজন',
}
const fieldLabels = {
  otherNames: 'স্থানীয়/অন্য নাম',
  origin: 'উৎপত্তি',
  sizeOrHeight: 'আকার/উচ্চতা',
  taxonomy: 'শ্রেণিবিন্যাস',
}

console.log('# রূপসী বাংলা — প্রকৃত সংখ্যা (স্বয়ংক্রিয় গণনা)\n')
console.log('| বিষয় | সংখ্যা |')
console.log('|---|---|')
console.log(`| মোট রেকর্ড | ${bn(stats.seedRecords)} |`)
for (const [type, n] of Object.entries(stats.byType)) {
  console.log(`| — ${typeLabels[type] || type} | ${bn(n)} |`)
}
console.log(`| ছবিসহ রেকর্ড | ${bn(stats.images.withImage)} (লোকাল ${bn(stats.images.local)} + দূরবর্তী ${bn(stats.images.remote)}) |`)
console.log(`| নথিভুক্ত ছবি-ফাঁক | ${bn(stats.images.documentedGaps)} |`)
console.log(`| প্রজাতির ভিডিও | ${bn(stats.videos)} |`)
console.log(`| মিডিয়া-ক্রেডিট রেকর্ড | ${bn(stats.credits.total)} (যাচাইকৃত ${bn(stats.credits.verified)}, বাকি ${bn(stats.credits.pending)}) |`)
for (const [status, n] of Object.entries(stats.byDataStatus)) {
  console.log(`| তথ্যের অবস্থা — ${statusLabels[status] || status} | ${bn(n)} |`)
}
console.log('')
console.log('## জীবগোষ্ঠীভিত্তিক (কভারেজ)\n')
console.log('| জীবগোষ্ঠী | মোট | যাচাইকৃত | ' + COVERAGE_FIELDS.map((f) => fieldLabels[f] + ' নেই').join(' | ') + ' |')
console.log('|---|---|---|---|---|---|')
for (const row of rows.filter((r) => r.kind === 'species')) {
  const label = row.umbrella ? `${row.label} (ছাতা — মোটে গণনা হয় না)` : row.label
  const pad = row.umbrella
    ? ['—', '—', '—', '—']
    : COVERAGE_FIELDS.map((f) => bn(row.missingFields[f]))
  console.log(`| ${label} | ${bn(row.total)} | ${bn(row.verified)} | ${pad.join(' | ')} |`)
}
console.log('')
console.log(
  `মোট (ছাতা/কনটেন্ট বাদ): **${bn(totals.records)}** রেকর্ড — যাচাইকৃত **${bn(totals.verified)}**, ` +
    `যাচাই করা যায়নি **${bn(totals.partial)}**, ছবি নেই **${bn(totals.missingImage)}**, উৎস নেই **${bn(totals.missingSource)}**।`,
)
console.log(
  'প্রযোজ্য ক্ষেত্রের ফাঁক: ' +
    COVERAGE_FIELDS.map((f) => `${fieldLabels[f]} ${bn(totals.missingFields[f])}`).join(' · '),
)
if (runtime) {
  console.log('\n## রানটাইম ডেটা (`.data/db.json`)\n')
  console.log('| সংগ্রহ | সংখ্যা |')
  console.log('|---|---|')
  for (const [key, value] of Object.entries(runtime)) {
    if (key === 'dbPath') continue
    console.log(`| ${key} | ${bn(value)} |`)
  }
} else {
  console.log('\n_রানটাইম `.data/db.json` নেই — সাইট প্রথম চালু হলে এটি তৈরি হবে।_')
}
