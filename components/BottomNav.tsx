'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PawPrint, TreePine, Sparkles, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { href: '/', label: 'হোম', icon: Home },
  { href: '/prani', label: 'প্রাণী', icon: PawPrint },
  { href: '/udbhid', label: 'উদ্ভিদ', icon: TreePine },
  { href: '/ai', label: 'এআই', icon: Sparkles },
  { href: '/share', label: 'শেয়ার', icon: Camera },
]

export default function BottomNav() {
  const pathname = usePathname()
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="grid grid-cols-5">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition',
                active ? 'text-forest-700' : 'text-black/50',
              )}
            >
              <span className={cn('rounded-xl px-4 py-0.5', active && 'bg-forest-50')}>
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
