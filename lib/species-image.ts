import { SPECIES } from '@/data/seed'

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
