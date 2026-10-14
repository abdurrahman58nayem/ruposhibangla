import type { Metadata } from 'next'
import NotificationsList from '@/components/NotificationsList'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'নোটিফিকেশন' }

export default function Page() {
  return (
    <div className="container-pb max-w-2xl py-6">
      <NotificationsList />
    </div>
  )
}
