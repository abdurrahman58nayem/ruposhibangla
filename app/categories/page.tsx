import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import { getRepo } from '@/lib/repo'
import { toBn } from '@/lib/utils'
import CategoryIcon, { toneOf } from '@/components/icons/CategoryIcon'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'সব ক্যাটাগরি' }

export default async function Page() {
  const coverage = await getRepo().coverage()
  const count = Object.fromEntries(coverage.map((c) => [c.group, c.total]))

  return (
    <div className="container-pb py-6">
      <h1 className="font-display text-2xl font-bold text-forest-900 sm:text-3xl">সব ক্যাটাগরি</h1>
      <p className="mt-1 text-sm text-black/55">
        বাংলাদেশের প্রাণী, উদ্ভিদ, স্থান ও সাহিত্য — ১৭টি প্রধান বিভাগে সাজানো।
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => {
          const tone = toneOf(c.id)
          const total = count[c.id] || 0
          return (
            <Link
              key={c.id}
              href={c.route}
              className="card group relative flex items-start gap-3 overflow-hidden p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {/* বাম প্রান্তে ক্যাটাগরির রঙের ডোরা */}
              <span
                className="absolute inset-y-0 left-0 w-1"
                style={{ backgroundImage: `linear-gradient(180deg, ${tone.from}, ${tone.to})` }}
              />
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: tone.soft }}
              >
                <CategoryIcon id={c.id} size={24} variant="auto" strokeWidth={1.8} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[16px] font-bold text-forest-900">{c.label}</span>
                <span className="block text-[12px] leading-relaxed text-black/50">{c.hint}</span>
                <span
                  className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                  style={{ backgroundColor: tone.from }}
                >
                  {toBn(total)} টি রেকর্ড
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
