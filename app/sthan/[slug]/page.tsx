import type { Metadata } from 'next'
import SpeciesDetail from '@/components/SpeciesDetail'
import { getRepo } from '@/lib/repo'
import { excerpt } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const s = await getRepo().getSpecies(slug)
  if (!s || s.type !== 'sthan') return { title: 'স্থান পাওয়া যায়নি' }
  return {
    title: `${s.nameBn} — বাংলাদেশের প্রকৃতির ঠিকানা`,
    description: excerpt(s.summary, 160),
    alternates: { canonical: `/sthan/${s.slug}` },
    openGraph: { title: s.nameBn, description: s.summary, images: s.image ? [s.image] : undefined },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = await getRepo().getSpecies(slug)
  if (!s || s.type !== 'sthan') {
    return (
      <div className="container-pb py-16 text-center text-sm text-black/55">স্থানটি পাওয়া যায়নি।</div>
    )
  }
  return <SpeciesDetail slug={slug} type="sthan" />
}
