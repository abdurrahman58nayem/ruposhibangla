import type { Metadata } from 'next'
import { Sparkles, ShieldCheck, Database, Wifi } from 'lucide-react'
import AiChat from '@/components/AiChat'
import { getRepo } from '@/lib/repo'
import { toBn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'প্রকৃতি সহচর — বাংলাদেশের প্রকৃতি বিষয়ক এআই',
  description:
    'আমাদের সাইটের নিজস্ব তথ্যভাণ্ডার থেকে প্রশ্নের উত্তর দেয় — বাংলাদেশের প্রাণী, পাখি, উদ্ভিদ, গ্রামবাংলা ও সংরক্ষণ নিয়ে জিজ্ঞেস করুন, ছবি দিয়েও বুঝতে চেষ্টা করবে।',
  alternates: { canonical: '/ai' },
}

export default async function Page() {
  const repo = getRepo()
  const [settings, stats] = await Promise.all([repo.getSettings(), repo.stats()])
  const mode = (process.env.AI_PROVIDER || 'local').toLowerCase()

  return (
    <div className="container-pb py-6">
      <header className="mb-5">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-forest-900 sm:text-3xl">
          <Sparkles className="text-earth-500" /> {settings.aiName}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-black/60">
          এটি বাইরের কোনো সাধারণ চ্যাটবট নয় — এই সাইটেই থাকা বাংলাদেশের প্রাণী, পাখি, উদ্ভিদ, খবর আর সম্প্রদায়ের পোস্ট
          থেকে তথ্য খুঁজে উত্তর দেয়। তাই উত্তরের সাথে সবসময় উৎসের লিংকও পাবেন।
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <AiChat settings={settings} />
        </div>

        <aside className="space-y-3">
          <div className="card p-4">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-forest-900">
              <Database size={15} /> তথ্যভাণ্ডার
            </h2>
            <ul className="space-y-1.5 text-[13px] text-black/65">
              <li>প্রজাতির তথ্য: {toBn(stats.species)}</li>
              <li>পাখি: {toBn(stats.birds)}</li>
              <li>উদ্ভিদ: {toBn(stats.plants)}</li>
              <li>প্রকাশিত খবর: {toBn((await repo.listNews({ publishedOnly: true })).length)}</li>
              <li>সম্প্রদায়ের পোস্ট: {toBn(stats.posts)}</li>
            </ul>
          </div>

          <div className="card p-4">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-forest-900">
              <Wifi size={15} /> কীভাবে কাজ করে
            </h2>
            <p className="text-[13px] leading-relaxed text-black/65">
              {mode === 'local' ? (
                <>
                  এখন <b>অফলাইন মোডে</b> চলছে — আমাদের নিজস্ব রিট্রিভাল ইঞ্জিন প্রশ্নের সাথে মিলিয়ে তথ্য খুঁজে বের করে
                  উত্তর তৈরি করে। কোনো বাইরের সার্ভারে তথ্য যায় না, খরচও নেই।
                  <br />
                  <br />
                  চাইলে এডমিন প্যানেল বা এনভায়রনমেন্টে <code>AI_PROVIDER</code> ও <code>AI_API_KEY</code> সেট করলে
                  ভাষা-মডেল যুক্ত হয়ে উত্তর আরও প্রাঞ্জল হবে।
                </>
              ) : (
                <>
                  উন্নত ভাষা-মডেল (<code>{process.env.AI_MODEL || 'gpt-4o-mini'}</code>) ব্যবহার করছে, তবে শুধু এই
                  সাইটের তথ্যের ভিত্তিতে উত্তর দেয় — তথ্য না থাকলে কল্পনা করবে না।
                </>
              )}
            </p>
          </div>

          <div className="card p-4">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-forest-900">
              <ShieldCheck size={15} /> ছবি দিয়ে প্রশ্ন
            </h2>
            <p className="text-[13px] leading-relaxed text-black/65">
              কোনো প্রাণী বা গাছের ছবি দিলে আমরা ছবির প্রধান রঙ বিশ্লেষণ করে আমাদের তথ্যভাণ্ডার থেকে সম্ভাব্য মিল খুঁজে
              দেখাই। সঠিক শনাক্তকরণের জন্য ভিশন-মডেল কনফিগার করা থাকলে আরও নিখুঁত ফল পাবেন।
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
