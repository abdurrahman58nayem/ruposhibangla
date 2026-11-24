import { getRepo } from '@/lib/repo'
import { SITEMAP_MAX_CHUNKS, sitemapChunkCount } from '@/lib/sitemap'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

/**
 * `/sitemap.xml` — **sitemap index**।
 *
 * `app/sitemap.ts`-এ `generateSitemaps()` দিলে Next শুধু
 * `/sitemap/0.xml`, `/sitemap/1.xml` … বানায়; `/sitemap.xml` আর তৈরি করে না।
 * ক্রলার ও `robots.txt` পুরোনো ঠিকানাটাই দেখে, তাই এখানে সেটি index হিসেবে
 * ফিরিয়ে দেওয়া হয় — ভেতরে প্রতিটি ভাগের লিংক থাকে।
 */
export async function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ruposhibangla.org').replace(/\/$/, '')
  let chunks = 1
  try {
    const total = await getRepo().countSpecies({})
    chunks = Math.min(SITEMAP_MAX_CHUNKS, Math.max(1, sitemapChunkCount(total)))
  } catch {
    chunks = 1
  }

  const lastmod = new Date().toISOString()
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    Array.from({ length: chunks }, (_, i) => `  <sitemap>\n    <loc>${base}/sitemap/${i}.xml</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>\n`).join('') +
    '</sitemapindex>\n'

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  })
}
