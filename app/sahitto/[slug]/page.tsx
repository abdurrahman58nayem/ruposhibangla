import type { Metadata } from 'next'
import SpeciesDetail from '@/components/SpeciesDetail'
import { getRepo } from '@/lib/repo'
import { excerpt } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const s = await getRepo().getSpecies(slug)
  if (!s || s.type !== 'sahitto') return { title: 'নিবন্ধ পাওয়া যায়নি' }
  return {
    title: `${s.nameBn} | কবির চোখে প্রকৃতি`,
    description: excerpt(s.summary, 160),
    alternates: { canonical: `/sahitto/${s.slug}` },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = await getRepo().getSpecies(slug)
  if (!s || s.type !== 'sahitto') {
    return (
      <div className="container-pb py-16 text-center text-sm text-black/55">নিবন্ধটি পাওয়া যায়নি।</div>
    )
  }
  return <SpeciesDetail slug={slug} type="sahitto" />
}
