import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import Feed from '@/components/Feed'
import { buildFeedPage } from '@/lib/feed'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import { CATEGORIES, categoryLabel } from '@/lib/categories'
import { cn } from '@/lib/utils'
import type { PostKind } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'প্রকৃতির ফিড — ছবি, ভিডিও ও মতামত',
  description: 'বাংলাদেশের প্রাণী, উদ্ভিদ ও গ্রামবাংলার সব শেয়ার করা ছবি-ভিডিও এক স্রোতে।',
  alternates: { canonical: '/feed' },
}

function buildHref(base: Record<string, string | undefined>, patch: Record<string, string | undefined>) {
  const sp = new URLSearchParams()
  const merged = { ...base, ...patch }
  Object.entries(merged).forEach(([k, v]) => v && sp.set(k, v))
  const qs = sp.toString()
  return qs ? `/feed?${qs}` : '/feed'
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; kind?: string; group?: string; me?: string }>
}) {
  const sp = await searchParams
  const sort = sp.sort === 'popular' ? 'popular' : 'new'
  const kind = (['photo', 'video', 'reel'] as PostKind[]).includes(sp.kind as PostKind) ? (sp.kind as PostKind) : undefined
  const group = CATEGORIES.some((c) => c.id === sp.group) ? (sp.group as (typeof CATEGORIES)[number]['id']) : undefined
  const me = sp.me === '1'

  const repo = getRepo()
  const session = await getSession()
  const followingIds = me && session ? ((await repo.followingIds?.(session.id)) ?? []) : undefined

  const feed = await buildFeedPage({
    group,
    kind,
    sort,
    followingIds,
    limit: 12,
    withSpecies: !group && !kind && !me && sort === 'new',
  })

  const base: Record<string, string | undefined> = {
    sort: sort === 'popular' ? 'popular' : undefined,
    kind,
    group,
    me: me ? '1' : undefined,
  }

  const sortTabs = [
    { id: 'all', label: 'সবার জন্য', patch: { sort: undefined, me: undefined } },
    { id: 'new', label: 'নতুন', patch: { sort: undefined, me: undefined } },
    { id: 'popular', label: 'জনপ্রিয়', patch: { sort: 'popular', me: undefined } },
    { id: 'following', label: 'অনুসরণ', patch: { sort: undefined, me: '1' } },
  ]
  const activeSort = me ? 'following' : sort === 'popular' ? 'popular' : 'new'

  const kindTabs = [
    { id: 'all', label: 'সব ধরন' },
    { id: 'photo', label: 'ছবি' },
    { id: 'video', label: 'ভিডিও' },
    { id: 'reel', label: 'রিলস' },
  ]

  return (
    <div className="container-pb py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-forest-900 sm:text-3xl">প্রকৃতির স্রোত</h1>
        <p className="mt-1 text-sm text-black/55">
          সম্প্রদায়ের শেয়ার করা ছবি, ভিডিও আর মতামত — মাঝে মাঝে তথ্যভাণ্ডারের প্রজাতিও মিশে থাকে। রাজনীতি, ভাইরাল বা
          প্রকৃতি-বহির্ভূত কনটেন্ট এই ফিডে রাখা হয় না।
        </p>
      </header>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {sortTabs.map((t) => (
          <Link
            key={t.id}
            href={buildHref(base, t.patch)}
            className={cn('chip whitespace-nowrap', activeSort === t.id && 'chip-active')}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {kindTabs.map((t) => (
          <Link
            key={t.id}
            href={buildHref(base, { kind: t.id === 'all' ? undefined : t.id })}
            className={cn('chip whitespace-nowrap', (kind || 'all') === t.id && 'chip-active')}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <Suspense fallback={<div className="h-8" />}>
        <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <Link
            href={buildHref(base, { group: undefined })}
            className={cn('chip whitespace-nowrap', !group && 'chip-active')}
          >
            সব ক্যাটাগরি
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={buildHref(base, { group: c.id })}
              className={cn('chip whitespace-nowrap', group === c.id && 'chip-active')}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </Suspense>

      {me && !session && (
        <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
          অনুসরণ ফিল্টার ব্যবহার করতে{' '}
          <Link href="/login?next=/feed?me=1" className="font-semibold underline">
            লগইন
          </Link>{' '}
          করুন।
        </p>
      )}

      {group && (
        <p className="mb-3 text-sm text-black/55">
          ফিল্টার: <span className="font-semibold text-forest-800">{categoryLabel(group)}</span>{' '}
          <Link href={buildHref(base, { group: undefined })} className="ml-1 underline">
            সরান
          </Link>
        </p>
      )}

      <Feed
        initialItems={feed.items}
        initialCursor={feed.nextCursor}
        query={{ sort, kind, group, me: me ? '1' : undefined }}
        emptyMessage={
          me && followingIds && !followingIds.length
            ? 'আপনি এখনো কাউকে অনুসরণ করেননি। প্রোফাইল পেজ থেকে প্রকৃতিপ্রেমীদের অনুসরণ করুন!'
            : 'এই ফিল্টারে এখনো কিছু শেয়ার করা হয়নি। প্রথমটি আপনি শেয়ার করুন!'
        }
      />
    </div>
  )
}
