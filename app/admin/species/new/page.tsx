import SpeciesForm from '@/components/admin/SpeciesForm'
import type { Species } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default function Page() {
  const blank: Species = {
    slug: '',
    type: 'prani',
    group: 'pranijogot',
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
      <h2 className="mb-1 text-lg font-bold text-forest-900">নতুন প্রজাতি যোগ করুন</h2>
      <p className="mb-4 text-xs text-black/50">
        নাম ও প্রধান ছবি দিলেই চলবে — বাকি তথ্য পরে যেকোনো সময় এডিট করা যাবে। “আপলোড” বোতাম ধরে সরাসরি
        মোবাইল বা কম্পিউটার থেকে ছবি তুলুন।
      </p>
      <SpeciesForm initial={blank} isNew />
    </div>
  )
}
