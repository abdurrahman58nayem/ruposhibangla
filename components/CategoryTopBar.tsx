'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { CATEGORIES } from '@/lib/categories'
import CategoryIcon, { toneOf } from '@/components/icons/CategoryIcon'
import { cn } from '@/lib/utils'

function CategoryTopBarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentGroup = searchParams?.get('group')
  const currentCat = searchParams?.get('cat')

  return (
    <div className="border-b border-black/5 bg-white/95 backdrop-blur-md dark:border-white/5 dark:bg-[#0c1810]/95">
      <div className="container-pb flex items-center justify-between gap-2">
        <nav
          aria-label="ক্যাটাগরি নেভিগেশন"
          className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-1.5 text-xs"
        >
          {CATEGORIES.map((c) => {
            const tone = toneOf(c.id)
            // সক্রিয় অবস্থা নির্ধারণ
            const isActive =
              (pathname === '/gyan' && currentGroup === c.id) ||
              (pathname === c.route) ||
              (pathname === '/prani' && currentCat === c.label) ||
              (pathname === '/udbhid' && currentCat === c.label)

            return (
              <Link
                key={c.id}
                href={c.route}
                title={c.hint}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors duration-150',
                  isActive
                    ? 'text-white shadow-xs font-semibold'
                    : 'text-forest-900/80 hover:bg-forest-50 hover:text-forest-950 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white',
                )}
                style={
                  isActive
                    ? { backgroundImage: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }
                    : undefined
                }
              >
                <CategoryIcon
                  id={c.id}
                  size={14}
                  variant={isActive ? 'mono' : 'auto'}
                  strokeWidth={1.9}
                  className="shrink-0"
                />
                <span className="whitespace-nowrap">{c.label}</span>
              </Link>
            )
          })}
        </nav>

        <Link
          href="/categories"
          className="hidden shrink-0 items-center border-l border-black/10 pl-2.5 text-[11px] font-semibold text-forest-700 transition hover:text-forest-900 hover:underline dark:border-white/10 dark:text-forest-300 md:inline-flex"
        >
          সব ক্যাটাগরি →
        </Link>
      </div>
    </div>
  )
}

export default function CategoryTopBar() {
  return (
    <Suspense
      fallback={
        <div className="h-9 border-b border-black/5 bg-white/90 dark:border-white/5 dark:bg-[#0c1810]/90" />
      }
    >
      <CategoryTopBarInner />
    </Suspense>
  )
}
