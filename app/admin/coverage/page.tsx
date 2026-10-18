import Link from 'next/link'
import { getRepo } from '@/lib/repo'
import { toBn } from '@/lib/utils'
import { speciesPath } from '@/lib/categories'
import { UNVERIFIED_REASONS } from '@/data/seed/verification'
import { DATA_STATUS_LABEL } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const repo = getRepo()
  const [rows, unverifiedList] = await Promise.all([
    repo.coverage(),
    repo.listSpecies({ dataStatus: 'unverified', limit: 500 }),
  ])
  const total = rows.reduce((a, r) => a + r.total, 0)
  const verified = rows.reduce((a, r) => a + r.verified, 0)

  return (
    <div>
      <h2 className="text-lg font-bold text-forest-900">কভারেজ ও তথ্য-যাচাই ড্যাশবোর্ড</h2>
      <p className="mb-4 text-xs text-black/50">
        কোন জীবগোষ্ঠীর কতটি রেকর্ড যাচাইকৃত এবং যেগুলো যাচাই করা যায়নি সেগুলো ঠিক কী কারণে যাচাই করা যায়নি — সব খোলাখুলি।
      </p>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="মোট রেকর্ড" value={total} />
        <Tile label="যাচাইকৃত ✓" value={verified} />
        <Tile label="যাচাই করা যায়নি (কারণসহ)" value={total - verified} />
        <Tile label="যাচাইকৃতের হার" value={toBn(`${total ? Math.round((verified / total) * 100) : 0}%`)} />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-forest-50 text-left text-[11px] uppercase tracking-wide text-forest-800">
            <tr>
              <th className="p-3">জীবগোষ্ঠী</th>
              <th className="p-3">মোট</th>
              <th className="p-3">যাচাইকৃত ✓</th>
              <th className="p-3">যাচাই করা যায়নি</th>
              <th className="p-3">বাংলা নাম নেই</th>
              <th className="p-3">ছবি নেই</th>
              <th className="p-3">উৎস নেই</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.group} className="border-t border-black/5">
                <td className="p-3 font-medium text-forest-900">{r.label}</td>
                <td className="p-3">{toBn(r.total)}</td>
                <td className="p-3 font-semibold text-emerald-700">{toBn(r.verified)}</td>
                <td className="p-3 font-semibold text-amber-700">{toBn(r.partial)}</td>
                <td className="p-3">{toBn(r.missingNameBn)}</td>
                <td className="p-3">{toBn(r.missingImage)}</td>
                <td className="p-3">{toBn(r.missingSource)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* যেগুলো যাচাই করা যায়নি এবং কেন */}
      <div className="card mt-5 overflow-x-auto p-4">
        <h3 className="text-sm font-bold text-forest-900">
          যেসব রেকর্ড একক প্রজাতি হিসেবে যাচাই করা যায়নি ({toBn(unverifiedList.length)}টি) — এবং সুনির্দিষ্ট কারণ
        </h3>
        <p className="mt-0.5 text-xs text-black/55">
          গণ-স্তরের (spp.) বা প্রজাতি-পরিচয় অনিশ্চিত হওয়ার কারণে নিচের রেকর্ডগুলোকে একক প্রজাতি হিসেবে “যাচাইকৃত” দেখানো হয়নি:
        </p>
        <table className="mt-3 w-full min-w-[720px] text-left text-xs">
          <thead className="bg-amber-50 text-[11px] font-bold text-amber-950">
            <tr>
              <th className="p-2.5">নাম</th>
              <th className="p-2.5">বৈজ্ঞানিক নাম</th>
              <th className="p-2.5">অবস্থা</th>
              <th className="p-2.5">কেন যাচাই করা যায়নি</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {unverifiedList.map((s) => {
              const meta = UNVERIFIED_REASONS[s.slug]
              return (
                <tr key={s.slug} className="align-top">
                  <td className="p-2.5 font-semibold text-forest-900 whitespace-nowrap">
                    <Link href={speciesPath(s)} className="hover:underline">
                      {s.nameBn}
                    </Link>
                  </td>
                  <td className="p-2.5 italic text-black/65 whitespace-nowrap">{s.scientificName}</td>
                  <td className="p-2.5 whitespace-nowrap">
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10.5px] font-semibold text-amber-900">
                      {meta?.category || DATA_STATUS_LABEL[s.dataStatus || 'partial']?.bn}
                    </span>
                  </td>
                  <td className="p-2.5 leading-relaxed text-black/80">
                    {s.conflictingInfo || meta?.reason}
                  </td>
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
