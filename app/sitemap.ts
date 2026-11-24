import type { MetadataRoute } from 'next'
import { getRepo } from '@/lib/repo'
import { speciesPath } from '@/lib/categories'
import { SITEMAP_CHUNK, SITEMAP_MAX_CHUNKS, sitemapChunkCount } from '@/lib/sitemap'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

/**
 * sitemap-এর প্রতিটি অংশে সর্বোচ্চ `SITEMAP_CHUNK` রেকর্ড।
 *
 * আগে `listSpecies({ limit: 1000 })` ছিল — সিড ১,৯১০-এ পৌঁছানোর পর **৯১০টি
 * রেকর্ড (৪৮%)** sitemap থেকে ঝরে যাচ্ছিল। এখন সীমা ছাড়া সব রেকর্ড আনা হয়
 * এবং `generateSitemaps()` দিয়ে অংশে ভাগ করা হয় (`/sitemap/0.xml`, `/sitemap/1.xml` …)।
 */
export default async function sitemap({ id }: { id?: number } = {}): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ruposhibangla.org').replace(/\/$/, '')
  const chunk = Number.isFinite(Number(id)) ? Math.max(0, Number(id)) : 0
  const offset = chunk * SITEMAP_CHUNK

  try {
    const repo = getRepo()
    // limit না দিলে রিপো সব রেকর্ড ফেরত দেয় (json + neon দুই স্টোরেই)
    const species = await repo.listSpecies({})
    const news = chunk === 0 ? await repo.listNews({ publishedOnly: true, limit: 200 }) : []
    const posts = chunk === 0 ? await repo.listPosts({ status: 'approved', limit: 200 }) : { items: [] as { id: string; createdAt: string }[] }

    const staticRoutes: MetadataRoute.Sitemap =
      chunk === 0
        ? [
            '',
            '/categories',
            '/gyan',
            '/prani',
            '/udbhid',
            '/sthan',
            '/grambangla',
            '/kobirchokhe',
            '/songrokkhon',
            '/ai',
            '/khobor',
            '/feed',
            '/observations',
            '/share',
            '/jeno',
            '/about',
            '/search',
            '/credits',
          ].map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8 }))
        : []

    // চাহিদার চেয়ে বেশি অংশ এলে খালি ফেরত — ক্রলার অযথা পাতা চাইবে না
    if (chunk >= sitemapChunkCount(species.length)) return staticRoutes

    return [
      ...staticRoutes,
      ...species.slice(offset, offset + SITEMAP_CHUNK).map((s) => ({
        url: `${base}${speciesPath(s)}`,
        lastModified: s.updatedAt ? new Date(s.updatedAt) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...news.map((n) => ({
        url: `${base}/khobor/${n.slug}`,
        lastModified: new Date(n.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
      ...(posts.items || []).map((p) => ({
        url: `${base}/post/${p.id}`,
        lastModified: new Date(p.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })),
    ]
  } catch {
    return [{ url: base, changeFrequency: 'weekly', priority: 1 }]
  }
}

/** Next.js-কে জানায় কতটি sitemap-অংশ আছে (`/sitemap/0.xml`, `/sitemap/1.xml` …) */
export async function generateSitemaps(): Promise<{ id: number }[]> {
  try {
    const total = await getRepo().countSpecies({})
    const chunks = Math.min(SITEMAP_MAX_CHUNKS, Math.max(1, sitemapChunkCount(total)))
    return Array.from({ length: chunks }, (_, id) => ({ id }))
  } catch {
    return [{ id: 0 }]
  }
}
