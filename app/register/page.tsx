import type { Metadata } from 'next'
import AuthForm from '@/components/AuthForm'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'অ্যাকাউন্ট খুলুন' }

export default async function Page() {
  return (
    <div className="container-pb py-10">
      <AuthForm mode="register" next="/" />
    </div>
  )
}
