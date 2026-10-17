#!/usr/bin/env node
/**
 * প্রজাতির ছবির অডিট — কোন ছবি আদৌ দেখা যাচ্ছে কিনা যাচাই করে।
 *
 *   node scripts/audit-species-images.cjs             # শুধু লোকাল ফাইল যাচাই + রিপোর্ট
 *   node scripts/audit-species-images.cjs --check     # দূরবর্তী (upload.wikimedia.org) লিংকও যাচাই
 *   node scripts/audit-species-images.cjs --json      # মেশিন-পঠনযোগ্য আউটপুট
 *
 * `--check` চালাতে ইন্টারনেট সংযোগ দরকার; এটি প্রতিটি দূরবর্তী ছবিতে একটি
 * ছোট HEAD/GET অনুরোধ পাঠিয়ে HTTP স্ট্যাটাস ও content-type ঠিক আছে কিনা দেখে।
 * রিপোর্টে ধরা পড়া ছবিগুলো `scripts/link-commons-images.py` দিয়ে নতুন ছবিতে
 * বদলানো যায়।
 */
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
require('./register-typescript.cjs')
const { SPECIES } = require('../data/seed/index.ts')
const { SPECIES_IMAGE_GAPS } = require('../data/seed/image-gaps.ts')

const args = process.argv.slice(2)
const shouldCheck = args.includes('--check')
const asJson = args.includes('--json')

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)(\?|$)/i

function isImageResponse(response) {
  const type = (response.headers.get('content-type') || '').toLowerCase()
  return response.ok && (!type || type.startsWith('image/'))
}

async function head(url) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal })
      if (isImageResponse(response)) return { ok: true, status: response.status }
    } catch {
      /* কিছু হোস্ট HEAD সমর্থন করে না — নিচে GET দিয়ে আবার চেষ্টা */
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-2047' },
      redirect: 'follow',
      signal: controller.signal,
    })
    return { ok: isImageResponse(response), status: response.status }
  } catch (error) {
    return { ok: false, status: 0, error: error.message }
  }
}

async function main() {
  const localMissing = []
  const remote = new Map() // url -> [slug, ...]
  let blank = []

  for (const s of SPECIES) {
    const image = (s.image || '').trim()
    if (!image) {
      blank.push({ slug: s.slug, nameBn: s.nameBn, documented: SPECIES_IMAGE_GAPS.some((g) => g.slug === s.slug) })
      continue
    }
    if (image.startsWith('/')) {
      if (!fs.existsSync(path.join(root, 'public', image))) localMissing.push({ slug: s.slug, image })
      continue
    }
    if (/^https?:\/\//i.test(image)) {
      if (!IMAGE_EXT.test(image)) localMissing.push({ slug: s.slug, image, reason: 'image-extension' })
      const list = remote.get(image) || []
      list.push(s.slug)
      remote.set(image, list)
    }
  }

  const remoteBroken = []
  if (shouldCheck) {
    const urls = [...remote.keys()]
    const limit = 8
    for (let i = 0; i < urls.length; i += limit) {
      const slice = urls.slice(i, i + limit)
      const results = await Promise.all(slice.map(head))
      slice.forEach((url, index) => {
        if (!results[index].ok) {
          remoteBroken.push({ url, status: results[index].status, slugs: remote.get(url) })
        }
      })
    }
  }

  const report = {
    species: SPECIES.length,
    withImage: SPECIES.length - blank.length,
    localImages: SPECIES.filter((s) => (s.image || '').startsWith('/')).length,
    remoteImages: remote.size,
    blank: blank.length,
    blankUndocumented: blank.filter((b) => !b.documented).map((b) => b.slug),
    localMissing,
    remoteChecked: shouldCheck,
    remoteBroken,
  }

  if (asJson) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    console.log(`প্রজাতি: ${report.species}`)
    console.log(`ছবি আছে: ${report.withImage}  (লোকাল ${report.localImages} · দূরবর্তী ${report.remoteImages})`)
    console.log(`ছবি নেই: ${report.blank}  (নথিভুক্ত ফাঁক ${report.blank - report.blankUndocumented.length})`)
    if (report.blankUndocumented.length) console.log(`  ⚠ নথিভুক্ত নয়: ${report.blankUndocumented.join(', ')}`)
    console.log(`লোকাল ফাইল অনুপস্থিত: ${report.localMissing.length}`)
    report.localMissing.slice(0, 20).forEach((m) => console.log(`  ⚠ ${m.slug} → ${m.image}`))
    if (shouldCheck) {
      console.log(`দূরবর্তী লিংক ভাঙা: ${report.remoteBroken.length}`)
      report.remoteBroken.slice(0, 30).forEach((b) => console.log(`  ⚠ ${b.status} ${b.url}  (${b.slugs.join(', ')})`))
    } else {
      console.log('দূরবর্তী লিংক যাচাই করতে: node scripts/audit-species-images.cjs --check')
    }
  }

  if (report.localMissing.length || report.blankUndocumented.length || report.remoteBroken.length) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
