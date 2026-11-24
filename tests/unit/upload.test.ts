import { describe, expect, it } from 'vitest'
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_BYTES_ANON, contentTypeForKey, extensionFor, isAllowedContentType, localUploadPath } from '@/lib/storage'

describe('আপলোড — ধরন ও পথের নিরাপত্তা', () => {
  it('ফাইলনেমের বিপজ্জনক এক্সটেনশন কখনো ব্যবহার হয় না', () => {
    // আগে: evil.html কে image/png বলে পাঠালে .html নামেই সেভ হতো (stored XSS)
    expect(extensionFor('image/png', 'evil.html')).toBe('png')
    expect(extensionFor('image/jpeg', 'shell.php')).toBe('jpg')
    expect(extensionFor('application/octet-stream', 'x.html')).toBe('bin')
  })

  it('SVG অনুমোদিত নয়', () => {
    expect(isAllowedContentType('image/svg+xml')).toBe(false)
    expect(isAllowedContentType('text/html')).toBe(false)
    expect(isAllowedContentType('application/javascript')).toBe(false)
  })

  it('রাস্টার ছবি ও ভিডিও অনুমোদিত', () => {
    for (const t of ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'video/mp4', 'video/webm']) {
      expect(isAllowedContentType(t)).toBe(true)
    }
    expect(isAllowedContentType('IMAGE/PNG; charset=binary')).toBe(true)
  })

  it('বেনামি আপলোডের সীমা অ্যাকাউন্টের চেয়ে ছোট', () => {
    expect(MAX_UPLOAD_BYTES_ANON).toBeLessThan(MAX_UPLOAD_BYTES)
    expect(MAX_UPLOAD_BYTES_ANON).toBe(8 * 1024 * 1024)
  })

  it('path traversal বন্ধ', () => {
    expect(localUploadPath('uploads/community/a.png')).toContain('public')
    expect(localUploadPath('uploads/../../etc/passwd')).toBeNull()
    expect(localUploadPath('../secrets.txt')).toBeNull()
    expect(localUploadPath('/etc/passwd')).toBeNull()
    expect(localUploadPath('seed/prani/ojogor.jpg')).toBeNull()
  })

  it('MIME এক্সটেনশন থেকেই নির্ধারিত হয়, ফাইলের দাবি থেকে নয়', () => {
    expect(contentTypeForKey('uploads/x/y.png')).toBe('image/png')
    expect(contentTypeForKey('uploads/x/y.html')).toBe('application/octet-stream')
    expect(contentTypeForKey('uploads/x/y.mp4')).toBe('video/mp4')
  })
})
