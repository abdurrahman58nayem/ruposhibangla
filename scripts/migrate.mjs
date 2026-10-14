#!/usr/bin/env node
/**
 * Neon Postgres-এ টেবিল তৈরি/হালনাগাদ করে।
 *
 * এটিই প্রজেক্টের অফিশিয়াল মাইগ্রেশন স্ক্রিপ্ট — GitHub Workflow
 * (.github/workflows/migrate.yml) থেকে ডাকা হয়, আপনি নিজেও চালাতে পারেন।
 *
 *   DATABASE_URL="postgresql://..." node scripts/migrate.mjs
 *   DATABASE_URL="..." SITE_URL="https://ruposhibangla.org" node scripts/migrate.mjs --reseed
 *
 * স্কিমার একমাত্র উৎস: db/schema.sql (প্রতিটি স্টেটমেন্ট `;` দিয়ে শেষ)।
 *
 * --reseed  : টেবিল তৈরির পরে সাইটের /api/admin/setup?mode=seed কল করে
 *             প্রজাতি/চ্যানেল/পোস্ট/খবর বসায়। একেবারে ফাঁকা ডেটাবেজে (কোনো
 *             ব্যবহারকারী নেই) এই কল বিনা লগইনেও কাজ করে। SITE_URL দিতে হবে।
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const log = (...a) => console.log(...a)

const url = process.env.DATABASE_URL || ''
if (!url) {
  console.error('❌ DATABASE_URL সেট করা নেই।')
  console.error('   লোকাল:  DATABASE_URL="postgresql://..." node scripts/migrate.mjs')
  console.error('   GitHub: repository secret হিসেবে DATABASE_URL যোগ করুন।')
  process.exit(1)
}
if (!/^postgres(ql)?:\/\//.test(url)) {
  console.error('❌ DATABASE_URL সঠিক নয় — postgresql:// দিয়ে শুরু হতে হবে।')
  process.exit(1)
}

const schemaPath = path.join(root, 'db', 'schema.sql')
if (!fs.existsSync(schemaPath)) {
  console.error('❌ db/schema.sql পাওয়া যায়নি:', schemaPath)
  process.exit(1)
}

const statements = fs
  .readFileSync(schemaPath, 'utf8')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean)

const sql = neon(url)

log(`🔌 Neon-এ সংযোগ হচ্ছে… (${url.replace(/\/\/[^@]*@/, '//***@')})`)
log(`📄 db/schema.sql — ${statements.length}টি স্টেটমেন্ট`)

let ok = 0
let failed = 0
for (const stmt of statements) {
  const label = stmt.split('\n')[0].slice(0, 72)
  try {
    await sql(stmt)
    ok++
  } catch (e) {
    failed++
    console.error(`❌ ব্যর্থ: ${label}\n   ${e?.message || e}`)
    process.exitCode = 1
  }
}

log(`✅ সফল: ${ok}টি · ব্যর্থ: ${failed}টি`)

/* ---------------- ঐচ্ছিক: সিড ডেটা বসানো ---------------- */
if (process.argv.includes('--reseed')) {
  const site = (process.env.SITE_URL || '').replace(/\/$/, '')
  if (!site) {
    console.error('❌ --reseed দিলে SITE_URL দিতে হবে (যেমন https://ruposhibangla.org)')
    process.exit(1)
  }
  log(`🌱 সিড ডেটা বসানো হচ্ছে → ${site}/api/admin/setup?mode=seed`)
  try {
    const res = await fetch(`${site}/api/admin/setup?mode=seed`, { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data?.error) {
      console.error('❌ সিড ব্যর্থ:', data?.error || res.status)
      console.error('   (মনে রাখবেন: ডেটাবেজে আগে থেকে অ্যাডমিন থাকলে এই কলের জন্য লগইন লাগে)')
      process.exit(1)
    }
    log(`✅ ${data.message || 'সিড সম্পন্ন'}`)
  } catch (e) {
    console.error('❌ সিড কল করা যায়নি:', e?.message || e)
    process.exit(1)
  }
}

/* ---------------- টেবিল যাচাই ---------------- */
try {
  const rows = await sql`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
    order by table_name
  `
  const names = rows.map((r) => r.table_name)
  log(`\n📊 ডেটাবেজে মোট ${names.length}টি টেবিল:`)
  for (const n of names) log(`   • ${n}`)
} catch (e) {
  console.error('⚠️ টেবিল তালিকা আনা যায়নি:', e?.message || e)
}
