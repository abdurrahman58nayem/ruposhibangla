import { redirect } from 'next/navigation'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/** লগইন থাকলে নিজের প্রোফাইলে, না থাকলে লগইন পাতায় */
export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/login?next=/profile')
  const u = await getRepo().getUserById(session.id)
  if (!u) redirect('/login?next=/profile')
  redirect(`/u/${u!.username}`)
}
