import type { Metadata } from 'next'
import AuthForm from '@/components/AuthForm'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'লগইন' }

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const sp = await searchParams
  return (
    <div className="container-pb py-10">
      <AuthForm mode="login" next={sp.next || '/'} />
    </div>
  )
}
