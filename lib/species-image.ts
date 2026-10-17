import { SPECIES } from '@/data/seed'
import type { SpeciesMedia } from '@/lib/types'

// Deployed databases may predate the bundled images. Resolve at read time;
// never reseed (which deletes user content) just to pick up a new photograph.
const seedImages = new Map<string, string>()
for (const species of SPECIES) {
  if (!species.image) continue
  seedImages.set(species.slug, species.image)
  for (const alias of species.synonyms || []) {
    if (!seedImages.has(alias)) seedImages.set(alias, species.image)
  }
}

export function resolveSpeciesImage(slug: string, image?: string | null): string {
  // An administrator's custom image always takes precedence.
  return image?.trim() || seedImages.get(slug) || ''
}

const seedMedia = new Map<string, SpeciesMedia[]>()
for (const species of SPECIES) {
  if (!species.media?.length) continue
  seedMedia.set(species.slug, species.media)
  for (const alias of species.synonyms || []) {
    if (!seedMedia.has(alias)) seedMedia.set(alias, species.media)
  }
}

/**
 * সিডে যোগ হওয়া নতুন ভিডিও/মিডিয়া পুরোনো DB রেকর্ডের সঙ্গে মিলিয়ে দেয় —
 * অ্যাডমিনের যোগ করা মিডিয়া আগে থাকে, সিডের নতুন এন্ট্রি (একই URL দুবার নয়)
 * পরে যোগ হয়। ফলে সিঙ্ক ছাড়াই সিডের নতুন ভিডিও প্রজাতির পাতা ও রিলসে দেখা যায়।
 */
export function resolveSpeciesMedia(slug: string, media?: SpeciesMedia[] | null): SpeciesMedia[] {
  const base = media || []
  const seeds = seedMedia.get(slug)
  if (!seeds?.length) return base
  const urls = new Set(base.map((m) => m.url))
  const additions = seeds.filter((m) => m.url && !urls.has(m.url))
  return additions.length ? [...base, ...additions] : base
}
