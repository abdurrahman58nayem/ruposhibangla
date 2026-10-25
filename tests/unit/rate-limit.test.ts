import { afterEach, describe, expect, it, vi } from 'vitest'
import { clientKey, rateLimit, RULES, sharedLimiterEnabled } from '@/lib/rate-limit'

describe('rateLimit — ইন-মেমোরি লিমিটার', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('সীমা পর্যন্ত অনুমোদন করে, তারপর 429-যোগ্য উত্তর দেয়', () => {
    const key = `test:${Math.random()}`
    const rule = { windowMs: 60_000, max: 3 }
    const results = [1, 2, 3, 4].map(() => rateLimit(key, rule))
    expect(results.map((r) => r.ok)).toEqual([true, true, true, false])
    expect(results.at(-1)!.remaining).toBe(0)
    expect(results.at(-1)!.retryAfterSec).toBeGreaterThan(0)
    expect(results.at(-1)!.limit).toBe(3)
  })

  it('জানালা শেষ হলে হিসাব আবার শুরু হয়', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const key = `test:${Math.random()}`
    const rule = { windowMs: 1_000, max: 1 }
    expect(rateLimit(key, rule).ok).toBe(true)
    expect(rateLimit(key, rule).ok).toBe(false)
    vi.setSystemTime(new Date('2026-01-01T00:00:02Z'))
    expect(rateLimit(key, rule).ok).toBe(true)
  })

  it('বিভিন্ন কী আলাদা হিসাব রাখে', () => {
    const rule = { windowMs: 60_000, max: 1 }
    const a = `test:a:${Math.random()}`
    const b = `test:b:${Math.random()}`
    expect(rateLimit(a, rule).ok).toBe(true)
    expect(rateLimit(b, rule).ok).toBe(true)
    expect(rateLimit(a, rule).ok).toBe(false)
  })

  it('RULES-এ প্রতিটি স্কোপে ইতিবাচক জানালা ও সীমা আছে', () => {
    for (const [name, rule] of Object.entries(RULES)) {
      expect(rule.windowMs, name).toBeGreaterThan(0)
      expect(rule.max, name).toBeGreaterThan(0)
    }
  })

  it('clientKey প্রক্সি হেডার থেকে আইপি নেয়', () => {
    const req = new Request('http://localhost/api/test', {
      headers: { 'x-forwarded-for': '203.0.113.7, 10.0.0.1' },
    })
    expect(clientKey(req, 'write')).toBe('write:203.0.113.7')
    expect(clientKey(req, 'write', 'u1')).toBe('write:203.0.113.7:u1')
  })

  it('কেন্দ্রীয় স্টোরের এনভায়রনমেন্ট না থাকলে ইন-মেমোরি ফলব্যাকই সক্রিয়', () => {
    expect(sharedLimiterEnabled).toBe(false)
  })
})
