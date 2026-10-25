/**
 * কভারেজ ড্যাশবোর্ডের হিসাব (§১৮) — এক জায়গায়, যাতে JSON ও Neon দুই স্টোরেই
 * একই নিয়মে সংখ্যা আসে এবং ভুল ডাবল-কাউন্টিং না হয়।
 *
 * দুটি গুরুত্বপূর্ণ নিয়ম:
 *  ১) **প্রাণীজগৎ** একটি ছাতা-ক্যাটাগরি — সব প্রাণীর সমষ্টি। এটি আলাদা রো হিসেবে
 *     দেখানো হয় (সাবটোটাল), কিন্তু মোট হিসাবে ধরা হয় না; নইলে পাখি/মাছ/স্তন্যপায়ী
 *     রেকর্ডগুলো দুইবার গোনা হবে।
 *  ২) **গ্রামবাংলা / পরিবেশ ও সংরক্ষণ** কনটেন্ট বিভাগ — এদের নিজস্ব প্রজাতি-রেকর্ড নেই।
 *     তাই এদের 0-কে “ফাঁকা” বলা হয় না; `kind: 'content'` দিয়ে আলাদা দেখানো হয়।
 *
 * একইভাবে প্রতি রেকর্ড-ধরনের জন্য প্রযোজ্য নয় এমন ক্ষেত্র (যেমন স্থানের taxonomy)
 * ফাঁক হিসেবে গোনা হয় না — অপ্রযোজ্য ক্ষেত্রকে “অনুপস্থিত তথ্য” বলে চালিয়ে দেওয়া যায় না।
 */
import type {
  CoverageAggregate,
  CoverageFieldKey,
  CoverageRow,
  CoverageTotals,
  GroupId,
  Species,
  SpeciesType,
} from './types'
import { CATEGORIES, type Category } from './categories'

/** যে ক্ষেত্রগুলোর পূর্ণতা কভারেজে আলাদা করে দেখা হয় */
export const COVERAGE_FIELDS: CoverageFieldKey[] = ['otherNames', 'origin', 'sizeOrHeight', 'taxonomy']

export const COVERAGE_FIELD_LABEL: Record<CoverageFieldKey, string> = {
  otherNames: 'স্থানীয়/অন্য নাম',
  origin: 'উৎপত্তি (দেশীয়/পরিযায়ী…)',
  sizeOrHeight: 'আকার/উচ্চতা',
  taxonomy: 'শ্রেণিবিন্যাস',
}

/** কোন ধরনের রেকর্ডে কোন ক্ষেত্রটি অর্থবহ */
const FIELD_APPLIES_TO: Record<CoverageFieldKey, SpeciesType[]> = {
  otherNames: ['prani', 'udbhid'],
  origin: ['prani', 'udbhid'],
  sizeOrHeight: ['prani', 'udbhid', 'sthan'],
  taxonomy: ['prani', 'udbhid'],
}

export function fieldApplies(type: SpeciesType | undefined, field: CoverageFieldKey): boolean {
  return !!type && FIELD_APPLIES_TO[field].includes(type)
}

/** ছাতা-ক্যাটাগরি যেগুলো মোটে গোনা যাবে না */
export const UMBRELLA_GROUPS: GroupId[] = ['pranijogot']

export function isUmbrellaGroup(group: string): boolean {
  return UMBRELLA_GROUPS.includes(group as GroupId)
}

function isBlank(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value as object).length === 0
  const text = String(value).trim()
  return text === '' || text === '—' || text === 'absent'
}

function blankFieldCount(rows: Species[], field: CoverageFieldKey): number {
  return rows.filter((s) => fieldApplies(s.type, field) && isBlank(s[field])).length
}

function aggregateFor(rows: Species[], group: GroupId): CoverageAggregate {
  const missingFields = {} as Record<CoverageFieldKey, number>
  for (const field of COVERAGE_FIELDS) missingFields[field] = blankFieldCount(rows, field)

  return {
    group,
    total: rows.length,
    verified: rows.filter((s) => (s.dataStatus || 'partial') === 'verified').length,
    partial: rows.filter((s) => (s.dataStatus || 'partial') !== 'verified').length,
    missingNameBn: rows.filter((s) => !s.nameBn || !s.nameBn.trim()).length,
    missingImage: rows.filter((s) => !s.image).length,
    missingSource: rows.filter((s) => !s.sources || s.sources.length === 0).length,
    missingFields,
    lastUpdated: rows.map((s) => s.updatedAt || '').sort().pop() || undefined,
  }
}

/**
 * কাঁচা প্রজাতি-তালিকা থেকে কভারেজ-এগ্রিগেট তৈরি করে।
 * `pranijogot` ছাতা-রো-টিও এখানেই তৈরি হয় — পরে `summarizeCoverage` সেটি বাদ দেয়।
 */
export function coverageAggregates(species: Species[], categories: Category[] = CATEGORIES): CoverageAggregate[] {
  return categories.map((c) => {
    const rows = species.filter((s) => (isUmbrellaGroup(c.id) ? s.type === 'prani' : s.group === c.id))
    return aggregateFor(rows, c.id)
  })
}

/** এগ্রিগেট + ক্যাটাগরি-তথ্য মিলিয়ে UI-উপযোগী রো */
export function mapCoverageAggregates(
  aggregates: CoverageAggregate[],
  categories: Category[] = CATEGORIES,
): CoverageRow[] {
  const byGroup = new Map(aggregates.map((a) => [a.group, a]))
  return categories.map((c) => {
    const a = byGroup.get(c.id)
    const emptyFields = {} as Record<CoverageFieldKey, number>
    for (const field of COVERAGE_FIELDS) emptyFields[field] = 0
    return {
      group: c.id,
      label: c.label,
      kind: c.type === 'content' ? 'content' : 'species',
      umbrella: isUmbrellaGroup(c.id),
      total: Number(a?.total || 0),
      verified: Number(a?.verified || 0),
      partial: Number(a?.partial || 0),
      missingNameBn: Number(a?.missingNameBn || 0),
      missingImage: Number(a?.missingImage || 0),
      missingSource: Number(a?.missingSource || 0),
      missingFields: { ...emptyFields, ...(a?.missingFields || {}) },
      lastUpdated: a?.lastUpdated,
    }
  })
}

/** সরাসরি প্রজাতি-তালিকা থেকে রো (লোকাল JSON স্টোর) */
export function buildCoverageRows(species: Species[], categories: Category[] = CATEGORIES): CoverageRow[] {
  return mapCoverageAggregates(coverageAggregates(species, categories), categories)
}

/**
 * ড্যাশবোর্ডের মোট সংখ্যা — ছাতা ও কনটেন্ট রো বাদ দিয়ে।
 * এটিই `/api/coverage`-এর `totals` এবং অ্যাডমিন পেজের টাইলের একমাত্র উৎস।
 */
export function summarizeCoverage(rows: CoverageRow[]): CoverageTotals {
  const leaf = rows.filter((r) => r.kind === 'species' && !r.umbrella)
  const totals: CoverageTotals = {
    records: 0,
    verified: 0,
    partial: 0,
    speciesGroups: leaf.length,
    contentGroups: rows.filter((r) => r.kind === 'content').length,
    missingNameBn: 0,
    missingImage: 0,
    missingSource: 0,
    missingFields: { otherNames: 0, origin: 0, sizeOrHeight: 0, taxonomy: 0 },
  }
  for (const r of leaf) {
    totals.records += r.total
    totals.verified += r.verified
    totals.partial += r.partial
    totals.missingNameBn += r.missingNameBn
    totals.missingImage += r.missingImage
    totals.missingSource += r.missingSource
    for (const field of COVERAGE_FIELDS) totals.missingFields[field] += r.missingFields[field] || 0
  }
  return totals
}
