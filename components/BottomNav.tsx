'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpenText, Newspaper, Film, User, Sparkles, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/components/Providers'

/** মোবাইলের স্থায়ী নিচের নেভিগেশন — ৬টি প্রধান অংশ */
const ITEMS = [
  { href: '/gyan', labelBn: 'জ্ঞানভান্ডার', labelEn: 'Knowledge', icon: BookOpenText, key: 'knowledge' as const },
  { href: '/feed', labelBn: 'ফিড', labelEn: 'Feed', icon: Newspaper, key: 'feed' as const },
  { href: '/reels', labelBn: 'রিলস', labelEn: 'Reels', icon: Film, key: 'reels' as const },
  { href: '/profile', labelBn: 'প্রোফাইল', labelEn: 'Profile', icon: User, key: 'profile' as const },
  { href: '/ai', labelBn: 'এআই', labelEn: 'AI', icon: Sparkles, key: 'ai' as const },
  { href: '/settings', labelBn: 'সেটিংস', labelEn: 'Settings', icon: Settings, key: 'settings' as const },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { lang } = useApp()
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:bg-[#0b1a12]/95 md:hidden">
      <div className="grid grid-cols-6">
        {ITEMS.map(({ href, labelBn, labelEn, icon: Icon }) => {
          const active = isActive(href)
          const label = lang === 'bn' ? labelBn : labelEn
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 py-1.5 text-[9.5px] font-medium leading-tight transition',
                active ? 'text-forest-700' : 'text-black/50',
              )}
            >
              <span className={cn('rounded-xl px-3 py-0.5', active && 'bg-forest-50')}>
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              </span>
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
