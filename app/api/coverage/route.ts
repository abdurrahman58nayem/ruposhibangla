import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'
import { summarizeCoverage } from '@/lib/coverage'

export const dynamic = 'force-dynamic'

/**
 * জীবগোষ্ঠীভিত্তিক কভারেজ — কোন তথ্য সম্পূর্ণ, কোনটি অসম্পূর্ণ।
 *
 * `rows`-এ প্রতিটি ক্যাটাগরির রো থাকে (প্রাণীজগৎ ছাতা-রো-সহ, `umbrella: true`)।
 * `totals` হলো প্রকৃত যোগফল — ছাতা ও কনটেন্ট রো বাদ দিয়ে, যাতে কোনো রেকর্ড
 * দুইবার না গোনা হয়।
 */
export async function GET() {
  const rows = await getRepo().coverage()
  return NextResponse.json({ rows, totals: summarizeCoverage(rows) })
}
