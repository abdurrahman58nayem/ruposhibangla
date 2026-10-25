import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, ExternalLink, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react'
import { getReadyRepo } from '@/lib/repo'
import { IUCN, IUCN_ORDER, toBn, bnDate, excerpt } from '@/lib/utils'
import { speciesPath } from '@/lib/categories'
import { UNVERIFIED_REASONS, iucnUnassessedReason } from '@/data/seed/verification'
import { DATA_STATUS_LABEL } from '@/lib/i18n'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'পরিবেশ, সংরক্ষণ ও IUCN শ্রেণিবিভাগ',
  description:
    'IUCN রেড লিস্টের ৯টি শ্রেণিবিভাগ (EX, EW, CR, EN, VU, NT, LC, DD, NE)-এর ইংরেজি নাম ও বাংলা অর্থ, যাচাইকৃত প্রজাতি ও যেগুলো যাচাই করা যায়নি সেগুলোর সুনির্দিষ্ট কারণ।',
}

const FOCUS_ORDER = ['CR', 'EN', 'VU', 'NT'] as const

export default async function Page() {
  const repo = await getReadyRepo()
  const [all, news, coverage] = await Promise.all([
    repo.listSpecies({ limit: 5000 }),
    repo.listNews({ publishedOnly: true, limit: 5 }),
    repo.coverage(),
  ])

  const bioSpecies = all.filter((s) => s.type === 'prani' || s.type === 'udbhid')
  const countsByCode: Record<string, number> = {}
  for (const code of IUCN_ORDER) countsByCode[code] = 0
  for (const s of bioSpecies) {
    countsByCode[s.conservation] = (countsByCode[s.conservation] || 0) + 1
  }

  const byStatus = FOCUS_ORDER.map((st) => ({
    status: st,
    info: IUCN[st],
    items: bioSpecies.filter((s) => s.conservation === st),
  })).filter((g) => g.items.length > 0)

  const total = all.length
  const verifiedList = all.filter((s) => (s.dataStatus || 'partial') === 'verified')
  const unverifiedList = all.filter((s) => (s.dataStatus || 'partial') !== 'verified')
  const verified = verifiedList.length

  const neDdSpecies = bioSpecies.filter((s) => s.conservation === 'NE' || s.conservation === 'DD')

  return (
    <div className="container-pb py-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-forest-900">
        <ShieldCheck size={24} /> পরিবেশ, সংরক্ষণ ও তথ্য-যাচাই প্রতিবেদন
      </h1>
      <p className="mt-1 max-w-3xl text-sm text-black/55">
        কোন প্রজাতি বা উদ্ভিদের সংরক্ষণ অবস্থা কী, IUCN-এর কোন চিহ্নের অর্থ কী, কোন রেকর্ডগুলো যাচাইকৃত এবং
        যেগুলো একক প্রজাতি হিসেবে যাচাই করা যায়নি সেগুলো ঠিক কী কারণে যাচাই করা যায়নি — সবকিছু খোলাখুলি।
      </p>

      {/* যাচাই ও সংরক্ষণ অবস্থা সারাংশ */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/gyan?status=verified"
          className="card group flex items-center justify-between gap-3 border-emerald-200 bg-emerald-50/40 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <CheckCircle2 size={15} className="text-emerald-700" /> যাচাইকৃত রেকর্ড
            </p>
            <p className="text-[11px] text-emerald-800/75">
              বৈজ্ঞানিক নাম, IUCN ও উৎস যাচাইকৃত
            </p>
            <p className="mt-1.5 text-2xl font-bold text-emerald-950">{toBn(verified)}</p>
            <p className="text-[10.5px] font-medium text-emerald-800">
              মোট {toBn(total)}-এর মধ্যে ({toBn(Math.round((verified / Math.max(1, total)) * 100))}%) →
            </p>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-700 text-sm font-extrabold text-white shadow-sm">
            ✓
          </span>
        </Link>

        <a
          href="#unverified"
          className="card group flex items-center justify-between gap-3 border-amber-200 bg-amber-50/40 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
              <AlertTriangle size={15} className="text-amber-700" /> যাচাই করা যায়নি
            </p>
            <p className="text-[11px] text-amber-900/75">
              গণ-স্তর (spp.) বা প্রজাতি-পরিচয় অনিশ্চিত
            </p>
            <p className="mt-1.5 text-2xl font-bold text-amber-950">{toBn(unverifiedList.length)}</p>
            <p className="text-[10.5px] font-medium text-amber-900">
              প্রতিটির সুনির্দিষ্ট কারণ নিচে দেখুন ↓
            </p>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-500 text-sm font-extrabold text-white shadow-sm">
            !
          </span>
        </a>

        {(['CR', 'EN'] as const).map((code) => {
          const info = IUCN[code]
          const cnt = countsByCode[code] || 0
          return (
            <Link
              key={code}
              href={`/gyan?iucn=${code}`}
              className="card group flex items-center justify-between gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div>
                <p className="text-xs font-bold text-forest-900 group-hover:text-forest-700">
                  {info.meaning}
                </p>
                <p className="text-[11px] text-black/50">
                  {info.code} — {info.en}
                </p>
                <p className="mt-1.5 text-2xl font-bold text-forest-900">{toBn(cnt)}</p>
                <p className="text-[10.5px] text-black/45">টি প্রজাতি দেখুন →</p>
              </div>
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-extrabold shadow-sm ${info.color}`}
              >
                {info.code}
              </span>
            </Link>
          )
        })}
      </div>

      {/* IUCN শ্রেণিবিভাগ নির্দেশিকা — কোন চিহ্নের অর্থ কী? */}
      <section id="iucn" className="card mt-6 scroll-mt-20 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-forest-900">
              <BookOpen size={19} className="text-forest-700" />
              IUCN-এর শ্রেণিবিভাগ — কোন চিহ্নের অর্থ কী?
            </h2>
            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-black/60">
              আন্তর্জাতিক প্রকৃতি ও প্রাকৃতিক সম্পদ সংরক্ষণ সংঘ (<b>IUCN Red List Categories and Criteria, Version 3.1</b>)
              যেকোনো প্রাণী বা উদ্ভিদের বিলুপ্তির ঝুঁকি বোঝাতে নিচের ৯টি শ্রেণি ব্যবহার করে। এর মধ্যে{' '}
              <b>CR (অত্যন্ত সংকটাপন্ন)</b>, <b>EN (বিপন্ন)</b> ও <b>VU (ঝুঁকিপূর্ণ)</b> — এই তিনটি সরাসরি হুমকিগ্রস্ত
              (Threatened) শ্রেণি।
            </p>
          </div>
          <a
            href="https://www.iucnredlist.org/resources/categories-and-criteria"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-3 py-1.5 text-xs font-semibold text-forest-800 hover:bg-forest-100"
          >
            IUCN Red List (v3.1) <ExternalLink size={12} />
          </a>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-forest-50 text-xs font-bold text-forest-900">
              <tr>
                <th className="rounded-tl-xl p-3">IUCN চিহ্ন</th>
                <th className="p-3">ইংরেজি শ্রেণি</th>
                <th className="p-3">অর্থ</th>
                <th className="p-3">সংক্ষিপ্ত ব্যাখ্যা (IUCN v3.1)</th>
                <th className="rounded-tr-xl p-3 text-right">সাইটে রেকর্ড</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {IUCN_ORDER.map((code) => {
                const info = IUCN[code]
                const cnt = countsByCode[code] || 0
                return (
                  <tr key={code} className="transition hover:bg-forest-50/40">
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-flex h-7 w-10 items-center justify-center rounded-lg text-xs font-extrabold shadow-sm ${info.color}`}
                      >
                        {info.code}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-forest-950 whitespace-nowrap">
                      {info.code} — {info.en}
                    </td>
                    <td className="p-3 font-bold text-forest-900">{info.meaning}</td>
                    <td className="p-3 text-xs leading-relaxed text-black/65">{info.detailBn}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <Link
                        href={`/gyan?iucn=${code}`}
                        className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-2.5 py-1 text-xs font-semibold text-forest-800 hover:bg-forest-100"
                      >
                        {toBn(cnt)} টি →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[11.5px] leading-relaxed text-black/50">
          <b>দ্রষ্টব্য:</b> প্রজাতির কার্ডে দেখানো প্রধান চিহ্নটি বৈশ্বিক IUCN মূল্যায়ন নির্দেশ করে; তবে কোনো প্রজাতি
          বিশ্বে <b>LC (তুলনামূলক কম ঝুঁকিতে)</b> হলেও বাংলাদেশে আঞ্চলিকভাবে বিরল বা সংকটাপন্ন হলে প্রজাতির পাতায় সেটিও
          আলাদাভাবে উল্লেখ করা হয়েছে।
        </p>
      </section>

      {/* যেসব রেকর্ড একক প্রজাতি হিসেবে যাচাই করা যায়নি — এবং কেন যাচাই করা যায়নি */}
      <section id="unverified" className="card mt-6 scroll-mt-20 border-amber-200/80 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-forest-900">
              <AlertTriangle size={19} className="text-amber-600" />
              যে {toBn(unverifiedList.length)}টি রেকর্ড একক প্রজাতি হিসেবে যাচাই করা যায়নি — এবং কেন যাচাই করা যায়নি
            </h2>
            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-black/60">
              আমাদের জ্ঞানভান্ডারের <b>{toBn(total)}</b>টি রেকর্ডের মধ্যে <b>{toBn(verified)}টি ({toBn(Math.round((verified / Math.max(1, total)) * 100))}%)</b>{' '}
              পূর্ণাঙ্গভাবে যাচাইকৃত। নিচের <b>{toBn(unverifiedList.length)}টি</b> রেকর্ডকে একক নিশ্চিত বন্য প্রজাতি হিসেবে{' '}
              <b>“যাচাইকৃত”</b> দেখানো হয়নি — প্রতিটির সুনির্দিষ্ট বৈজ্ঞানিক কারণ নিচে দেওয়া হলো:
            </p>
          </div>
          <Link
            href="/gyan?status=unverified"
            className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-950 hover:bg-amber-200"
          >
            জ্ঞানভান্ডারে দেখুন ({toBn(unverifiedList.length)}) →
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="bg-amber-50/90 text-[11px] font-bold uppercase tracking-wide text-amber-950">
              <tr>
                <th className="rounded-tl-xl p-3">নাম ও বিভাগ</th>
                <th className="p-3">বৈজ্ঞানিক নাম</th>
                <th className="p-3">অবস্থার ধরন</th>
                <th className="rounded-tr-xl p-3">কী কারণে যাচাই করা যায়নি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {unverifiedList.map((s) => {
                const meta = UNVERIFIED_REASONS[s.slug]
                const stLabel = DATA_STATUS_LABEL[s.dataStatus || 'partial']?.bn || s.dataStatus
                return (
                  <tr key={s.slug} className="align-top transition hover:bg-amber-50/30">
                    <td className="p-3 whitespace-nowrap">
                      <Link href={speciesPath(s)} className="font-bold text-forest-900 hover:underline">
                        {s.nameBn}
                      </Link>
                      <span className="block text-[11px] text-black/45">
                        {s.nameEn} · {s.category}
                      </span>
                    </td>
                    <td className="p-3 italic text-black/70 whitespace-nowrap">{s.scientificName}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${
                          s.dataStatus === 'identity_uncertain'
                            ? 'bg-red-100 text-red-800'
                            : s.dataStatus === 'needs_correction'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {meta?.category || stLabel}
                      </span>
                    </td>
                    <td className="p-3 leading-relaxed text-black/80">
                      {s.conflictingInfo || meta?.reason || 'নির্দিষ্ট প্রজাতি-স্তরের উপাত্ত যাচাই বাকি।'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* কেন কিছু প্রজাতির IUCN অবস্থা NE বা DD — তার কারণ */}
      <section id="ne-dd-reasons" className="card mt-6 p-5">
        <h2 className="text-base font-bold text-forest-900">
          কেন কিছু প্রজাতির IUCN সংরক্ষণ অবস্থা NE (এখনো মূল্যায়ন করা হয়নি) বা DD (তথ্য অপর্যাপ্ত)? ({toBn(neDdSpecies.length)}টি)
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-black/60">
          যে প্রজাতিগুলোর বৈজ্ঞানিক পরিচয় যাচাইকৃত হলেও বৈশ্বিক IUCN সংরক্ষণ অবস্থা <b>NE</b> অথবা <b>DD</b>, সেগুলোর
          প্রতিটির পাতায় কেন ঝুঁকি মূল্যায়ন বা নির্ধারণ করা যায়নি তা উল্লেখ করা আছে। নিচে সেগুলোর তালিকা ও কারণ দেওয়া হলো:
        </p>
        <div className="mt-3 max-h-[420px] overflow-y-auto rounded-xl border border-black/5">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="sticky top-0 bg-forest-50 text-[11px] font-bold text-forest-900">
              <tr>
                <th className="p-2.5">প্রজাতি</th>
                <th className="p-2.5">বৈজ্ঞানিক নাম</th>
                <th className="p-2.5">IUCN চিহ্ন</th>
                <th className="p-2.5">কেন মূল্যায়ন বা ঝুঁকি নির্ধারণ করা যায়নি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {neDdSpecies.map((s) => {
                const info = IUCN[s.conservation] || IUCN.NE
                return (
                  <tr key={s.slug} className="align-top hover:bg-forest-50/40">
                    <td className="p-2.5 font-semibold text-forest-900 whitespace-nowrap">
                      <Link href={speciesPath(s)} className="hover:underline">
                        {s.nameBn}
                      </Link>
                    </td>
                    <td className="p-2.5 italic text-black/65 whitespace-nowrap">{s.scientificName}</td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10.5px] font-bold ${info.color}`}>
                        {info.code} · {info.meaning}
                      </span>
                    </td>
                    <td className="p-2.5 leading-relaxed text-black/75">
                      {iucnUnassessedReason(s)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* কভারেজ সারাংশ */}
      <section className="card mt-5 p-4">
        <h2 className="mb-3 text-sm font-bold text-forest-900">জীবগোষ্ঠীভিত্তিক তথ্য কভারেজ — কী যাচাইকৃত, কী বাকি</h2>
        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          <span className="chip">মোট রেকর্ড: {toBn(total)}</span>
          <span className="chip bg-emerald-50 text-emerald-900">যাচাইকৃত ✓: {toBn(verified)}</span>
          <span className="chip bg-amber-50 text-amber-900">যাচাই করা যায়নি (কারণসহ): {toBn(total - verified)}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-xs">
            <thead className="text-left text-[11px] uppercase tracking-wide text-forest-800">
              <tr>
                <th className="p-2">ক্যাটাগরি</th>
                <th className="p-2">মোট</th>
                <th className="p-2">যাচাইকৃত ✓</th>
                <th className="p-2">যাচাই বাকি (কারণসহ)</th>
                <th className="p-2">ছবি নেই</th>
                <th className="p-2">উৎস নেই</th>
              </tr>
            </thead>
            <tbody>
              {coverage
                .filter((c) => c.kind === 'species')
                .map((c) => (
                  <tr
                    key={c.group}
                    className={c.umbrella ? 'border-t-2 border-forest-200 bg-forest-50/60 font-semibold' : 'border-t border-black/5'}
                  >
                    <td className="p-2 font-medium text-forest-900">
                      {c.label}
                      {c.umbrella && <span className="ml-1.5 text-[10px] font-normal text-black/45">(ছাতা · সাবটোটাল, মোটে গণনা হয় না)</span>}
                    </td>
                    <td className="p-2">{toBn(c.total)}</td>
                    <td className="p-2 font-semibold text-emerald-700">{toBn(c.verified)}</td>
                    <td className="p-2 font-semibold text-amber-700">{toBn(c.partial)}</td>
                    <td className="p-2">{toBn(c.missingImage)}</td>
                    <td className="p-2">{toBn(c.missingSource)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* বিপন্ন ও ঝুঁকিপূর্ণ প্রজাতি */}
      {byStatus.map((g) => (
        <section key={g.status} className="mt-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="section-title">
              {g.info.code} — {g.info.en}: {g.info.meaning} ({toBn(g.items.length)})
            </h2>
            {g.items.length > 12 && (
              <Link
                href={`/gyan?iucn=${g.status}`}
                className="text-xs font-semibold text-forest-700 hover:underline"
              >
                সব {toBn(g.items.length)} টি দেখুন →
              </Link>
            )}
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.slice(0, 12).map((s) => (
              <Link
                key={s.slug}
                href={speciesPath(s)}
                className="card flex items-center gap-3 p-3 transition hover:bg-forest-50"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-forest-900">{s.nameBn}</span>
                  <span className="block truncate text-[11px] italic text-black/45">{s.scientificName}</span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${g.info.color}`}
                  title={`${g.info.code} — ${g.info.en}: ${g.info.meaning}`}
                >
                  {s.conservation} · {g.info.meaning}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* খবর */}
      {news.length > 0 && (
        <section className="mt-6">
          <h2 className="section-title">সাম্প্রতিক খবর ও গবেষণা</h2>
          <div className="mt-2 space-y-2">
            {news.map((n) => (
              <Link key={n.id} href={`/khobor/${n.slug}`} className="card block p-3 transition hover:bg-forest-50">
                <p className="text-sm font-semibold text-forest-900">{n.title}</p>
                <p className="mt-0.5 text-xs text-black/55">{excerpt(n.excerpt || n.body, 120)}</p>
                <p className="mt-1 text-[10px] text-black/40">
                  {bnDate(n.createdAt)}
                  {n.publisher ? ` · ${n.publisher}` : ''}
                  {n.sourceUrl && (
                    <span className="ml-1 inline-flex items-center gap-1">
                      <ExternalLink size={10} /> মূল সূত্র
                    </span>
                  )}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
