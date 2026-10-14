import { notFound } from 'next/navigation'
import SpeciesForm from '@/components/admin/SpeciesForm'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = await getRepo().getSpecies(slug)
  if (!s) notFound()
  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-forest-900">সম্পাদনা: {s.nameBn}</h2>
      <p className="mb-4 text-xs text-black/45">
        /{s.type === 'prani' ? 'prani' : 'udbhid'}/{s.slug}
      </p>
      <SpeciesForm initial={s} />
    </div>
  )
}
