import type { Metadata } from 'next'
import Link from 'next/link'
import ShareForm from '@/components/ShareForm'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import { Camera } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ছবি বা ভিডিও শেয়ার করুন',
  description: 'বাংলাদেশের প্রাণী, উদ্ভিদ, গ্রাম ও মানুষের ছবি-ভিডিও শেয়ার করুন — অ্যাকাউন্ট ছাড়াই, শুধু নাম দিয়ে।',
  alternates: { canonical: '/share' },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ species?: string; category?: string }> }) {
  const sp = await searchParams
  const repo = getRepo()
  const [all, session] = await Promise.all([repo.listSpecies({ limit: 500 }), getSession()])
  const options = all.map((s) => ({ slug: s.slug, nameBn: s.nameBn, category: s.category, type: s.type }))

  return (
    <div className="container-pb py-6">
      <header className="mb-5">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-forest-900 sm:text-3xl">
          <Camera className="text-forest-600" /> প্রকৃতির ছবি শেয়ার করুন
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-black/55">
          বাগানের দোয়েল, মাঠের নীলকণ্ঠ, গ্রামের পুকুর কিংবা রাস্তার পাশের কৃষ্ণচূড়া — যা দেখছেন তা তুলে এখানে দিন।
          অ্যাকাউন্ট না থাকলেও শুধু নাম দিয়েই শেয়ার করা যায়।
        </p>
        {!session && (
          <p className="mt-2 text-xs text-black/45">
            টিপস:{' '}
            <Link href="/register" className="font-medium text-forest-700 hover:underline">
              অ্যাকাউন্ট খুললে
            </Link>{' '}
            আপনার সব ছবি এক প্রোফাইলে থাকবে ও অন্যরা আপনাকে ফলো করতে পারবে।
          </p>
        )}
      </header>

      <div className="mx-auto max-w-2xl">
        <ShareForm
          speciesOptions={options}
          defaultSpecies={sp.species || ''}
          defaultCategory={sp.category || ''}
          userName={session?.name || ''}
          loggedIn={!!session}
        />
      </div>
    </div>
  )
}
