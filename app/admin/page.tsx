import Link from 'next/link'
import { getRepo } from '@/lib/repo'
import { hasDb } from '@/lib/db/client'
import { storageKindAsync } from '@/lib/storage'
import { toBn } from '@/lib/utils'
import { Database, HardDrive, AlertTriangle, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react'
import SetupButton from '@/components/admin/SetupButton'
import SpeciesSyncCard from '@/components/admin/SpeciesSyncCard'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const repo = getRepo()
  const [stats, jeno, users, sync] = await Promise.all([
    repo.stats(),
    repo.listJeno(),
    repo.listUsers(),
    // dryRun — কেবল হিসাব, কোনো পরিবর্তন করে না
    repo.syncSpecies({ dryRun: true }).catch(() => null),
  ])

  const dbOn = hasDb()
  const storage = await storageKindAsync()
  const newJeno = jeno.filter((j) => j.status === 'new').length
  const channel = users.find((u) => u.username === 'ruposhibangla')

  const cards = [
    { label: 'মোট প্রজাতি', value: stats.species, href: '/admin/species' },
    { label: 'পাখি', value: stats.birds, href: '/admin/species' },
    { label: 'অন্যান্য প্রাণী', value: stats.animals, href: '/admin/species' },
    { label: 'উদ্ভিদ', value: stats.plants, href: '/admin/species' },
    { label: 'প্রকাশিত পোস্ট', value: stats.posts, href: '/admin/posts' },
    { label: 'অপেক্ষমান পোস্ট', value: stats.pending, href: '/admin/posts' },
    { label: 'ব্যবহারকারী', value: stats.users, href: '/admin/users' },
    { label: 'যাচাইকৃত পার্টনার', value: stats.partners, href: '/admin/users' },
  ]

  return (
    <div className="space-y-5">
      {/* Status */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/45">
            <Database size={14} /> ডেটাবেজ
          </p>
          <p className="mt-2 flex items-center gap-2 text-lg font-bold text-forest-900">
            {dbOn ? <CheckCircle2 size={17} className="text-emerald-600" /> : <AlertTriangle size={17} className="text-amber-500" />}
            {dbOn ? 'Neon Postgres' : 'লোকাল JSON (ডেমো)'}
          </p>
          <p className="mt-1 text-[11px] text-black/45">
            {dbOn
              ? 'সব তথ্য Neon ডেটাবেজে সংরক্ষিত হচ্ছে।'
              : 'DATABASE_URL সেট না থাকায় লোকাল ফাইলে চলছে। Vercel-এ কন্টিনিউয়াস ডেটার জন্য Neon যুক্ত করুন।'}
          </p>
          {dbOn && <SetupButton />}
        </div>

        <div className="card p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/45">
            <HardDrive size={14} /> স্টোরেজ (ছবি/ভিডিও)
          </p>
          <p className="mt-2 flex items-center gap-2 text-lg font-bold text-forest-900">
            {storage === 'r2' ? <CheckCircle2 size={17} className="text-emerald-600" /> : <AlertTriangle size={17} className="text-amber-500" />}
            {storage === 'r2' ? 'Cloudflare R2' : 'লোকাল public/uploads'}
          </p>
          <p className="mt-1 text-[11px] text-black/45">
            {storage === 'r2'
              ? 'আপলোড সরাসরি R2 বাকেটে যাচ্ছে।'
              : 'R2 কী না থাকায় লোকাল ফোল্ডারে জমা হচ্ছে। .env এ R2_* সেট করলেই R2 চালু হবে।'}
          </p>
        </div>

        <div className="card p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-black/45">
            <Sparkles size={14} /> এআই মোড
          </p>
          <p className="mt-2 text-lg font-bold text-forest-900">
            {(process.env.AI_PROVIDER || 'local') === 'local' ? 'লোকাল (অফলাইন)' : process.env.AI_PROVIDER}
          </p>
          <p className="mt-1 text-[11px] text-black/45">
            {(process.env.AI_PROVIDER || 'local') === 'local'
              ? 'নিজস্ব রিট্রিভাল ইঞ্জিন — কোনো API খরচ নেই।'
              : `${process.env.AI_MODEL || 'gpt-4o-mini'} মডেল ব্যবহার করছে।`}
          </p>
        </div>
      </div>

      {/* সিড ↔ ডেটাবেজ সিঙ্ক */}
      {sync && (
        <SpeciesSyncCard
          info={{
            seedCount: sync.seedCount,
            before: sync.before,
            after: sync.after,
            missing: sync.missing,
            added: 0,
          }}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-4 transition hover:shadow-md">
            <p className="text-[11px] text-black/45">{c.label}</p>
            <p className="text-2xl font-bold text-forest-900">{toBn(c.value)}</p>
          </Link>
        ))}
      </div>

      {/* Pending tasks */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-2 text-sm font-bold text-forest-900">অপেক্ষমান কাজ</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-black/65">নতুন জেনো বার্তা</span>
              <Link href="/admin/jeno" className="font-semibold text-forest-700 hover:underline">
                {toBn(newJeno)}
              </Link>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-black/65">অনুমোদনের অপেক্ষায় পোস্ট</span>
              <Link href="/admin/posts" className="font-semibold text-forest-700 hover:underline">
                {toBn(stats.pending)}
              </Link>
            </li>
          </ul>
        </div>

        <div className="card p-4">
          <h2 className="mb-2 text-sm font-bold text-forest-900">মূল চ্যানেল</h2>
          {channel ? (
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-forest-100 font-bold text-forest-800">
                {channel.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={channel.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  channel.name.slice(0, 1)
                )}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1 text-sm font-semibold text-forest-900">
                  {channel.name} {channel.verified && <span className="text-sky-500">✔</span>}
                </p>
                <p className="text-[11px] text-black/45">@{channel.username}</p>
              </div>
              <Link href={`/u/${channel.username}`} className="ml-auto text-xs text-forest-700 hover:underline">
                <ExternalLink size={13} className="inline" /> প্রোফাইল
              </Link>
            </div>
          ) : (
            <p className="text-xs text-black/50">চ্যানেল পাওয়া যায়নি।</p>
          )}
        </div>
      </div>

      {/* Quick guide */}
      <div className="card p-5">
        <h2 className="mb-2 text-sm font-bold text-forest-900">এডমিন প্যানেলে যা যা করতে পারবেন</h2>
        <div className="grid gap-2 text-[13px] text-black/65 sm:grid-cols-2">
          <p>• নতুন প্রাণী/উদ্ভিদ যোগ, তথ্য ও কবির দৃষ্টি সম্পাদনা</p>
          <p>• হেডার নোটিশ ও প্রকৃতির খবর প্রকাশ</p>
          <p>• শেয়ার করা পোস্ট অনুমোদন/প্রত্যাখ্যান/ফিচার্ড</p>
          <p>• ব্লু টিক (যাচাইকৃত পার্টনার) ও রোল নিয়ন্ত্রণ</p>
          <p>• সোশ্যাল মিডিয়া লিংক ও সাইট সেটিংস</p>
          <p>• R2 বাকেটে ছবি/ভিডিও আপলোড</p>
        </div>
      </div>
    </div>
  )
}
