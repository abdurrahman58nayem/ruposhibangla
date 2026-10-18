import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import { getRepo } from '@/lib/repo'
import { toBn } from '@/lib/utils'
import CategoryIcon, { toneOf } from '@/components/icons/CategoryIcon'
import PortalCategoryGrid from '@/components/PortalCategoryGrid'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'সব ক্যাটাগরি — রূপসী বাংলা' }

export default async function Page() {
  const coverage = await getRepo().coverage()
  const count = Object.fromEntries(coverage.map((row) => [row.group, row.total]))

  return <main className="container-pb py-6 sm:py-8">
    <header className="mb-5 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[.14em] text-forest-600">বিষয়ভিত্তিক সূচি</p>
      <h1 className="mt-1 font-display text-2xl font-bold text-forest-900 sm:text-3xl">সব ক্যাটাগরি ও উপক্যাটাগরি</h1>
      <p className="mt-2 text-sm leading-relaxed text-black/55">প্রকৃতি, জীববৈচিত্র্য, প্রাকৃতিক ভ্রমণ, গ্রামবাংলা, ঋতু, সংরক্ষণ, ছবি ও সংবাদ—সব বিভাগ এক জায়গায়। একই বিষয় একাধিক প্রাসঙ্গিক বিভাগে থাকতে পারে; মূল প্রজাতি/স্থানের পরিচিত URL অপরিবর্তিত রাখা হয়েছে।</p>
    </header>

    <PortalCategoryGrid />

    <section className="mt-9">
      <div className="mb-3"><h2 className="text-lg font-bold text-forest-900">প্রজাতির মূল শ্রেণিবিন্যাস</h2><p className="mt-1 text-xs text-black/50">প্রাণী ও উদ্ভিদের বিদ্যমান ১৭টি গ্রুপ—admin panel এবং database-এর canonical group id অক্ষুণ্ণ।</p></div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const tone = toneOf(category.id)
          return <Link key={category.id} href={category.route} className="card flex items-center gap-3 p-3 transition hover:-translate-y-0.5 hover:shadow-md">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: tone.soft }}><CategoryIcon id={category.id} size={20}/></span>
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-forest-900">{category.label}</span><span className="block truncate text-[10px] text-black/45">{category.hint}</span></span>
            <span className="shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold text-white" style={{ backgroundColor: tone.from }}>{toBn(count[category.id] || 0)}</span>
          </Link>
        })}
      </div>
    </section>

    <div className="mt-6 rounded-xl border border-forest-100 bg-forest-50/70 p-4 text-xs leading-relaxed text-forest-900/75">
      <b>কনটেন্ট সাজানোর নিয়ম:</b> প্রাণী/উদ্ভিদের বৈজ্ঞানিক শ্রেণি তার মূল record-এ থাকে; আবাসস্থল, পর্যটন-ধরন, ঋতু ও সংরক্ষণ আলাদা discovery link ও tag-ভিত্তিকভাবে পাওয়া যায়। এতে একই বাঘ বা বনকে নকল record বানাতে হয় না।
    </div>
  </main>
}
