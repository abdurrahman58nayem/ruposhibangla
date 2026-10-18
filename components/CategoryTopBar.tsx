import { Suspense } from 'react'
import { getRepo } from '@/lib/repo'
import CategoryTopBarClient from './CategoryTopBarClient'

/**
 * হেডারের নিচের ক্যাটাগরি স্ট্রিপ (সার্ভার অংশ) —
 * প্রাণী/উদ্ভিদের উপ-ক্যাটাগরি ও সংখ্যা সার্ভার থেকে এনে ক্লায়েন্ট স্ট্রিপে দেয়,
 * যাতে কোনো বিভাগে ঢুকলেই স্ট্রিপে সেই বিভাগের উপ-ক্যাটাগরিগুলো দেখায়।
 */
export default async function CategoryTopBar() {
  let praniCats: { name: string; count: number }[] = []
  let udbhidCats: { name: string; count: number }[] = []
  try {
    const repo = getRepo()
    ;[praniCats, udbhidCats] = await Promise.all([
      repo.listCategories('prani'),
      repo.listCategories('udbhid'),
    ])
  } catch {
    /* ডেটা না পেলে স্ট্রিপ প্রধান ক্যাটাগরিতেই ফলব্যাক করবে */
  }
  return (
    <Suspense fallback={<div className="h-11 border-b border-black/5 bg-white/90" />}>
      <CategoryTopBarClient praniCats={praniCats} udbhidCats={udbhidCats} />
    </Suspense>
  )
}
