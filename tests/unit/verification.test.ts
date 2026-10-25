import { describe, expect, it } from 'vitest'
import { verifySpeciesRecord, ORIGIN_OVERRIDES } from '@/data/seed/verification'
import type { Species } from '@/lib/types'

function base(partial: Partial<Species> & Pick<Species, 'slug'>): Species {
  return {
    type: 'prani',
    group: 'prani',
    category: 'সরীসৃপ',
    nameBn: 'পরীক্ষা',
    nameEn: 'Test',
    scientificName: 'Testus testus',
    summary: 'সংক্ষিপ্ত',
    description: 'বিবরণ',
    habitat: 'বন',
    conservation: 'LC',
    colorTags: [],
    image: '/seed/prani/x.jpg',
    sources: [{ title: 'IUCN Red List' }],
    dataStatus: 'partial',
    ...partial,
  } as Species
}

describe('verifySpeciesRecord — অ্যাডমিনের সিদ্ধান্ত অক্ষত', () => {
  it('statusLockedAt থাকলে dataStatus ওভাররাইড হয় না', () => {
    const locked = verifySpeciesRecord(
      base({ slug: 'doyel', dataStatus: 'review', statusLockedAt: '2026-10-25T00:00:00.000Z' }),
    )
    expect(locked.dataStatus).toBe('review')
  })

  it('লক না থাকলে সিড-যাচাই নিয়মে verified হয়', () => {
    const out = verifySpeciesRecord(base({ slug: 'doyel' }))
    expect(out.dataStatus).toBe('verified')
    expect(out.lastVerifiedAt).toBeTruthy()
  })
})

describe('উৎপত্তি-ওভাররাইড', () => {
  it('কেবল তালিকাভুক্ত রেকর্ডে country-native বসে, অন্যদের ফাঁকা থাকে', () => {
    for (const slug of Object.keys(ORIGIN_OVERRIDES)) {
      const out = verifySpeciesRecord(base({ slug, origin: undefined }))
      expect(out.origin, slug).toBe(ORIGIN_OVERRIDES[slug])
    }
    const untouched = verifySpeciesRecord(base({ slug: 'am', origin: undefined }))
    expect(untouched.origin).toBeUndefined()
  })

  it('অ্যাডমিনের দেওয়া origin ওভাররাইড হয় না', () => {
    const out = verifySpeciesRecord(base({ slug: 'ghoreal', origin: 'exotic' }))
    expect(out.origin).toBe('exotic')
  })
})
