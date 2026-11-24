import { describe, expect, it } from 'vitest'
import { SITEMAP_CHUNK, SITEMAP_MAX_CHUNKS, sitemapChunkCount } from '@/lib/sitemap'

describe('sitemap — ভাগ-বণ্টনের হিসাব', () => {
  it('প্রতি অংশে নির্ধারিত সংখ্যার বেশি রেকর্ড যাবে না', () => {
    const total = 1910
    const chunks = sitemapChunkCount(total)
    expect(chunks).toBe(Math.ceil(total / SITEMAP_CHUNK))
    expect(chunks * SITEMAP_CHUNK).toBeGreaterThanOrEqual(total)
  })

  it('শূন্য/অজানা রেকর্ডেও কমপক্ষে একটি অংশ থাকে', () => {
    expect(sitemapChunkCount(0)).toBe(1)
    expect(sitemapChunkCount(-5)).toBe(1)
    expect(sitemapChunkCount(Number.NaN)).toBe(1)
  })

  it('সীমার চেয়ে বেশি অংশ কখনো তৈরি হয় না', () => {
    expect(sitemapChunkCount(1_000_000)).toBe(SITEMAP_MAX_CHUNKS)
  })

  it('সব অংশ মিলে প্রতিটি রেকর্ডকে ঠিক একবার ঢাকে', () => {
    const total = 1234
    const chunks = sitemapChunkCount(total)
    const seen = new Set<number>()
    for (let c = 0; c < chunks; c++) {
      for (let i = c * SITEMAP_CHUNK; i < Math.min(total, (c + 1) * SITEMAP_CHUNK); i++) seen.add(i)
    }
    expect(seen.size).toBe(total)
  })
})
