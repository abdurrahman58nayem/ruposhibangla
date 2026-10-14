import type { Metadata } from 'next'
import Link from 'next/link'
import { getRepo } from '@/lib/repo'
import { toBn } from '@/lib/utils'
import { Leaf, Users, Sparkles, Camera } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'আমাদের সম্পর্কে',
  description: 'প্রকৃতি বাংলা — বাংলাদেশের প্রকৃতি, প্রাণী, উদ্ভিদ ও গ্রাম-মানুষ নিয়ে একটি উন্মুক্ত ডিজিটাল উদ্যোগ।',
}

export default async function Page() {
  const repo = getRepo()
  const [settings, stats] = await Promise.all([repo.getSettings(), repo.stats()])

  const cards = [
    { icon: Leaf, title: 'তথ্যভাণ্ডার', text: `বাংলাদেশের ${toBn(stats.species)}+ প্রজাতির প্রাণী ও উদ্ভিদ — বৈজ্ঞানিক নাম, বাসস্থান, খাদ্য, মৌসুম ও সংরক্ষণ অবস্থা সহ।` },
    { icon: Camera, title: 'শেয়ার', text: 'আপনার তোলা ছবি-ভিডিও ও মতামত শেয়ার করুন। অ্যাকাউন্ট ছাড়াও শুধু নাম দিয়ে অংশ নেওয়া যায়।' },
    { icon: Sparkles, title: 'প্রকৃতি সহচর', text: 'সাইটের নিজস্ব এআই — আপনার প্রশ্নের উত্তর দেয় এই সাইটের তথ্য থেকেই, উৎসের লিংক সহ।' },
    { icon: Users, title: 'মানুষ ও দেশ', text: 'গ্রামবাংলার ছবি, কবির চোখে প্রকৃতি আর দেশ ও প্রকৃতি নিয়ে কাজ করা মানুষদের সাথে যোগাযোগ।' },
  ]

  return (
    <div className="container-pb py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-forest-900">{settings.siteName} সম্পর্কে</h1>
        <p className="mt-1 text-sm text-black/50">{settings.tagline}</p>

        <div className="prose-bn mt-5 card p-5">
          <p>{settings.about}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {cards.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-4">
              <Icon className="mb-2 text-forest-600" size={20} />
              <h2 className="text-base font-bold text-forest-900">{title}</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-black/65">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 card p-5">
          <h2 className="text-lg font-bold text-forest-900">রূপসী বাংলা — আমাদের মূল চ্যানেল</h2>
          <p className="mt-2 text-sm leading-relaxed text-black/70">
            দেশ, মানুষ আর প্রকৃতির গল্প আমরা প্রথমে তুলে ধরি নিজস্ব চ্যানেল <b>রূপসী বাংলা</b> থেকে। এই চ্যানেলের সব কনটেন্ট
            যাচাইকৃত (ব্লু টিক)। দেশ ও প্রকৃতি নিয়ে কাজ করা ব্যক্তি বা সংগঠন আমাদের পার্টনার হতে পারেন — পার্টনার
            অ্যাকাউন্টে ব্লু টিক দেওয়া হয়।
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/u/ruposhibangla" className="btn-primary text-sm">চ্যানেল দেখুন</Link>
            <Link href="/jeno" className="btn-outline text-sm">পার্টনার হতে চাই</Link>
          </div>
        </div>

        <div className="mt-6 text-xs text-black/45">
          <Link href="/privacy" className="hover:underline">গোপনীয়তা নীতি</Link> ·{' '}
          <Link href="/terms" className="hover:underline">ব্যবহারের শর্তাবলি</Link>
        </div>
      </div>
    </div>
  )
}
