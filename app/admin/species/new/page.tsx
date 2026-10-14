import SpeciesForm from '@/components/admin/SpeciesForm'
import type { Species } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default function Page() {
  const blank: Species = {
    slug: '',
    type: 'prani',
    category: 'পাখি',
    nameBn: '',
    nameEn: '',
    scientificName: '',
    otherNames: [],
    summary: '',
    description: '',
    habitat: '',
    diet: '',
    sizeOrHeight: '',
    season: '',
    whereToSee: '',
    reproduction: '',
    conservation: 'LC',
    conservationBn: '',
    colorTags: [],
    image: '',
    gallery: [],
    poetViews: [],
    sources: [],
    featured: false,
  }
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-forest-900">নতুন প্রজাতি যোগ করুন</h2>
      <SpeciesForm initial={blank} isNew />
    </div>
  )
}
