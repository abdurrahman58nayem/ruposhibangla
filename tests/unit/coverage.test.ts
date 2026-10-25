import { describe, expect, it } from 'vitest'
import {
  buildCoverageRows,
  coverageAggregates,
  fieldApplies,
  mapCoverageAggregates,
  summarizeCoverage,
} from '@/lib/coverage'
import type { Species } from '@/lib/types'

function species(partial: Partial<Species> & Pick<Species, 'slug' | 'type' | 'group'>): Species {
  return {
    category: 'অন্যান্য',
    nameBn: partial.slug,
    nameEn: '',
    scientificName: '',
    summary: '',
    description: '',
    habitat: '',
    conservation: 'LC',
    colorTags: [],
    image: '/seed/x.jpg',
    sources: [{ title: 'সূত্র' }],
    dataStatus: 'verified',
    taxonomy: { family: 'Testidae' },
    origin: 'native',
    otherNames: ['নাম'],
    sizeOrHeight: '১০ সেমি',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...partial,
  } as Species
}

describe('coverage — ডাবল-কাউন্টিং নিষেধ', () => {
  const sample: Species[] = [
    species({ slug: 'doyel', type: 'prani', group: 'pakhi' }),
    species({ slug: 'bagh', type: 'prani', group: 'stanapayi' }),
    species({ slug: 'ilish', type: 'prani', group: 'machh' }),
    species({ slug: 'am', type: 'udbhid', group: 'gachhbon' }),
    species({ slug: 'sundarban', type: 'sthan', group: 'pahar', taxonomy: undefined, origin: undefined, otherNames: [] }),
    species({ slug: 'jibanananda', type: 'sahitto', group: 'sahitto', taxonomy: undefined, origin: undefined, otherNames: [] }),
  ]

  it('প্রাণীজগৎ রো-টি ছাতা এবং মোটে গোনা হয় না', () => {
    const rows = buildCoverageRows(sample)
    const umbrella = rows.find((r) => r.group === 'pranijogot')!
    expect(umbrella.umbrella).toBe(true)
    expect(umbrella.total).toBe(3) // তিনটি প্রাণী

    const totals = summarizeCoverage(rows)
    expect(totals.records).toBe(sample.length) // ৬, ৩+৩ নয়
    expect(totals.verified).toBe(sample.length)
    expect(totals.speciesGroups).toBe(rows.filter((r) => r.kind === 'species' && !r.umbrella).length)
  })

  it('কনটেন্ট বিভাগ (গ্রামবাংলা/সংরক্ষণ) মোটে গোনা হয় না এবং 0 দেখালেও তা ফাঁক নয়', () => {
    const rows = buildCoverageRows(sample)
    const content = rows.filter((r) => r.kind === 'content').map((r) => r.group)
    expect(content).toEqual(['grambangla', 'songrokkhon'])
    const totals = summarizeCoverage(rows)
    expect(totals.contentGroups).toBe(2)
    expect(totals.records).toBe(6)
  })

  it('প্রযোজ্য নয় এমন ক্ষেত্র ফাঁক হিসেবে গোনা হয় না', () => {
    const rows = buildCoverageRows(sample)
    const sthan = rows.find((r) => r.group === 'pahar')!
    // স্থানের taxonomy/origin/otherNames ফাঁকা — কিন্তু এগুলো স্থানে প্রযোজ্য নয়
    expect(sthan.missingFields.taxonomy).toBe(0)
    expect(sthan.missingFields.origin).toBe(0)
    expect(sthan.missingFields.otherNames).toBe(0)

    const plants = rows.find((r) => r.group === 'gachhbon')!
    expect(plants.missingFields.taxonomy).toBe(0)

    expect(fieldApplies('prani', 'taxonomy')).toBe(true)
    expect(fieldApplies('sthan', 'taxonomy')).toBe(false)
    expect(fieldApplies('sthan', 'sizeOrHeight')).toBe(true)
    expect(fieldApplies('sahitto', 'sizeOrHeight')).toBe(false)
  })

  it('প্রযোজ্য ক্ষেত্রে সত্যিকার ফাঁক ধরা পড়ে', () => {
    const withGaps: Species[] = [
      species({ slug: 'a', type: 'prani', group: 'pakhi', otherNames: [], origin: undefined, taxonomy: {} }),
      species({ slug: 'b', type: 'prani', group: 'pakhi', image: '', sources: [] }),
    ]
    const rows = buildCoverageRows(withGaps)
    const birds = rows.find((r) => r.group === 'pakhi')!
    expect(birds.missingFields.otherNames).toBe(1)
    expect(birds.missingFields.origin).toBe(1)
    expect(birds.missingFields.taxonomy).toBe(1)
    expect(birds.missingImage).toBe(1)
    expect(birds.missingSource).toBe(1)

    const totals = summarizeCoverage(rows)
    expect(totals.missingFields.otherNames).toBe(1)
    expect(totals.missingImage).toBe(1)
  })

  it('প্রত্যেকটি ক্যাটাগরির জন্য রো থাকে, নাও থাকলে ০', () => {
    const rows = buildCoverageRows([])
    expect(rows.length).toBe(17)
    expect(rows.every((r) => r.total === 0)).toBe(true)
    expect(summarizeCoverage(rows).records).toBe(0)
  })
})

describe('mapCoverageAggregates — Neon/SQL এগ্রিগেট থেকে একই ফলাফল', () => {
  it('এগ্রিগেটে না থাকা গ্রুপ ০ হিসেবে আসে এবং ছাতা চিহ্নিত থাকে', () => {
    const rows = mapCoverageAggregates([
      {
        group: 'pakhi',
        total: 851,
        verified: 850,
        partial: 1,
        missingNameBn: 0,
        missingImage: 0,
        missingSource: 0,
        missingFields: { otherNames: 3, origin: 1, sizeOrHeight: 0, taxonomy: 2 },
        lastUpdated: '2026-01-01T00:00:00.000Z',
      },
      {
        group: 'pranijogot',
        total: 1202,
        verified: 1178,
        partial: 24,
        missingNameBn: 0,
        missingImage: 3,
        missingSource: 0,
        missingFields: { otherNames: 0, origin: 0, sizeOrHeight: 0, taxonomy: 0 },
      },
    ])
    const birds = rows.find((r) => r.group === 'pakhi')!
    expect(birds.label).toBe('পাখি')
    expect(birds.missingFields.origin).toBe(1)
    expect(rows.find((r) => r.group === 'machh')!.total).toBe(0)
    expect(rows.find((r) => r.group === 'pranijogot')!.umbrella).toBe(true)

    const totals = summarizeCoverage(rows)
    expect(totals.records).toBe(851) // ছাতা-রো বাদ
    expect(totals.missingFields.otherNames).toBe(3)
  })

  it('coverageAggregates কাঁচা তালিকা থেকে একই সংখ্যা দেয়', () => {
    const sample = [species({ slug: 'x', type: 'prani', group: 'sarisrip' })]
    const aggregates = coverageAggregates(sample)
    const umbrella = aggregates.find((a) => a.group === 'pranijogot')!
    const reptiles = aggregates.find((a) => a.group === 'sarisrip')!
    expect(umbrella.total).toBe(1)
    expect(reptiles.total).toBe(1)
  })
})
