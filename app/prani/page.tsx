import type { Metadata } from 'next'
import SpeciesBrowser from '@/components/SpeciesBrowser'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'বাংলাদেশের প্রাণী — পাখি, স্তন্যপায়ী, সরীসৃপ, মাছ',
  description:
    'বাংলাদেশের পাখি, স্তন্যপায়ী, সরীসৃপ, উভচর, মাছ ও পতঙ্গের সম্পূর্ণ তালিকা — বৈজ্ঞানিক নাম, বাসস্থান, খাদ্য, আইইউসিএন সংরক্ষণ অবস্থা সহ।',
  alternates: { canonical: '/prani' },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string; page?: string }> }) {
  const sp = await searchParams
  return (
    <SpeciesBrowser
      type="prani"
      title="বাংলাদেশের প্রাণী"
      subtitle="পাখি, স্তন্যপায়ী, সরীসৃপ, উভচর, মাছ ও পতঙ্গ — বাংলাদেশের যা কিছু প্রাণ আছে"
      cat={sp.cat}
      q={sp.q}
      page={Number(sp.page || 1)}
    />
  )
}
