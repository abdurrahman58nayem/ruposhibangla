import type { SpeciesMedia } from '@/lib/types'

/**
 * রেকর্ড-ভিত্তিক "সম্পূর্ণ বিবরণ" — বিষয়ভিত্তিক কাঠামোবদ্ধ তথ্য।
 *
 * নিয়ম:
 *  ১. যে ঘর রেকর্ডে আগে থেকে আছে, সেটা ওভাররাইট করা হয় না (আগের তথ্য হারায় না)।
 *  ২. নতুন তথ্য যোগ হলেই রেকর্ডের `dataStatus` 'partial' থেকে 'review'-এ উন্নীত হয়।
 *  ৩. ভিডিও কখনো ডাউনলোড করা হয় না — সরাসরি উৎসের লিংক থেকে এম্বেড হয়,
 *     ক্রেডিট ও লাইসেন্স সবসময় দেখানো হয়।
 */
export type SpeciesDetail = {
  /** শনাক্তকরণের লক্ষণ */
  identification?: string
  /** শারীরিক গঠন */
  physical?: string
  /** আচরণ ও জীবনযাপন */
  behavior?: string
  /** বাংলাদেশে বিস্তৃতি */
  distribution?: string
  /** প্রজনন ও জীবনচক্র */
  reproduction?: string
  /** প্রকৃতিতে ভূমিকা */
  ecologicalRole?: string
  /** হুমকি */
  threats?: string
  /** সংরক্ষণ ও করণীয় */
  conservationActions?: string
  diet?: string
  season?: string
  whereToSee?: string
  sizeOrHeight?: string
  origin?: 'native' | 'domestic' | 'cultivated' | 'migratory' | 'exotic' | 'invasive'
  /** কপিরাইট-মুক্ত ভিডিও (এম্বেড) */
  media?: SpeciesMedia[]
}

export type DetailsMap = Record<string, SpeciesDetail>
