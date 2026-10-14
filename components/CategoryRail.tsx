import Link from 'next/link'
import {
  PawPrint, Bird, Fish, Rat, Bug, Waves, Shell, Flower2, TreeDeciduous, Sparkles,
  Microscope, Mountain, Home, BookOpen, ShieldCheck,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/categories'

const ICONS: Record<string, any> = {
  PawPrint, Bird, Fish, Rat, Bug, Waves, Shell, Flower2, TreeDeciduous, Sparkles,
  Microscope, Mountain, Home, BookOpen, ShieldCheck,
}

/** ১৭টি ক্যাটাগরি — অনুভূমিক স্ক্রলযোগ্য; আইকনের সাথে সবসময় বাংলা নাম */
export default function CategoryRail({ active }: { active?: string }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
      <div className="flex gap-2 pb-1">
        {CATEGORIES.map((c) => {
          const Icon = ICONS[c.icon] || PawPrint
          const isActive = active === c.id
          return (
            <Link
              key={c.id}
              href={c.route}
              title={c.hint}
              className={`flex w-[86px] shrink-0 flex-col items-center gap-1.5 rounded-2xl border px-2 py-2.5 text-center transition ${
                isActive
                  ? 'border-forest-700 bg-forest-700 text-white'
                  : 'border-black/5 bg-white text-forest-900 hover:border-forest-300 hover:bg-forest-50'
              }`}
            >
              <Icon size={20} strokeWidth={1.9} />
              <span className="text-[10.5px] font-medium leading-tight">{c.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
