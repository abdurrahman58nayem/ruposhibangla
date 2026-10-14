import type { Metadata } from 'next'
import SpeciesBrowser from '@/components/SpeciesBrowser'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'বাংলাদেশের উদ্ভিদ — গাছ, ফুল, ফল, ঔষধি ও ম্যানগ্রোভ',
  description:
    'বাংলাদেশের বন গাছ, ফল গাছ, ফুল গাছ, ঔষধি গাছ, জলজ উদ্ভিদ, ম্যানগ্রোভ ও ফসলের তথ্য — বৈজ্ঞানিক নাম, মৌসুম ও ব্যবহার সহ।',
  alternates: { canonical: '/udbhid' },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string; page?: string }> }) {
  const sp = await searchParams
  return (
    <SpeciesBrowser
      type="udbhid"
      title="বাংলাদেশের উদ্ভিদ"
      subtitle="বন, ফল, ফুল, ঔষধি, জলজ, ম্যানগ্রোভ আর ফসল — বাংলার সবুজের তালিকা"
      cat={sp.cat}
      q={sp.q}
      page={Number(sp.page || 1)}
    />
  )
}
