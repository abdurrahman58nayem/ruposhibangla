#!/usr/bin/env node
/**
 * `public/brand/og-cover.jpg` তৈরি করে — সোশ্যাল শেয়ার কার্ড (১২০০×৬৩০)।
 *
 * আগের কভারে **Dreamstime ওয়াটারমার্ক** ও পুরোনো লোগো ছিল — সেটি সরিয়ে
 * নিজস্ব সিড ছবি (`public/seed/village/nouka.jpg`) + বর্তমান `logo-mark.png` দিয়ে
 * নতুন কভার বানানো হয়। কোনো স্টক-ফটো ওয়াটারমার্ক নেই।
 *
 *   node scripts/gen-og-cover.mjs
 *
 * ⚠️ বাংলা লেখা রেন্ডার করতে সিস্টেমে Hind Siliguri ফন্ট থাকতে হবে:
 *   1) `npm i -D @fontsource/hind-siliguri`
 *   2) `python3 -m pip install --break-system-packages fonttools brotli`
 *      `python3 - <<'EOF'`
 *      `from fontTools.ttLib import TTFont; import os`
 *      `f = TTFont('node_modules/@fontsource/hind-siliguri/files/hind-siliguri-bengali-700-normal.woff2')`
 *      `f.flavor = None`
 *      `d = os.path.expanduser('~/.local/share/fonts'); os.makedirs(d, exist_ok=True)`
 *      `f.save(os.path.join(d, 'HindSiliguri-Bold.ttf'))`
 *      `EOF`
 *
 * ফন্ট না থাকলে লেখা বাদ দিয়ে শুধু ছবি+লোগো দিয়ে বানাবে (টেক্সট-লেস কভার),
 * অর্থাৎ স্ক্রিপ্ট কখনো ভাঙা কার্ড তৈরি করবে না।
 */
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'

const W = 1200
const H = 630
const OUT = 'public/brand/og-cover.jpg'
const BG = 'public/seed/village/nouka.jpg'
const LOGO = 'public/brand/logo-mark.png'

/**
 * librsvg (sharp) সিস্টেমের ফন্ট-ডিরেক্টরি পড়ে — `fc-list` কমান্ড না থাকলেও।
 * হোম-ডিরেক্টরিতে ফন্ট থাকলে সেখানেও খোঁজা হয় (`fc-cache` ছাড়াই কাজ করে)।
 */
function bengaliFontAvailable() {
  const dirs = [
    path.join(os.homedir(), '.local', 'share', 'fonts'),
    path.join(os.homedir(), '.fonts'),
    '/usr/share/fonts',
    '/usr/local/share/fonts',
  ]
  for (const dir of dirs) {
    try {
      const out = execSync(`find ${JSON.stringify(dir)} -maxdepth 3 -iname '*hind*siliguri*' -o -iname '*noto*sans*bengali*' 2>/dev/null`).toString()
      if (out.trim()) return true
    } catch {
      /* ডিরেক্টরি নেই */
    }
  }
  return false
}

const hasFont = bengaliFontAvailable()
const FAMILY = "HindSiliguri, 'Hind Siliguri', 'Noto Sans Bengali', sans-serif"

const textLayer = hasFont
  ? `<text x="64" y="330" font-family="${FAMILY}" font-size="82" font-weight="700" fill="#ffffff">রূপসী বাংলা</text>
     <text x="66" y="392" font-family="${FAMILY}" font-size="35" fill="#ffffff" opacity="0.94">বাংলাদেশের প্রকৃতি ও জীববৈচিত্র্যের ডিজিটাল মিলনমেলা</text>
     <text x="66" y="470" font-family="${FAMILY}" font-size="27" fill="#a8d0b6">বাংলাদেশের সব প্রাণী, উদ্ভিদ ও গ্রামবাংলা — এক জায়গায়</text>`
  : ''

const overlay = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#082016" stop-opacity="0.88"/>
      <stop offset="0.62" stop-color="#082016" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#082016" stop-opacity="0.10"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="64" y="96" width="132" height="132" rx="26" fill="#ffffff" opacity="0.96"/>
  ${textLayer}
</svg>`)

const bg = await sharp(BG).resize(W, H, { fit: 'cover' }).toBuffer()
const logo = await sharp(LOGO).resize(120, 120).toBuffer()

await sharp(bg)
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: logo, top: 102, left: 70 },
  ])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(OUT)

const meta = await sharp(OUT).metadata()
console.log(`✓ ${OUT} — ${meta.width}×${meta.height}${hasFont ? '' : ' (বাংলা ফন্ট নেই, লেখা বাদ)'}`)

if (!fs.statSync(OUT).size) throw new Error('og-cover খালি তৈরি হয়েছে')
