import type { Metadata } from 'next'
import Link from 'next/link'
import {
  PawPrint, Bird, Fish, Rat, Bug, Waves, Shell, Flower2, TreeDeciduous, Sparkles,
  Microscope, Mountain, Home, BookOpen, ShieldCheck,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/categories'
import { getRepo } from '@/lib/repo'
import { toBn } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'সব ক্যাটাগরি' }

const ICONS: Record<string, any> = {
  PawPrint, Bird, Fish, Rat, Bug, Waves, Shell, Flower2, TreeDeciduous, Sparkles,
  Microscope, Mountain, Home, BookOpen, ShieldCheck,
}

export default async function Page() {
  const coverage = await getRepo().coverage()
  const count = Object.fromEntries(coverage.map((c) => [c.group, c.total]))

  return (
    <div className="container-pb py-6">
      <h1 className="text-2xl font-bold text-forest-900">সব ক্যাটাগরি</h1>
      <p className="mt-1 text-sm text-black/55">
        বাংলাদেশের প্রাণী, উদ্ভিদ, স্থান ও সাহিত্য — ১৭টি প্রধান বিভাগে সাজানো।
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => {
          const Icon = ICONS[c.icon] || PawPrint
          const total = count[c.id] || 0
          return (
            <Link
              key={c.id}
              href={c.route}
              className="card group flex items-start gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-700 group-hover:bg-forest-700 group-hover:text-white">
                <Icon size={22} strokeWidth={1.9} />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-forest-900">{c.label}</span>
                <span className="block text-[11px] text-black/45">{c.hint}</span>
                <span className="mt-1 inline-block rounded-full bg-forest-50 px-2 py-0.5 text-[10px] font-semibold text-forest-800">
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
