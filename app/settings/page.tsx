import type { Metadata } from 'next'
import SettingsForm from '@/components/SettingsForm'
import { getRepo } from '@/lib/repo'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'সেটিংস' }

export default async function Page() {
  const session = await getSession()
  let user = null as null | {
    id: string
    username: string
    name: string
    bio?: string
    avatar?: string
    cover?: string
    location?: string
    followers: number
    following: number
    verified: boolean
    role: string
    deletionRequested?: boolean
  }
  if (session) {
    const u = await getRepo().getUserById(session.id)
    if (u) {
      user = {
        id: u.id,
        username: u.username,
        name: u.name,
        bio: u.bio,
        avatar: u.avatar,
        cover: u.cover,
        location: u.location,
        followers: u.followers,
        following: u.following,
        verified: u.verified,
        role: u.role,
        deletionRequested: u.deletionRequested,
      }
    }
  }
  return <SettingsForm user={user} />
}
