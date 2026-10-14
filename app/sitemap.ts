import type { MetadataRoute } from 'next'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://prakritibangla.org').replace(/\/$/, '')
  try {
    const repo = getRepo()
    const [species, news, posts] = await Promise.all([
      repo.listSpecies({ limit: 1000 }),
      repo.listNews({ publishedOnly: true, limit: 200 }),
      repo.listPosts({ status: 'approved', limit: 200 }),
    ])

    const staticRoutes: MetadataRoute.Sitemap = [
      '', '/prani', '/udbhid', '/grambangla', '/kobirchokhe', '/ai', '/khobor', '/feed', '/share', '/jeno', '/about', '/search',
    ].map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.8 }))

    return [
      ...staticRoutes,
      ...species.map((s) => ({
        url: `${base}/${s.type === 'prani' ? 'prani' : 'udbhid'}/${s.slug}`,
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
      ...posts.items.map((p) => ({
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
