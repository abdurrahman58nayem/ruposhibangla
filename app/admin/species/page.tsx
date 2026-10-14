import Link from 'next/link'
import { getRepo } from '@/lib/repo'
import SpeciesRowActions from '@/components/admin/SpeciesRowActions'
import ImportExport from '@/components/admin/ImportExport'
import { Plus, Pencil } from 'lucide-react'
import { IUCN } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const sp = await searchParams
  const repo = getRepo()
  const rows = await repo.listSpecies({
    q: sp.q,
    type: (sp.type as any) || undefined,
    limit: 300,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-forest-900">প্রজাতি ({rows.length})</h2>
          <p className="text-xs text-black/50">নতুন প্রাণী বা উদ্ভিদ যোগ করুন, তথ্য হালনাগাদ করুন</p>
        </div>
        <Link href="/admin/species/new" className="btn-primary text-sm">
          <Plus size={16} /> নতুন প্রজাতি
        </Link>
      </div>

      <ImportExport />

      <form className="mb-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={sp.q || ''} placeholder="নাম/বৈজ্ঞানিক নাম দিয়ে খুঁজুন" className="field max-w-xs" />
        <select name="type" defaultValue={sp.type || ''} className="field w-auto">
          <option value="">সব ধরন</option>
          <option value="prani">প্রাণী</option>
          <option value="udbhid">উদ্ভিদ</option>
          <option value="sthan">নদী-বন-পাহাড়</option>
          <option value="sahitto">প্রকৃতি ও সাহিত্য</option>
        </select>
        <button className="btn-outline">খুঁজুন</button>
      </form>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-forest-50 text-left text-[11px] uppercase tracking-wide text-forest-800">
              <tr>
                <th className="p-3">নাম</th>
                <th className="p-3">বিভাগ</th>
                <th className="p-3">বৈজ্ঞানিক নাম</th>
                <th className="p-3">সংরক্ষণ</th>
                <th className="p-3">কবি</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.slug} className="border-t border-black/5">
                  <td className="p-3">
                    <p className="font-semibold text-forest-900">{s.nameBn}</p>
                    <p className="text-[11px] text-black/40">{s.nameEn}</p>
                  </td>
                  <td className="p-3 text-xs text-black/60">{s.category}</td>
                  <td className="p-3 text-xs italic text-black/60">{s.scientificName}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${(IUCN[s.conservation] || IUCN.NE).color}`}>
                      {(IUCN[s.conservation] || IUCN.NE).short}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-black/60">{s.poetViews?.length || 0}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={s.type === 'prani' ? `/prani/${s.slug}` : `/udbhid/${s.slug}`}
                        className="rounded-full p-2 text-black/45 hover:bg-forest-50 hover:text-forest-800"
                        title="দেখুন"
                      >
                        <Pencil size={14} />
                      </Link>
                      <SpeciesRowActions slug={s.slug} editHref={`/admin/species/${s.slug}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
