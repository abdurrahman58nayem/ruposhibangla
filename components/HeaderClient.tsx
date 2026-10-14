'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, Search, X, Leaf, User, LayoutDashboard, Bell, Languages } from 'lucide-react'
import type { SiteSettings, UserRole } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useApp } from '@/components/Providers'

const NAV = [
  { href: '/gyan', label: 'জ্ঞানভান্ডার' },
  { href: '/prani', label: 'প্রাণী' },
  { href: '/udbhid', label: 'উদ্ভিদ' },
  { href: '/grambangla', label: 'গ্রামবাংলা' },
  { href: '/sahitto', label: 'কবির চোখে' },
  { href: '/khobor', label: 'খবর' },
]

type CUser = { id: string; username: string; name: string; role: UserRole; verified: boolean; avatar?: string } | null

export default function HeaderClient({
  settings,
  user,
}: {
  settings: SiteSettings
  user: CUser
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [unread, setUnread] = useState(0)
  const { lang, setLang } = useApp()

  // অপঠিত নোটিফিকেশনের সংখ্যা (লগইন করা বা অতিথি — দুজনেরই)
  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch('/api/notifications', { cache: 'no-store' })
        const data = await res.json()
        if (alive && Array.isArray(data.items)) {
          setUnread(data.items.filter((n: any) => !n.read).length)
        }
      } catch {}
    }
    load()
    const id = setInterval(load, 60000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [pathname])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!q.trim()) return
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <>
      <button
        aria-label="মেনু"
        onClick={() => setOpen(true)}
        className="rounded-full p-2 text-forest-800 hover:bg-forest-50 md:hidden"
      >
        <Menu size={22} />
      </button>

      <Link href="/" className="flex min-w-0 items-center gap-2">
        <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-forest-700 sm:h-10 sm:w-10">
          {settings.logoUrl ? (
            <Image src={settings.logoUrl} alt={settings.siteName} width={40} height={40} className="h-full w-full object-cover" />
          ) : (
            <Leaf className="text-white" size={20} />
          )}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[15px] font-bold text-forest-900 sm:text-lg">{settings.siteName}</span>
          <span className="hidden truncate text-[11px] text-black/50 sm:block">{settings.tagline}</span>
        </span>
      </Link>

      <nav className="ml-4 hidden items-center gap-1 md:flex">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium transition',
              pathname.startsWith(n.href) ? 'bg-forest-700 text-white' : 'text-forest-900 hover:bg-forest-50',
            )}
          >
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <form onSubmit={submit} className="hidden items-center sm:flex">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="খুঁজুন… দোয়েল, বাঘ, শাপলা"
              className="w-44 rounded-full border border-black/10 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:w-60 focus:border-forest-400 lg:w-56"
            />
          </div>
        </form>

        <Link href="/share" className="btn-primary hidden px-3 py-2 text-xs sm:inline-flex sm:text-sm">
          শেয়ার করুন
        </Link>

        <Link
          href="/notifications"
          aria-label="নোটিফিকেশন"
          className="relative hidden rounded-full p-2 text-forest-800 hover:bg-forest-50 sm:block"
        >
          <Bell size={20} />
          {unread > 0 && (
            <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>

        <button
          onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
          aria-label="ভাষা পরিবর্তন"
          title={lang === 'bn' ? 'English' : 'বাংলা'}
          className="hidden rounded-full p-2 text-forest-800 hover:bg-forest-50 sm:block"
        >
          <Languages size={20} />
        </button>

        {user ? (
          <Link
            href={`/u/${user.username}`}
            title={user.name}
            className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-forest-100 text-sm font-bold text-forest-800"
          >
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} width={36} height={36} className="h-full w-full object-cover" />
            ) : (
              user.name.slice(0, 1)
            )}
          </Link>
        ) : (
          <Link href="/login" className="btn-outline px-3 py-2 text-xs sm:text-sm">
            <User size={16} /> লগইন
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link href="/admin" aria-label="অ্যাডমিন" className="hidden rounded-full p-2 text-forest-800 hover:bg-forest-50 sm:block">
            <LayoutDashboard size={20} />
          </Link>
        )}
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-sm bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-bold text-forest-900">{settings.siteName}</span>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-black/5" aria-label="বন্ধ করুন">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submit} className="mb-4 sm:hidden">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="খুঁজুন…"
                  className="field w-full pl-9"
                />
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              <Link href="/" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                হোম
              </Link>
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50',
                    pathname.startsWith(n.href) && 'bg-forest-50 text-forest-800',
                  )}
                >
                  {n.label}
                </Link>
              ))}
              <Link href="/share" onClick={() => setOpen(false)} className="rounded-xl bg-forest-700 px-3 py-2.5 text-[15px] font-medium text-white">
                ছবি/ভিডিও শেয়ার করুন
              </Link>
              <Link href="/notifications" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                নোটিফিকেশন
              </Link>
              <Link href="/saved" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                সংরক্ষিত
              </Link>
              <Link href="/reels" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                রিলস
              </Link>
              <Link href="/settings" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                সেটিংস
              </Link>
              <Link href="/jeno" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                জেনো — তথ্য জানান
              </Link>
              <Link href="/about" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                আমাদের সম্পর্কে
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                  অ্যাডমিন প্যানেল
                </Link>
              )}
              {!user && (
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                  লগইন / রেজিস্টার
                </Link>
              )}
              {user && (
                <Link href={`/u/${user.username}`} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                  আমার প্রোফাইল
                </Link>
              )}
            </nav>
            <p className="mt-6 text-xs text-black/40">{settings.tagline}</p>
          </div>
        </div>
      )}
    </>
  )
}
