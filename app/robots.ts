import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ruposhibangla.org').replace(/\/$/, '')
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    ],
    // sitemap index — ভেতরে /sitemap/0.xml, /sitemap/1.xml … (প্রতি অংশে ৫০০ রেকর্ড)
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
