import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import CategoryIcon from '@/components/icons/CategoryIcon'
import { toneOf } from '@/components/icons/CategoryIcon'

/**
 * ১৭টি ক্যাটাগরি — অনুভূমিক স্ক্রলযোগ্য; আইকনের সাথে সবসময় বাংলা নাম।
 *
 * আইকনগুলো রূপসী বাংলা-র নিজস্ব SVG সেট — বাংলাদেশের প্রকৃতি ও ঐতিহ্যের
 * রঙে (বন-সবুজ, নদীর নীল, ধানখেতের সোনালি, লাল মাটির টেরাকোটা, শাপলা)
 * গ্রেড করা। সাধারণ জেনেরিক আইকনের বদলে প্রতিটা দলের নিজস্ব চিহ্ন।
 */
export default function CategoryRail({ active }: { active?: string }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
      <div className="flex gap-2 pb-1">
        {CATEGORIES.map((c) => {
          const isActive = active === c.id
          const tone = toneOf(c.id)
          return (
            <Link
              key={c.id}
              href={c.route}
              title={c.hint}
              className={`group flex w-[86px] shrink-0 flex-col items-center gap-1.5 rounded-2xl border px-2 py-2.5 text-center transition-all duration-200 ${
                isActive
                  ? 'border-transparent text-white shadow-md'
                  : 'border-black/5 bg-white text-forest-900 hover:-translate-y-0.5 hover:border-transparent hover:shadow-md'
              }`}
              style={
                isActive
                  ? { backgroundImage: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }
                  : undefined
              }
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  isActive
                    ? 'bg-white/20'
                    : 'group-hover:scale-105'
                }`}
                style={!isActive ? { backgroundColor: tone.soft } : undefined}
              >
                <CategoryIcon id={c.id} size={22} variant="auto" strokeWidth={1.8} />
              </span>
              <span className="text-[10.5px] font-medium leading-tight">{c.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
