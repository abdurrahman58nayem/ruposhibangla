'use client'

import Link from 'next/link'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, Search, X, User, LayoutDashboard, Bell, Languages } from 'lucide-react'
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
  const [mounted, setMounted] = useState(false)
  const [q, setQ] = useState('')
  const [unread, setUnread] = useState(0)
  const { lang, setLang } = useApp()

  useEffect(() => setMounted(true), [])

  // Render the drawer at body level: .glass uses backdrop-filter, which can
  // otherwise trap position:fixed overlays inside the short header.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

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
      <Link href="/" aria-label="রূপসী বাংলা — প্রথম পৃষ্ঠা" className="flex min-w-0 items-center gap-2">
        <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5 sm:h-10 sm:w-10">
          {settings.logoUrl ? (
            <Image src={settings.logoUrl} alt={settings.siteName} width={40} height={40} className="h-full w-full object-contain" />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src="/brand/logo-mark.png" alt={settings.siteName} width={40} height={40} className="h-full w-full object-contain" />
          )}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-display text-[16px] font-bold text-forest-900 sm:text-[19px]">
            {settings.siteName}
          </span>
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
        <form onSubmit={submit} className="hidden items-center md:flex">
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

        <Link href="/share" className="btn-primary hidden px-3 py-2 text-xs md:inline-flex md:text-sm">
          শেয়ার করুন
        </Link>

        <Link
          href="/notifications"
          aria-label="নোটিফিকেশন"
          className="relative hidden rounded-full p-2 text-forest-800 hover:bg-forest-50 md:block"
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
          className="hidden rounded-full p-2 text-forest-800 hover:bg-forest-50 md:block"
        >
          <Languages size={20} />
        </button>

        {user ? (
          <Link
            href={`/u/${user.username}`}
            title={user.name}
            className="hidden h-9 w-9 place-items-center overflow-hidden rounded-full bg-forest-100 text-sm font-bold text-forest-800 md:grid"
          >
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} width={36} height={36} className="h-full w-full object-cover" />
            ) : (
              user.name.slice(0, 1)
            )}
          </Link>
        ) : (
          <Link href="/login" className="btn-outline hidden px-3 py-2 text-xs md:inline-flex md:text-sm">
            <User size={16} /> লগইন
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link href="/admin" aria-label="অ্যাডমিন" className="hidden rounded-full p-2 text-forest-800 hover:bg-forest-50 md:block">
            <LayoutDashboard size={20} />
          </Link>
        )}

        <button
          type="button"
          aria-label="ক্যাটাগরি ও মেনু খুলুন"
          aria-controls="mobile-site-menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="rounded-full border border-black/10 bg-white/70 p-2 text-forest-800 shadow-sm transition hover:bg-forest-50 md:hidden"
        >
          <Menu size={21} />
        </button>
      </div>

      {mounted && open && createPortal(
        <div className="fixed inset-0 z-[100] md:hidden">
          <button
            type="button"
            aria-label="মেনু বন্ধ করুন"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/55"
          />
          <aside
            id="mobile-site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="প্রধান নেভিগেশন"
            className="absolute left-0 top-0 h-dvh w-[86%] max-w-sm overflow-y-auto bg-white px-4 pb-6 pt-[calc(env(safe-area-inset-top)+1rem)] text-forest-900 shadow-2xl dark:bg-[#102017]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <Link href="/" onClick={() => setOpen(false)} className="min-w-0 truncate text-lg font-bold text-forest-900">
                {settings.siteName}
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-full p-2 text-forest-800 transition hover:bg-forest-50"
                aria-label="বন্ধ করুন"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submit} className="mb-4 md:hidden">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/45" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="প্রজাতি, নদী, বন খুঁজুন…"
                  className="field w-full pl-9"
                />
              </div>
            </form>

            <nav className="flex flex-col gap-1">
              <Link href="/" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                হোম
              </Link>
              <Link href="/categories" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                সব ক্যাটাগরি
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
              <Link href="/share" onClick={() => setOpen(false)} className="mt-1 rounded-xl bg-forest-700 px-3 py-2.5 text-[15px] font-medium text-white hover:bg-forest-800">
                ছবি/ভিডিও শেয়ার করুন
              </Link>
              <Link href="/notifications" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                নোটিফিকেশন {unread > 0 ? `(${unread > 9 ? '9+' : unread})` : ''}
              </Link>
              <Link href="/saved" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                সংরক্ষিত
              </Link>
              <Link href="/reels" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-forest-50">
                রিলস
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
            <p className="mt-6 text-xs text-black/50">{settings.tagline}</p>
          </aside>
        </div>,
        document.body,
      )}
    </>
  )
}
