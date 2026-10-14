import type { Species } from '@/lib/types'
import { DETAILS_PAKHI } from './pakhi'
import { DETAILS_PAKHI2 } from './pakhi2'
import type { DetailsMap } from './types'

export type { SpeciesDetail, DetailsMap } from './types'

/** সব বিস্তারিত খণ্ড এক জায়গায় */
export const SPECIES_DETAILS: DetailsMap = {
  ...DETAILS_PAKHI,
  ...DETAILS_PAKHI2,
}

export const DETAILS_COUNT = Object.keys(SPECIES_DETAILS).length

/**
 * শনাক্তকরণ সংশোধন — রেকর্ডে ভুল বৈজ্ঞানিক নাম/বিভাগ পাওয়া গেলে।
 *
 * এখানে জোর করে বসানো হয় (আগের ভুল মান বদলায়), কিন্তু `conflictingInfo`-তে
 * কী ছিল ও কেন বদলানো হলো তা লিখে রাখা হয় এবং `dataStatus` = 'identity_uncertain'
 * রাখা হয় — অর্থাৎ কখনোই নিশ্চিত দাবি করা হয় না।
 */
type Correction = {
  field: 'scientificName' | 'nameEn' | 'category' | 'nameBn'
  from: string
  to: string
  note: string
}

export const CORRECTIONS: Record<string, Correction> = {
  batashi: {
    field: 'scientificName',
    from: 'Pseudeutropius atherinoides',
    to: 'Apus affinis',
    note:
      'এই রেকর্ডে আগে বৈজ্ঞানিক নাম হিসেবে Pseudeutropius atherinoides দেওয়া ছিল, যা একটি স্বাদুপানির মাগুর-জাতীয় মাছ (Batashi catfish) — পাখি নয়। বিবরণ (কখনো মাটিতে বসে না, বাড়ির চালের নিচে ও কংক্রিটের ফাঁকে বাসা) বাংলাদেশে প্রচলিত গৃহ-বাতাসি Apus affinis-এর সাথেই মেলে, তাই নামটি সংশোধন করা হয়েছে। ছবির পরিচয় এখনো যাচাই হয়নি — স্থির নিশ্চিতকরণের আগে রেকর্ডটি identity_uncertain হিসেবেই দেখানো হচ্ছে।',
  },
}

function applyCorrections(list: Species[]): Species[] {
  return list.map((s) => {
    const c = CORRECTIONS[s.slug]
    if (!c) return s
    if ((s as any)[c.field] !== c.from) return s
    return {
      ...s,
      [c.field]: c.to,
      conflictingInfo: c.note,
      dataStatus: 'identity_uncertain' as const,
    }
  })
}

/**
 * যে কোনো তথ্য যোগ করা হলেই রেকর্ডের `dataStatus` উন্নীত করা হয়,
 * যাতে অসম্পূর্ণ রেকর্ড "সম্পূর্ণ" বলে ভুল দাবি না করা হয়।
 */
const FILLABLE = [
  'identification',
  'physical',
  'behavior',
  'distribution',
  'reproduction',
  'ecologicalRole',
  'threats',
  'conservationActions',
  'diet',
  'season',
  'whereToSee',
  'sizeOrHeight',
  'origin',
] as const

/** ভিডিও থাকলে ডুপ্লিকেট এড়িয়ে যোগ করা হয় */
function mergeMedia(existing: Species['media'], incoming: Species['media']) {
  if (!incoming?.length) return existing
  const urls = new Set((existing || []).map((m) => m.url))
  const added = incoming.filter((m) => !urls.has(m.url))
  return added.length ? [...(existing || []), ...added] : existing
}

/**
 * রেকর্ডে বিস্তারিত তথ্য বসানো —
 *  · আগের তথ্য কখনো মুছে যায় না (শুধু ফাঁকা ঘর পূরণ হয়)
 *  · কমপক্ষে একটি নতুন তথ্য গেলে dataStatus 'partial' → 'review'
 */
export function withDetails(list: Species[]): Species[] {
  let filled = 0

  const out = applyCorrections(list).map((s) => {
    const d = SPECIES_DETAILS[s.slug]
    if (!d) return s

    const next: Species = { ...s }
    let changed = false

    for (const key of FILLABLE) {
      const v = (d as any)[key]
      if (v === undefined || v === null || v === '') continue
      const cur = (s as any)[key]
      const empty = cur === undefined || cur === null || (typeof cur === 'string' && !cur.trim())
      if (!empty) continue
      ;(next as any)[key] = v
      changed = true
    }

    const mergedMedia = mergeMedia(s.media, d.media)
    if (mergedMedia !== s.media) {
      next.media = mergedMedia
      changed = true
    }

    if (changed) {
      filled++
      if (!next.dataStatus || next.dataStatus === 'partial') next.dataStatus = 'review'
    }
    return next
  })

  if (typeof process !== 'undefined' && process.env?.RB_DETAILS_LOG === '1') {
    // eslint-disable-next-line no-console
    console.log(`[details] ${filled} টি রেকর্ডে নতুন তথ্য যোগ হয়েছে (মোট বিবরণ: ${DETAILS_COUNT})`)
  }

  return out
}
