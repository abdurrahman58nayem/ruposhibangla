import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SpeciesDetail from '@/components/SpeciesDetail'
import { getRepo } from '@/lib/repo'
import { excerpt } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const s = await getRepo().getSpecies(slug)
  if (!s || s.type !== 'prani') return { title: 'প্রজাতি পাওয়া যায়নি' }
  return {
    title: `${s.nameBn} — ${s.scientificName} | বাংলাদেশের প্রাণী`,
    description: excerpt(`${s.nameBn} (${s.nameEn}) — ${s.summary} বাসস্থান: ${s.habitat}`, 160),
    alternates: { canonical: `/prani/${s.slug}` },
    openGraph: {
      title: `${s.nameBn} — ${s.scientificName}`,
      description: s.summary,
      images: s.image ? [s.image] : undefined,
      type: 'article',
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = await getRepo().getSpecies(slug)
  if (!s || s.type !== 'prani') notFound()
  return <SpeciesDetail slug={slug} type="prani" />
}
