import { describe, expect, it } from 'vitest'
import { CATEGORIES, categoryLabel, normalizeCategoryName, speciesPath } from '@/lib/categories'
import { bnDate, excerpt, iucnInfo, normalizeConservationBn, slugify, toBn, timeAgoBn } from '@/lib/utils'

describe('শ্রেণিবিন্যাস ও ক্যাটাগরি', () => {
  it('১৭টি ক্যাটাগরি আছে এবং আইডি অনন্য', () => {
    expect(CATEGORIES).toHaveLength(17)
    expect(new Set(CATEGORIES.map((c) => c.id)).size).toBe(17)
  })

  it('বানানভেদ একই ক্যাটাগরিতে মেলে', () => {
    expect(normalizeCategoryName('স্তন্যপায়ী')).toBe('স্তন্যপায়ী') // য় vs য়
    expect(normalizeCategoryName('স্তন্যপায়ী প্রাণী')).toBe('স্তন্যপায়ী')
    expect(normalizeCategoryName('পাখী')).toBe('পাখি')
    expect(normalizeCategoryName('পতঙ্গ')).toBe('কীটপতঙ্গ')
    expect(normalizeCategoryName('মোলাস্ক')).toBe('অন্যান্য অমেরুদণ্ডী')
    expect(normalizeCategoryName('সরিসৃপ')).toBe('সরীসৃপ')
  })

  it('ক্যাটাগরি না থাকলে গ্রুপের লেবেল ব্যবহার হয়', () => {
    expect(normalizeCategoryName(undefined, 'pakhi')).toBe('পাখি')
    expect(normalizeCategoryName('', 'chhatrak')).toBe('ছত্রাক ও শৈবাল')
    expect(categoryLabel('machh')).toBe('মাছ')
    expect(categoryLabel('unknown-id')).toBe('অন্যান্য')
  })

  it('প্রজাতির পথ ধরন অনুযায়ী সঠিক', () => {
    expect(speciesPath({ type: 'prani', slug: 'bagh' })).toBe('/prani/bagh')
    expect(speciesPath({ type: 'udbhid', slug: 'am' })).toBe('/udbhid/am')
    expect(speciesPath({ type: 'sthan', slug: 'sundarban' })).toBe('/sthan/sundarban')
    expect(speciesPath({ type: 'sahitto', slug: 'jibanananda-bon-nodi' })).toBe('/sahitto/jibanananda-bon-nodi')
  })
})

describe('সংখ্যা, তারিখ ও আইইউসিএন', () => {
  it('বাংলা সংখ্যা', () => {
    expect(toBn(1451)).toBe('১৪৫১')
    expect(toBn('2026')).toBe('২০২৬')
  })

  it('তারিখ বাংলায়', () => {
    expect(bnDate('2026-01-15T00:00:00.000Z')).toMatch(/২০২৬/)
    expect(bnDate('')).toBe('')
  })

  it('সময়-ব্যবধান বাংলায়', () => {
    const now = Date.now()
    expect(timeAgoBn(new Date(now - 30_000).toISOString())).toBe('এইমাত্র')
    expect(timeAgoBn(new Date(now - 5 * 60_000).toISOString())).toContain('মিনিট আগে')
    expect(timeAgoBn(new Date(now - 3 * 3600_000).toISOString())).toContain('ঘণ্টা আগে')
    expect(timeAgoBn('')).toBe('')
  })

  it('IUCN কোডের বাংলা অর্থ ও অজানা কোডে নিরাপদ ফলব্যাক', () => {
    expect(iucnInfo('EN').code).toBe('EN')
    expect(iucnInfo('EN').meaning).toBeTruthy()
    expect(iucnInfo(undefined).code).toBe('NE')
    expect(iucnInfo('ZZ').code).toBe('NE')
    expect(normalizeConservationBn('EN', '')).toContain('বিপন্ন')
  })

  it('excerpt ও slugify', () => {
    expect(excerpt('a'.repeat(300), 20)).toHaveLength(21) // ২০ + ellipsis
    expect(excerpt('ছোট লেখা', 50)).toBe('ছোট লেখা')
    expect(slugify('Royal Bengal Tiger')).toBe('royal-bengal-tiger')
    expect(slugify('  —— ')).toMatch(/^item-/) // অক্ষরহীন ইনপুটে নিরাপদ ইউনিক ফলব্যাক
  })
})
