import Link from 'next/link'
import { getRepo } from '@/lib/repo'
import { toBn } from '@/lib/utils'
import { speciesPath } from '@/lib/categories'
import { UNVERIFIED_REASONS } from '@/data/seed/verification'
import { DATA_STATUS_LABEL } from '@/lib/i18n'
import { COVERAGE_FIELDS, COVERAGE_FIELD_LABEL, summarizeCoverage } from '@/lib/coverage'
import { allMediaLicenses } from '@/data/seed/media-licenses'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const repo = getRepo()
  const [rows, unverifiedList] = await Promise.all([
    repo.coverage(),
    repo.listSpecies({ dataStatus: 'unverified', limit: 500 }),
  ])

  // ছাতা (প্রাণীজগৎ) ও কনটেন্ট রো বাদ দিয়ে প্রকৃত মোট — নইলে পাখি/মাছ/স্তন্যপায়ী
  // রেকর্ডগুলো দুইবার গোনা হতো (আগের বাগ)।
  const totals = summarizeCoverage(rows)
  const speciesRows = rows.filter((r) => r.kind === 'species')
  const contentRows = rows.filter((r) => r.kind === 'content')
  const rate = totals.records ? Math.round((totals.verified / totals.records) * 100) : 0

  // §12 — মিডিয়া লাইসেন্সের প্রকৃত অবস্থা (কল্পিত ক্রেডিট নয়, অসম্পূর্ণতা দেখানোই নীতি)
  const credits = allMediaLicenses()
  const creditsVerified = credits.filter((c) => c.verified).length
  const creditsPending = credits.length - creditsVerified

  return (
    <div>
      <h2 className="text-lg font-bold text-forest-900">কভারেজ ও তথ্য-যাচাই ড্যাশবোর্ড</h2>
      <p className="mb-4 text-xs text-black/50">
        কোন জীবগোষ্ঠীর কতটি রেকর্ড যাচাইকৃত এবং যেগুলো যাচাই করা যায়নি সেগুলো ঠিক কী কারণে যাচাই করা যায়নি — সব খোলাখুলি।
        “প্রাণীজগৎ” একটি ছাতা-ক্যাটাগরি; টেবিলে সাবটোটাল হিসেবে দেখানো হয়, কিন্তু মোটের হিসাবে ধরা হয় না।
      </p>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="মোট রেকর্ড" value={totals.records} />
        <Tile label="যাচাইকৃত ✓" value={totals.verified} />
        <Tile label="যাচাই করা যায়নি (কারণসহ)" value={totals.partial} />
        <Tile label="যাচাইকৃতের হার" value={toBn(`${rate}%`)} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-xs text-amber-950">
        <span className="font-semibold">মিডিয়া ক্রেডিট (§১২):</span>
        <span>
          মোট {toBn(credits.length)} · যাচাইকৃত {toBn(creditsVerified)} ·{' '}
          <b>যাচাই বাকি {toBn(creditsPending)}</b>
        </span>
        <Link href="/credits" className="font-semibold text-forest-800 underline">
          সম্পূর্ণ তালিকা →
        </Link>
        <span className="w-full text-[11px] text-amber-900/70">
          যাচাই না হওয়া ছবিকে “যাচাইকৃত” দেখানো হয় না; প্রতিটি রেকর্ডে উৎস ও কারণ লেখা আছে।
        </span>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-forest-50 text-left text-[11px] uppercase tracking-wide text-forest-800">
            <tr>
              <th className="p-3">জীবগোষ্ঠী</th>
              <th className="p-3">মোট</th>
              <th className="p-3">যাচাইকৃত ✓</th>
              <th className="p-3">যাচাই করা যায়নি</th>
              <th className="p-3">বাংলা নাম নেই</th>
              <th className="p-3">ছবি নেই</th>
              <th className="p-3">উৎস নেই</th>
            </tr>
          </thead>
          <tbody>
            {speciesRows.map((r) =>
              r.umbrella ? (
                <tr key={r.group} className="border-t-2 border-forest-200 bg-forest-50/60 text-forest-900">
                  <td className="p-3 font-bold">
                    {r.label}
                    <span className="ml-2 rounded-full bg-forest-100 px-2 py-0.5 text-[10px] font-semibold text-forest-800">
                      ছাতা · সাবটোটাল
                    </span>
                    <span className="mt-0.5 block text-[10px] font-normal text-black/45">
                      নিচের সব প্রাণী-গোষ্ঠীর যোগফল — তাই মোটে গোনা হয় না
                    </span>
                  </td>
                  <td className="p-3 font-bold">{toBn(r.total)}</td>
                  <td className="p-3 font-semibold text-emerald-700">{toBn(r.verified)}</td>
                  <td className="p-3 font-semibold text-amber-700">{toBn(r.partial)}</td>
                  <td className="p-3">{toBn(r.missingNameBn)}</td>
                  <td className="p-3">{toBn(r.missingImage)}</td>
                  <td className="p-3">{toBn(r.missingSource)}</td>
                </tr>
              ) : (
                <tr key={r.group} className="border-t border-black/5">
                  <td className="p-3 font-medium text-forest-900">{r.label}</td>
                  <td className="p-3">{toBn(r.total)}</td>
                  <td className="p-3 font-semibold text-emerald-700">{toBn(r.verified)}</td>
                  <td className="p-3 font-semibold text-amber-700">{toBn(r.partial)}</td>
                  <td className="p-3">{toBn(r.missingNameBn)}</td>
                  <td className="p-3">{toBn(r.missingImage)}</td>
                  <td className="p-3">{toBn(r.missingSource)}</td>
                </tr>
              ),
            )}
            {contentRows.map((r) => (
              <tr key={r.group} className="border-t border-black/5 text-black/45">
                <td className="p-3 font-medium">
                  {r.label}
                  <span className="mt-0.5 block text-[10px] font-normal">কনটেন্ট বিভাগ — প্রজাতি-রেকর্ড নেই</span>
                </td>
                <td className="p-3">—</td>
                <td className="p-3">—</td>
                <td className="p-3">—</td>
                <td className="p-3">—</td>
                <td className="p-3">—</td>
                <td className="p-3">—</td>
              </tr>
            ))}
            <tr className="border-t-2 border-forest-300 bg-white font-bold text-forest-900">
              <td className="p-3">সর্বমোট ({toBn(totals.speciesGroups)}টি জীবগোষ্ঠী)</td>
              <td className="p-3">{toBn(totals.records)}</td>
              <td className="p-3 text-emerald-700">{toBn(totals.verified)}</td>
              <td className="p-3 text-amber-700">{toBn(totals.partial)}</td>
              <td className="p-3">{toBn(totals.missingNameBn)}</td>
              <td className="p-3">{toBn(totals.missingImage)}</td>
              <td className="p-3">{toBn(totals.missingSource)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ক্ষেত্র-ভিত্তিক পূর্ণতা — শুধু প্রযোজ্য রেকর্ডের মধ্যে গণনা */}
      <div className="card mt-5 overflow-x-auto">
        <div className="p-4 pb-0">
          <h3 className="text-sm font-bold text-forest-900">ক্ষেত্র-ভিত্তিক পূর্ণতা</h3>
          <p className="mt-0.5 text-xs text-black/55">
            যে ক্ষেত্রটি যে ধরনের রেকর্ডে প্রযোজ্য নয় (যেমন স্থান বা সাহিত্যে শ্রেণিবিন্যাস/উৎপত্তি), সেটি ফাঁক হিসেবে
            গোনা হয় না — কেবল প্রযোজ্য রেকর্ডের ভেতরে ফাঁকা ঘরগুলো এখানে দেখানো হচ্ছে।
          </p>
        </div>
        <table className="mt-3 w-full min-w-[720px] text-left text-xs">
          <thead className="bg-forest-50 text-[11px] font-bold text-forest-900">
            <tr>
              <th className="p-2.5">জীবগোষ্ঠী</th>
              {COVERAGE_FIELDS.map((f) => (
                <th key={f} className="p-2.5">
                  {COVERAGE_FIELD_LABEL[f]} নেই
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {speciesRows
              .filter((r) => !r.umbrella)
              .map((r) => (
                <tr key={r.group} className="align-top">
                  <td className="p-2.5 font-semibold text-forest-900">
                    {r.label} <span className="font-normal text-black/40">({toBn(r.total)})</span>
                  </td>
                  {COVERAGE_FIELDS.map((f) => (
                    <td key={f} className="p-2.5">
                      {r.missingFields[f] ? (
                        <span className="font-semibold text-amber-700">{toBn(r.missingFields[f])}</span>
                      ) : (
                        <span className="text-emerald-700">০</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-forest-300 bg-white font-bold text-forest-900">
              <td className="p-2.5">সর্বমোট</td>
              {COVERAGE_FIELDS.map((f) => (
                <td key={f} className="p-2.5">
                  {toBn(totals.missingFields[f])}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* যেগুলো যাচাই করা যায়নি এবং কেন */}
      <div className="card mt-5 overflow-x-auto p-4">
        <h3 className="text-sm font-bold text-forest-900">
          যেসব রেকর্ড একক প্রজাতি হিসেবে যাচাই করা যায়নি ({toBn(unverifiedList.length)}টি) — এবং সুনির্দিষ্ট কারণ
        </h3>
        <p className="mt-0.5 text-xs text-black/55">
          গণ-স্তরের (spp.) বা প্রজাতি-পরিচয় অনিশ্চিত হওয়ার কারণে নিচের রেকর্ডগুলোকে একক প্রজাতি হিসেবে “যাচাইকৃত” দেখানো হয়নি:
        </p>
        <table className="mt-3 w-full min-w-[720px] text-left text-xs">
          <thead className="bg-amber-50 text-[11px] font-bold text-amber-950">
            <tr>
              <th className="p-2.5">নাম</th>
              <th className="p-2.5">বৈজ্ঞানিক নাম</th>
              <th className="p-2.5">অবস্থা</th>
              <th className="p-2.5">কেন যাচাই করা যায়নি</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {unverifiedList.map((s) => {
              const meta = UNVERIFIED_REASONS[s.slug]
              return (
                <tr key={s.slug} className="align-top">
                  <td className="p-2.5 whitespace-nowrap font-semibold text-forest-900">
                    <Link href={speciesPath(s)} className="hover:underline">
                      {s.nameBn}
                    </Link>
                  </td>
                  <td className="p-2.5 whitespace-nowrap italic text-black/65">{s.scientificName}</td>
                  <td className="p-2.5 whitespace-nowrap">
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10.5px] font-semibold text-amber-900">
                      {meta?.category || DATA_STATUS_LABEL[s.dataStatus || 'partial']?.bn}
                    </span>
                  </td>
                  <td className="p-2.5 leading-relaxed text-black/80">{s.conflictingInfo || meta?.reason}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Tile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card p-3">
      <p className="text-xl font-bold text-forest-900">{typeof value === 'number' ? toBn(value) : value}</p>
      <p className="text-[11px] text-black/50">{label}</p>
    </div>
  )
}
