import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PORTAL_CATEGORIES } from '@/lib/portal-categories'
import CategoryIcon, { toneOf } from '@/components/icons/CategoryIcon'

export default function PortalCategoryGrid({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? 'grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3'}>
    {PORTAL_CATEGORIES.map((category) => {
      const tone = toneOf(category.iconGroup)
      return <section key={category.id} className={`card relative overflow-hidden border border-black/5 ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
        <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundImage: `linear-gradient(180deg, ${tone.from}, ${tone.to})` }} />
        <div className="flex items-start gap-2.5">
          <span className={`grid shrink-0 place-items-center rounded-xl ${compact ? 'h-8 w-8' : 'h-10 w-10'}`} style={{ backgroundColor: tone.soft }}>
            <CategoryIcon id={category.iconGroup} size={compact ? 18 : 22} variant="auto" />
          </span>
          <div className="min-w-0 flex-1">
            <Link href={category.href} className={`font-bold leading-tight text-forest-900 hover:text-forest-700 ${compact ? 'text-xs' : 'text-sm sm:text-base'}`}>{category.label}</Link>
            {!compact && <p className="mt-1 text-xs text-black/50">{category.description}</p>}
          </div>
          {!compact && <Link href={category.href} aria-label={`${category.label} দেখুন`} className="rounded-full p-1.5 text-forest-700 hover:bg-forest-50"><ArrowRight size={15}/></Link>}
        </div>
        <div className={`mt-2 flex flex-wrap gap-1 ${compact ? 'max-h-10 overflow-hidden' : ''}`}>
          {(compact ? category.subcategories.slice(0, 3) : category.subcategories).map((subcategory) => <Link key={`${subcategory.label}-${subcategory.href}`} href={subcategory.href}
            className={`rounded-full bg-stone-50 text-black/65 transition hover:bg-forest-50 hover:text-forest-900 ${compact ? 'px-1.5 py-1 text-[9px] leading-tight' : 'px-2.5 py-1.5 text-[11px]'}`}>{subcategory.label}</Link>)}
          {compact && category.subcategories.length > 3 && <Link href="/categories" className="rounded-full bg-forest-50 px-1.5 py-1 text-[9px] font-semibold text-forest-800">আরও +{category.subcategories.length - 3}</Link>}
        </div>
      </section>
    })}
  </div>
}
