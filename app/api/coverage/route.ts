import { NextResponse } from 'next/server'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

/** জীবগোষ্ঠীভিত্তিক কভারেজ — কোন তথ্য সম্পূর্ণ, কোনটি অসম্পূর্ণ */
export async function GET() {
  const rows = await getRepo().coverage()
  return NextResponse.json({ rows })
}
