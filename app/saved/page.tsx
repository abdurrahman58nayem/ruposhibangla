import type { Metadata } from 'next'
import SavedList from '@/components/SavedList'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'সংরক্ষিত' }

export default function Page() {
  return (
    <div className="container-pb max-w-2xl py-6">
      <SavedList />
    </div>
  )
}
