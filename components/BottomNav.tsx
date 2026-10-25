'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useApp } from '@/components/Providers'
import NavIcon, { type NavKey } from '@/components/icons/NavIcon'

/**
 * মোবাইলের স্থায়ী নিচের নেভিগেশন — MASTER-PROMPT §৪ অনুযায়ী **ঠিক ৬টি**:
 * জ্ঞানভান্ডার · ফিড · রিলস · প্রোফাইল · এআই · সেটিংস।
 * (সেটিংস প্রোফাইলের ⚙️-তেও আছে, কিন্তু স্পেক অনুযায়ী নেভিতেও থাকবে।)
 */
const ITEMS: { href: string; labelBn: string; labelEn: string; key: NavKey }[] = [
  { href: '/gyan', labelBn: 'জ্ঞানভান্ডার', labelEn: 'Knowledge', key: 'knowledge' },
  { href: '/feed', labelBn: 'ফিড', labelEn: 'Feed', key: 'feed' },
  { href: '/reels', labelBn: 'রিলস', labelEn: 'Reels', key: 'reels' },
  { href: '/profile', labelBn: 'প্রোফাইল', labelEn: 'Profile', key: 'profile' },
  { href: '/ai', labelBn: 'এআই', labelEn: 'AI', key: 'ai' },
  { href: '/settings', labelBn: 'সেটিংস', labelEn: 'Settings', key: 'settings' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { lang } = useApp()
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:bg-[#0b1a12]/95 md:hidden">
      <div className="grid grid-cols-6">
        {ITEMS.map(({ href, labelBn, labelEn, key }) => {
          const active = isActive(href)
          const label = lang === 'bn' ? labelBn : labelEn
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-0.5 py-1.5 text-[9.5px] font-semibold leading-tight transition sm:text-[10px]',
                active ? 'text-forest-800 dark:text-forest-100' : 'text-black/45 dark:text-white/45',
              )}
            >
              <span
                className={cn(
                  'flex items-center justify-center rounded-xl px-2 py-0.5 transition-all duration-200',
                  active ? 'scale-105 bg-forest-50 dark:bg-forest-900/40' : '',
                )}
              >
                <NavIcon id={key} size={21} strokeWidth={active ? 2.2 : 1.8} />
              </span>
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
