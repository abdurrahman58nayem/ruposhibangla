import { getRepo } from '@/lib/repo'
import { toBn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const rows = await getRepo().coverage()
  const total = rows.reduce((a, r) => a + r.total, 0)
  const verified = rows.reduce((a, r) => a + r.verified, 0)

  return (
    <div>
      <h2 className="text-lg font-bold text-forest-900">কভারেজ ড্যাশবোর্ড</h2>
      <p className="mb-4 text-xs text-black/50">
        কোন জীবগোষ্ঠীর তথ্য কতটা এসেছে, কোথায় ঘাটতি — সব খোলাখুলি। কোনো গোষ্ঠীর তথ্য সংগ্রহ না করেও
        সম্পূর্ণ বলে দেখানো হয়নি।
      </p>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="মোট রেকর্ড" value={total} />
        <Tile label="যাচাইকৃত" value={verified} />
        <Tile label="অসম্পূর্ণ" value={total - verified} />
        <Tile label="সম্পূর্ণতা" value={`${total ? Math.round((verified / total) * 100) : 0}%`} />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-forest-50 text-left text-[11px] uppercase tracking-wide text-forest-800">
            <tr>
              <th className="p-3">জীবগোষ্ঠী</th>
              <th className="p-3">মোট</th>
              <th className="p-3">যাচাইকৃত</th>
              <th className="p-3">অসম্পূর্ণ</th>
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
                <td className="p-3 text-emerald-700">{toBn(r.verified)}</td>
                <td className="p-3 text-amber-700">{toBn(r.partial)}</td>
                <td className="p-3">{toBn(r.missingNameBn)}</td>
                <td className="p-3">{toBn(r.missingImage)}</td>
                <td className="p-3">{toBn(r.missingSource)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] text-black/45">
        যে গোষ্ঠীতে রেকর্ড ০ বা খুব কম — সেটি এখনো সংগ্রহ করা বাকি। নতুন তথ্য যোগ করতে{' '}
        <b>/admin/species/new</b> ব্যবহার করুন, অথবা CSV/JSON ইমপোর্টের মাধ্যমে হালনাগাদ করুন।
      </p>
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
