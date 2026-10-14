import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getReadyRepo } from '@/lib/repo'
import AccountForm from '@/components/admin/AccountForm'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'আমার অ্যাকাউন্ট', robots: { index: false, follow: false } }

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/login?next=/admin/account')
  const repo = await getReadyRepo()
  const user = await repo.getUserById(session.id)
  if (!user) redirect('/login?next=/admin/account')

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-forest-900">আমার অ্যাকাউন্ট</h2>
      <p className="mb-4 text-xs text-black/50">
        ব্যবহারনাম <b>@{user.username}</b> · ভূমিকা <b>{user.role}</b>
      </p>
      <AccountForm
        initial={{
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email || '',
          role: user.role,
        }}
      />
    </div>
  )
}
