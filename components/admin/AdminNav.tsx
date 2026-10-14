'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Leaf, Newspaper, ImageIcon, Users, MessageSquare, Settings, Database, BadgeCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { href: '/admin', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
  { href: '/admin/species', label: 'প্রজাতি', icon: Leaf },
  { href: '/admin/news', label: 'খবর', icon: Newspaper },
  { href: '/admin/posts', label: 'পোস্ট', icon: ImageIcon },
  { href: '/admin/users', label: 'ব্যবহারকারী', icon: Users },
  { href: '/admin/jeno', label: 'জেনো', icon: MessageSquare },
  { href: '/admin/settings', label: 'সেটিংস', icon: Settings },
  { href: '/admin/media', label: 'মিডিয়া / R2', icon: Database },
]

export default function AdminNav({ pending = 0 }: { pending?: number }) {
  const pathname = usePathname()
  return (
    <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition sm:text-sm',
              active
                ? 'border-forest-700 bg-forest-700 text-white'
                : 'border-black/10 bg-white text-black/65 hover:bg-forest-50',
            )}
          >
            <Icon size={14} />
            {label}
            {label === 'জেনো' && pending > 0 && (
              <span className="rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">{pending}</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
