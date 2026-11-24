#!/usr/bin/env node
/**
 * ব্র্যান্ড-আইকন একক সোর্স থেকে তৈরি — **`public/brand/logo-mark.png`**।
 *
 * সমস্যা ছিল: `logo-mark.svg` আর `logo-mark.png` দুইটা আলাদা ডিজাইন (SVG-তে
 * পদ্ম-হৃদয়+নলখাগড়া, PNG-তে ধান+সূর্য+শাপলা), আর ফ্যাভিকন কোনটা থেকে
 * বানানো তা নির্দিষ্ট ছিল না। এখন PNG-ই একমাত্র সোর্স; SVG ফাইলটা সরানো হয়েছে।
 *
 *   node scripts/gen-brand-icons.mjs
 */
import sharp from 'sharp'

const SRC = 'public/brand/logo-mark.png'

const targets = [
  { file: 'public/brand/favicon-32.png', size: 32, pad: 0 },
  { file: 'public/brand/favicon-64.png', size: 64, pad: 0 },
  { file: 'public/brand/apple-touch-icon.png', size: 180, pad: 0.10, bg: '#ffffff' },
  { file: 'public/brand/logo-mark-512.png', size: 512, pad: 0 },
]

/**
 * লোগো PNG-তে আলফা নেই (সাদা বর্গাকার পটভূমি) — ছোট আইকনে সেই সাদা বর্গ
 * ঘিরে বেমানান বৃত্ত/বর্গ দেখায়। তাই কেন্দ্র থেকে বাইরে গিয়ে আলফা ১→০
 * করে দিই; ভেতরের নকশা অক্ষত থাকে।
 */
async function withRoundAlpha(buf, size) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const c = (size - 1) / 2
  const R = size / 2
  const feather = size * 0.045
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const d = Math.hypot(x - c, y - c)
      const a = d <= R - feather ? 1 : d >= R ? 0 : 1 - (d - (R - feather)) / feather
      const i = (y * info.width + x) * info.channels
      // পুরোনো সাদা পটভূমির জায়গায় আলফা লাগালেই গোল হয়ে যাবে
      data[i + 3] = Math.round(Math.min(data[i + 3], 255 * a))
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } }).png().toBuffer()
}

for (const t of targets) {
  const inner = Math.round(t.size * (1 - t.pad * 2))
  const flat = await sharp(SRC).resize(inner, inner, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toBuffer()
  const icon = await withRoundAlpha(flat, inner)
  if (t.pad > 0) {
    const off = Math.round((t.size - inner) / 2)
    await sharp({ create: { width: t.size, height: t.size, channels: 4, background: t.bg } })
      .composite([{ input: icon, top: off, left: off }])
      .png()
      .toFile(t.file)
  } else {
    await sharp(icon).resize(t.size, t.size).png().toFile(t.file)
  }
  console.log(`✓ ${t.file} (${t.size}×${t.size})`)
}
