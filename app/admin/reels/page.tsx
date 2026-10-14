import ModerationList from '@/components/admin/ModerationList'
import { getRepo } from '@/lib/repo'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const page = await getRepo().listPosts({ status: 'all', kind: 'reel', limit: 50 })
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-forest-900">রিলস পরিচালনা</h2>
      <ModerationList initial={page.items} />
    </div>
  )
}
