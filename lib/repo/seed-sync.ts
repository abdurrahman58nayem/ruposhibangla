import type { Species } from '@/lib/types'
import { SPECIES } from '@/data/seed'

/**
 * সিড (কোড) ↔ ডেটাবেজ সিঙ্ক — কেন দরকার?
 *
 * জ্ঞানভান্ডারের রেকর্ড `data/seed/*.ts`-এ থাকে। Neon ডেটাবেজে সিড বসানোর
 * আগের নিয়ম ছিল: টেবিল সম্পূর্ণ ফাঁকা থাকলে কেবল একবার বসবে
 * (`seedIfEmptyNeon`)। ফলে পরে সিডে নতুন ব্যাচ যোগ হলে (যেমন more-birds3…9,
 * more-plants3, more-insects2) সেগুলো লাইভ সাইটে কখনোই ঢুকতো না — সাইট
 * পুরোনো সংখ্যাই দেখাতে থাকতো।
 *
 * এই মডিউল সেই ফাঁকটা নিরাপদে পূরণ করে:
 *  - ডিফল্ট: **শুধু অনুপস্থিত রেকর্ড যোগ করে** (insert-only)।
 *    বিদ্যমান রেকর্ডে হাত দেয় না → অ্যাডমিনের সম্পাদনা, ছবি, ভিউ-কাউন্ট অক্ষত থাকে।
 *  - `overwrite: true` দিলে বিদ্যমান রেকর্ডগুলো সিড-ভার্সনে রিফ্রেশ হয়।
 *  - **কখনো কিছু মুছে ফেলা হয় না** (TRUNCATE/DELETE নেই) — ইউজারের পোস্ট,
 *    মন্তব্য, অ্যাকাউন্ট সম্পূর্ণ নিরাপদ।
 *  - `dryRun: true` দিলে শুধু হিসাব দেয়, কিছু লেখে না।
 */

export type SpeciesSyncOptions = {
  /** বিদ্যমান রেকর্ডও সিড দিয়ে রিফ্রেশ করবে কি (ডিফল্ট: false — কেবল নতুন যোগ) */
  overwrite?: boolean
  /** শুধু হিসাব, কোনো পরিবর্তন নয় (ডিফল্ট: false) */
  dryRun?: boolean
}

export type SpeciesSyncResult = {
  /** কোডে (সিডে) কতগুলো অনন্য রেকর্ড আছে */
  seedCount: number
  /** সিঙ্কের আগে ডেটাবেজে কতগুলো ছিল */
  before: number
  /** সিঙ্কের পরে ডেটাবেজে কতগুলো */
  after: number
  /** নতুন যোগ হওয়া স্লাগ */
  added: string[]
  /** রিফ্রেশ হওয়া স্লাগ (`overwrite: true` হলে) */
  updated: string[]
  /** আগে থেকে ছিল, অপরিবর্তিত */
  skipped: number
  /** ডেটাবেজে অনুপস্থিত (সিঙ্ক করলে যতগুলো যোগ হবে) */
  missing: number
  dryRun: boolean
  ok: boolean
  error?: string
}

/** সিডের অনন্য স্লাগ-সংখ্যা (একই স্লাগ দুবার থাকলে একবার ধরা হয়) */
export const SEED_SLUGS: string[] = Array.from(new Set(SPECIES.map((s) => s.slug)))
export const SEED_SPECIES_COUNT = SEED_SLUGS.length

/** সিডের যে রেকর্ডগুলো ডেটাবেজে নেই (এবং চাইলে যেগুলো রিফ্রেশ হবে) */
export function pendingSeedSpecies(
  existingSlugs: Iterable<string>,
  overwrite = false,
): { toAdd: Species[]; toUpdate: Species[] } {
  const have = new Set(existingSlugs)
  const toAdd: Species[] = []
  const toUpdate: Species[] = []
  const seen = new Set<string>()
  for (const s of SPECIES) {
    if (seen.has(s.slug)) continue // একই স্লাগ দুবার (PK কনফ্লিক্ট এড়াতে)
    seen.add(s.slug)
    if (!have.has(s.slug)) toAdd.push(s)
    else if (overwrite) toUpdate.push(s)
  }
  return { toAdd, toUpdate }
}

export function makeSyncResult(params: {
  before: number
  toAdd: Species[]
  toUpdate: Species[]
  dryRun?: boolean
  error?: string
}): SpeciesSyncResult {
  const { before, toAdd, toUpdate, dryRun = false, error } = params
  const added = toAdd.map((s) => s.slug)
  const updated = toUpdate.map((s) => s.slug)
  return {
    seedCount: SEED_SPECIES_COUNT,
    before,
    after: before + added.length,
    added,
    updated,
    skipped: Math.max(0, before - updated.length),
    missing: added.length,
    dryRun,
    ok: !error,
    error,
  }
}

/** অ্যাডমিন প্যানেল/লগে দেখানোর জন্য এক লাইনের সারাংশ */
export function syncSummary(r: SpeciesSyncResult): string {
  if (r.error) return `সিঙ্ক ব্যর্থ: ${r.error}`
  if (r.dryRun) {
    return r.missing
      ? `সিডে ${r.seedCount}টি · ডেটাবেজে ${r.before}টি · বাকি ${r.missing}টি যোগ হতে পারে`
      : `সিডে ${r.seedCount}টি · ডেটাবেজে ${r.before}টি — সব সিঙ্কড`
  }
  return r.added.length
    ? `${r.added.length}টি নতুন প্রজাতি যোগ হয়েছে (মোট ${r.after}টি)`
    : `কিছু যোগ করার ছিল না — ডেটাবেজে আগেই ${r.before}টি রেকর্ড আছে`
}
