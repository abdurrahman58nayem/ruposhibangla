import Link from 'next/link'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'
import HeaderClient from './HeaderClient'
import CategoryTopBar from './CategoryTopBar'

export default async function SiteHeader({ notice }: { notice: string | null }) {
  const repo = getRepo()
  const [settings, session] = await Promise.all([repo.getSettings(), getSession()])
  let user = null
  if (session) {
    const u = await repo.getUserById(session.id)
    if (u) user = { id: u.id, username: u.username, name: u.name, role: u.role, verified: u.verified, avatar: u.avatar }
  }

  return (
    <header className="sticky top-0 z-50">
      {notice && (
        <div className="bg-forest-900 text-white">
          <div className="container-pb flex items-center gap-2 py-1.5 text-[11px] sm:text-xs">
            <span className="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-earth-300" />
            <span className="line-clamp-1">{notice}</span>
            <Link href="/khobor" className="ml-auto shrink-0 underline decoration-dotted">
              বিস্তারিত
            </Link>
          </div>
        </div>
      )}
      <div className="glass border-b border-black/5">
        <div className="container-pb flex h-14 items-center gap-2 sm:h-16">
          <HeaderClient settings={settings} user={user} />
        </div>
      </div>
      <CategoryTopBar />
    </header>
  )
}
