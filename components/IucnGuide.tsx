import Link from 'next/link'
import { ShieldAlert, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { IUCN, IUCN_ORDER, iucnInfo, extraConservationNote, toBn } from '@/lib/utils'
import { iucnUnassessedReason, UNVERIFIED_REASONS } from '@/data/seed/verification'
import type { Conservation, Species } from '@/lib/types'

/**
 * প্রজাতির পাতায় (প্রাণী ও উদ্ভিদ) দেখানোর জন্য IUCN সংরক্ষণ অবস্থা, যাচাইয়ের তথ্য ও ৯টি চিহ্নের অর্থের কার্ড।
 */
export function IucnSpeciesCard({
  s,
  conservation,
  conservationBn,
  type,
}: {
  s?: Species
  conservation: Conservation
  conservationBn?: string
  type: 'prani' | 'udbhid'
}) {
  const active = iucnInfo(conservation)
  const extraNote = extraConservationNote(conservation, conservationBn)
  const filterBase = type === 'prani' ? '/prani' : '/udbhid'
  const unassessedWhy = s ? iucnUnassessedReason(s) : null
  const unverifiedMeta = s ? UNVERIFIED_REASONS[s.slug] : undefined
  const isVerifiedRecord = !s || (s.dataStatus || 'partial') === 'verified'

  return (
    <section id="iucn-status" className="card mt-4 p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-forest-900">
            <ShieldAlert size={17} className="text-forest-700" />
            IUCN সংরক্ষণ অবস্থা
          </h2>
          <p className="mt-0.5 text-[11.5px] text-black/50">
            IUCN Red List (v3.1) অনুযায়ী বৈশ্বিক মূল্যায়ন ও চিহ্নের অর্থ
          </p>
        </div>
        <Link
          href="/songrokkhon#iucn"
          className="shrink-0 rounded-full bg-forest-50 px-2.5 py-1 text-[11px] font-medium text-forest-800 hover:bg-forest-100"
        >
          বিস্তারিত নির্দেশিকা
        </Link>
      </div>

      {/* বর্তমান প্রজাতির অবস্থা */}
      <div className="mt-3.5 rounded-xl border border-forest-100 bg-forest-50/50 p-3.5">
        <div className="flex items-center gap-3">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-extrabold shadow-sm ${active.color}`}
          >
            {active.code}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-black/45">
                {active.code} — {active.en}
              </p>
              {active.code !== 'NE' && active.code !== 'DD' && isVerifiedRecord ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  <CheckCircle2 size={11} /> যাচাইকৃত
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                  <AlertCircle size={11} />
                  {active.code === 'NE'
                    ? 'মূল্যায়ন হয়নি'
                    : active.code === 'DD'
                      ? 'উপাত্ত অপর্যাপ্ত'
                      : 'যাচাই বাকি'}
                </span>
              )}
            </div>
            <p className="text-base font-bold leading-snug text-forest-900">{active.meaning}</p>
          </div>
        </div>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-black/75">{active.detailBn}</p>

        {extraNote && (
          <p className="mt-2 rounded-lg bg-white/80 px-2.5 py-1.5 text-[12px] text-forest-900 ring-1 ring-black/5">
            <b className="font-semibold">আঞ্চলিক/অতিরিক্ত তথ্য:</b> {extraNote}
          </p>
        )}

        {unassessedWhy && (
          <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50/80 px-2.5 py-2 text-[12px] leading-relaxed text-amber-950">
            <b>
              {active.code === 'NE'
                ? 'কেন IUCN মূল্যায়ন করা যায়নি (NE):'
                : 'কেন ঝুঁকি নির্ধারণ করা যায়নি (DD):'}
            </b>{' '}
            {unassessedWhy}
          </div>
        )}

        {!isVerifiedRecord && unverifiedMeta && (
          <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50/80 px-2.5 py-2 text-[12px] leading-relaxed text-rose-950">
            <b>কেন একক প্রজাতি হিসেবে যাচাই করা যায়নি ({unverifiedMeta.category}):</b>{' '}
            {unverifiedMeta.reason}
          </div>
        )}
      </div>

      {/* ৯টি চিহ্নের স্কেল */}
      <div className="mt-4">
        <p className="mb-1.5 text-[11px] font-semibold text-black/50">
          IUCN স্কেলে অবস্থান (ঝুঁকির ক্রমানুসারে):
        </p>
        <div className="grid grid-cols-9 gap-1">
          {IUCN_ORDER.map((code) => {
            const info = IUCN[code]
            const isCurrent = code === active.code
            return (
              <Link
                key={code}
                href={`${filterBase}?iucn=${code}`}
                title={`${info.code} — ${info.en}: ${info.meaning}`}
                className={`flex flex-col items-center justify-center rounded-lg py-1.5 text-[11px] font-bold transition ${info.color} ${
                  isCurrent
                    ? 'scale-105 ring-2 ring-forest-800 ring-offset-2'
                    : 'opacity-65 hover:opacity-100'
                }`}
              >
                <span>{code}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* কোন চিহ্নের অর্থ কী — সম্পূর্ণ তালিকা */}
      <div className="mt-4 border-t border-black/5 pt-3.5">
        <p className="mb-2 text-xs font-bold text-forest-900">
          কোন চিহ্নের অর্থ কী? (IUCN শ্রেণিবিভাগ)
        </p>
        <div className="space-y-1.5">
          {IUCN_ORDER.map((code) => {
            const info = IUCN[code]
            const isCurrent = code === active.code
            return (
              <Link
                key={code}
                href={`${filterBase}?iucn=${code}`}
                className={`flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs transition ${
                  isCurrent
                    ? 'bg-forest-100/80 font-semibold text-forest-950 ring-1 ring-forest-300'
                    : 'hover:bg-forest-50/70'
                }`}
              >
                <span
                  className={`inline-flex h-6 w-8 shrink-0 items-center justify-center rounded-md text-[11px] font-extrabold ${info.color}`}
                >
                  {info.code}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-semibold text-forest-900">
                    {info.meaning}
                  </span>
                  <span className="block text-[11px] text-black/50">
                    {info.code} — {info.en}
                  </span>
                </span>
                {isCurrent && (
                  <span className="shrink-0 rounded-full bg-forest-700 px-2 py-0.5 text-[10px] font-semibold text-white">
                    এই প্রজাতি
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/**
 * জ্ঞানভান্ডার (/gyan), প্রাণী (/prani) ও উদ্ভিদ (/udbhid) পাতায়
 * IUCN ফিল্টার চিপ এবং “কোন চিহ্নের অর্থ কী?” সহায়িকা।
 */
export function IucnFilterBar({
  active,
  buildHref,
  counts,
}: {
  active?: Conservation | 'all'
  buildHref: (code?: Conservation) => string
  counts?: Partial<Record<Conservation, number>>
}) {
  const current = active && active !== 'all' ? iucnInfo(active) : null

  return (
    <div className="mt-4 rounded-2xl border border-forest-100 bg-white p-3.5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold text-forest-900">
          IUCN সংরক্ষণ অবস্থা দিয়ে দেখুন:
        </p>
        <details className="group relative">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-full bg-forest-50 px-3 py-1 text-[11.5px] font-semibold text-forest-800 transition hover:bg-forest-100">
            <HelpCircle size={13} />
            কোন চিহ্নের অর্থ কী? (IUCN তালিকা)
          </summary>
          <div className="mt-2.5 w-full rounded-xl border border-forest-100 bg-forest-50/40 p-3 sm:min-w-[460px]">
            <p className="mb-2 text-xs font-bold text-forest-900">
              IUCN-এর শ্রেণিবিভাগ — ইংরেজি শ্রেণি ও বাংলা অর্থ
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-black/10 text-[11px] font-bold text-forest-800">
                    <th className="py-1.5 pr-2">চিহ্ন</th>
                    <th className="py-1.5 pr-2">ইংরেজি শ্রেণি</th>
                    <th className="py-1.5">অর্থ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {IUCN_ORDER.map((code) => {
                    const info = IUCN[code]
                    return (
                      <tr key={code}>
                        <td className="py-1.5 pr-2 whitespace-nowrap">
                          <span
                            className={`inline-flex h-5 w-7 items-center justify-center rounded text-[10.5px] font-extrabold ${info.color}`}
                          >
                            {info.code}
                          </span>
                        </td>
                        <td className="py-1.5 pr-2 font-medium text-black/75 whitespace-nowrap">
                          {info.code} — {info.en}
                        </td>
                        <td className="py-1.5 font-semibold text-forest-900">{info.meaning}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </details>
      </div>

      <div className="no-scrollbar mt-2.5 flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap">
        <Link
          href={buildHref(undefined)}
          className={`chip text-xs ${!current ? 'chip-active' : ''}`}
        >
          সব অবস্থা
        </Link>
        {IUCN_ORDER.map((code) => {
          const info = IUCN[code]
          const isSelected = current?.code === code
          const cnt = counts?.[code]
          return (
            <Link
              key={code}
              href={buildHref(code)}
              title={`${info.code} — ${info.en}: ${info.meaning}`}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition ${
                isSelected
                  ? 'border-forest-800 bg-forest-800 text-white shadow-sm'
                  : 'border-forest-100 bg-white text-forest-900 hover:border-forest-300 hover:bg-forest-50'
              }`}
            >
              <span
                className={`inline-flex h-4 w-6 items-center justify-center rounded text-[10px] font-extrabold ${info.color}`}
              >
                {info.code}
              </span>
              <span>{info.meaning}</span>
              {typeof cnt === 'number' && (
                <span className={isSelected ? 'text-white/80' : 'text-black/45'}>
                  ({toBn(cnt)})
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {current && (
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-forest-50/70 px-3 py-2 text-xs">
          <div>
            <span className="font-bold text-forest-900">
              {current.code} — {current.en} ({current.meaning}):
            </span>{' '}
            <span className="text-black/70">{current.detailBn}</span>
          </div>
          <Link href={buildHref(undefined)} className="font-semibold text-forest-700 hover:underline">
            ফিল্টার সরান ✕
          </Link>
        </div>
      )}
    </div>
  )
}
