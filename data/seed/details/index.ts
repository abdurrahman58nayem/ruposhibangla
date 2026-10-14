import type { Species } from '@/lib/types'
import { DETAILS_PAKHI } from './pakhi'
import { DETAILS_PAKHI2 } from './pakhi2'
import { DETAILS_GACHHBON } from './gachhbon'
import { DETAILS_GACHHBON2 } from './gachhbon2'
import { DETAILS_UDABHID } from './udbhidful'
import { DETAILS_UDABHID2 } from './udbhidful2'
import { DETAILS_MACHH } from './machh'
import { DETAILS_MACHH2 } from './machh2'
import { DETAILS_STANAPAYI } from './stanapayi'
import { DETAILS_STANAPAYI2 } from './stanapayi2'
import type { DetailsMap } from './types'

export type { SpeciesDetail, DetailsMap } from './types'

/** সব বিস্তারিত খণ্ড এক জায়গায় */
export const SPECIES_DETAILS: DetailsMap = {
  ...DETAILS_PAKHI,
  ...DETAILS_PAKHI2,
  ...DETAILS_GACHHBON,
  ...DETAILS_GACHHBON2,
  ...DETAILS_UDABHID,
  ...DETAILS_UDABHID2,
  ...DETAILS_MACHH,
  ...DETAILS_MACHH2,
  ...DETAILS_STANAPAYI,
  ...DETAILS_STANAPAYI2,
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
 * সিড-ফাইলে অনেক রেকর্ডে আগে থেকেই এক-লাইনের সারাংশ ছিল
 * (যেমন “চ্যাপ্টা রূপালি দেহ, লেজ দ্বিখণ্ডিত”), যা পরে লেখা পূর্ণ বিবরণকে বসতে দেয়নি।
 * তাই “থিন স্টাব”-এর বদলে বিস্তারিত বিবরণ বসানোর নিয়ম:
 *   · বিস্তারিত লেখা অন্তত MIN_UPGRADE_CHARS অক্ষরের হতে হবে, এবং
 *   · বিদ্যমান লেখার চেয়ে অন্তত UPGRADE_RATIO গুণ বড় হতে হবে।
 * দুটোই মিললে আগের লেখা `stubArchive`-এ সংরক্ষিত হয় — কোনো তথ্য হারায় না,
 * প্রশাসক চাইলে আগের সংস্করণ দেখতে পারবেন।
 */
const MIN_UPGRADE_CHARS = 120
const UPGRADE_RATIO = 2.5

function isUpgrade(cur: unknown, incoming: unknown) {
  if (typeof cur !== 'string' || typeof incoming !== 'string') return false
  const oldLen = cur.trim().length
  if (!oldLen) return true
  return incoming.trim().length >= MIN_UPGRADE_CHARS && incoming.trim().length >= oldLen * UPGRADE_RATIO
}

/**
 * রেকর্ডে বিস্তারিত তথ্য বসানো —
 *  · আগের তথ্য কখনো মুছে যায় না (ফাঁকা ঘর পূরণ হয়, স্টাব প্রতিস্থাপিত হলে সংরক্ষিত থাকে)
 *  · কমপক্ষে একটি নতুন তথ্য গেলে dataStatus 'partial'/'verified' → 'review'
 */
export function withDetails(list: Species[]): Species[] {
  let filled = 0
  let upgraded = 0

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
      if (!empty) {
        if (!isUpgrade(cur, v)) continue
        // আগের এক-লাইনের সারাংশ সংরক্ষণ — তথ্য হারানো যাবে না
        next.stubArchive = { ...(next.stubArchive || {}), [key]: String(cur) }
        upgraded++
      }
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
      // নতুন (অযাচিত) তথ্য বসলেই রেকর্ড 'review'-এ যায় —
      // 'verified' অবস্থায় থাকা মানে বিশেষজ্ঞ-যাচিত, তাই তা কমিয়ে 'review' করা হয়।
      if (!next.dataStatus || next.dataStatus === 'partial' || next.dataStatus === 'verified') {
        next.dataStatus = 'review'
      }
    }
    return next
  })

  if (typeof process !== 'undefined' && process.env?.RB_DETAILS_LOG === '1') {
    // eslint-disable-next-line no-console
    console.log(
      `[details] ${filled} টি রেকর্ডে নতুন তথ্য যোগ হয়েছে (স্টাব প্রতিস্থাপিত ঘর: ${upgraded}, মোট বিবরণ: ${DETAILS_COUNT})`,
    )
  }

  return out
}
