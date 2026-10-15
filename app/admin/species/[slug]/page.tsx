import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import SpeciesForm from '@/components/admin/SpeciesForm'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = await getRepo().getSpecies(slug)
  if (!s) notFound()
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-forest-900">সম্পাদনা: {s.nameBn}</h2>
          <p className="text-xs text-black/45">/{s.type}/{s.slug}</p>
        </div>
        <Link href={`/${s.type}/${s.slug}`} target="_blank" className="btn-outline text-xs">
          <ExternalLink size={13} /> সাইটে দেখুন
        </Link>
      </div>
      <SpeciesForm initial={s} />
    </div>
  )
}
