import type { Metadata } from 'next'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { getRepo } from '@/lib/repo'
import AdminNav from '@/components/admin/AdminNav'
import LogoutButton from '@/components/admin/LogoutButton'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'অ্যাডমিন প্যানেল',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session || !['admin', 'super_admin', 'editor'].includes(session.role)) {
    return (
      <div className="container-pb py-16">
        <div className="mx-auto max-w-md card p-8 text-center">
          <ShieldAlert size={40} className="mx-auto mb-3 text-amber-600" />
          <h1 className="text-xl font-bold text-forest-900">অ্যাডমিন প্যানেল</h1>
          <p className="mt-2 text-sm text-black/60">
            {session
              ? 'আপনার অ্যাকাউন্টে অ্যাডমিন অনুমতি নেই।'
              : 'এই পাতায় ঢুকতে অ্যাডমিন অ্যাকাউন্টে লগইন করতে হবে। প্রথম যে অ্যাকাউন্ট খোলা হবে সেটিই অ্যাডমিন হবে।'}
          </p>
          <Link href="/login?next=/admin" className="btn-primary mt-5 w-full">
            লগইন করুন
          </Link>
          <Link href="/" className="mt-3 inline-flex items-center gap-1 text-xs text-black/45 hover:underline">
            <ArrowLeft size={12} /> সাইটে ফিরুন
          </Link>
        </div>
      </div>
    )
  }

  const repo = getRepo()
  const stats = await repo.stats()

  return (
    <div className="container-pb py-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-forest-900 sm:text-2xl">অ্যাডমিন প্যানেল</h1>
          <p className="text-xs text-black/50">স্বাগতম, {session.name} (@{session.username})</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link href="/" className="btn-outline px-3 py-1.5">সাইট দেখুন</Link>
          <Link href="/share" className="btn-outline px-3 py-1.5">নতুন পোস্ট</Link>
          <LogoutButton className="btn-outline px-3 py-1.5 text-red-600" />
        </div>
      </div>

      <AdminNav pending={stats.pending} aiPending={stats.aiPending} reports={stats.reports} />

      <div className="mt-5">{children}</div>
    </div>
  )
}
