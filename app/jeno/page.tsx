import type { Metadata } from 'next'
import JenoForm from '@/components/JenoForm'
import { getRepo } from '@/lib/repo'
import { MessageSquarePlus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'জেনো — প্রকৃতি সম্পর্কে তথ্য জানান',
  description:
    'কোনো প্রাণী বা উদ্ভিদ সম্পর্কে নতুন তথ্য, ভুল সংশোধন, স্থানীয় নাম কিংবা নতুন ছবির খোঁজ জানালেই আমরা যাচাই করে তথ্যভাণ্ডারে যোগ করব।',
  alternates: { canonical: '/jeno' },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ species?: string; topic?: string }> }) {
  const sp = await searchParams
  const all = await getRepo().listSpecies({ limit: 500 })
  return (
    <div className="container-pb py-6">
      <header className="mb-5">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-forest-900 sm:text-3xl">
          <MessageSquarePlus className="text-earth-500" /> জেনো — আমাদের জানান
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-black/55">
          আপনি যদি কোনো প্রাণী বা উদ্ভিদ সম্পর্কে নতুন তথ্য জানেন, কোনো ভুল দেখতে পান, স্থানীয় নাম জানেন বা নতুন কিছু
          দেখে থাকেন — এখান থেকে পাঠিয়ে দিন। যাচাই করে আমরা সাইটে যোগ করব এবং আপনার কথা উল্লেখ করব।
        </p>
      </header>
      <div className="mx-auto max-w-2xl">
        <JenoForm
          speciesOptions={all.map((s) => ({ slug: s.slug, nameBn: s.nameBn, category: s.category }))}
          defaultSpecies={sp.species || ''}
          defaultTopic={sp.topic || ''}
        />
      </div>
    </div>
  )
}
