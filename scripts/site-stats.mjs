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

const poetViewSpecies = SPECIES.filter((s) => (s.poetViews || []).length).length
const poetViewEntries = SPECIES.reduce((n, s) => n + (s.poetViews || []).length, 0)
const gallerySpecies = SPECIES.filter((s) => (s.gallery || []).length).length
const galleryImages = SPECIES.reduce((n, s) => n + (s.gallery || []).length, 0)

const st = {
  seedRecords: SPECIES.length,
  poetViews: { species: poetViewSpecies, entries: poetViewEntries },
  gallery: { species: gallerySpecies, images: galleryImages },
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

/* ------------------------------------------------------------------ */
/* ডকুমেন্টেশনের সংখ্যা স্বয়ংক্রিয় হালনাগাদ                                */
/* ------------------------------------------------------------------ */

const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
const toBn = (n) => String(n).replace(/[0-9]/g, (d) => bnDigits[Number(d)])
const clock = (n) => (n >= 1000 ? `${Math.round(n / 100) / 10}k` : String(n))

/**
 * মার্কডাউনে লেখা সংখ্যা বদলে দেয় — `<!-- stats:key -->মান<!-- /stats -->` ব্লক।
 *
 * কেন: README/HANDOFF-এ হাতে লেখা সংখ্যা সিড বাড়ার সাথে সাথে পুরোনো হয়ে যায়
 * (আগে ৬৬১ → ১৭৫৯ → ১৮৯৬ → ১৯১০, প্রতিবারই ভুল ছিল)। এখন ডকে কেবল
 * `<!-- stats:records -->` থাকবে, `npm run stats -- --write` সংখ্যা বসিয়ে দেবে।
 */
const DOC_FILES = ['README.md', 'HANDOFF.md', 'docs/TESTING.md', 'docs/SEED-SYNC.md', 'docs/species-image-audit.md']

const STAT_KEYS = {
  records: () => st.seedRecords,
  animals: () => st.byType.prani || 0,
  plants: () => st.byType.udbhid || 0,
  places: () => st.byType.sthan || 0,
  literature: () => st.byType.sahitto || 0,
  birds: () => st.byGroup.pakhi || 0,
  fish: () => st.byGroup.machh || 0,
  mammals: () => st.byGroup.stanapayi || 0,
  reptiles: () => st.byGroup.sarisrip || 0,
  amphibians: () => st.byGroup.ubhochor || 0,
  insects: () => st.byGroup.kitpotongo || 0,
  invertebrates: () => st.byGroup.ameruddondi || 0,
  plantsFlowers: () => st.byGroup.udbhidful || 0,
  trees: () => st.byGroup.gachhbon || 0,
  fungi: () => st.byGroup.chhatrak || 0,
  microbes: () => st.byGroup.onujib || 0,
  rivers: () => st.byGroup.nadi || 0,
  hills: () => st.byGroup.pahar || 0,
  withImage: () => st.images.withImage,
  imageGaps: () => st.images.documentedGaps,
  videos: () => st.videos,
  credits: () => st.credits.total,
  creditsVerified: () => st.credits.verified,
  creditsPending: () => st.credits.pending,
  verified: () => st.byDataStatus.verified || 0,
  review: () => st.byDataStatus.review || 0,
  identityUncertain: () => st.byDataStatus.identity_uncertain || 0,
  needsCorrection: () => st.byDataStatus.needs_correction || 0,
  unverified: () => totals.partial,
  gapOtherNames: () => st.fieldGaps.otherNames,
  gapOrigin: () => st.fieldGaps.origin,
  gapSize: () => st.fieldGaps.sizeOrHeight,
  gapTaxonomy: () => st.fieldGaps.taxonomy,
  poetViews: () => st.poetViews.species,
  galleries: () => st.gallery.species,
}

function renderStatBlock(text, { bangla }) {
  return text.replace(
    /<!--\s*stats:([a-zA-Z]+)(?:\s*:\s*(bn|raw))?\s*-->([\s\S]*?)<!--\s*\/stats\s*-->/g,
    (_m, key, fmt, fallback) => {
      const getter = STAT_KEYS[key]
      if (!getter) return _m
      const n = getter()
      const useBn = fmt === 'bn' || (fmt !== 'raw' && bangla)
      return `<!-- stats:${key}${fmt ? ':' + fmt : ''} -->${useBn ? toBn(n) : String(n)}<!-- /stats -->`
    },
  )
}

function refreshDocs({ write = false } = {}) {
  const changed = []
  for (const rel of DOC_FILES) {
    const abs = path.join(root, rel)
    if (!fs.existsSync(abs)) continue
    const before = fs.readFileSync(abs, 'utf8')
    const after = renderStatBlock(before, { bangla: true })
    if (after !== before) {
      changed.push(rel)
      if (write) fs.writeFileSync(abs, after)
    }
  }
  return changed
}

if (process.argv.includes('--check')) {
  const changed = refreshDocs({ write: false })
  if (changed.length) {
    console.error('✗ ডকের সংখ্যা পুরোনো: ' + changed.join(', ') + '\n  ঠিক করতে: npm run stats -- --write')
    process.exit(1)
  }
  console.log('✓ ডকের সংখ্যা হালনাগাদ।')
  process.exit(0)
}

if (process.argv.includes('--write')) {
  const changed = refreshDocs({ write: true })
  console.log(changed.length ? `✓ ডক হালনাগাদ: ${changed.join(', ')}` : '✓ ডক আগেই হালনাগাদ ছিল।')
  process.exit(0)
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ seed: st, runtime }, null, 2))
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
console.log(`| মোট রেকর্ড | ${bn(st.seedRecords)} |`)
for (const [type, n] of Object.entries(st.byType)) {
  console.log(`| — ${typeLabels[type] || type} | ${bn(n)} |`)
}
console.log(`| ছবিসহ রেকর্ড | ${bn(st.images.withImage)} (লোকাল ${bn(st.images.local)} + দূরবর্তী ${bn(st.images.remote)}) |`)
console.log(`| নথিভুক্ত ছবি-ফাঁক | ${bn(st.images.documentedGaps)} |`)
console.log(`| প্রজাতির ভিডিও | ${bn(st.videos)} |`)
console.log(`| মিডিয়া-ক্রেডিট রেকর্ড | ${bn(st.credits.total)} (যাচাইকৃত ${bn(st.credits.verified)}, বাকি ${bn(st.credits.pending)}) |`)
for (const [status, n] of Object.entries(st.byDataStatus)) {
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

